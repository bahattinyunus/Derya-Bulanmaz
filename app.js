/**
 * DERYA BULANMAZ - Temel Uygulama Motoru
 * Kesretin Gürültüsünden Vahdetin İnşasına
 */

document.addEventListener('DOMContentLoaded', () => {
  // Lucide ikonlarını başlat
  if (window.lucide) {
    lucide.createIcons();
  }

  // Modülleri Başlat
  initOceanCanvas();
  initAmbientSound();
  initReadingTools();
  initCompass();
  initFocusTimer();
  initBreathingExercise();
  initQuotesAndCards();
  initJournal();
  initQuiz();
  initMobileMenu();
});

/* ==========================================================================
   1. İNTERAKTİF OKYANUS TUVALİ & ÇAMUR SOĞURMA SİMÜLASYONU
   ========================================================================== */
function initOceanCanvas() {
  const canvas = document.getElementById('oceanCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Okyanus Dalga Noktaları
  const waves = [
    { y: height * 0.75, length: 0.003, amplitude: 35, speed: 0.015, color: 'rgba(12, 23, 42, 0.7)' },
    { y: height * 0.82, length: 0.004, amplitude: 25, speed: 0.02, color: 'rgba(7, 13, 24, 0.85)' },
    { y: height * 0.88, length: 0.002, amplitude: 20, speed: 0.01, color: 'rgba(5, 10, 20, 0.95)' }
  ];

  // Işık ve Yıldız Partikülleri
  const lightParticles = [];
  for (let i = 0; i < 40; i++) {
    lightParticles.push({
      x: Math.random() * width,
      y: Math.random() * height * 0.7,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.005 + 0.002
    });
  }

  // Dışarıdan atılan "Çamur / Gürültü" Partikülleri
  let mudParticles = [];
  let floatingTexts = [];

  let step = 0;

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Derinlik Gradyanı
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#050a14');
    gradient.addColorStop(0.5, '#070d18');
    gradient.addColorStop(1, '#020617');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Işık / Vahdet Parıltıları
    lightParticles.forEach(p => {
      p.alpha += Math.sin(step * p.speed) * 0.01;
      ctx.fillStyle = `rgba(226, 177, 104, ${Math.max(0.1, Math.min(0.7, p.alpha))})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Okyanus Dalgaları
    waves.forEach(w => {
      ctx.fillStyle = w.color;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 10) {
        const y = w.y + Math.sin(x * w.length + step * w.speed) * w.amplitude;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
    });

    // Çamur Partikülleri (Gittikçe küçülür, temizlenir ve deryada kaybolur)
    for (let i = mudParticles.length - 1; i >= 0; i--) {
      const m = mudParticles[i];
      m.x += m.vx;
      m.y += m.vy;
      m.vy += 0.08; // Yerçekimi
      m.alpha -= 0.012; // Derya çamuru temizler
      m.size *= 0.985;

      ctx.fillStyle = `rgba(${m.r}, ${m.g}, ${m.b}, ${Math.max(0, m.alpha)})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      ctx.fill();

      if (m.alpha <= 0 || m.size <= 0.5) {
        mudParticles.splice(i, 1);
      }
    }

    // Yüzen Hakikat Metinleri
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y -= 0.6;
      ft.alpha -= 0.01;

      ctx.save();
      ctx.font = 'italic 16px "Playfair Display", Georgia, serif';
      ctx.fillStyle = `rgba(226, 177, 104, ${Math.max(0, ft.alpha)})`;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();

      if (ft.alpha <= 0) {
        floatingTexts.splice(i, 1);
      }
    }

    step++;
    requestAnimationFrame(render);
  }

  render();

  // Çamur Atma Fonksiyonu (Dış gürültüyü deryaya fırlatma)
  window.throwMudAtSea = function (customLabel = '') {
    const originX = width * 0.5 + (Math.random() * 200 - 100);
    const originY = height * 0.45;

    // 40 adet çamur zerresi fırlat
    for (let i = 0; i < 40; i++) {
      mudParticles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.8) * 5,
        size: Math.random() * 8 + 3,
        alpha: 0.9,
        r: 120 + Math.floor(Math.random() * 40),
        g: 80 + Math.floor(Math.random() * 30),
        b: 40 + Math.floor(Math.random() * 20)
      });
    }

    // 1 saniye sonra deryanın saflığı ortaya çıkar
    setTimeout(() => {
      floatingTexts.push({
        x: originX,
        y: originY - 20,
        text: '🌊 Derya bulanmaz...',
        alpha: 1.0
      });
    }, 700);
  };

  // Ekrana tıklayınca da su dalgalansın
  canvas.addEventListener('click', e => {
    window.throwMudAtSea();
  });

  // Arayüzdeki Çamur Butonu
  const throwMudBtn = document.getElementById('throwMudBtn');
  const mudInput = document.getElementById('mudInput');
  const mudFeedback = document.getElementById('mudFeedback');

  if (throwMudBtn && mudInput) {
    const fireMud = () => {
      const val = mudInput.value.trim() || 'Laf / Çamur';
      window.throwMudAtSea(val);
      if (mudFeedback) {
        mudFeedback.textContent = `"${val}" atıldı; saniyeler içinde okyanusta eridi ve kayboldu.`;
        mudFeedback.style.opacity = '1';
        setTimeout(() => {
          mudFeedback.style.opacity = '0';
        }, 4000);
      }
      mudInput.value = '';
    };

    throwMudBtn.addEventListener('click', fireMud);
    mudInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') fireMud();
    });
  }
}

/* ==========================================================================
   2. AMBİYANS SES SENTEZLEYİCİSİ (WEB AUDIO API)
   ========================================================================== */
function initAmbientSound() {
  const toggleBtn = document.getElementById('ambientSoundToggle');
  const icon = document.getElementById('ambientSoundIcon');
  const text = document.getElementById('ambientSoundText');

  if (!toggleBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let gainNode = null;
  let waveOsc = null;

  function createOceanSound() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Pembe/Beyaz Gürültü Tamponu Oluştur (Okyanus Dalgaları İçin)
    const bufferSize = audioCtx.sampleRate * 4;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Alçak Geçiren Filtre (Dalga simülasyonu)
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, audioCtx.currentTime);

    // Filtre frekansını dalga gibi periyodik olarak açıp kapayan LFO
    const lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime); // Dalga ritmi ~8 sn
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(260, audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    // 432 Hz Tefekkür / Meditatif Bas Tonal Desteği
    const droneOsc = audioCtx.createOscillator();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(108, audioCtx.currentTime); // 432Hz'in 2 oktav altı
    const droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(0.018, audioCtx.currentTime);
    droneOsc.connect(droneGain);

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    droneGain.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    whiteNoise.start();
    lfo.start();
    droneOsc.start();
  }

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      createOceanSound();
      isPlaying = true;
    } else if (audioCtx.state === 'suspended') {
      audioCtx.resume();
      isPlaying = true;
    } else if (isPlaying) {
      audioCtx.suspend();
      isPlaying = false;
    } else {
      audioCtx.resume();
      isPlaying = true;
    }

    // UI Güncelle
    if (isPlaying) {
      toggleBtn.classList.add('border-gold-500', 'bg-gold-500/10', 'text-gold-300');
      if (icon) icon.setAttribute('data-lucide', 'volume-2');
      if (text) text.textContent = 'Okyanus Sesi Açık';
    } else {
      toggleBtn.classList.remove('border-gold-500', 'bg-gold-500/10', 'text-gold-300');
      if (icon) icon.setAttribute('data-lucide', 'volume-x');
      if (text) text.textContent = 'Sükunet Sesi';
    }
    if (window.lucide) lucide.createIcons();
  });
}

/* ==========================================================================
   3. OKUMA ARAÇLARI: TİPOGRAFİ, İLERLEME ÇUBUĞU & SESLENDİRME
   ========================================================================== */
function initReadingTools() {
  const progressBar = document.getElementById('readProgressBar');
  const manifesto = document.getElementById('manifestoContent');
  const serifBtn = document.getElementById('fontToggleSerif');
  const sansBtn = document.getElementById('fontToggleSans');
  const incBtn = document.getElementById('fontSizeInc');
  const decBtn = document.getElementById('fontSizeDec');
  const readAloudBtn = document.getElementById('readAloudBtn');
  const readAloudText = document.getElementById('readAloudText');

  // Okuma İlerleme Çubuğu
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;
  });

  // Font Değişimi
  let currentFontSize = 18;
  if (serifBtn && sansBtn && manifesto) {
    serifBtn.addEventListener('click', () => {
      manifesto.classList.remove('font-sans-reading');
      manifesto.classList.add('font-serif-reading');
      serifBtn.classList.add('border-gold-500/40', 'bg-gold-500/10', 'text-gold-300');
      sansBtn.classList.remove('border-gold-500/40', 'bg-gold-500/10', 'text-gold-300');
    });

    sansBtn.addEventListener('click', () => {
      manifesto.classList.remove('font-serif-reading');
      manifesto.classList.add('font-sans-reading');
      sansBtn.classList.add('border-gold-500/40', 'bg-gold-500/10', 'text-gold-300');
      serifBtn.classList.remove('border-gold-500/40', 'bg-gold-500/10', 'text-gold-300');
    });
  }

  if (incBtn && decBtn && manifesto) {
    incBtn.addEventListener('click', () => {
      if (currentFontSize < 26) {
        currentFontSize += 2;
        manifesto.style.fontSize = `${currentFontSize}px`;
      }
    });

    decBtn.addEventListener('click', () => {
      if (currentFontSize > 14) {
        currentFontSize -= 2;
        manifesto.style.fontSize = `${currentFontSize}px`;
      }
    });
  }

  // Web Speech API ile Manifesto Okuma
  let isSpeaking = false;
  if (readAloudBtn && 'speechSynthesis' in window) {
    readAloudBtn.addEventListener('click', () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        if (readAloudText) readAloudText.textContent = 'Sesli Dinle';
        return;
      }

      const textToRead = manifesto ? manifesto.innerText : '';
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.92; // Dingin, ağırbaşlı bir tempo

      utterance.onend = () => {
        isSpeaking = false;
        if (readAloudText) readAloudText.textContent = 'Sesli Dinle';
      };

      utterance.onerror = () => {
        isSpeaking = false;
        if (readAloudText) readAloudText.textContent = 'Sesli Dinle';
      };

      window.speechSynthesis.speak(utterance);
      isSpeaking = true;
      if (readAloudText) readAloudText.textContent = 'Durdur';
    });
  }
}

/* ==========================================================================
   4. GÜRÜLTÜ KALKANI & ZİHİN PUSULASI VERİ MOTORU
   ========================================================================== */
function initCompass() {
  const situations = {
    linc: {
      diagTitle: 'Sürü Psikolojisi ve Dijital Çeteleşme',
      diagText: 'Birey olarak tek başlarına kaldıklarında eylemsiz olanlar, kitle içinde sorumluluğun dağılmasına sığınır. Sana attıkları her çamur, onlara geçici bir aidiyet hissi verir. Bu şahsi bir mesele değil; onların kendi hiçliklerini bastırma çabasıdır.',
      shieldTitle: 'Manevi Zırh (İhlas Kalkanı)',
      shieldText: '"Bir divane çamur atsa, derya bulanmaz." Attıkları çamur ancak senin elinle ona dokunursan eline bulaşır. Suskunluk bir zayıflık değil, deryanın vüs\'atidir.',
      actionTitle: 'Somut Müsbet Eylem',
      actionText: 'Cevap verme, polemiğe girme. Sosyal medya bildirimlerini kapat. Sıradaki projenin koduna veya tasarımına 30 dakika kesintisiz gömül. Açıklama yapma; eserini inşa et.',
      quote: '"Kötülüğe verilecek en iyi cevap, onlara benzememektir." — Marcus Aurelius'
    },
    cevre: {
      diagTitle: 'Göstermelik Gamsızlık & Sinik Maske',
      diagText: 'Yakın çevrenin senin çabanı "Neden bu kadar kasıyorsun ki?" diyerek alaya alması, kendi tembelliklerinin vicdan azabını bastırma refleksidir. Senin dikey çaban, onların yatay ataletini yüzlerine çarpan bir aynadır.',
      shieldTitle: 'Manevi Zırh (Kalbi İstiklal)',
      shieldText: '"Hiçbir şey yapmayanlar, her şeyi eleştirme hakkını kendilerinde bulurlar." Onların onayıyla yola çıkmadın ki, onların yergisiyle yoldan dönesin.',
      actionTitle: 'Somut Müsbet Eylem',
      actionText: 'Onları ikna etmeye veya hedeflerini savunmaya çalışma. Tebessüm et ve sessizce çalışmaya devam et. Arı bala daldığında vızıltı çıkarmaz.',
      quote: '"Büyük beyinler fikirleri tartışır, orta beyinler olayları, küçük beyinler insanları tartışır." — Eleanor Roosevelt'
    },
    haset: {
      diagTitle: 'Yengeç Sepeti Hasedi',
      diagText: 'Başarılı bir dikey sıçrama yaptığında sürüdeki karanlık kural bozulur: "Biz yapamıyorsak o da yapamamalı." Paçandan çekmeye çalışmaları, senin yükseldiğinin en kesin ispatıdır.',
      shieldTitle: 'Manevi Zırh (Aynanın Kiri)',
      shieldText: '"Senin dünyaya bakan penceren kirli ise, benim açan çiçeklerim sana çamur görünür." Haset, sahibini içten içe kemiren bir ateştir; sana zarar veremez.',
      actionTitle: 'Somut Müsbet Eylem',
      actionText: 'Hasetçiyi cezalandırmanın en asil yolu, daha da büyük bir eser ortaya koymaktır. Sana atılan taşları toplayıp yeni eserinin temeline koy.',
      quote: '"Arı inler bal içinde..." — Anadolu İrfanı'
    },
    kibir: {
      diagTitle: 'Gizli Şirk & Alkış Bağımlılığı',
      diagText: 'Gelen aşırı övgü, kınamadan daha tehlikeli bir zehirdir. Zihin dış dünyadan alkış beklemeye başladığı anda, o alkışı kesenlerin kölesi haline gelir.',
      shieldTitle: 'Manevi Zırh (Rıza-yı İlahi)',
      shieldText: '"Amelinizde rıza-yı İlâhî olmalı. Eğer O razı olsa, bütün dünya küsse ehemmiyeti yok." İnsanların övgüsüyle şişen, yergisiyle söner.',
      actionTitle: 'Somut Müsbet Eylem',
      actionText: 'Kendine hemen şu soruyu sor: "Ben bu işi insanların 'ne harika' demesi için mi yapıyorum, yoksa hakikat aşkıyla mı?" Kalbini temizle ve sessizliğe çekil.',
      quote: '"İnsanların seni kınaması veya övmesi kalbinde eşitlenmediyse, henüz bağımsız değilsin." — İbn Ataullah'
    },
    ofke: {
      diagTitle: 'Ego Tuzağı & Nefsin Kışkırtması',
      diagText: 'Sana taş atana taşla karşılık vermek, seni onun çukuruna indirir. Kavgaya girmek, gürültücünün alanına teslim olmaktır; orada hakikat konuşulmaz.',
      shieldTitle: 'Manevi Zırh (Sessizliğin Heybeti)',
      shieldText: '"Sessizlik, en güçlü çığlıktır." Attığı taşın karşısında sarsılmayan bir irade gören saldırgan, kendi hiçliğinin ağırlığı altında ezilir.',
      actionTitle: 'Somut Müsbet Eylem',
      actionText: 'Hemen 10 derin nefes al (Nefes-i Sükun). Klavyeden elini çek. O kişiye beddua etmek yerine, onun amaçsızlık zindanına acı ve merhamet et.',
      quote: '"Karanlığa sövmektense, bir mum yak." — Konfüçyüs'
    },
    daginiklik: {
      diagTitle: 'Kesretin Zihin Parçalanması',
      diagText: 'Modern bildirimler, kısa videolar ve bitmek bilmeyen gündemler zihni atomlarına ayırır. Gaye-i hayal kaybolunca zihin en küçük çeldiriciye teslim olur.',
      shieldTitle: 'Manevi Zırh (Vahdet Odaklanması)',
      shieldText: 'Bütün kainatın dağınıklığı, hakikate adanmış tek bir saatin sükunetinde erir. Çokluktan (kesret) birliğe (vahdet) kaçış vaktidir.',
      actionTitle: 'Somut Müsbet Eylem',
      actionText: 'Aşağıdaki "Derya Odak İstasyonu"na geç. 25 dakikalık derin inşa sayacını başlat ve telefonunu başka odaya bırak.',
      quote: '"İnsanın en büyük zindanı, kendi içinde inşa ettiği amaçsızlıktır." — C. G. Jung'
    }
  };

  const buttons = document.querySelectorAll('.compass-btn');
  const output = document.getElementById('compassOutput');
  const copyBtn = document.getElementById('copyCompassAdvice');

  let currentSituationKey = 'linc';

  function renderCompass(key) {
    const data = situations[key];
    if (!data || !output) return;
    currentSituationKey = key;

    output.innerHTML = `
      <div class="flex items-center gap-2 mb-4">
        <span class="px-2.5 py-1 rounded bg-sky-950 text-sky-400 text-xs font-semibold uppercase tracking-wider">Teşhis</span>
        <h3 class="font-cinzel text-xl font-bold text-white">${data.diagTitle}</h3>
      </div>
      <p class="text-slate-300 text-sm leading-relaxed mb-6">${data.diagText}</p>

      <div class="space-y-4 border-t border-ocean-800 pt-4">
        <div class="flex items-start gap-3">
          <i data-lucide="shield-check" class="w-5 h-5 text-gold-400 shrink-0 mt-0.5"></i>
          <div>
            <h4 class="text-sm font-bold text-gold-300">${data.shieldTitle}</h4>
            <p class="text-xs text-slate-300 leading-normal">${data.shieldText}</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <i data-lucide="hammer" class="w-5 h-5 text-sky-400 shrink-0 mt-0.5"></i>
          <div>
            <h4 class="text-sm font-bold text-sky-300">${data.actionTitle}</h4>
            <p class="text-xs text-slate-300 leading-normal">${data.actionText}</p>
          </div>
        </div>
      </div>
    `;

    const quoteContainer = output.parentElement.querySelector('.font-serif-reading');
    if (quoteContainer) {
      quoteContainer.textContent = data.quote;
    }

    if (window.lucide) lucide.createIcons();
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('active', 'border-gold-500/40', 'bg-gold-500/10', 'text-gold-200');
        b.classList.add('border-ocean-800', 'bg-ocean-850', 'text-slate-300');
      });
      btn.classList.add('active', 'border-gold-500/40', 'bg-gold-500/10', 'text-gold-200');
      btn.classList.remove('border-ocean-800', 'bg-ocean-850', 'text-slate-300');

      renderCompass(btn.dataset.situation);
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const data = situations[currentSituationKey];
      const textToCopy = `[Gürültü Kalkanı]\nTeşhis: ${data.diagTitle}\nZırh: ${data.shieldText}\nEylem: ${data.actionText}\nÖğüt: ${data.quote}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i> Kopyalandı';
        if (window.lucide) lucide.createIcons();
        setTimeout(() => {
          copyBtn.innerHTML = '<i data-lucide="copy" class="w-3.5 h-3.5"></i> Kopyala';
          if (window.lucide) lucide.createIcons();
        }, 2000);
      });
    });
  }
}

/* ==========================================================================
   5. DERYA SESSİZLİĞİ & DERİN ODAK SAYACI (POMODORO & ZEN MODU)
   ========================================================================== */
function initFocusTimer() {
  const display = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startTimerBtn');
  const resetBtn = document.getElementById('resetTimerBtn');
  const zenBtn = document.getElementById('zenModeBtn');
  const goalInput = document.getElementById('focusGoalInput');
  const label = document.getElementById('activeFocusLabel');
  const presets = document.querySelectorAll('.time-preset');

  if (!display || !startBtn) return;

  let totalSeconds = 25 * 60;
  let remainingSeconds = totalSeconds;
  let timerInterval = null;
  let isRunning = false;

  function updateDisplay() {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function playChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz dönüşüm frekansı
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3);
    } catch (e) {
      console.log('Ses çalınamadı', e);
    }
  }

  function startTimer() {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4 fill-current"></i> Devam Et';
      if (label) label.textContent = 'Duraklatıldı: Eser seni bekliyor';
    } else {
      isRunning = true;
      startBtn.innerHTML = '<i data-lucide="pause" class="w-4 h-4 fill-current"></i> Duraklat';
      const goal = goalInput.value.trim() || 'Eserin İnşası';
      if (label) label.textContent = `Odak: "${goal}" sessizce inşa ediliyor...`;

      timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds--;
          updateDisplay();
        } else {
          clearInterval(timerInterval);
          isRunning = false;
          playChime();
          startBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4 fill-current"></i> Yeni Oturum';
          if (label) label.textContent = '✨ Tebrikler! Bir eserin taşı daha yerine kondu.';
          alert('Derya Sessizliği Tamamlandı. Hakikat adına bir taş daha yerine kondu!');
        }
      }, 1000);
    }
    if (window.lucide) lucide.createIcons();
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    remainingSeconds = totalSeconds;
    updateDisplay();
    startBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4 fill-current"></i> Başla';
    if (label) label.textContent = 'Hazır: Sükunete adım at';
    if (window.lucide) lucide.createIcons();
  }

  startBtn.addEventListener('click', startTimer);
  if (resetBtn) resetBtn.addEventListener('click', resetTimer);

  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      presets.forEach(p => {
        p.classList.remove('active', 'border-gold-500', 'bg-gold-500/20', 'text-gold-300');
        p.classList.add('border-ocean-700', 'bg-ocean-900', 'text-slate-300');
      });
      btn.classList.add('active', 'border-gold-500', 'bg-gold-500/20', 'text-gold-300');
      btn.classList.remove('border-ocean-700', 'bg-ocean-900', 'text-slate-300');

      const mins = parseInt(btn.dataset.mins, 10);
      totalSeconds = mins * 60;
      resetTimer();
    });
  });

  // Zen Modu (Dikkati dağıtan her şeyi gizle / tam ekran)
  let isZen = false;
  if (zenBtn) {
    zenBtn.addEventListener('click', () => {
      isZen = !isZen;
      const header = document.querySelector('header');
      const footer = document.querySelector('footer');
      if (isZen) {
        if (header) header.style.display = 'none';
        if (footer) footer.style.display = 'none';
        zenBtn.classList.add('bg-gold-500', 'text-ocean-950');
        zenBtn.innerHTML = '<i data-lucide="minimize-2" class="w-4 h-4"></i> Çık';
      } else {
        if (header) header.style.display = '';
        if (footer) footer.style.display = '';
        zenBtn.classList.remove('bg-gold-500', 'text-ocean-950');
        zenBtn.innerHTML = '<i data-lucide="maximize-2" class="w-4 h-4"></i> Zen Modu';
      }
      if (window.lucide) lucide.createIcons();
    });
  }
}

/* ==========================================================================
   6. NEFES-İ SÜKUN (4-7-8 RİTMİK NEFES METODU)
   ========================================================================== */
function initBreathingExercise() {
  const tabFocus = document.getElementById('tabFocus');
  const tabBreath = document.getElementById('tabBreath');
  const focusPanel = document.getElementById('focusPanel');
  const breathPanel = document.getElementById('breathPanel');
  const circle = document.getElementById('breathCircle');
  const phaseText = document.getElementById('breathPhaseText');
  const counterText = document.getElementById('breathTimerCounter');
  const startBtn = document.getElementById('startBreathBtn');
  const stopBtn = document.getElementById('stopBreathBtn');

  if (!tabFocus || !tabBreath || !focusPanel || !breathPanel) return;

  tabFocus.addEventListener('click', () => {
    tabFocus.classList.add('bg-gold-500', 'text-ocean-950');
    tabFocus.classList.remove('bg-ocean-800', 'text-slate-300');
    tabBreath.classList.add('bg-ocean-800', 'text-slate-300');
    tabBreath.classList.remove('bg-gold-500', 'text-ocean-950');
    focusPanel.classList.remove('hidden');
    breathPanel.classList.add('hidden');
  });

  tabBreath.addEventListener('click', () => {
    tabBreath.classList.add('bg-gold-500', 'text-ocean-950');
    tabBreath.classList.remove('bg-ocean-800', 'text-slate-300');
    tabFocus.classList.add('bg-ocean-800', 'text-slate-300');
    tabFocus.classList.remove('bg-gold-500', 'text-ocean-950');
    breathPanel.classList.remove('hidden');
    focusPanel.classList.add('hidden');
  });

  let breathInterval = null;
  let breathRunning = false;

  function runBreathCycle() {
    let phase = 0; // 0: al (4s), 1: tut (7s), 2: ver (8s)
    let timeLeft = 4;

    phaseText.textContent = 'Nefes Al';
    counterText.textContent = `${timeLeft}s`;
    circle.style.transform = 'scale(1.35)';

    breathInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        phase = (phase + 1) % 3;
        if (phase === 0) {
          timeLeft = 4;
          phaseText.textContent = 'Nefes Al';
          circle.style.transform = 'scale(1.35)';
        } else if (phase === 1) {
          timeLeft = 7;
          phaseText.textContent = 'Nefesi Tut';
          circle.style.transform = 'scale(1.35)';
        } else {
          timeLeft = 8;
          phaseText.textContent = 'Yavaşça Ver';
          circle.style.transform = 'scale(0.85)';
        }
      }
      counterText.textContent = `${timeLeft}s`;
    }, 1000);
  }

  if (startBtn && stopBtn) {
    startBtn.addEventListener('click', () => {
      if (breathRunning) return;
      breathRunning = true;
      runBreathCycle();
    });

    stopBtn.addEventListener('click', () => {
      clearInterval(breathInterval);
      breathRunning = false;
      phaseText.textContent = 'Hazır';
      counterText.textContent = '--';
      circle.style.transform = 'scale(1)';
    });
  }
}

/* ==========================================================================
   7. HİKMET SANDIĞI & SOSYAL KART ÜRETİCİ (CANVAS PNG İNDİRME)
   ========================================================================== */
function initQuotesAndCards() {
  const container = document.getElementById('quotesGrid');
  const filterBtns = document.querySelectorAll('.quote-filter-btn');
  const exportCanvas = document.getElementById('exportCardCanvas');

  // Manifestodaki tüm hakikat incileri (Genişletilmiş 26 Hikmet)
  let quotesData = [
    { id: 1, text: 'Ehl-i dalâletin ve gafletin tahkiriyle sarsılma. Bir divane çamur atsa, derya bulanmaz.', author: 'Risale-i Nur Külliyatı', tag: 'derya', theme: 'Metanet & Sarsılmazlık' },
    { id: 2, text: 'Amelinizde rıza-yı İlâhî olmalı. Eğer O razı olsa, bütün dünya küsse ehemmiyeti yok.', author: 'Bediüzzaman Said Nursî', tag: 'ihlas', theme: 'İhlas & Hürriyet' },
    { id: 3, text: 'İnsanın en büyük zindanı, kendi içinde inşa ettiği amaçsızlıktır.', author: 'Carl Gustav Jung', tag: 'felsefe', theme: 'İçsel Boşluk & Gölge' },
    { id: 4, text: 'Başkalarının hayatıyla aşırı ilgilenenler, kendi hayatlarındaki dayanılmaz boşluktan kaçanlardır.', author: 'Arthur Schopenhauer', tag: 'felsefe', theme: 'Kesret Kaosu' },
    { id: 5, text: 'Büyük beyinler fikirleri tartışır, orta beyinler olayları, küçük beyinler insanları tartışır.', author: 'Eleanor Roosevelt', tag: 'felsefe', theme: 'Ufuk & Vizyon' },
    { id: 6, text: 'Hiçbir şey yapmayanlar, her şeyi eleştirme hakkını kendilerinde bulurlar.', author: 'Jean-Jacques Rousseau', tag: 'felsefe', theme: 'Eylemsizlik' },
    { id: 7, text: 'Kitle asla en iyi üyelerinin seviyesine çıkamaz; o her zaman en alt seviyedekilerin hizasına inerek dengelenir.', author: 'Friedrich Nietzsche', tag: 'felsefe', theme: 'Sürü Psikolojisi' },
    { id: 8, text: 'Senin dünyaya bakan penceren kirli ise, benim açan çiçeklerim sana çamur görünür.', author: 'Mevlânâ Celâleddîn-i Rûmî', tag: 'tasavvuf', theme: 'İrfan & Gönül' },
    { id: 9, text: 'Deniz köpeğin ağzını yıkamasıyla murdar olmaz; güneş bir örümceğin tükürüğüyle kararmaz.', author: 'Mevlânâ Celâleddîn-i Rûmî', tag: 'tasavvuf', theme: 'Hakikatin Saflığı' },
    { id: 10, text: 'İnsanların seni kınaması veya övmesi senin kalbinde aynı etkiyi bırakmıyorsa, henüz tam bir bağımsızlığa ulaşmamışsındır.', author: 'İbn Ataullah el-İskenderî', tag: 'tasavvuf', theme: 'Kalbi İstiklal' },
    { id: 11, text: 'Gerçek bağımsızlık, başkalarının senin hakkında ne düşündüğünü umursamayı bıraktığın an başlar.', author: 'Lao Tzu', tag: 'stoa', theme: 'İçsel Huzur' },
    { id: 12, text: 'En üstün erdem su gibidir. Su her varlığa menfaat sağlar ama hiçbir şeyle çekişmez; herkesin küçümsediği alçak yerlere akar.', author: 'Lao Tzu', tag: 'stoa', theme: 'Wu Wei & Tevazu' },
    { id: 13, text: 'Sessizlik, en güçlü çığlıktır.', author: 'Sun Tzu', tag: 'derya', theme: 'Lisan-ı Hal' },
    { id: 14, text: 'Karanlığa sövmektense, bir mum yak.', author: 'Konfüçyüs', tag: 'derya', theme: 'Müsbet Hareket' },
    { id: 15, text: 'Arı inler bal içinde...', author: 'Anadolu İrfanı', tag: 'tasavvuf', theme: 'Eserin İnşası' },
    { id: 16, text: 'Dervişlik dedikleri hırka ile taç değil / Gönlün derviş eyleyen hırkaya muhtaç değil.', author: 'Yunus Emre', tag: 'tasavvuf', theme: 'Öz & Hakikat' },
    { id: 17, text: 'Kötülüğe karşı verilecek en iyi cevap, onlara benzememektir.', author: 'Marcus Aurelius', tag: 'stoa', theme: 'Merhamet Makamı' },
    { id: 18, text: 'Taş havaya fırlatıldığında yükselmekle bir kazanç elde etmez; yere düşmekle de hiçbir şey kaybetmez.', author: 'Marcus Aurelius', tag: 'stoa', theme: 'Sarsılmazlık' },
    { id: 19, text: 'Seni kızdıran şey insanların hareketleri değil; o hareketler hakkında kurduğun kendi yargılarındır.', author: 'Marcus Aurelius', tag: 'stoa', theme: 'Zihinsel Zırh' },
    { id: 20, text: 'Başkalarının hakkımızdaki fikirleri elimizde olmayan şeylerdendir; öyleyse onların kalbimizi incitmesine izin vermemeliyiz.', author: 'Epiktetos', tag: 'stoa', theme: 'Kontrol İkiliği' },
    { id: 21, text: 'İnsanların tüm eylemlerinin altında tek bir saik yatar: Kederi ve içsel anlamsızlığı kovmak.', author: 'İbn Hazm', tag: 'tasavvuf', theme: 'Nefsin Tahlili' },
    { id: 22, text: 'Hasetçiyi cezalandırmaya kalkma; zira o zaten senin nimetini her gördüğünde kendi ciğerini dağlamaktadır.', author: 'İmam Gazali', tag: 'tasavvuf', theme: 'Hasedin Çöküşü' },
    { id: 23, text: 'Bizim vazifemiz müsbet hareket etmektir, menfî hareket değildir. Sırf hizmeti yapmak, vazife-i İlâhiyeye karışmamaktır.', author: 'Bediüzzaman Said Nursî', tag: 'ihlas', theme: 'Müsbet Hareket' },
    { id: 24, text: 'İnsanlar neyi arzulayacaklarını diğer insanları taklit ederek öğrenirler. Bu taklitçi arzu çatışma ve linç doğurur.', author: 'René Girard', tag: 'felsefe', theme: 'Mimetik Linç' },
    { id: 25, text: 'Hınç (Ressentiment), yaratıcı eylem gücünden yoksun olanların, üretenlere karşı beslediği sinsi zehirdir.', author: 'Friedrich Nietzsche', tag: 'felsefe', theme: 'Hınç Psikolojisi' },
    { id: 26, text: 'Sessizlik, ruhun kendi derinliklerine inip hakikatle yüzleştiği tek mukaddes atölyedir.', author: 'Søren Kierkegaard', tag: 'felsefe', theme: 'Sükunetin Gücü' }
  ];

  // data/quotes.json dosyasından asenkron yüklemeyi de dene
  fetch('./data/quotes.json')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        quotesData = data;
        renderCards();
      }
    })
    .catch(() => {
      // Yerel dosya sistemi (file://) ise gömülü liste zaten devrededir
    });

  function renderCards(filter = 'all') {
    if (!container) return;
    container.innerHTML = '';

    const filtered = filter === 'all' ? quotesData : quotesData.filter(q => q.tag === filter);

    filtered.forEach(quote => {
      const card = document.createElement('div');
      card.className = 'glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-gold-500/40 transition-all group';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span class="px-2 py-0.5 rounded bg-ocean-800 font-mono">${quote.theme}</span>
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-gold-400 opacity-60"></i>
          </div>
          <p class="font-serif-reading text-slate-200 text-base leading-relaxed mb-4 italic">
            "${quote.text}"
          </p>
        </div>
        <div class="border-t border-ocean-800 pt-3 flex items-center justify-between">
          <span class="text-xs font-semibold text-gold-400 font-sans">— ${quote.author}</span>
          <button class="download-card-btn p-1.5 rounded-lg hover:bg-ocean-800 text-slate-400 hover:text-gold-400 transition-colors" title="Görsel Kart Olarak İndir" data-id="${quote.id}">
            <i data-lucide="download" class="w-4 h-4"></i>
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();

    // Kart İndirme Butonları Olay Dinleyicisi
    document.querySelectorAll('.download-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        const item = quotesData.find(q => q.id === id);
        if (item) generateAndDownloadCard(item);
      });
    });
  }

  // Filtre Butonları
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'border-gold-500', 'bg-gold-500/20', 'text-gold-300');
        b.classList.add('border-ocean-700', 'bg-ocean-850', 'text-slate-300');
      });
      btn.classList.add('active', 'border-gold-500', 'bg-gold-500/20', 'text-gold-300');
      btn.classList.remove('border-ocean-700', 'bg-ocean-850', 'text-slate-300');
      renderCards(btn.dataset.filter);
    });
  });

  renderCards();

  // Canvas ile 1080x1080 HD Sosyal Medya Kartı Üretimi
  function generateAndDownloadCard(item) {
    if (!exportCanvas) return;
    const ctx = exportCanvas.getContext('2d');
    const size = 1080;
    exportCanvas.width = size;
    exportCanvas.height = size;

    // Arka Plan Radyal Gradyan
    const bgGrad = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, size / 1.2);
    bgGrad.addColorStop(0, '#0c172a');
    bgGrad.addColorStop(0.7, '#070d18');
    bgGrad.addColorStop(1, '#030712');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // İnce Altın Çerçeve
    ctx.strokeStyle = '#e2b168';
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 50, size - 100, size - 100);

    ctx.strokeStyle = 'rgba(226, 177, 104, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(65, 65, size - 130, size - 130);

    // Üst Amblem / Başlık
    ctx.font = 'bold 24px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#e2b168';
    ctx.textAlign = 'center';
    ctx.fillText('D E R Y A   B U L A N M A Z', size / 2, 130);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('KESRETİN GÜRÜLTÜSÜNDEN VAHDETİN İNŞASINA', size / 2, 165);

    // Tırnak İşareti
    ctx.font = 'bold 120px Georgia, serif';
    ctx.fillStyle = 'rgba(226, 177, 104, 0.15)';
    ctx.fillText('“', size / 2, 280);

    // Alıntı Metnini Otomatik Satırlara Böl
    ctx.font = 'italic 38px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';

    const words = item.text.split(' ');
    let line = '';
    const lines = [];
    const maxWidth = 800;
    const lineHeight = 55;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Metni dikeyde ortala
    const startY = size / 2 - ((lines.length - 1) * lineHeight) / 2 - 20;
    for (let j = 0; j < lines.length; j++) {
      ctx.fillText(lines[j], size / 2, startY + j * lineHeight);
    }

    // Müellif / İsim
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#e2b168';
    ctx.fillText(`— ${item.author}`, size / 2, startY + lines.length * lineHeight + 60);

    // Tema etiketi
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`[ ${item.theme} ]`, size / 2, startY + lines.length * lineHeight + 100);

    // Alt Filigran
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('derya-bulanmaz.org  •  github.com/bahattinyunus/Derya-Bulanmaz', size / 2, size - 85);

    // PNG İndirme
    const image = exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `derya-bulanmaz-${item.id}.png`;
    link.href = image;
    link.click();
  }
}

/* ==========================================================================
   8. MÜSBET ESER GÜNLÜĞÜ (LOCALSTORAGE DESTEKLİ TEFEKKÜR KAYDI)
   ========================================================================== */
function initJournal() {
  const saveBtn = document.getElementById('saveJournalBtn');
  const exportMdBtn = document.getElementById('exportJournalMdBtn');
  const clearBtn = document.getElementById('clearJournalBtn');
  const list = document.getElementById('journalEntriesList');

  const inputNoise = document.getElementById('journalNoise');
  const inputWork = document.getElementById('journalWork');
  const inputMercy = document.getElementById('journalMercy');

  const STORAGE_KEY = 'derya_journal_entries';

  function getEntries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function renderEntries() {
    if (!list) return;
    const entries = getEntries();
    if (entries.length === 0) {
      list.innerHTML = '<p class="text-xs text-slate-500 italic">Henüz bir kayıt bulunmuyor. İlk tefekkürünüzü yukarıdan kaydedin.</p>';
      return;
    }

    list.innerHTML = '';
    entries.forEach((e, idx) => {
      const item = document.createElement('div');
      item.className = 'p-3.5 rounded-xl bg-ocean-950/70 border border-ocean-800 text-xs text-slate-300 space-y-1.5';
      item.innerHTML = `
        <div class="flex items-center justify-between font-mono text-[10px] text-gold-400">
          <span>📅 ${e.date}</span>
          <button class="delete-entry-btn text-red-400 hover:text-red-300" data-idx="${idx}">Sil</button>
        </div>
        ${e.noise ? `<p><strong class="text-sky-300">Duymazdan Gelinen Gürültü:</strong> ${e.noise}</p>` : ''}
        ${e.work ? `<p><strong class="text-gold-300">İnşa Edilen Eser:</strong> ${e.work}</p>` : ''}
        ${e.mercy ? `<p><strong class="text-emerald-300">Merhamet Notu:</strong> ${e.mercy}</p>` : ''}
      `;
      list.appendChild(item);
    });

    document.querySelectorAll('.delete-entry-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const current = getEntries();
        current.splice(idx, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        renderEntries();
      });
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const noise = inputNoise.value.trim();
      const work = inputWork.value.trim();
      const mercy = inputMercy.value.trim();

      if (!noise && !work && !mercy) {
        alert('Lütfen en az bir alanı doldurunuz.');
        return;
      }

      const newEntry = {
        date: new Date().toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }),
        noise,
        work,
        mercy
      };

      const entries = getEntries();
      entries.unshift(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

      inputNoise.value = '';
      inputWork.value = '';
      inputMercy.value = '';

      renderEntries();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Tüm günlük kayıtlarınız silinsin mi? Bu işlem geri alınamaz.')) {
        localStorage.removeItem(STORAGE_KEY);
        renderEntries();
      }
    });
  }

  if (exportMdBtn) {
    exportMdBtn.addEventListener('click', () => {
      const entries = getEntries();
      if (entries.length === 0) {
        alert('Dışa aktarılacak kayıt bulunmuyor.');
        return;
      }

      let md = '# Derya Bulanmaz — Müsbet Eser Günlüğü\n\n';
      entries.forEach(e => {
        md += `### ${e.date}\n`;
        if (e.noise) md += `- **Duymazdan Gelinen Gürültü:** ${e.noise}\n`;
        if (e.work) md += `- **İnşa Edilen Eser:** ${e.work}\n`;
        if (e.mercy) md += `- **Merhamet Notu:** ${e.mercy}\n`;
        md += '\n---\n\n';
      });

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `derya-gunluk-${new Date().toISOString().slice(0, 10)}.md`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  renderEntries();
}

/* ==========================================================================
   9. İHLAS & METANET SKALASI (ÖZ DEĞERLENDİRME TESTİ)
   ========================================================================== */
function initQuiz() {
  const container = document.getElementById('quizQuestions');
  const calcBtn = document.getElementById('calculateQuizBtn');
  const resultDiv = document.getElementById('quizResult');
  const title = document.getElementById('quizResultTitle');
  const desc = document.getElementById('quizResultDesc');
  const badge = document.getElementById('quizResultBadge');

  if (!container || !calcBtn) return;

  const questions = [
    {
      q: '1. Bir projenizi sosyal medyada paylaştığınızda gelen ilk eleştiri veya alayda ilk hissiniz ne olur?',
      options: [
        { text: 'Hemen öfkelenir, savunmaya geçer veya karşı tarafa laf yetiştiririm.', score: 0 },
        { text: 'İçim sıkılır, biraz canım yanar ama yine de susmaya çalışırım.', score: 2 },
        { text: 'Gülümserim; "bir divane çamur attı" der, işime devam ederim.', score: 4 }
      ]
    },
    {
      q: '2. Çevrenizden büyük bir iltifat ve alkış aldığınızda kalbinizin durumu nedir?',
      options: [
        { text: 'Kendimi üstün hisseder, başkalarının takdirine bağımlı hale gelirim.', score: 0 },
        { text: 'Hoşuma gider ama çok şımarmamaya dikkat ederim.', score: 2 },
        { text: 'Övgü ile yergiyi eşitlerim; "Ben hakikat için yaptım" derim.', score: 4 }
      ]
    },
    {
      q: '3. Hiçbir takdir veya para almayacağınızı bilseniz bile o eseri inşa eder miydiniz?',
      options: [
        { text: 'Kesinlikle hayır; kimse görmeyecekse neden yorulayım?', score: 0 },
        { text: 'Emin değilim, dış motivasyon olmadan zorlanırım.', score: 2 },
        { text: 'Evet; gaye-i hayalim amelin kendisidir, alkış değil.', score: 4 }
      ]
    },
    {
      q: '4. Size haksızlık eden veya arkanızdan kuyu kazan birine karşı nihai tavrınız nedir?',
      options: [
        { text: 'İntikam planı yapar, onun seviyesine inip zarar vermeye çalışırım.', score: 0 },
        { text: 'Bağlarımı tamamen koparırım ve kinimi içimde tutarım.', score: 2 },
        { text: 'Onun manevi zindanına acır, merhamet eder ve kendi yoluma yürürüm.', score: 4 }
      ]
    },
    {
      q: '5. Gününüzün ne kadarı "başkalarının ne yaptığıyla" ilgilenmekle geçiyor?',
      options: [
        { text: 'Çoğu zamanım sosyal medyadaki dedikodu ve dramaları izlemekle geçiyor.', score: 0 },
        { text: 'Bazen kendimi kaptırıyorum ama sonra vicdanen rahatsız oluyorum.', score: 2 },
        { text: 'Hiç ilgilenmem; "büyük beyinler fikirleri inşa eder" düsturuyla yaşarım.', score: 4 }
      ]
    }
  ];

  container.innerHTML = questions
    .map(
      (q, qIdx) => `
    <div class="space-y-3 pb-4 border-b border-ocean-800/80">
      <h4 class="text-sm font-semibold text-slate-200">${q.q}</h4>
      <div class="space-y-2">
        ${q.options
          .map(
            (opt, oIdx) => `
          <label class="flex items-center space-x-3 p-3 rounded-xl bg-ocean-950/60 border border-ocean-800/60 hover:border-gold-500/40 cursor-pointer transition-colors text-xs text-slate-300">
            <input type="radio" name="q_${qIdx}" value="${opt.score}" class="accent-gold-500 text-gold-500 focus:ring-0">
            <span>${opt.text}</span>
          </label>
        `
          )
          .join('')}
      </div>
    </div>
  `
    )
    .join('');

  calcBtn.addEventListener('click', () => {
    let totalScore = 0;
    let answered = 0;

    questions.forEach((_, idx) => {
      const selected = document.querySelector(`input[name="q_${idx}"]:checked`);
      if (selected) {
        totalScore += parseInt(selected.value, 10);
        answered++;
      }
    });

    if (answered < questions.length) {
      alert('Lütfen tüm soruları yanıtlayınız.');
      return;
    }

    resultDiv.classList.remove('hidden');

    if (totalScore >= 16) {
      title.textContent = '🌊 Derya-yı Bî-Pâyan (Sarsılmaz Okyanus)';
      desc.textContent =
        'Tebrikler! Kalbiniz kesretin ve kalabalıkların dedikodusundan sıyrılmış. Övgü ve yergiyi eşitlemiş, ihlas zırhını kuşanmışsınız. Eserinizi sessizlikte inşa etmeye devam edin; atılan hiçbir çamur sizin suyunuzu bulandıramaz.';
      badge.textContent = 'Sarsılmazlık Seviyesi: %90+';
      badge.className = 'inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500 text-ocean-950';
    } else if (totalScore >= 10) {
      title.textContent = '💧 Berrak Göl (Durulan Zihin)';
      desc.textContent =
        'Hakikat yolundasınız ancak dış dünyanın gürültüsü ve onaylanma arzusu zaman zaman yüzeyinizi dalgalandırıyor. Lisan-ı hal ile susmayı ve merhamet makamını daha derin tefekkür etmeye ihtiyacınız var.';
      badge.textContent = 'Sarsılmazlık Seviyesi: %60 - %85';
      badge.className = 'inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500 text-ocean-950';
    } else {
      title.textContent = '🌪️ Rüzgarlı Kıyı (Zırh Kuşanma Vakti)';
      desc.textContent =
        'Kalabalıkların alkışına veya kınamasına gereğinden fazla değer veriyorsunuz. İhlas sırrına sığınmalı; başkalarının hayatıyla ilgilenmeyi bırakıp kendi gaye-i hayalinizi inşa etmeye başlamalısınız.';
      badge.textContent = 'Sarsılmazlık Seviyesi: %50 Altı';
      badge.className = 'inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-600 text-white';
    }
  });
}

/* ==========================================================================
   10. MOBİL MENÜ KONTROLÜ
   ========================================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}
