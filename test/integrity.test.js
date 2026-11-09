/**
 * Derya Bulanmaz - Veri ve Bütünlük Test Paketi
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Derya Bulanmaz Bütünlük Testleri Başlatılıyor...\n');

// 1. quotes.json testi
const quotesPath = path.join(__dirname, '..', 'data', 'quotes.json');
assert(fs.existsSync(quotesPath), 'data/quotes.json dosyası mevcut olmalıdır.');
const quotes = JSON.parse(fs.readFileSync(quotesPath, 'utf8'));
assert(Array.isArray(quotes), 'quotes.json dizi formatında olmalıdır.');
assert(quotes.length >= 26, `quotes.json en az 26 hikmet içermelidir (Mevcut: ${quotes.length}).`);
quotes.forEach((q, idx) => {
  assert(q.id, `Quote #${idx} id alanına sahip olmalıdır.`);
  assert(q.text && q.text.trim().length > 0, `Quote #${q.id} geçerli bir metne sahip olmalıdır.`);
  assert(q.author && q.author.trim().length > 0, `Quote #${q.id} geçerli bir yazara sahip olmalıdır.`);
  assert(q.theme, `Quote #${q.id} tema alanına sahip olmalıdır.`);
});
console.log(`✅ quotes.json doğrulandı (${quotes.length} aforizma).`);

// 2. manifesto.json testi
const manifestoPath = path.join(__dirname, '..', 'data', 'manifesto.json');
assert(fs.existsSync(manifestoPath), 'data/manifesto.json mevcut olmalıdır.');
const manifesto = JSON.parse(fs.readFileSync(manifestoPath, 'utf8'));
assert(manifesto.title, 'Manifesto başlığı bulunmalıdır.');
assert(Array.isArray(manifesto.sections) && manifesto.sections.length >= 6, 'Manifesto en az 6 ana bölüme sahip olmalıdır.');
console.log(`✅ manifesto.json doğrulandı (${manifesto.sections.length} ana bölüm).`);

// 3. dilemmas.json testi
const dilemmasPath = path.join(__dirname, '..', 'data', 'dilemmas.json');
assert(fs.existsSync(dilemmasPath), 'data/dilemmas.json mevcut olmalıdır.');
const dilemmas = JSON.parse(fs.readFileSync(dilemmasPath, 'utf8'));
assert(Array.isArray(dilemmas) && dilemmas.length >= 5, 'dilemmas.json en az 5 vaka protokolü içermelidir.');
dilemmas.forEach(d => {
  assert(d.id && d.title && d.diagnostic, `Vaka ${d.id} zorunlu alanlara sahip olmalıdır.`);
  assert(d.enfus_mirror && d.lisan_i_hal && d.eser_insasi && d.merhamet_makami, `Vaka ${d.id} 4 aşamalı protokole sahip olmalıdır.`);
});
console.log(`✅ dilemmas.json doğrulandı (${dilemmas.length} vaka protokolü).`);

// 4. cli.js ve derya.py dosyaları kontrolü
const cliPath = path.join(__dirname, '..', 'cli.js');
const pyPath = path.join(__dirname, '..', 'derya.py');
assert(fs.existsSync(cliPath), 'cli.js mevcut olmalıdır.');
assert(fs.existsSync(pyPath), 'derya.py mevcut olmalıdır.');
console.log('✅ cli.js ve derya.py dosyaları doğrulandı.');

console.log('\n✨ Bütün testler başarıyla tamamlandı!\n');
