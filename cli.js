#!/usr/bin/env node

/**
 * DERYA BULANMAZ - Terminal Yoldaşı (CLI)
 * "Kesretin Gürültüsünden Vahdetin İnşasına"
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI Renkleri
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  gold: '\x1b[38;5;220m',
  sky: '\x1b[38;5;75m',
  emerald: '\x1b[38;5;78m',
  slate: '\x1b[38;5;246m',
  white: '\x1b[38;5;255m',
  red: '\x1b[38;5;203m',
  bgBlue: '\x1b[48;5;24m'
};

const quotesPath = path.join(__dirname, 'data', 'quotes.json');
const manifestoPath = path.join(__dirname, 'data', 'manifesto.json');

function printBanner() {
  console.log(`\n${C.gold}${C.bold}════════════════════════════════════════════════════════════════════${C.reset}`);
  console.log(`  🌊  ${C.white}${C.bold}D E R Y A   B U L A N M A Z${C.reset}`);
  console.log(`      ${C.sky}Kesretin Gürültüsünden Vahdetin İnşasına${C.reset}`);
  console.log(`      ${C.italic}${C.slate}"Bir divane çamur atsa, derya bulanmaz." — Risale-i Nur${C.reset}`);
  console.log(`${C.gold}${C.bold}════════════════════════════════════════════════════════════════════${C.reset}\n`);
}

function showHelp() {
  printBanner();
  console.log(`${C.bold}Kullanım:${C.reset}`);
  console.log(`  node cli.js [komut]\n`);
  console.log(`${C.bold}Komutlar:${C.reset}`);
  console.log(`  ${C.gold}quote${C.reset}             Rastgele bir hakikat & hikmet sözü getirir`);
  console.log(`  ${C.gold}manifesto${C.reset}         Manifestonun tam metnini terminalde okutur`);
  console.log(`  ${C.gold}shield [durum]${C.reset}    Gürültü Kalkanı: Linç, dedikodu veya alaya karşı zırh`);
  console.log(`  ${C.gold}focus [dakika]${C.reset}    Terminalde derya odak sayacı başlatır (Varsayılan: 25)`);
  console.log(`  ${C.gold}serve [port]${C.reset}      Yerel web arayüzünü tarayıcıda sunar (Varsayılan: 3000)`);
  console.log(`  ${C.gold}help${C.reset}              Bu yardım ekranını gösterir\n`);
}

function getRandomQuote() {
  if (!fs.existsSync(quotesPath)) {
    console.log(`${C.red}quotes.json dosyası bulunamadı.${C.reset}`);
    return;
  }
  const quotes = JSON.parse(fs.readFileSync(quotesPath, 'utf8'));
  const q = quotes[Math.floor(Math.random() * quotes.length)];

  printBanner();
  console.log(`${C.sky}[${q.theme}]${C.reset}\n`);
  console.log(`${C.white}${C.bold}“${q.text}”${C.reset}\n`);
  console.log(`  ${C.gold}— ${q.author}${C.reset}\n`);
}

function readManifesto() {
  if (!fs.existsSync(manifestoPath)) {
    console.log(`${C.red}manifesto.json dosyası bulunamadı.${C.reset}`);
    return;
  }
  const m = JSON.parse(fs.readFileSync(manifestoPath, 'utf8'));
  printBanner();
  console.log(`${C.gold}${C.bold}# ${m.title}${C.reset}\n`);
  console.log(`${C.italic}${m.motto}${C.reset}\n`);
  console.log(`${C.slate}────────────────────────────────────────────────────────────────────${C.reset}\n`);

  m.sections.forEach(sec => {
    console.log(`\n${C.sky}${C.bold}${sec.number}. ${sec.title}${C.reset}`);
    if (sec.subtitle) console.log(`${C.slate}${C.italic}${sec.subtitle}${C.reset}\n`);

    sec.paragraphs.forEach(p => console.log(`  ${p}\n`));

    if (sec.subsections) {
      sec.subsections.forEach(sub => {
        console.log(`  ${C.gold}${sub.letter}. ${sub.title}${C.reset}`);
        console.log(`  ${sub.text}\n`);
        if (sub.quote) {
          console.log(`    ${C.italic}"${sub.quote.text}" — ${sub.quote.author}${C.reset}\n`);
        }
      });
    }

    if (sec.steps) {
      sec.steps.forEach(st => {
        console.log(`  ${C.gold}Aşama ${st.step}: ${st.title}${C.reset}`);
        console.log(`  ${st.text}\n`);
        st.quotes.forEach(q => {
          console.log(`    ${C.italic}"${q.text}" — ${q.author}${C.reset}`);
        });
        console.log('');
      });
    }

    if (sec.quotes && sec.quotes.length > 0) {
      sec.quotes.forEach(q => {
        console.log(`  ${C.italic}“${q.text}”${C.reset} ${C.gold}— ${q.author}${C.reset}`);
      });
      console.log('');
    }
  });
}

function runFocusTimer(mins = 25) {
  let seconds = parseInt(mins, 10) * 60;
  if (isNaN(seconds) || seconds <= 0) seconds = 25 * 60;

  printBanner();
  console.log(`${C.emerald}${C.bold}Derya Sessizliği Başladı (${Math.floor(seconds / 60)} dakika)${C.reset}`);
  console.log(`${C.slate}"Arı inler bal içinde..." Dış dünyayı sessize alın ve eserinize odaklanın.${C.reset}`);
  console.log(`${C.slate}(Çıkmak için Ctrl+C)${C.reset}\n`);

  const interval = setInterval(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    process.stdout.write(`\r  ${C.gold}⏳ Kalan Süre: ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}${C.reset}  `);

    if (seconds <= 0) {
      clearInterval(interval);
      console.log(`\n\n${C.emerald}${C.bold}✨ Oturum Tamamlandı! Hakikat adına bir taş yerine kondu.${C.reset}\n`);
      process.exit(0);
    }
    seconds--;
  }, 1000);
}

function startServer(port = 3000) {
  const http = require('http');
  const portNum = parseInt(port, 10) || 3000;

  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  const server = http.createServer((req, res) => {
    let reqPath = req.url === '/' ? '/index.html' : req.url;
    // Query parametrelerini temizle
    reqPath = reqPath.split('?')[0];
    const filePath = path.join(__dirname, reqPath);

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404: Sayfa bulunamadı.');
      } else {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
        res.end(content);
      }
    });
  });

  server.listen(portNum, () => {
    printBanner();
    console.log(`${C.emerald}${C.bold}Derya Bulanmaz Web Portalı Yayında!${C.reset}`);
    console.log(`  Tarayıcınızda açın: ${C.gold}http://localhost:${portNum}${C.reset}\n`);
    console.log(`${C.slate}Durdurmak için Ctrl+C tuşlarına basın.${C.reset}\n`);
  });
}

// Komut Yönlendirme
const args = process.argv.slice(2);
const cmd = args[0] ? args[0].toLowerCase() : 'help';

switch (cmd) {
  case 'quote':
  case 'soz':
  case 'hikmet':
    getRandomQuote();
    break;
  case 'manifesto':
  case 'oku':
    readManifesto();
    break;
  case 'focus':
  case 'odak':
    runFocusTimer(args[1] || 25);
    break;
  case 'serve':
  case 'server':
  case 'sunucu':
    startServer(args[1] || 3000);
    break;
  case 'help':
  default:
    showHelp();
    break;
}
