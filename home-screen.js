const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function homeMarkup({canContinue=false,notice='',sampleError=''}={}) {
  return `<header class="app-header home-header"><a class="app-brand" href="#home">ParameterPlotter</a></header>
  <main class="home-main" aria-labelledby="home-title">
    <h1 id="home-title">Get Started</h1>
    <p class="home-intro">Compare E2R Entities across Dimensions.</p>
    ${notice?`<p class="home-notice" role="alert">${escapeHtml(notice)}</p>`:''}
    ${sampleError?`<p class="home-notice" role="alert">${escapeHtml(sampleError)}</p>`:''}
    <div class="home-actions">
      ${canContinue?'<button data-home-action="continue">Continue Editing</button>':''}
      <button data-home-action="new">New Dataset</button>
      <button data-home-action="open">Open E2R Dataset</button>
      <div class="sample-action"><button data-home-action="sample">Open Sample Dataset · The Ashen Crown</button></div>
    </div>
    <input id="dataset-file" type="file" accept=".json,.e2r.json,application/json" hidden>
  </main>`;
}
