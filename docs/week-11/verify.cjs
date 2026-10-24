// Optional tooling: install Playwright in minishop-react, or point to an existing module.
const { chromium } = require(process.env.MINISHOP_PLAYWRIGHT || '../../minishop-react/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const net = require('node:net');

const root = path.resolve(__dirname, '../..');
const app = path.join(root, 'minishop-react');
const output = __dirname;
const screenshotViewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 393, height: 852 },
];
const webPort = 15173;
const apiPort = 13001;
const base = `http://127.0.0.1:${webPort}`;
const api = `http://127.0.0.1:${apiPort}/products`;
const fixture = path.join(output, 'test-db.json');
const seed = JSON.parse(fs.readFileSync(path.join(output, 'db.before-crud.json'), 'utf8'));
const results = [];
const screenshots = [];
const runtimeErrors = [];
let apiProcess;
let viteProcess;
let browser;
let page;
let ownsFixture = false;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function requireFreePort(port) {
  await new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', () => reject(new Error(`Test port ${port} is occupied; stop the test before touching any API`)));
    probe.listen(port, '127.0.0.1', () => probe.close(resolve));
  });
}

async function waitUntil(fn, label, timeout = 15000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    try { if (await fn()) return; } catch { /* server may still be starting */ }
    await delay(120);
  }
  throw new Error(`Timeout: ${label}`);
}
async function step(name, fn) {
  const start = Date.now();
  try { await fn(); results.push({ name, passed: true, durationMs: Date.now() - start }); console.log(`PASS ${name}`); }
  catch (error) { results.push({ name, passed: false, error: error.message }); throw error; }
}
async function stop(child) {
  if (!child || child.exitCode !== null) return;
  const exited = once(child, 'exit');
  child.kill();
  await Promise.race([exited, delay(3000)]);
}
async function startApi() {
  apiProcess = spawn(process.execPath, [path.join(app, 'node_modules/json-server/lib/cli/bin.js'), '--watch', fixture, '--port', String(apiPort), '--host', '127.0.0.1'], { cwd: app, stdio: 'ignore', windowsHide: true });
  await waitUntil(async () => (await fetch(api)).ok, 'API start');
}
async function products() { return (await fetch(api)).json(); }
async function go(route) { await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' }); }
async function tableReady() { await page.locator('tbody tr').first().waitFor(); }
async function shot(name) {
  const viewport = page.viewportSize();
  const device = screenshotViewports.find(size => size.width === viewport.width && size.height === viewport.height);
  assert.ok(device, `Unexpected screenshot size: ${viewport.width}x${viewport.height}`);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.querySelector('.modal-box')?.scrollTo({ top: 0, behavior: 'instant' });
  });
  const filename = `${device.name}-${name}.png`;
  await page.screenshot({ path: path.join(output, filename), fullPage: false, animations: 'disabled', scale: 'css' });
  screenshots.push(filename);
}
async function summary(label) {
  return page.locator('article').filter({ has: page.getByRole('heading', { name: label, exact: true }) }).locator('p').first().innerText();
}
async function assertSummary(count, value, categories) {
  await tableReady();
  assert.equal(await summary('Total Products'), String(count));
  assert.equal(await summary('Categories'), String(categories));
  assert.equal(await summary('Product Value'), new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value));
}
async function openAdd() {
  await page.getByRole('button', { name: /Add Product/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  return dialog;
}
async function fillProduct(name, price, category = 'Gadget', icon = '🖱️', description = 'Week 11 verification item') {
  await page.locator('#product-name').fill(name);
  await page.locator('#product-price').fill(String(price));
  await page.locator('#product-category').selectOption(category);
  await page.locator('#product-icon').fill(icon);
  await page.locator('#product-description').fill(description);
}
async function submitAdd() {
  await page.getByRole('dialog').getByRole('button', { name: 'Add Product', exact: true }).click();
}
async function confirmDelete(name, accept = true) {
  const dialogEvent = page.waitForEvent('dialog');
  const click = page.getByRole('button', { name: `Delete ${name}`, exact: true }).click();
  const dialog = await dialogEvent;
  assert.match(dialog.message(), new RegExp(name));
  if (accept) await dialog.accept(); else await dialog.dismiss();
  await click;
}
async function noPageOverflow(width) {
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
  assert.equal(dimensions.viewport, width);
  assert.ok(dimensions.content <= width + 1, JSON.stringify(dimensions));
}

(async () => {
  // A dedicated copy and dedicated ports avoid changing the user's live database/servers.
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(app, 'db.json'), 'utf8')), seed);
  await requireFreePort(apiPort);
  await requireFreePort(webPort);
  fs.writeFileSync(fixture, JSON.stringify(seed, null, 2));
  ownsFixture = true;
  await startApi();
  viteProcess = spawn(process.execPath, [path.join(app, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', String(webPort), '--strictPort'], {
    cwd: app, env: { ...process.env, VITE_PRODUCT_API_URL: api }, stdio: 'ignore', windowsHide: true,
  });
  await waitUntil(async () => (await fetch(base)).ok, 'Vite start');
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => runtimeErrors.push(error.message));

  await step('Profile entry, separate AdminLayout, /admin redirect, active navigation', async () => {
    await go('/profile');
    assert.equal(await page.getByRole('link', { name: 'Manage Products', exact: true }).count(), 0);
    await page.getByRole('link', { name: /Switch to Admin/ }).click();
    await page.waitForURL('**/admin/dashboard');
    await tableReady();
    assert.equal(await page.locator('footer').count(), 0);
    assert.equal(await page.getByRole('navigation', { name: 'Admin navigation' }).getByRole('link', { name: 'Dashboard' }).getAttribute('aria-current'), 'page');
    await go('/admin');
    await page.waitForURL('**/admin/dashboard');
  });
  await step('Dashboard real API totals: 3 products, THB33000, 1 category', async () => {
    await assertSummary(3, 33000, 1);
    assert.equal(await page.locator('tbody tr').count(), 3);
  });
  await step('Loading states on both API pages (delayed real GET)', async () => {
    const handler = async route => { await delay(700); await route.continue(); };
    await page.route(api, handler);
    await go('/admin/dashboard');
    await page.getByText('กำลังโหลดภาพรวมสินค้า…', { exact: true }).waitFor();
    await tableReady();
    await go('/admin/products');
    await page.getByText('กำลังโหลดสินค้า…', { exact: true }).waitFor();
    await tableReady();
    await page.unroute(api, handler);
  });
  await step('Validation: empty/whitespace name, blank/0/negative/non-number price never POST', async () => {
    let mutations = 0;
    const countMutation = request => { if (request.url() === api && request.method() === 'POST') mutations++; };
    page.on('request', countMutation);
    await openAdd();
    assert.equal(await page.locator('#product-name').inputValue(), '');
    assert.equal(await page.locator('#product-category').inputValue(), 'Computer');
    assert.equal(await page.locator('#product-name').evaluate(element => element === document.activeElement), true);
    await submitAdd();
    await page.locator('#name-error').waitFor();
    await page.locator('#price-error').waitFor();
    await fillProduct('   ', 450);
    await submitAdd();
    assert.match(await page.locator('#name-error').innerText(), /กรุณา/);
    await page.locator('#product-name').fill('Week 11 validation');
    for (const value of ['0', '-10', '']) {
      await page.locator('#product-price').fill(value);
      await submitAdd();
      await page.locator('#price-error').waitFor();
    }
    await page.locator('#product-price').fill('');
    await page.locator('#product-price').pressSequentially('abc');
    await submitAdd();
    await page.locator('#price-error').waitFor();
    assert.equal(mutations, 0);
    assert.equal((await products()).length, 3);
    await shot('02-validation');
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    assert.match(await page.evaluate(() => document.activeElement.textContent), /Add Product/);
    page.off('request', countMutation);
  });
  await step('Cancel, Escape and backdrop close without saving; reopening resets form', async () => {
    const before = await products();
    await openAdd();
    await fillProduct('Week 11 Cancel', 100);
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await openAdd();
    assert.equal(await page.locator('#product-name').inputValue(), '');
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await openAdd();
    await page.mouse.click(10, 10);
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    assert.deepEqual(await products(), before);
  });
  await step('Create via POST, all fields, numeric price, guard double-submit; Dashboard refetch', async () => {
    let postCount = 0;
    const slowPost = async route => {
      if (route.request().method() === 'POST') { postCount++; await delay(700); }
      await route.continue();
    };
    await page.route(api, slowPost);
    await openAdd();
    await fillProduct('Week 11 Wireless Mouse', 450);
    await submitAdd();
    await waitUntil(() => page.locator('#product-name').isDisabled(), 'form disabled while saving');
    assert.equal(await page.getByRole('button', { name: 'Close modal', exact: true }).isDisabled(), true);
    await page.locator('dialog form').evaluate(form => { form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').isVisible(), true);
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await page.getByRole('button', { name: 'Edit Week 11 Wireless Mouse', exact: true }).waitFor();
    assert.equal(postCount, 1);
    await page.unroute(api, slowPost);
    const record = (await products()).find(p => p.name === 'Week 11 Wireless Mouse');
    assert.equal(record.price, 450);
    assert.equal(typeof record.price, 'number');
    assert.equal(record.category, 'Gadget');
    assert.equal(record.icon, '🖱️');
    assert.equal(record.description, 'Week 11 verification item');
    await shot('03-created');
    await page.getByRole('navigation', { name: 'Admin navigation' }).getByRole('link', { name: 'Dashboard' }).click();
    await assertSummary(4, 33450, 2);
    await shot('04-dashboard-after-create');
  });
  await step('Edit prefilled modal via PUT, price450->490 and preserve untouched extra field', async () => {
    const record = (await products()).find(p => p.name === 'Week 11 Wireless Mouse');
    await fetch(`${api}/${record.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ verificationExtra: { keep: true } }) });
    await page.getByRole('navigation', { name: 'Admin navigation' }).getByRole('link', { name: 'Products', exact: true }).click();
    await page.getByRole('button', { name: 'Edit Week 11 Wireless Mouse', exact: true }).click();
    assert.equal(await page.locator('#product-name').inputValue(), record.name);
    assert.equal(await page.locator('#product-category').inputValue(), 'Gadget');
    assert.equal(await page.locator('#product-description').inputValue(), record.description);
    await page.locator('#product-price').fill('490');
    const put = page.waitForRequest(req => req.method() === 'PUT' && req.url() === `${api}/${record.id}`);
    await page.getByRole('button', { name: 'Save Changes', exact: true }).click();
    const payload = (await put).postDataJSON();
    assert.equal(payload.price, 490);
    assert.deepEqual(payload.verificationExtra, { keep: true });
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    const updated = (await products()).find(p => p.id === record.id);
    assert.equal(updated.price, 490);
    assert.deepEqual(updated.verificationExtra, { keep: true });
    assert.equal(updated.icon, record.icon);
    assert.equal(updated.description, record.description);
    await shot('05-updated');
    await page.getByRole('navigation', { name: 'Admin navigation' }).getByRole('link', { name: 'Dashboard' }).click();
    await assertSummary(4, 33490, 2);
  });
  await step('Delete confirmation cancel preserves record; confirm removes from API/table/dashboard', async () => {
    await page.getByRole('navigation', { name: 'Admin navigation' }).getByRole('link', { name: 'Products', exact: true }).click();
    await tableReady();
    await confirmDelete('Week 11 Wireless Mouse', false);
    assert.equal((await products()).length, 4);
    await confirmDelete('Week 11 Wireless Mouse');
    await page.getByRole('button', { name: 'Delete Week 11 Wireless Mouse', exact: true }).waitFor({ state: 'detached' });
    assert.deepEqual(await products(), seed.products);
    await shot('06-deleted');
    await page.getByRole('navigation', { name: 'Admin navigation' }).getByRole('link', { name: 'Dashboard' }).click();
    await assertSummary(3, 33000, 1);
  });
  await step('Optional icon/description can be blank and each category can be saved', async () => {
    await go('/admin/products');
    await tableReady();
    for (const category of ['Computer', 'Audio', 'Fashion', 'Gadget']) {
      await openAdd();
      await fillProduct(`Week 11 ${category}`, 1, category, '', '');
      await submitAdd();
      await page.getByRole('dialog').waitFor({ state: 'detached' });
      const item = (await products()).find(p => p.name === `Week 11 ${category}`);
      assert.equal(item.category, category);
      assert.equal(item.icon, '');
      assert.equal(item.description, '');
      await page.getByRole('button', { name: `Delete Week 11 ${category}`, exact: true }).waitFor();
      await confirmDelete(`Week 11 ${category}`);
      await page.getByRole('button', { name: `Delete Week 11 ${category}`, exact: true }).waitFor({ state: 'detached' });
    }
    assert.deepEqual(await products(), seed.products);
  });
  await step('Empty states and zero summaries; first-five table with seven real API records', async () => {
    // Change only the isolated API fixture while its process is stopped.
    await stop(apiProcess);
    fs.writeFileSync(fixture, JSON.stringify({ products: [] }));
    await startApi();
    await go('/admin/dashboard');
    await page.getByRole('heading', { name: 'ยังไม่มีสินค้าในระบบ', exact: true }).waitFor();
    assert.equal(await summary('Total Products'), '0');
    assert.equal(await summary('Categories'), '0');
    assert.match(await summary('Product Value'), /0\.00/);
    await shot('07-empty-dashboard');
    await go('/admin/products');
    await page.getByRole('heading', { name: 'ยังไม่มีสินค้า', exact: true }).waitFor();
    await shot('08-empty-products');
    const additional = Array.from({ length: 4 }, (_, i) => ({ id: i + 4, name: `Week 11 Overview ${i + 1}`, price: 10, category: 'Audio' }));
    await stop(apiProcess);
    fs.writeFileSync(fixture, JSON.stringify({ products: [...seed.products, ...additional] }));
    await startApi();
    await go('/admin/dashboard');
    await assertSummary(7, 33040, 2);
    assert.equal(await page.locator('tbody tr').count(), 5);
    assert.deepEqual(await page.locator('tbody th').allTextContents(), ['Laptop', 'Keyboard', 'Monitor', 'Week 11 Overview 1', 'Week 11 Overview 2']);
    await stop(apiProcess);
    fs.writeFileSync(fixture, JSON.stringify(seed));
    await startApi();
  });
  await step('Real stopped API: Dashboard and Products error + Retry recover', async () => {
    await stop(apiProcess);
    await go('/admin/dashboard');
    await page.getByRole('heading', { name: 'โหลด Dashboard ไม่สำเร็จ', exact: true }).waitFor();
    await shot('09-api-stopped-dashboard');
    await startApi();
    await page.getByRole('button', { name: /Retry/ }).click();
    await assertSummary(3, 33000, 1);
    await stop(apiProcess);
    await go('/admin/products');
    await page.getByRole('heading', { name: 'โหลดสินค้าไม่สำเร็จ', exact: true }).waitFor();
    await shot('10-api-stopped-products');
    await startApi();
    await page.getByRole('button', { name: /Retry/ }).click();
    await tableReady();
  });
  await step('Real stopped API during save: retain modal/input, show error, retry saves successfully', async () => {
    await openAdd();
    await fillProduct('Week 11 Retry Mouse', 450);
    await stop(apiProcess);
    await submitAdd();
    await page.getByRole('dialog').getByRole('alert').waitFor();
    assert.equal(await page.locator('#product-name').inputValue(), 'Week 11 Retry Mouse');
    assert.equal(await page.locator('#product-price').inputValue(), '450');
    assert.equal(await page.locator('#product-description').inputValue(), 'Week 11 verification item');
    await shot('11-save-error-retains-form');
    await startApi();
    await submitAdd();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await page.getByRole('button', { name: 'Delete Week 11 Retry Mouse', exact: true }).waitFor();
    await confirmDelete('Week 11 Retry Mouse');
    await page.getByRole('button', { name: 'Delete Week 11 Retry Mouse', exact: true }).waitFor({ state: 'detached' });
    assert.deepEqual(await products(), seed.products);
  });
  await step('HTTP500 update/delete error messages preserve form/record (injected response)', async () => {
    await openAdd();
    await fillProduct('Week 11 HTTP Error', 10);
    await submitAdd();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    const item = (await products()).find(p => p.name === 'Week 11 HTTP Error');
    const failWrite = async route => {
      if (['PUT', 'DELETE'].includes(route.request().method())) await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
      else await route.continue();
    };
    await page.route(`${api}/${item.id}`, failWrite);
    await page.getByRole('button', { name: 'Edit Week 11 HTTP Error', exact: true }).click();
    await page.locator('#product-price').fill('20');
    await page.getByRole('button', { name: 'Save Changes', exact: true }).click();
    await page.getByRole('dialog').getByRole('alert').waitFor();
    assert.match(await page.getByRole('dialog').getByRole('alert').innerText(), /HTTP 500/);
    assert.equal(await page.locator('#product-price').inputValue(), '20');
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await confirmDelete('Week 11 HTTP Error');
    await page.getByRole('alert').filter({ hasText: 'HTTP 500' }).waitFor();
    assert.equal((await products()).find(p => p.id === item.id).price, 10);
    await page.unroute(`${api}/${item.id}`, failWrite);
    await confirmDelete('Week 11 HTTP Error');
    await page.getByRole('button', { name: 'Delete Week 11 HTTP Error', exact: true }).waitFor({ state: 'detached' });
  });
  await step('Light/dark token change, localStorage and refresh persistence', async () => {
    await go('/admin/dashboard');
    await tableReady();
    const light = await page.locator('.admin-shell').evaluate(el => getComputedStyle(el).backgroundColor);
    await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click();
    await waitUntil(() => page.evaluate(() => document.documentElement.dataset.theme === 'dark'), 'dark theme');
    assert.equal(await page.evaluate(() => localStorage.getItem('minishop-theme')), 'dark');
    const dark = await page.locator('.admin-shell').evaluate(el => getComputedStyle(el).backgroundColor);
    assert.notEqual(light, dark);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await assertSummary(3, 33000, 1);
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    // Persistence is local to this browser context. A new tab in the same context uses the saved theme.
    const sameContextPage = await page.context().newPage();
    await sameContextPage.goto(`${base}/admin/dashboard`, { waitUntil: 'domcontentloaded' });
    await sameContextPage.getByRole('button', { name: 'Switch to light mode', exact: true }).waitFor();
    await sameContextPage.close();
  });
  await step('Responsive desktop1440x1000/mobile393x852, both themes, horizontal table scroll and contained modal', async () => {
    for (const theme of ['light', 'dark']) {
      for (const { width, height } of screenshotViewports) {
        await page.setViewportSize({ width, height });
        await go('/admin/dashboard');
        await tableReady();
        const current = await page.locator('html').getAttribute('data-theme');
        if (current !== theme) await page.getByRole('button', { name: `Switch to ${theme} mode`, exact: true }).click();
        await noPageOverflow(width);
        const layout = await page.locator('.admin-shell > div').evaluate(el => getComputedStyle(el).gridTemplateColumns);
        assert.equal(layout.split(' ').length, width < 801 ? 1 : 2);
        await shot(`dashboard-${theme}`);
        await page.getByRole('navigation', { name: 'Admin navigation' }).getByRole('link', { name: 'Products', exact: true }).click();
        await tableReady();
        await noPageOverflow(width);
        const region = page.getByRole('region', { name: /ตารางจัดการสินค้า/ });
        const scrollable = await region.evaluate(el => ({ content: el.scrollWidth, width: el.clientWidth }));
        if (width === 393) assert.ok(scrollable.content > scrollable.width);
        await region.evaluate(el => { el.scrollLeft = el.scrollWidth; });
        await page.getByRole('button', { name: 'Edit Laptop', exact: true }).click();
        const modalBounds = await page.locator('.modal-box').boundingBox();
        assert.ok(modalBounds.x >= 0 && modalBounds.y >= 0);
        assert.ok(modalBounds.x + modalBounds.width <= width + 1);
        assert.ok(modalBounds.y + modalBounds.height <= page.viewportSize().height + 1);
        const modalScroll = await page.locator('.modal-box').evaluate(el => ({ height: el.clientHeight, content: el.scrollHeight, overflow: getComputedStyle(el).overflowY }));
        if (modalScroll.content > modalScroll.height) assert.equal(modalScroll.overflow, 'auto');
        await page.locator('#product-name').fill('   ');
        await page.getByRole('button', { name: 'Save Changes', exact: true }).click();
        await page.locator('#name-error').waitFor();
        await shot(`modal-${theme}`);
        await page.getByRole('button', { name: 'Cancel', exact: true }).click();
        await page.getByRole('dialog').waitFor({ state: 'detached' });
        await region.evaluate(el => { el.scrollLeft = 0; });
        await shot(`products-${theme}`);
      }
    }
    assert.deepEqual(await products(), seed.products);
  });
  await step('Storefront regression: Home/Products/search/filter/sort/detail/profile/cart under saved dark theme', async () => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole('link', { name: /View Store/ }).click();
    await page.waitForURL(`${base}/`);
    assert.equal(await page.locator('[data-theme="light"]').count(), 1);
    await page.getByRole('navigation', { name: 'เมนูหลัก' }).getByRole('link', { name: 'Products', exact: true }).click();
    await page.getByRole('searchbox', { name: 'ค้นหาสินค้า' }).fill('backpack');
    assert.match(await page.locator('#catalog').innerText(), /Backpack/);
    await page.getByRole('searchbox', { name: 'ค้นหาสินค้า' }).fill('week11-no-such-product');
    await page.getByRole('heading', { name: 'ไม่พบสินค้าที่ค้นหา', exact: true }).waitFor();
    await page.getByRole('searchbox', { name: 'ค้นหาสินค้า' }).fill('');
    await page.getByRole('button', { name: /electronics/ }).click();
    await page.getByRole('combobox', { name: 'เรียงราคาสินค้า' }).selectOption('asc');
    await go('/products/1');
    await page.getByRole('heading', { name: /Fjallraven/ }).waitFor();
    await page.getByRole('button', { name: 'Add to Cart', exact: true }).first().click();
    await page.getByRole('button', { name: 'เปิดตะกร้า 1 ชิ้น', exact: true }).click();
    const cart = page.getByRole('dialog');
    await cart.waitFor();
    assert.match(await cart.innerText(), /Fjallraven/);
    const name = "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops";
    await cart.getByRole('button', { name: `เพิ่มจำนวน ${name}`, exact: true }).click();
    assert.match(await cart.innerText(), /219\.9/);
    await cart.getByRole('button', { name: `ลดจำนวน ${name}`, exact: true }).click();
    await cart.getByRole('button', { name: `ลบ ${name} ออกจากตะกร้า`, exact: true }).click();
    await cart.getByRole('heading', { name: 'ตะกร้ายังว่างอยู่', exact: true }).waitFor();
    await cart.getByRole('button', { name: 'เลือกดูสินค้า', exact: true }).click();
    await go('/profile');
    await page.getByRole('textbox', { name: 'ชื่อที่แสดง', exact: true }).fill('Week 11 User');
    await page.getByRole('button', { name: 'บันทึกข้อมูล', exact: true }).click();
    assert.ok((await page.getByText('Week 11 User', { exact: true }).count()) >= 1);
    for (const { width, height } of screenshotViewports) {
      await page.setViewportSize({ width, height });
      for (const route of ['/', '/products', '/products/1', '/profile']) {
        await go(route);
        await noPageOverflow(width);
        if (route === '/profile') await shot('storefront-profile');
      }
    }
    await go('/about');
    assert.equal(await page.locator('main').count(), 1);
    await go('/week11-not-found');
    assert.equal(await page.locator('main').count(), 1);
  });
  await step('No React runtime errors; original database and seed records unchanged', async () => {
    assert.deepEqual(runtimeErrors, []);
    assert.deepEqual(await products(), seed.products);
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(app, 'db.json'), 'utf8')), seed);
  });
})().catch(async error => {
  console.error(error);
  if (page) await shot('failure').catch(() => {});
  process.exitCode = 1;
}).finally(async () => {
  if (browser) await browser.close();
  await stop(apiProcess);
  await stop(viteProcess);
  if (ownsFixture && fs.existsSync(fixture)) fs.unlinkSync(fixture);
  fs.writeFileSync(path.join(output, 'test-results.json'), JSON.stringify({ testedAt: new Date().toISOString(), browser: 'Installed Chrome (Playwright, headless)', api: 'JSON Server 0.17.4, isolated clone on port13001; actual stopped/restarted for error tests', web: base, screenshotViewports, fullPageScreenshots: false, results, runtimeErrors, screenshots }, null, 2));
});
