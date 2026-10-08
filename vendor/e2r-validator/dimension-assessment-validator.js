import { diagnostic, SEVERITIES } from "./diagnostics.js";

export const DIMENSION_ASSESSMENT_EXTENSION_ID = "draft.github.sukoyaka-dopeness.dimension-assessment";
export const DIMENSION_ASSESSMENT_VERSION = "0.1.0";
export const DIMENSION_ASSESSMENT_VERSIONS = Object.freeze([DIMENSION_ASSESSMENT_VERSION, "0.2.0"]);
export const SPECIFICATION_EXTENSION_ID = "draft.github.sukoyaka-dopeness.specification";

const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const pointer = (value) => String(value).replaceAll("~", "~0").replaceAll("/", "~1");
const allowed = {
  payload: new Set(["specVersion", "dimensions", "assessments"]),
  dimension: new Set(["id", "name", "min", "max", "integerOnly", "unit", "lowLabel", "highLabel"]),
  assessment: new Set(["entityId", "dimensionId", "value"]),
};
const allowedDimensionFields = new Map(DIMENSION_ASSESSMENT_VERSIONS.map((version) => [
  version,
  new Set([...allowed.dimension, ...(version === "0.2.0" ? ["description"] : [])]),
]));

/** Semantic validator for exact supported Dimension Assessment Candidate versions. */
export function validateDimensionAssessment(dataset, occurrences = new Map()) {
  const diagnostics = [];
  const payloadPath = `/extensions/${pointer(DIMENSION_ASSESSMENT_EXTENSION_ID)}`;
  const found = occurrences.get(DIMENSION_ASSESSMENT_EXTENSION_ID) ?? [];
  if (!found.length) return diagnostics;
  if (found.length !== 1 || found[0].path !== payloadPath) {
    diagnostics.push(diagnostic(SEVERITIES.ERROR, "dimension_assessment_scope_invalid", found[0]?.path ?? payloadPath));
  }
  const payload = found[0]?.value;
  const add = (code, path) => diagnostics.push(diagnostic(SEVERITIES.ERROR, code, path));
  if (!isObject(payload)) {
    add("dimension_assessment_payload_invalid", payloadPath);
    return diagnostics;
  }
  for (const key of Object.keys(payload)) if (!allowed.payload.has(key)) add("dimension_assessment_field_unknown", `${payloadPath}/${pointer(key)}`);
  if (!allowedDimensionFields.has(payload.specVersion)) {
    diagnostics.push(diagnostic(SEVERITIES.WARNING, "dimension_assessment_version_unsupported", `${payloadPath}/specVersion`));
    return diagnostics;
  }
  const dimensionFields = allowedDimensionFields.get(payload.specVersion);
  if (!Array.isArray(payload.dimensions)) add("dimension_assessment_dimensions_invalid", `${payloadPath}/dimensions`);
  if (!Array.isArray(payload.assessments)) add("dimension_assessment_assessments_invalid", `${payloadPath}/assessments`);
  if (!Array.isArray(payload.dimensions) || !Array.isArray(payload.assessments)) return diagnostics;

  const dimensions = new Map();
  for (const [index, dimension] of payload.dimensions.entries()) {
    const path = `${payloadPath}/dimensions/${index}`;
    if (!isObject(dimension)) { add("dimension_assessment_dimension_invalid", path); continue; }
    for (const key of Object.keys(dimension)) if (!dimensionFields.has(key)) add("dimension_assessment_field_unknown", `${path}/${pointer(key)}`);
    if (typeof dimension.id !== "string" || dimension.id.length === 0) add("dimension_assessment_dimension_id_invalid", `${path}/id`);
    else if (dimensions.has(dimension.id)) add("dimension_assessment_dimension_id_duplicate", `${path}/id`);
    else dimensions.set(dimension.id, dimension);
    if (typeof dimension.name !== "string") add("dimension_assessment_dimension_name_invalid", `${path}/name`);
    for (const field of ["min", "max"]) if (typeof dimension[field] !== "number" || !Number.isFinite(dimension[field])) add("dimension_assessment_bounds_not_finite", `${path}/${field}`);
    if (Number.isFinite(dimension.min) && Number.isFinite(dimension.max) && dimension.min >= dimension.max) add("dimension_assessment_bounds_not_ordered", path);
    if ("integerOnly" in dimension && typeof dimension.integerOnly !== "boolean") add("dimension_assessment_integer_only_invalid", `${path}/integerOnly`);
    if (dimension.integerOnly === true && Number.isFinite(dimension.min) && Number.isFinite(dimension.max) && Math.ceil(dimension.min) > Math.floor(dimension.max)) add("dimension_assessment_no_integer_candidate", path);
    for (const field of ["unit", "lowLabel", "highLabel"]) if (field in dimension && typeof dimension[field] !== "string") add("dimension_assessment_text_field_invalid", `${path}/${field}`);
    if (payload.specVersion === "0.2.0" && "description" in dimension
      && (typeof dimension.description !== "string" || !/\S/u.test(dimension.description))) {
      add("dimension_assessment_description_invalid", `${path}/description`);
    }
    if (Object.hasOwn(dimension, "lowLabel") !== Object.hasOwn(dimension, "highLabel")) add("dimension_assessment_endpoint_labels_unpaired", path);
  }

  const entityIds = new Set((Array.isArray(dataset.entities) ? dataset.entities : []).filter(isObject).map((entity) => entity.id));
  const pairs = new Set();
  for (const [index, assessment] of payload.assessments.entries()) {
    const path = `${payloadPath}/assessments/${index}`;
    if (!isObject(assessment)) { add("dimension_assessment_assessment_invalid", path); continue; }
    for (const key of Object.keys(assessment)) if (!allowed.assessment.has(key)) add("dimension_assessment_field_unknown", `${path}/${pointer(key)}`);
    if (typeof assessment.entityId !== "string" || !assessment.entityId) add("dimension_assessment_entity_id_invalid", `${path}/entityId`);
    else if (!entityIds.has(assessment.entityId)) add("dimension_assessment_entity_unresolved", `${path}/entityId`);
    if (typeof assessment.dimensionId !== "string" || !assessment.dimensionId) { add("dimension_assessment_dimension_ref_invalid", `${path}/dimensionId`); continue; }
    const dimension = dimensions.get(assessment.dimensionId);
    if (!dimension) { add("dimension_assessment_dimension_unresolved", `${path}/dimensionId`); continue; }
    const pair = JSON.stringify([assessment.entityId, assessment.dimensionId]);
    if (pairs.has(pair)) add("dimension_assessment_pair_duplicate", path); else pairs.add(pair);
    if (typeof assessment.value !== "number" || !Number.isFinite(assessment.value)) add("dimension_assessment_value_not_finite", `${path}/value`);
    else {
      if (assessment.value < dimension.min || assessment.value > dimension.max) add("dimension_assessment_value_out_of_range", `${path}/value`);
      if (dimension.integerOnly === true && !Number.isInteger(assessment.value)) add("dimension_assessment_value_not_integer", `${path}/value`);
    }
  }

  const specification = dataset.extensions?.[SPECIFICATION_EXTENSION_ID];
  if (specification !== undefined) {
    const declarations = Array.isArray(specification?.uses) ? specification.uses.filter((entry) => entry?.extension === DIMENSION_ASSESSMENT_EXTENSION_ID) : [];
    if (declarations.length !== 1) add("dimension_assessment_specification_declaration_count", `/extensions/${pointer(SPECIFICATION_EXTENSION_ID)}/uses`);
    else if (declarations[0].version !== payload.specVersion) add("dimension_assessment_specification_version_conflict", `/extensions/${pointer(SPECIFICATION_EXTENSION_ID)}/uses`);
  }
  return diagnostics;
}
