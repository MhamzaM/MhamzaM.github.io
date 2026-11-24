// Fills the "Support" section from config.js.
(function () {
  const s = window.SUPPORT || {};
  const root = document.getElementById("support-ways");
  if (!root) return;

  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const soon = '<span class="soon">Coming soon</span>';

  const row = (label, value) =>
    `<div><dt>${label}</dt><dd>${value ? `<span>${esc(value)}</span><button class="copy" type="button" data-copy="${esc(value)}">Copy</button>` : soon}</dd></div>`;

  const wallet = (w) => (w && w.number ? `${w.number}${w.name ? " (" + w.name + ")" : ""}` : "");

  const patreon = s.patreon
    ? `<a class="button" href="${esc(s.patreon)}" target="_blank" rel="noopener">Join on Patreon</a>`
    : `<span class="button" aria-disabled="true">Patreon page coming soon</span>`;

  const b = s.bank || {};
  root.innerHTML = `
    <article class="way primary">
      <h3>Monthly on Patreon</h3>
      <p>Pay by card from anywhere in the world. A small monthly amount is the most useful kind of support, because it lets me plan the next app.</p>
      ${patreon}
    </article>
    <article class="way">
      <h3>JazzCash or Easypaisa</h3>
      <p>Send any amount from your phone.</p>
      <dl>
        ${row("JazzCash", wallet(s.jazzcash))}
        ${row("Easypaisa", wallet(s.easypaisa))}
      </dl>
    </article>
    <article class="way">
      <h3>Bank transfer</h3>
      <p>From any Pakistani bank, or internationally by SWIFT.</p>
      <dl>
        ${row("Account title", b.title)}
        ${row("Bank", b.bank)}
        ${row("IBAN", b.iban)}
      </dl>
    </article>`;

  root.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = "Copied";
    } catch {
      btn.textContent = "Select and copy";
    }
    setTimeout(() => (btn.textContent = "Copy"), 2000);
  });
})();
