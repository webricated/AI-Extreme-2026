/* AI EXTREME 2026 – Problem Statement Portal
 * SECURITY NOTE: data.js holds the 10 problems AES-GCM-encrypted; the key is derived (PBKDF2) from
 * each access code, so no problem text or code list is readable in the page source. A static site can
 * still be brute-forced offline, so for stronger confidentiality move decryption to a backend:
 * replace unlock() with a fetch() to your server that checks the code and returns one problem. */
(() => {
  const $ = id => document.getElementById(id);
  const input = $('code'), go = $('go'), msg = $('msg'), lock = $('lockCard');
  const ERR = 'Invalid access code. Please check the code shared with you through email and try again.';
  const normalize = s => s.replace(/\s+/g, '').toUpperCase();
  const unb64 = s => Uint8Array.from(atob(s), ch => ch.charCodeAt(0));

  async function tryBlob(code, blob) {
    try {
      const d = unb64(blob), salt = d.slice(0, 16), iv = d.slice(16, 28), ct = d.slice(28);
      const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(code), 'PBKDF2', false, ['deriveKey']);
      const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
      return JSON.parse(new TextDecoder().decode(pt));
    } catch (e) { return null; }
  }
  async function unlock(code) {
    const all = await Promise.all((window.AIEX_DATA || []).map(b => tryBlob(code, b)));
    return all.find(Boolean) || null;
  }

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
  function render(md) {
    const out = [], lines = md.split('\n'); let i = 0;
    while (i < lines.length) {
      const l = lines[i];
      if (!l.trim()) { i++; continue; }
      if (l.startsWith('### ')) { out.push(`<h3>${inline(l.slice(4))}</h3>`); i++; }
      else if (l.startsWith('> ')) { const q = []; while (i < lines.length && lines[i].startsWith('> ')) q.push(inline(lines[i++].slice(2))); out.push(`<blockquote>${q.join('<br>')}</blockquote>`); }
      else if (l.startsWith('- ')) { const li = []; while (i < lines.length && lines[i].startsWith('- ')) li.push(`<li>${inline(lines[i++].slice(2))}</li>`); out.push(`<ul>${li.join('')}</ul>`); }
      else { const p = []; while (i < lines.length && lines[i].trim() && !/^(### |> |- )/.test(lines[i])) p.push(inline(lines[i++])); out.push(`<p>${p.join('<br>')}</p>`); }
    }
    return out.join('');
  }

  function fail() { msg.textContent = ERR; lock.classList.remove('shake'); void lock.offsetWidth; lock.classList.add('shake'); }
  async function submit() {
    const code = normalize(input.value);
    msg.textContent = '';
    if (!code) { msg.textContent = 'Enter the access code you received by email.'; return; }
    go.disabled = true; go.classList.add('busy');
    const started = Date.now();
    const p = await unlock(code);
    await new Promise(r => setTimeout(r, Math.max(0, 700 - (Date.now() - started))));
    go.disabled = false; go.classList.remove('busy');
    if (!p) return fail();
    $('track').textContent = p.track; $('ptitle').textContent = p.title; $('body').innerHTML = render(p.body);
    $('gate').hidden = true; $('result').hidden = false; input.value = '';
    $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  go.addEventListener('click', submit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  $('close').addEventListener('click', () => {
    $('body').innerHTML = ''; $('ptitle').textContent = ''; $('result').hidden = true; $('gate').hidden = false; window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* Animated network background */
  const cv = $('bg'), g = cv.getContext('2d'); let W, H, pts = [];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    const n = Math.min(90, Math.floor(W * H / 16000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
  }
  function frame() {
    g.clearRect(0, 0, W, H);
    for (const a of pts) {
      a.x = (a.x + a.vx + W) % W; a.y = (a.y + a.vy + H) % H;
      g.fillStyle = 'rgba(77,226,197,.7)'; g.beginPath(); g.arc(a.x, a.y, 1.6, 0, 7); g.fill();
      for (const b of pts) { const d = Math.hypot(a.x - b.x, a.y - b.y); if (d < 130) { g.strokeStyle = `rgba(110,160,255,${.16 * (1 - d / 130)})`; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); } }
    }
    if (!still) requestAnimationFrame(frame);
  }
  addEventListener('resize', size); size(); frame();
})();
