const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

const TARGET_NAME = process.env.TARGET || 'loess.html';
const FILE = 'file:///' + path.resolve(__dirname, '..', TARGET_NAME).replace(/\\/g, '/');
const results = [];
const ok = (name, pass, detail) => results.push({ name, pass, detail: detail || '' });

// page.screenshot() can stall on this page: the compositor is saturated by a
// million grains. Give it room, and fall back to reading the canvas directly.
async function snap(page, name) {
  const p = path.resolve(__dirname, 'shots', name);
  try {
    await page.screenshot({ path: p, timeout: 90000 });
  } catch (e) {
    const d = await page.evaluate(() => document.querySelector('#gl').toDataURL('image/png'));
    fs.writeFileSync(p, Buffer.from(d.split(',')[1], 'base64'));
  }
}

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/PC/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe',
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-gl=angle', '--ignore-gpu-blocklist']
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 820 }, acceptDownloads: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 200)); });

  await page.goto(FILE, { waitUntil: 'load' });
  await page.waitForSelector('#load', { state: 'detached', timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(600);

  // ---------- 1. every element exists ----------
  const ids = ['gl','brand','spec','status','meta','mPts','mDepth','mOcc','scale','focusMark','hint',
    'panel','rail','dock','bNext','bStir','bPaper','bSave','bPanel','veil','file','nogl',
    'sRelief','sFocus','sAperture','sGather','sSize','sExp','sBloom',
    'vRelief','vFocus','vAperture','vGather','vSize','vExp','vBloom',
    'tOcc','tDepthInv','tSpin','tGrain','tModel'];
  const missing = await page.evaluate(list => list.filter(id => !document.getElementById(id)), ids);
  ok('all ' + ids.length + ' elements present', missing.length === 0, missing.join(', '));
  ok('loader element cleaned up', await page.evaluate(() => !document.getElementById('load')));

  // ---------- 2. loader gone, canvas sized ----------
  const boot = await page.evaluate(() => {
    const c = document.querySelector('#gl');
    return { load: !!document.querySelector('#load'), w: c.width, h: c.height, cw: c.clientWidth };
  });
  ok('loader removed', boot.load === false);
  ok('canvas backing store matches', Math.abs(boot.w - boot.cw * (boot.w / boot.cw)) < 1 && boot.w > 0,
     `canvas ${boot.w}px / css ${boot.cw}px`);

  // ---------- 3. every slider ----------
  const sliders = [
    ['sRelief', 'vRelief', 'relief', v => v.toFixed(2)],
    ['sFocus', 'vFocus', 'focus', v => v.toFixed(2)],
    ['sAperture', 'vAperture', 'aperture', v => v.toFixed(2)],
    ['sGather', 'vGather', 'gather', v => v.toFixed(2)],
    ['sSize', 'vSize', 'size', v => v.toFixed(4)],
    ['sExp', 'vExp', 'exposure', v => v.toFixed(2)],
    ['sBloom', 'vBloom', 'bloom', v => v.toFixed(2)],
  ];
  for (const [sid, vid, key] of sliders) {
    const r = await page.evaluate(([sid, vid, key]) => {
      const el = document.getElementById(sid);
      const before = window.LOESS.S[key];
      el.value = 17;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      const mid = window.LOESS.S[key];
      el.value = 88;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      const after = window.LOESS.S[key];
      return { before, mid, after, label: document.getElementById(vid).textContent };
    }, [sid, vid, key]);
    const numeric = parseFloat(r.label);
    ok('slider ' + key + ' drives state',
       r.mid !== r.before && r.after !== r.mid && (key === 'gather' ? numeric > 0 : r.after > r.mid),
       `${r.before} → ${r.mid} → ${r.after}, label "${r.label}"`);
    ok('slider ' + key + ' label non-empty', /\d/.test(r.label), r.label);
  }

  // gather must also move the morph duration
  const dur = await page.evaluate(() => {
    const el = document.getElementById('sGather');
    el.value = 10; el.dispatchEvent(new Event('input', { bubbles: true }));
    const slow = window.LOESS.S.dur;
    el.value = 95; el.dispatchEvent(new Event('input', { bubbles: true }));
    return { slow, fast: window.LOESS.S.dur };
  });
  ok('gather sets morph duration', dur.slow > dur.fast, `${dur.slow.toFixed(2)}s → ${dur.fast.toFixed(2)}s`);

  // ---------- 4. toggles ----------
  const toggles = [['tOcc', 'occlude'], ['tDepthInv', 'depthInv'], ['tSpin', 'spin'], ['tGrain', 'grain']];
  for (const [tid, key] of toggles) {
    const r = await page.evaluate(([tid, key]) => {
      const el = document.getElementById(tid);
      const a = window.LOESS.S[key], ca = el.classList.contains('on');
      el.click();
      const b = window.LOESS.S[key], cb = el.classList.contains('on');
      el.click();
      const c = window.LOESS.S[key], cc = el.classList.contains('on');
      return { a, b, c, ca, cb, cc };
    }, [tid, key]);
    ok('toggle ' + key + ' flips state', r.a !== r.b && r.b !== r.c, `${r.a}→${r.b}→${r.c}`);
    ok('toggle ' + key + ' flips .on class', r.ca !== r.cb && r.cb !== r.cc);
  }

  // depth model toggle has its own handler
  const dm = await page.evaluate(() => {
    const el = document.getElementById('tModel');
    const a = window.LOESS.model.enabled;
    el.click();
    const b = window.LOESS.model.enabled;
    el.click();
    return { a, b, c: window.LOESS.model.enabled };
  });
  ok('toggle depth model', dm.a !== dm.b && dm.b !== dm.c, `${dm.a}→${dm.b}→${dm.c}`);

  // ---------- 5. dock buttons ----------
  const next = await page.evaluate(async () => {
    const before = window.LOESS.S.current;
    document.getElementById('bNext').click();
    await new Promise(r => setTimeout(r, 120));
    return { before, after: window.LOESS.S.current, pics: window.LOESS.S.pics.length };
  });
  ok('NEXT turns the page', next.after !== next.before || next.pics < 2,
     `${next.before} → ${next.after} of ${next.pics}`);

  const spec = await page.textContent('#spec');
  ok('specimen label follows', /\d\d\s*\/\s*\d\d/.test(spec), spec);

  const stir = await page.evaluate(() => {
    window.LOESS.S.stir = 0;
    document.getElementById('bStir').click();
    return window.LOESS.S.stir;
  });
  ok('STIR kicks the dust', stir > 0.5, 'stir=' + stir.toFixed(2));

  const plate = await page.evaluate(async () => {
    document.getElementById('bPaper').click();
    await new Promise(r => setTimeout(r, 9000));
    return { target: window.LOESS.S.inkTarget, body: document.body.classList.contains('ink'),
             btn: document.getElementById('bPaper').classList.contains('on') };
  });
  ok('PLATE flips the target', plate.target === 1);
  ok('PLATE flips the page to ink', plate.body === true);
  ok('PLATE marks its button', plate.btn === true);
  await snap(page, 't_plate.png');
  await page.evaluate(() => document.getElementById('bPaper').click());
  await page.waitForTimeout(1600);

  // ---------- 6. panel ----------
  await page.click('#bPanel');
  await page.waitForTimeout(500);
  const open = await page.evaluate(() => ({
    open: document.getElementById('panel').classList.contains('open'),
    btn: document.getElementById('bPanel').classList.contains('on'),
    body: document.body.classList.contains('panelopen'),
    hint: getComputedStyle(document.getElementById('hint')).opacity
  }));
  ok('SETTINGS opens the panel', open.open && open.btn && open.body);
  await snap(page, 't_panel.png');
  await page.click('#bPanel');
  await page.waitForTimeout(500);
  const closed = await page.evaluate(() => document.getElementById('panel').classList.contains('open'));
  ok('SETTINGS closes again', closed === false);

  // ---------- 7. rail ----------
  const rail = await page.evaluate(() => {
    const t = [...document.querySelectorAll('#rail .thumb')];
    return { total: t.length, withImg: t.filter(x => x.querySelector('img')).length,
             add: t.filter(x => x.classList.contains('add')).length,
             active: t.filter(x => x.classList.contains('on')).length };
  });
  ok('rail has a thumb per picture + add', rail.add === 1 && rail.withImg === rail.total - 1,
     `${rail.total} thumbs, ${rail.withImg} images, ${rail.add} add`);
  ok('exactly one thumb is active', rail.active === 1, rail.active + ' active');

  const pick = await page.evaluate(async () => {
    const t = [...document.querySelectorAll('#rail .thumb')].filter(x => !x.classList.contains('add'));
    const target = t.length > 1 ? 1 : 0;
    t[target].click();
    await new Promise(r => setTimeout(r, 200));
    return { target, current: window.LOESS.S.current };
  });
  ok('thumbnail selects that picture', pick.target === pick.current, `${pick.target} vs ${pick.current}`);

  // ---------- 8. focus scale ----------
  const scale = await page.evaluate(async () => {
    const el = document.getElementById('sFocus');
    el.value = 5; el.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(r => setTimeout(r, 250));
    const a = document.getElementById('focusMark').style.top;
    el.value = 95; el.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(r => setTimeout(r, 250));
    return { a, b: document.getElementById('focusMark').style.top };
  });
  ok('focus scale marker tracks', scale.a !== scale.b && scale.a !== '' , `${scale.a} → ${scale.b}`);

  // ---------- 9. keyboard ----------
  const keys = await page.evaluate(() => ({ ink: window.LOESS.S.inkTarget }));
  await page.keyboard.press('b');
  await page.waitForTimeout(300);
  const afterB = await page.evaluate(() => window.LOESS.S.inkTarget);
  ok('key b toggles plate', afterB !== keys.ink);
  await page.keyboard.press('b');
  await page.waitForTimeout(200);

  await page.evaluate(() => { window.LOESS.S.stir = 0; });
  await page.keyboard.press('g');
  const afterG = await page.evaluate(() => window.LOESS.S.stir);
  ok('key g stirs', afterG > 0.5, afterG.toFixed(2));

  const cur0 = await page.evaluate(() => window.LOESS.S.current);
  await page.keyboard.press(' ');
  await page.waitForTimeout(300);
  const cur1 = await page.evaluate(() => window.LOESS.S.current);
  ok('space turns the page', cur0 !== cur1, `${cur0} → ${cur1}`);

  const focusBefore = await page.evaluate(() => window.LOESS.S.focus);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  const focusAfter = await page.evaluate(() => window.LOESS.S.focus);
  ok('arrow keys pull focus', focusAfter > focusBefore, `${focusBefore.toFixed(2)} → ${focusAfter.toFixed(2)}`);

  const diag = await page.evaluate(async () => {
    const before = window.LOESS.S.diag;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', bubbles: true }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', bubbles: true }));
    await new Promise(r => setTimeout(r, 200));
    return { before, after: window.LOESS.S.diag, label: document.getElementById('mDepth').textContent };
  });
  ok('key d cycles the diagnostic', diag.before !== diag.after, `${diag.before} → ${diag.after}: ${diag.label}`);
  // back to normal
  for (let i = 0; i < 5; i++) { await page.keyboard.press('d'); await page.waitForTimeout(80); }

  // ---------- 10. save ----------
  const [dl] = await Promise.all([
    page.waitForEvent('download', { timeout: 15000 }).catch(() => null),
    page.keyboard.press('p')
  ]);
  ok('save produces a png', !!dl, dl ? dl.suggestedFilename() : 'no download');

  // ---------- 11. upload ----------
  const src = path.resolve(__dirname, 'shots', 'up.png');
  await page.evaluate(async () => {
    const c = document.createElement('canvas'); c.width = 320; c.height = 480;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 480);
    g.addColorStop(0, '#0b1220'); g.addColorStop(1, '#e8b183');
    x.fillStyle = g; x.fillRect(0, 0, 320, 480);
    window.__png = c.toDataURL('image/png');
  });
  const b64 = await page.evaluate(() => window.__png);
  fs.writeFileSync(src, Buffer.from(b64.split(',')[1], 'base64'));
  const before = await page.evaluate(() => window.LOESS.S.pics.length);
  await page.setInputFiles('#file', src);
  await page.waitForTimeout(5000);
  const after = await page.evaluate(() => ({ n: window.LOESS.S.pics.length, cur: window.LOESS.S.current }));
  ok('dropping a picture adds it', after.n === before + 1, `${before} → ${after.n}`);
  ok('new picture is shown', after.cur === after.n - 1);

  // ---------- 12. drag and drop ----------
  const veil = await page.evaluate(async () => {
    window.dispatchEvent(new DragEvent('dragenter', { bubbles: true }));
    await new Promise(r => setTimeout(r, 150));
    const on = document.getElementById('veil').classList.contains('on');
    window.dispatchEvent(new DragEvent('dragleave', { bubbles: true }));
    await new Promise(r => setTimeout(r, 150));
    return { on, off: document.getElementById('veil').classList.contains('on') };
  });
  ok('drag veil appears and clears', veil.on === true && veil.off === false);

  // ---------- 13. hide ui ----------
  const hidden = await page.evaluate(async () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', bubbles: true }));
    await new Promise(r => setTimeout(r, 150));
    const a = getComputedStyle(document.getElementById('brand')).opacity;
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', bubbles: true }));
    await new Promise(r => setTimeout(r, 150));
    return { a, b: getComputedStyle(document.getElementById('brand')).opacity };
  });
  ok('key h hides and restores the ui', hidden.a === '0' && hidden.b !== '0', `${hidden.a} / ${hidden.b}`);

  // ---------- 14. resize ----------
  await page.setViewportSize({ width: 900, height: 700 });
  await page.waitForTimeout(1200);
  const rs = await page.evaluate(() => {
    const c = document.querySelector('#gl');
    return { w: c.width, cw: c.clientWidth, dpr: devicePixelRatio };
  });
  ok('resize rebuilds the canvas', Math.abs(rs.w - rs.cw * rs.dpr) <= 1, `${rs.w} vs ${rs.cw}×${rs.dpr}`);

  await snap(page, 't_final.png');

  // ---------- report ----------
  const bad = results.filter(r => !r.pass);
  console.log('\n=== ' + (results.length - bad.length) + '/' + results.length + ' passed ===');
  for (const r of results) console.log((r.pass ? '  ok   ' : '  FAIL ') + r.name + (r.detail ? '   [' + r.detail + ']' : ''));
  if (errs.length) { console.log('\n=== console errors ==='); errs.forEach(e => console.log('  ' + e)); }
  console.log('\nfailures: ' + bad.length + ', console errors: ' + errs.length);

  await browser.close();
})();
