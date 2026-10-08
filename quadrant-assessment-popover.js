const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

export function quadrantAssessmentPopoverMarkup({entityName, dimensions, getValue, format}) {
  const rows = dimensions.map(dimension => {
    const value = getValue(dimension.id);
    const display = value === null || value === undefined
      ? '<span class="quadrant-assessment-missing">No assessment</span>'
      : esc(format(value, dimension));
    return `<div class="quadrant-assessment-row"><dt class="authored-dimension-name">${esc(dimension.name)}</dt><dd>${display}</dd></div>`;
  }).join('');
  return `<section class="quadrant-assessment-popover" role="dialog" aria-modal="false" aria-labelledby="quadrant-assessment-title"><div class="quadrant-assessment-popover-head"><div><h3 id="quadrant-assessment-title" tabindex="-1">Assessment details</h3><p class="authored-entity-name">${esc(entityName)}</p></div><button type="button" data-close-quadrant-assessments aria-label="Close assessment details">Close</button></div><dl class="quadrant-assessment-list" tabindex="0" aria-label="Assessment details">${rows}</dl></section>`;
}
