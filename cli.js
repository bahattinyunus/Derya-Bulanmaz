#!/usr/bin/env node

/**
 * DERYA BULANMAZ - Terminal Yoldaşı (CLI)
 * "Kesretin Gürültüsünden Vahdetin İnşasına"
 * 
 * Zenginleştirilmiş Terminal Deneyimi:
 * - Hikmet Aforizmaları (quote)
 * - Manifesto Okuyucu (manifesto)
 * - Gürültü Kalkanı & Zırh (shield)
 * - Müsbet Hareket Matrisi & Vaka Çözücü (matrix)
 * - Terminal Nefes & Sükun Rehberi (breathe)
 * - Derin İnşa / Odak Sayacı (focus)
 * - Terminal Tefekkür Günlüğü (journal)
 * - Sistem ve İrfan İstatistikleri (stats)
 * - Yerel Web Sunucusu (serve)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI Renkleri ve Biçimlendirme
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  gold: '\x1b[38;5;220m',
  amber: '\x1b[38;5;214m',
  sky: '\x1b[38;5;75m',
  cyan: '\x1b[38;5;51m',
  emerald: '\x1b[38;5;78m',
  slate: '\x1b[38;5;246m',
  white: '\x1b[38;5;255m',
  red: '\x1b[38;5;203m',
  purple: '\x1b[38;5;141m',
  bgBlue: '\x1b[48;5;24m'
};

const quotesPath = path.join(__dirname, 'data', 'quotes.json');
const manifestoPath = path.join(__dirname, 'data', 'manifesto.json');
const dilemmasPath = path.join(__dirname, 'data', 'dilemmas.json');
const journalPath = path.join(__dirname, 'data', 'journal.json');

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
  console.log(`  node cli.js [komut] [parametreler]\n`);
  console.log(`${C.bold}Temel Komutlar:${C.reset}`);
  console.log(`  ${C.gold}quote [filtre]${C.reset}       Rastgele veya filtreli hikmet sözü getirir (ihlas, derya, stoa...)`);
  console.log(`  ${C.gold}manifesto${C.reset}            Manifestonun tam metnini terminalde okutur`);
  console.log(`  ${C.gold}shield [vaka]${C.reset}        Gürültü Kalkanı: linc, cevre, haset, kibir, ofke, daginiklik`);
  console.log(`  ${C.gold}matrix [vaka]${C.reset}        Müsbet Hareket Matrisi: 4 adımlı derin vaka çözümü`);
  console.log(`  ${C.gold}breathe [ritim]${C.reset}      Terminalde nefes rehberi (4-7-8, kutu / varsayılan: 4-7-8)`);
  console.log(`  ${C.gold}focus [dakika]${C.reset}       Derya derin odak sayacı başlatır (Varsayılan: 25 dk)`);
  console.log(`  ${C.gold}journal [yaz|oku]${C.reset}    Terminal tefekkür günlüğüne not kaydet veya oku`);
  console.log(`  ${C.gold}card [id]${C.reset}            ASCII biçimli tefekkür kartı oluşturur`);
  console.log(`  ${C.gold}stats${C.reset}                İrfani ve teknik portal istatistiklerini görüntüler`);
  console.log(`  ${C.gold}serve [port]${C.reset}         Yerel web arayüzünü tarayıcıda sunar (Varsayılan: 3000)`);
  console.log(`  ${C.gold}help${C.reset}                 Bu yardım ekranını gösterir\n`);
}

function loadQuotes() {
  if (!fs.existsSync(quotesPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(quotesPath, 'utf8'));
  } catch (e) {
    return [];
  }
}

function getRandomQuote(filter) {
  const quotes = loadQuotes();
  if (quotes.length === 0) {
    console.log(`${C.red}quotes.json dosyası bulunamadı veya boş.${C.reset}`);
    return;
  }

  let candidates = quotes;
  if (filter) {
    const f = filter.toLowerCase();
    const byId = parseInt(filter, 10);
    if (!isNaN(byId)) {
      candidates = quotes.filter(q => q.id === byId);
    } else {
      candidates = quotes.filter(q =>
        (q.tag && q.tag.toLowerCase().includes(f)) ||
        (q.theme && q.theme.toLowerCase().includes(f)) ||
        (q.author && q.author.toLowerCase().includes(f)) ||
        (q.text && q.text.toLowerCase().includes(f))
      );
    }
    if (candidates.length === 0) {
      console.log(`${C.amber}Filtreye uygun hikmet bulunamadı: "${filter}". Rastgele bir söz getiriliyor...${C.reset}`);
      candidates = quotes;
    }
  }

  const q = candidates[Math.floor(Math.random() * candidates.length)];

  printBanner();
  console.log(`${C.sky}[ #${q.id} • ${q.theme} ]${C.reset}  ${C.slate}(Etiket: ${q.tag || 'genel'})${C.reset}\n`);
  console.log(`${C.white}${C.bold}“${q.text}”${C.reset}\n`);
  console.log(`  ${C.gold}— ${q.author}${C.reset}`);
  if (q.context) {
    console.log(`  ${C.slate}${C.italic}Kaynak: ${q.context}${C.reset}`);
  }
  console.log('');
}

function printAsciiCard(idArg) {
  const quotes = loadQuotes();
  if (quotes.length === 0) return;
  const id = parseInt(idArg, 10) || quotes[Math.floor(Math.random() * quotes.length)].id;
  const q = quotes.find(item => item.id === id) || quotes[0];

  const width = 64;
  const border = '═'.repeat(width);

  console.log(`\n${C.gold}╔${border}╗${C.reset}`);
  console.log(`${C.gold}║${C.reset}  ${C.sky}${C.bold}D E R Y A   B U L A N M A Z${C.reset}`.padEnd(width + 12) + `${C.gold}║${C.reset}`);
  console.log(`${C.gold}║${C.reset}  ${C.slate}Kesretin Gürültüsünden Vahdetin İnşasına${C.reset}`.padEnd(width + 10) + `${C.gold}║${C.reset}`);
  console.log(`${C.gold}╠${'─'.repeat(width)}╣${C.reset}`);

  // Metni satırlara böl
  const words = q.text.split(' ');
  let line = '';
  const lines = [];
  words.forEach(w => {
    if ((line + ' ' + w).trim().length > width - 6) {
      lines.push(line.trim());
      line = w + ' ';
    } else {
      line += w + ' ';
    }
  });
  if (line.trim()) lines.push(line.trim());

  console.log(`${C.gold}║${C.reset}`.padEnd(width + 9) + `${C.gold}║${C.reset}`);
  lines.forEach(l => {
    const formatted = `  ${C.white}${C.bold}${l}${C.reset}`;
    console.log(`${C.gold}║${C.reset}  ${l}`.padEnd(width + 1) + `${C.gold}║${C.reset}`);
  });
  console.log(`${C.gold}║${C.reset}`.padEnd(width + 9) + `${C.gold}║${C.reset}`);

  const authorLine = `— ${q.author}  [${q.theme}]`;
  console.log(`${C.gold}║${C.reset}  ${C.gold}${authorLine}${C.reset}`.padEnd(width + 10) + `${C.gold}║${C.reset}`);
  console.log(`${C.gold}╚${border}╝${C.reset}\n`);
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

function showShield(caseKey) {
  const shieldCases = {
    linc: {
      name: 'Dijital Güruh & Sosyal Medya Linci',
      diag: 'Kitle içinde bireysel akıl kaybolur; yerini kör histeri alır. Kendi hiçliğini bastırmak için bir günah keçisi ararlar.',
      shield: '"Bir divane çamur atsa, derya bulanmaz." Attıkları çamur ancak karşılık verirsen eline bulaşır.',
      action: 'Cevap verme, savunma yapma. Bildirimleri kapat. 30 dakika kesintisiz sıradaki projene odaklan.',
      quote: '"Kötülüğe verilecek en iyi cevap, onlara benzememektir." — Marcus Aurelius'
    },
    cevre: {
      name: 'Yakın Çevre Alayı ("Neden bu kadar kasıyorsun?")',
      diag: 'Senin dik yürüyüşün, onların yatay ataletine ayna tutar. Alay, vicdan azabını bastırma savunmasıdır.',
      shield: '"Hiçbir şey yapmayanlar, her şeyi eleştirme hakkını kendilerinde bulurlar." Onların onayıyla başlamadın.',
      action: 'Onları ikna etmeye çalışma. Tebessüm et ve sessizce çalış. Arı bala daldığında vızıltı çıkarmaz.',
      quote: '"Büyük beyinler fikirleri tartışır, küçük beyinler insanları." — Eleanor Roosevelt'
    },
    haset: {
      name: 'Yengeç Sepeti Hasedi & Paçadan Çekme',
      diag: 'Başarın sürüdeki karanlık kuralı bozar: "Biz yapamıyorsak o da yapamamalı." Bu saldırı yükseldiğinin ispatıdır.',
      shield: '"Senin penceren kirli ise, benim çiçeklerim sana çamur görünür." Haset sahibinin ciğerini dağlar.',
      action: 'Hasetçiye verilecek en asil cevap daha büyük bir eser ortaya koymaktır. Atılan taşlarla kale inşa et.',
      quote: '"Arı inler bal içinde..." — Anadolu İrfanı'
    },
    kibir: {
      name: 'Övgü Zehirlenmesi & Alkış Bağımlılığı',
      diag: 'Gelen aşırı övgü kınamadan daha tehlikelidir. Zihin alkışa bağlandığı an, alkışlayanın kölesi olur.',
      shield: '"Amelinizde rıza-yı İlâhî olmalı. O razı olsa, bütün dünya küsse ehemmiyeti yok."',
      action: 'Hemen kendine sor: "Bunu insanların alkışı için mi yapıyorum, hakikat için mi?" Mahviyete sığın.',
      quote: '"İnsanların seni kınaması veya övmesi kalbinde eşitlenmediyse, henüz hür değilsin." — İbn Ataullah'
    },
    ofke: {
      name: 'Ego Tuzağı & Nefsin Kışkırtması',
      diag: 'Sana taş atana taş atmak seni onun çukuruna indirir. Gürültücünün arenasında hakikat konuşulmaz.',
      shield: '"Sessizlik en güçlü çığlıktır." Sarsılmayan bir irade karşısında saldırgan kendi hiçliğinde ezilir.',
      action: 'Klavyeden elini çek. 10 derin sükun nefesi al. Saldırganın gayesiz zindanına acı ve merhamet et.',
      quote: '"Karanlığa sövmektense, bir mum yak." — Konfüçyüs'
    },
    daginiklik: {
      name: 'Kesret Kaosu & Zihin Parçalanması',
      diag: 'Bildirimler ve anlık gündemler zihni atomlarına ayırır. Gaye-i hayal kaybolunca zihin esir olur.',
      shield: 'Kainatın bütün dağınıklığı, hakikate adanmış tek bir saatin sükunetinde erir.',
      action: 'Telefonu uçak moduna al. `node cli.js focus 25` komutunu çalıştır ve tek bir amele kilitlen.',
      quote: '"İnsanın en büyük zindanı, kendi içinde inşa ettiği amaçsızlıktır." — C. G. Jung'
    }
  };

  printBanner();
  const key = (caseKey || '').toLowerCase();

  if (!key || !shieldCases[key]) {
    console.log(`${C.bold}🛡️  GÜRÜLTÜ KALKANI VAKA REHBERİ${C.reset}\n`);
    console.log(`Lütfen kalkan kuşanmak istediğiniz durumu belirtin:`);
    Object.keys(shieldCases).forEach(k => {
      console.log(`  ${C.gold}node cli.js shield ${k}${C.reset}  →  ${shieldCases[k].name}`);
    });
    console.log(`\n${C.slate}Örnek: node cli.js shield linc${C.reset}\n`);
    return;
  }

  const c = shieldCases[key];
  console.log(`${C.emerald}${C.bold}🛡️  GÜRÜLTÜ KALKANI AKTİF: ${c.name}${C.reset}\n`);
  console.log(`${C.sky}${C.bold}1. Teşhis (Psikolojik / Sosyolojik):${C.reset}`);
  console.log(`   ${c.diag}\n`);
  console.log(`${C.gold}${C.bold}2. İhlas Zırhı (Manevi Hakikat):${C.reset}`);
  console.log(`   ${c.shield}\n`);
  console.log(`${C.cyan}${C.bold}3. Müsbet Eylem Reçetesi:${C.reset}`);
  console.log(`   ${c.action}\n`);
  console.log(`${C.purple}${C.italic}${c.quote}${C.reset}\n`);
}

function showMatrix(dilemmaArg) {
  if (!fs.existsSync(dilemmasPath)) {
    console.log(`${C.red}dilemmas.json dosyası bulunamadı.${C.reset}`);
    return;
  }
  const dilemmas = JSON.parse(fs.readFileSync(dilemmasPath, 'utf8'));

  printBanner();

  if (!dilemmaArg) {
    console.log(`${C.gold}${C.bold}🏛️  MÜSBET HAREKET MATRİSİ & VAKA ÇÖZÜCÜ${C.reset}\n`);
    console.log(`Mevcut Vaka Protokolleri:`);
    dilemmas.forEach((d, i) => {
      console.log(`  ${C.gold}${i + 1}.${C.reset} ${C.white}${C.bold}${d.title}${C.reset} [${C.sky}${d.id}${C.reset}]`);
      console.log(`     ${C.slate}${d.summary}${C.reset}`);
    });
    console.log(`\n${C.emerald}Kullanım:${C.reset} node cli.js matrix <vaka_id_veya_numara>`);
    console.log(`${C.slate}Örnek: node cli.js matrix linc_ve_iftira  veya  node cli.js matrix 1${C.reset}\n`);
    return;
  }

  const arg = dilemmaArg.toLowerCase();
  const byIdx = parseInt(arg, 10);
  const target = !isNaN(byIdx)
    ? dilemmas[byIdx - 1]
    : dilemmas.find(d => d.id.toLowerCase() === arg || d.id.toLowerCase().includes(arg));

  if (!target) {
    console.log(`${C.red}Geçersiz vaka. Seçenekleri görmek için: node cli.js matrix${C.reset}`);
    return;
  }

  console.log(`${C.gold}${C.bold}════════════════════════════════════════════════════════════════════${C.reset}`);
  console.log(`  ${C.white}${C.bold}${target.title.toUpperCase()}${C.reset}`);
  console.log(`  ${C.sky}Kategori: ${target.category}  |  Karakter: ${target.badge}${C.reset}`);
  console.log(`${C.gold}${C.bold}════════════════════════════════════════════════════════════════════${C.reset}\n`);

  console.log(`${C.slate}${C.italic}"${target.summary}"${C.reset}\n`);

  console.log(`${C.sky}${C.bold}▶ 0. Evrensel Teşhis:${C.reset}`);
  console.log(`  ${target.diagnostic}\n`);

  console.log(`${C.purple}${C.bold}▶ 1. Enfüs Aynası (Kendi Nefsini Sorgulama):${C.reset}`);
  console.log(`  ${target.enfus_mirror}\n`);

  console.log(`${C.gold}${C.bold}▶ 2. Lisan-ı Hal Kalkanı (Tepkisizlik & Suskunluk Sanatı):${C.reset}`);
  console.log(`  ${target.lisan_i_hal}\n`);

  console.log(`${C.emerald}${C.bold}▶ 3. Eserin İnşası (Enerjiyi Amelle Taçlandırma):${C.reset}`);
  console.log(`  ${target.eser_insasi}\n`);

  console.log(`${C.cyan}${C.bold}▶ 4. Merhamet Makamı (Saldırgana Acıma & Onlara Benzememe):${C.reset}`);
  console.log(`  ${target.merhamet_makami}\n`);

  console.log(`${C.amber}${C.bold}✓ Hemen Şimdi Yapılacak Somut Eylemler:${C.reset}`);
  target.action_checklist.forEach((act, idx) => {
    console.log(`  [${idx + 1}] ${act}`);
  });

  if (target.prescribed_quote) {
    console.log(`\n${C.slate}────────────────────────────────────────────────────────────────────${C.reset}`);
    console.log(`${C.italic}“${target.prescribed_quote.text}”${C.reset}`);
    console.log(`  ${C.gold}— ${target.prescribed_quote.author}${C.reset}\n`);
  }
}

function runBreathingExercise(typeArg = '478') {
  printBanner();
  const type = typeArg.toLowerCase();

  let phases = [];
  let name = '';

  if (type === 'kutu' || type === 'box' || type === '4444') {
    name = 'Kutu Nefesi (Stoic Box 4-4-4-4) — Odak ve Soğukkanlılık';
    phases = [
      { text: 'Nefes Al...', dur: 4, char: '▲' },
      { text: 'Nefesi Tut...', dur: 4, char: '■' },
      { text: 'Nefes Ver...', dur: 4, char: '▼' },
      { text: 'Boşlukta Kal (Bekle)...', dur: 4, char: '○' }
    ];
  } else if (type === 'denge' || type === '55') {
    name = 'Rezonans Nefesi (5-5) — Kalp Senkronizasyonu';
    phases = [
      { text: 'Derin Nefes Al...', dur: 5, char: '▲' },
      { text: 'Yavaşça Nefes Ver...', dur: 5, char: '▼' }
    ];
  } else {
    name = 'Sükun Nefesi (4-7-8) — Parasempatik Sinir Sistemi & Dinginlik';
    phases = [
      { text: '4 Saniye: Sakince Nefes Al...', dur: 4, char: '▲' },
      { text: '7 Saniye: Nefesi Tut ve Sükuneti Hisset...', dur: 7, char: '■' },
      { text: '8 Saniye: Ağızdan Yavaşça Boşalt...', dur: 8, char: '▼' }
    ];
  }

  console.log(`${C.emerald}${C.bold}🌬️  ${name}${C.reset}`);
  console.log(`${C.slate}"Nefes aldıkça deryanın derinliğini, nefes verdikçe dünyanın gürültüsünü bırakın."${C.reset}`);
  console.log(`${C.slate}(Durdurmak için Ctrl+C tuşlarına basın)\n${C.reset}`);

  let cycle = 1;
  let phaseIdx = 0;
  let currentSec = 0;

  function tick() {
    const curPhase = phases[phaseIdx];
    currentSec++;

    const progress = Math.min(20, Math.round((currentSec / curPhase.dur) * 20));
    const bar = curPhase.char.repeat(progress).padEnd(20, '·');

    process.stdout.write(`\r  ${C.gold}[Tur ${cycle}]${C.reset} ${C.cyan}${curPhase.text}${C.reset}  [${C.emerald}${bar}${C.reset}] ${currentSec}/${curPhase.dur} sn `);

    if (currentSec >= curPhase.dur) {
      currentSec = 0;
      phaseIdx++;
      if (phaseIdx >= phases.length) {
        phaseIdx = 0;
        cycle++;
        console.log(`\n  ${C.slate}✓ Bir döngü tamamlandı. Zihin duruluyor...${C.reset}`);
      }
    }
  }

  const timer = setInterval(tick, 1000);

  process.on('SIGINT', () => {
    clearInterval(timer);
    console.log(`\n\n${C.gold}✨ Nefes seansı tamamlandı. Derya gibi sakin ve berrak kalın.${C.reset}\n`);
    process.exit(0);
  });
}

function runFocusTimer(mins = 25) {
  let seconds = parseInt(mins, 10) * 60;
  if (isNaN(seconds) || seconds <= 0) seconds = 25 * 60;
  const initialSeconds = seconds;

  printBanner();
  console.log(`${C.emerald}${C.bold}🌊 Derya Sessizliği Başladı (${Math.floor(seconds / 60)} dakika)${C.reset}`);
  console.log(`${C.slate}"Arı inler bal içinde..." Dış dünyayı sessize alın ve eserinize odaklanın.${C.reset}`);
  console.log(`${C.slate}(Çıkmak için Ctrl+C)\n${C.reset}`);

  const interval = setInterval(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const elapsed = initialSeconds - seconds;
    const pct = Math.round((elapsed / initialSeconds) * 100);
    const barLen = 20;
    const filled = Math.round((elapsed / initialSeconds) * barLen);
    const progressBar = '█'.repeat(filled) + '░'.repeat(barLen - filled);

    process.stdout.write(`\r  ${C.gold}⏳ Kalan: ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}${C.reset}  [${C.sky}${progressBar}${C.reset}] ${pct}%  `);

    if (seconds <= 0) {
      clearInterval(interval);
      console.log(`\n\n${C.emerald}${C.bold}✨ Oturum Tamamlandı! Hakikat adına bir taş daha yerine kondu.${C.reset}`);
      console.log(`${C.gold}Müsbet bir adım attınız. Şimdi 5 dakika zihninizi dinlendirin.${C.reset}\n`);
      process.exit(0);
    }
    seconds--;
  }, 1000);

  process.on('SIGINT', () => {
    clearInterval(interval);
    console.log(`\n\n${C.slate}Odak seansı sonlandırıldı. Yine de harcanan her dakika kıymetlidir.${C.reset}\n`);
    process.exit(0);
  });
}

function handleJournal(subCmd) {
  let entries = [];
  if (fs.existsSync(journalPath)) {
    try {
      entries = JSON.parse(fs.readFileSync(journalPath, 'utf8'));
    } catch (e) {
      entries = [];
    }
  }

  printBanner();

  if (subCmd === 'oku' || subCmd === 'list' || subCmd === 'read') {
    console.log(`${C.gold}${C.bold}📖  MÜSBET TEFEKKÜR GÜNLÜĞÜ GEÇMİŞİ (${entries.length} Kayıt)${C.reset}\n`);
    if (entries.length === 0) {
      console.log(`${C.slate}Henüz kayıtlı bir günlük girdisi bulunmuyor.${C.reset}`);
      console.log(`${C.slate}Yeni bir kayıt eklemek için: node cli.js journal yaz${C.reset}\n`);
      return;
    }

    entries.slice(-5).reverse().forEach((e, idx) => {
      console.log(`${C.sky}── [${e.date}] ${e.tag ? '#' + e.tag : ''} ──────────────────────────────${C.reset}`);
      if (e.noise) console.log(`  ${C.red}Gürültü / Çamur:${C.reset} ${e.noise}`);
      if (e.work) console.log(`  ${C.emerald}İnşa Edilen Eser:${C.reset} ${e.work}`);
      if (e.mercy) console.log(`  ${C.gold}Merhamet / Dua:${C.reset} ${e.mercy}`);
      if (e.note) console.log(`  ${C.white}Serbest Tefekkür:${C.reset} ${e.note}`);
      console.log('');
    });
    return;
  }

  // Yeni Kayıt Yazma Arayüzü
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`${C.gold}${C.bold}✍️  YENİ TEFEKKÜR KAYDI EKLE${C.reset}`);
  console.log(`${C.slate}Soruları yanıtlayarak günün muhasebesini tutun (Boş bırakmak için Enter'a basın):\n${C.reset}`);

  rl.question(`${C.sky}1. Bugün dışarıdan gelen hangi gürültüyü/çamuru duymazdan geldin?${C.reset}\n> `, noise => {
    rl.question(`\n${C.emerald}2. Hakikat adına hangi eseri veya somut ameli inşa ettin?${C.reset}\n> `, work => {
      rl.question(`\n${C.gold}3. Sana eziyet edenlere karşı kalbinde nasıl bir merhamet/af yeşerttin?${C.reset}\n> `, mercy => {
        rl.question(`\n${C.purple}4. Etiket (Tefekkür, Zırh, İhlas, Şükür):${C.reset}\n> `, tag => {
          const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleString('tr-TR'),
            noise: noise.trim() || 'Sükut korundu.',
            work: work.trim() || 'Sabır ve niyet yenilendi.',
            mercy: mercy.trim() || 'Kalpte kin tutulmadı.',
            tag: tag.trim() || 'Tefekkür'
          };

          entries.push(newEntry);
          fs.writeFileSync(journalPath, JSON.stringify(entries, null, 2), 'utf8');

          console.log(`\n${C.emerald}${C.bold}✨ Tefekkür kaydı muvaffakiyetle kaydedildi!${C.reset}`);
          console.log(`${C.slate}Kayıtları listelemek için: node cli.js journal oku${C.reset}\n`);
          rl.close();
        });
      });
    });
  });
}

function showStats() {
  const quotes = loadQuotes();
  let manifestoWordCount = 0;
  let sectionCount = 0;
  if (fs.existsSync(manifestoPath)) {
    const m = JSON.parse(fs.readFileSync(manifestoPath, 'utf8'));
    sectionCount = m.sections ? m.sections.length : 0;
    manifestoWordCount = JSON.stringify(m).split(/\s+/).length;
  }

  let dilemmaCount = 0;
  if (fs.existsSync(dilemmasPath)) {
    const d = JSON.parse(fs.readFileSync(dilemmasPath, 'utf8'));
    dilemmaCount = d.length;
  }

  let journalCount = 0;
  if (fs.existsSync(journalPath)) {
    try {
      journalCount = JSON.parse(fs.readFileSync(journalPath, 'utf8')).length;
    } catch (e) {}
  }

  printBanner();
  console.log(`${C.gold}${C.bold}📊  DERYA BULANMAZ İRFANİ & TEKNİK METRİKLER${C.reset}\n`);
  console.log(`  ${C.sky}✦ Toplam Hikmet Sözü:${C.reset}        ${C.bold}${quotes.length}${C.reset} aforizma`);
  console.log(`  ${C.emerald}✦ Manifesto Bölüm Sayısı:${C.reset}    ${C.bold}${sectionCount}${C.reset} ana risale babı`);
  console.log(`  ${C.amber}✦ Manifesto Kelime Hacmi:${C.reset}    ~${C.bold}${manifestoWordCount}${C.reset} kelime`);
  console.log(`  ${C.purple}✦ Müsbet Hareket Vakaları:${C.reset}   ${C.bold}${dilemmaCount}${C.reset} kritik vaka protokolü`);
  console.log(`  ${C.cyan}✦ Yerel Tefekkür Kayıtları:${C.reset}  ${C.bold}${journalCount}${C.reset} kaydedilmiş tefekkür`);
  console.log(`  ${C.white}✦ Platformlar:${C.reset}                 HTML5/Tailwind Web App, Node.js CLI, Python CLI\n`);
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
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webmanifest': 'application/manifest+json; charset=utf-8'
  };

  const server = http.createServer((req, res) => {
    let reqPath = req.url === '/' ? '/index.html' : req.url;
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
    getRandomQuote(args[1]);
    break;
  case 'card':
  case 'kart':
    printAsciiCard(args[1]);
    break;
  case 'manifesto':
  case 'oku':
    readManifesto();
    break;
  case 'shield':
  case 'kalkan':
  case 'zirh':
    showShield(args[1]);
    break;
  case 'matrix':
  case 'matris':
  case 'cozum':
  case 'vaka':
    showMatrix(args[1]);
    break;
  case 'breathe':
  case 'nefes':
    runBreathingExercise(args[1] || '478');
    break;
  case 'focus':
  case 'odak':
    runFocusTimer(args[1] || 25);
    break;
  case 'journal':
  case 'gunluk':
  case 'tefekkur':
    handleJournal(args[1] || 'oku');
    break;
  case 'stats':
  case 'istatistik':
    showStats();
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
