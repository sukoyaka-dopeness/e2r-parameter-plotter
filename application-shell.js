export function footerMarkup() {
  return `<footer class="app-footer"><small>E2R Dimension Editor</small><button class="credits-button" data-open-credits>Credits</button></footer>`;
}

export function creditsMarkup() {
  // Updated records the last confirmed publication, not a future deployment date.
  const firstReleaseDate='2026-10-21',updatedDate='2026-10-21';
  return `<div class="credits-scrim is-backdrop-dismissible" data-credits-backdrop><section class="credits-dialog" role="dialog" aria-modal="true" aria-labelledby="credits-title" tabindex="-1"><h2 id="credits-title">Credits</h2><div class="credits-metadata"><p>Application: ParameterPlotter 0.1.0</p><p>Creator: sukoyaka-dopeness</p><p><span>First release</span>: ${firstReleaseDate}</p><p><span>Updated</span>: ${updatedDate}</p><p>With gratitude to all the AI systems that contributed to this project.</p></div><nav class="credits-links" aria-label="Credits links"><a href="https://github.com/sukoyaka-dopeness/e2r-parameter-plotter" target="_blank" rel="noreferrer">ParameterPlotter repository</a><a href="https://github.com/sukoyaka-dopeness/e2r-spec" target="_blank" rel="noreferrer">E2R specification repository</a></nav><div class="credits-actions"><button data-close-credits>Close</button></div></section></div>`;
}
