import { HISTORY_2_FEATURES } from "./specification-validator.js";

export const PROFILE_REGISTRY_VERSION = "1.0.0";
export const HISTORY_POSITION_CIRCA_PROFILE = "position-circa";

const HISTORY_EXTENSION_ID = "history";
const HISTORY_STABLE_VERSION = "1.0.0";
const HISTORY_CANDIDATE_VERSION = "2.0.0";
const PROFILE_FEATURES = new Set(["approximation"]);
const PROFILE_ASSERTION_TYPES = new Set(["position"]);

function sameSet(left, right) {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

function profileResult(matched, reasons = []) {
  return {
    profile: HISTORY_POSITION_CIRCA_PROFILE,
    maturity: "stable",
    matched,
    reasons,
  };
}

export function classifyHistoryProfile({
  declaration,
  occurrences = [],
  validCandidates = [],
  usedFeatures = new Set(),
}) {
  if (!declaration) return undefined;

  if (declaration.version === HISTORY_STABLE_VERSION) {
    return {
      registryVersion: PROFILE_REGISTRY_VERSION,
      extension: HISTORY_EXTENSION_ID,
      version: HISTORY_STABLE_VERSION,
      extensionMaturity: "stable",
      classification: "stable-extension-supported",
      profiles: [],
    };
  }

  if (declaration.version !== HISTORY_CANDIDATE_VERSION) {
    return {
      registryVersion: PROFILE_REGISTRY_VERSION,
      extension: HISTORY_EXTENSION_ID,
      version: declaration.version,
      extensionMaturity: "unsupported",
      classification: "unsupported-or-partial",
      profiles: [],
    };
  }

  const declaredFeatures = new Set(declaration.features ?? []);
  const unknownFeatures = [...declaredFeatures].filter((feature) => !HISTORY_2_FEATURES.has(feature));
  const deferredFeatures = [...declaredFeatures].filter((feature) => (
    HISTORY_2_FEATURES.has(feature) && !PROFILE_FEATURES.has(feature)
  ));
  const reasons = [];
  if (unknownFeatures.length > 0) reasons.push(`unknown-feature:${unknownFeatures.join(",")}`);
  if (deferredFeatures.length > 0) reasons.push(`deferred-feature:${deferredFeatures.join(",")}`);
  if (occurrences.length === 0 || validCandidates.length !== occurrences.length) {
    reasons.push("invalid-or-missing-history-payload");
  }
  if (!sameSet(usedFeatures, declaredFeatures)) reasons.push("feature-declaration-mismatch");
  if (validCandidates.some(({ assertions }) => (
    assertions.length !== 1
    || !PROFILE_ASSERTION_TYPES.has(assertions[0]?.assertion?.type)
  ))) {
    reasons.push("profile-assertion-constraint");
  }

  const uniqueReasons = [...new Set(reasons)];
  const matched = uniqueReasons.length === 0;
  return {
    registryVersion: PROFILE_REGISTRY_VERSION,
    extension: HISTORY_EXTENSION_ID,
    version: HISTORY_CANDIDATE_VERSION,
    extensionMaturity: "candidate",
    classification: matched
      ? "stable-profile-supported"
      : unknownFeatures.length > 0
        ? "unsupported-or-partial"
        : "candidate-supported",
    profiles: [profileResult(matched, uniqueReasons)],
  };
}
