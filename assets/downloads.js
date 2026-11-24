// Shows how many times each app's APK has been downloaded from GitHub Releases.
// Usage: <span class="downloads" data-repo="owner/repo" data-format="short|long" hidden></span>
(function () {
  const els = document.querySelectorAll(".downloads[data-repo]");
  if (!els.length) return;

  const CACHE_MS = 60 * 60 * 1000; // GitHub allows 60 API requests/hour per visitor, so cache for an hour
  const fmt = new Intl.NumberFormat("en");

  function cached(repo) {
    try {
      const c = JSON.parse(localStorage.getItem("dl:" + repo));
      if (c && Date.now() - c.t < CACHE_MS) return c.n;
    } catch (e) {}
    return null;
  }

  function store(repo, n) {
    try { localStorage.setItem("dl:" + repo, JSON.stringify({ n: n, t: Date.now() })); } catch (e) {}
  }

  async function count(repo) {
    const hit = cached(repo);
    if (hit !== null) return hit;
    let total = 0;
    for (let page = 1; page <= 5; page++) {
      const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`, {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!res.ok) throw new Error("GitHub API " + res.status);
      const releases = await res.json();
      for (const r of releases) {
        for (const a of r.assets || []) {
          if (a.name.toLowerCase().endsWith(".apk")) total += a.download_count;
        }
      }
      if (releases.length < 100) break;
    }
    store(repo, total);
    return total;
  }

  const repos = [...new Set([...els].map((el) => el.dataset.repo))];
  repos.forEach((repo) => {
    count(repo)
      .then((n) => {
        document.querySelectorAll(`.downloads[data-repo="${repo}"]`).forEach((el) => {
          const word = n === 1 ? "download" : "downloads";
          el.textContent = el.dataset.format === "long" ? `Downloaded ${fmt.format(n)} ${n === 1 ? "time" : "times"}` : `${fmt.format(n)} ${word}`;
          el.hidden = false;
        });
      })
      .catch(() => {
        // Leave the count hidden if GitHub can't be reached; the rest of the page is unaffected.
      });
  });
})();
