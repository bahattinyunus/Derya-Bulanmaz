/**
 * DERYA BULANMAZ - Temel Uygulama Motoru v2.0
 * Kesretin Gürültüsünden Vahdetin İnşasına
 */

document.addEventListener('DOMContentLoaded', () => {
  // Lucide ikonlarını başlat
  if (window.lucide) {
    lucide.createIcons();
  }

  // Modülleri Başlat
  initToast();
  initThemeEngine();
  initOceanCanvas();
  initAmbientSound();
  initReadingTools();
  initCompass();
  initMatrixEngine();
  initFocusTimer();
  initBreathingExercise();
  initQuotesAndCards();
  initJournal();
  initQuiz();
  initKeyboardShortcuts();
  initMobileMenu();
  initServiceWorker();
});

/* ==========================================================================
   0. TOAST BİLDİRİM SİSTEMİ
   ========================================================================== */
let showToast = (message, iconName = 'sparkles') => {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4 text-gold-400"></i> <span>${message}</span>`;
  if (window.lucide) lucide.createIcons();
  toast.classList.remove('toast-hidden');
  toast.classList.add('toast-visible');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.classList.add('toast-hidden');
  }, 3200);
};

/* ==========================================================================
   0.1. TEMA DEĞİŞTİRME MOTORU (OKYANUS, OBSİDİYEN, PARŞÖMEN)
   ========================================================================== */
function initThemeEngine() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const themes = ['ocean', 'obsidian', 'parchment'];
  const themeLabels = {
    ocean: 'Okyanus Gece',
    obsidian: 'Saf Obsidiyen',
    parchment: 'İrfan Parşömeni'
  };

  let currentTheme = localStorage.getItem('derya_theme') || 'ocean';

  function applyTheme(theme) {
    document.body.classList.remove('theme-obsidian', 'theme-parchment');
    if (theme === 'obsidian') {
      document.body.classList.add('theme-obsidian');
    } else if (theme === 'parchment') {
      document.body.classList.add('theme-parchment');
    }
    localStorage.setItem('derya_theme', theme);
    if (themeBtn) {
      themeBtn.title = `Mevcut Tema: ${themeLabels[theme]} (Değiştirmek için tıkla)`;
    }
  }

  applyTheme(currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
      currentTheme = themes[nextIdx];
      applyTheme(currentTheme);
      showToast(`Tema değiştirildi: ${themeLabels[currentTheme]}`, 'palette');
    });
  }

  window.toggleNextTheme = () => {
    if (themeBtn) themeBtn.click();
  };
}

/* ==========================================================================
   1. İNTERAKTİF OKYANUS TUVALİ & ÇAMUR SOĞURMA SİMÜLASYONU
   ========================================================================== */
let triggerCanvasMud = null;

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
  for (let i = 0; i < 45; i++) {
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
  let pearls = [];

  let step = 0;

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Derinlik Gradyanı
    const isObsidian = document.body.classList.contains('theme-obsidian');
    const isParchment = document.body.classList.contains('theme-parchment');

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isObsidian) {
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(0.5, '#050505');
      gradient.addColorStop(1, '#0a0a0a');
    } else if (isParchment) {
      gradient.addColorStop(0, '#120d07');
      gradient.addColorStop(0.5, '#18120a');
      gradient.addColorStop(1, '#241a0e');
    } else {
      gradient.addColorStop(0, '#050a14');
      gradient.addColorStop(0.5, '#070d18');
      gradient.addColorStop(1, '#020617');
    }
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

    // Çamur Partikülleri (Deryada çözünür ve dibe indikçe inci tanelerine dönüşür)
    for (let i = mudParticles.length - 1; i >= 0; i--) {
      const m = mudParticles[i];
      m.x += m.vx;
      m.y += m.vy;
      m.vy += 0.08;
      m.alpha -= 0.014;
      m.size *= 0.985;

      ctx.fillStyle = `rgba(${m.r}, ${m.g}, ${m.b}, ${Math.max(0, m.alpha)})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      ctx.fill();

      // Tam kaybolurken minik altın parıltı bırak
      if (m.alpha <= 0.15 && Math.random() < 0.08) {
        pearls.push({
          x: m.x,
          y: m.y,
          size: Math.random() * 2 + 1,
          alpha: 0.8,
          vy: -0.5
        });
      }

      if (m.alpha <= 0 || m.size <= 0.5) {
        mudParticles.splice(i, 1);
      }
    }

    // İnciler / Işık damlacıkları (Derya çamuru dönüştürdü)
    for (let i = pearls.length - 1; i >= 0; i--) {
      const pr = pearls[i];
      pr.y += pr.vy;
      pr.alpha -= 0.01;
      ctx.fillStyle = `rgba(250, 204, 21, ${Math.max(0, pr.alpha)})`;
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, pr.size, 0, Math.PI * 2);
      ctx.fill();
      if (pr.alpha <= 0) pearls.splice(i, 1);
    }

    // Yüzen Hakikat Metinleri
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.008;

      ctx.font = 'italic 16px "Playfair Display", Georgia, serif';
      ctx.fillStyle = `rgba(226, 177, 104, ${Math.max(0, ft.alpha)})`;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);

      if (ft.alpha <= 0) {
        floatingTexts.splice(i, 1);
      }
    }

    step++;
    requestAnimationFrame(render);
  }

  render();

  // Çamur Fırlatma Fonksiyonu
  function addMud(word) {
    const startX = width / 2 + (Math.random() - 0.5) * 300;
    const startY = height * 0.45;

    // 40 adet koyu partikül saç
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1;
      mudParticles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 5 + 3,
        alpha: 0.85,
        r: Math.floor(Math.random() * 40 + 70),
        g: Math.floor(Math.random() * 30 + 50),
        b: Math.floor(Math.random() * 20 + 30)
      });
    }

    // Suyun üzerine hakikat yankısı yazdır
    floatingTexts.push({
      x: startX,
      y: startY - 20,
      vy: -0.6,
      alpha: 1,
      text: `“${word}” deryada kayboldu...`
    });
  }

  triggerCanvasMud = addMud;

  // UI Olayları
  const mudInput = document.getElementById('mudInput');
  const throwBtn = document.getElementById('throwMudBtn');
  const mudFeedback = document.getElementById('mudFeedback');
  const mudCountEl = document.getElementById('mudAbsorbedCount');

  let mudCount = parseInt(localStorage.getItem('derya_mud_count') || '0', 10);
  if (mudCountEl) mudCountEl.textContent = mudCount;

  function fireMud(customWord) {
    const rawVal = customWord || (mudInput ? mudInput.value.trim() : '');
    const val = rawVal || 'Gürültü';
    addMud(val);

    mudCount++;
    localStorage.setItem('derya_mud_count', mudCount);
    if (mudCountEl) mudCountEl.textContent = mudCount;

    // Ses efekti (Eğer ses motoru devredeyse)
    if (window.playWaterSplashChime) {
      window.playWaterSplashChime();
    }

    if (mudFeedback) {
      const responses = [
        `Derya bir an bile bulanmadı; "${val}" ummanın enginliğinde inciye dönüştü.`,
        `Bir divane "${val}" attı, derya sükunetini korudu.`,
        `Gürültü yüzeyde söndü; hakikat dipte sessizce parıldıyor.`,
        `"${val}" bir köpük gibi söndü; deryanın vüs'ati onu yuttu.`
      ];
      mudFeedback.textContent = responses[Math.floor(Math.random() * responses.length)];
      mudFeedback.style.opacity = '1';
      setTimeout(() => {
        if (mudFeedback) mudFeedback.style.opacity = '0';
      }, 4000);
    }

    if (mudInput && !customWord) mudInput.value = '';
  }

  if (throwBtn) {
    throwBtn.addEventListener('click', () => fireMud());
  }

  if (mudInput) {
    mudInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') fireMud();
    });
  }

  // Çamur Hazır Butonları (Pills)
  document.querySelectorAll('.mud-preset-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const text = pill.dataset.text || pill.textContent.trim();
      fireMud(text);
    });
  });
}

/* ==========================================================================
   2. GELİŞMİŞ AMBİYANS SES SENTEZLEYİCİSİ (WEB AUDIO API - 4 SES MANZARASI)
   ========================================================================== */
function initAmbientSound() {
  const toggleBtn = document.getElementById('ambientSoundToggle');
  const icon = document.getElementById('ambientSoundIcon');
  const text = document.getElementById('ambientSoundText');
  const soundscapeSelect = document.getElementById('soundscapeSelect');

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let activeNodes = [];
  let currentSoundscape = 'ocean'; // 'ocean', 'solfeggio', 'rain', 'brown'

  function stopCurrentSound() {
    activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    activeNodes = [];
  }

  function setupAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
  }

  // 1. Okyanus Dalgaları
  function playOceanSound() {
    stopCurrentSound();
    setupAudioContext();

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

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, audioCtx.currentTime);

    const lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime);
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(260, audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const droneOsc = audioCtx.createOscillator();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(108, audioCtx.currentTime);
    const droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(0.018, audioCtx.currentTime);
    droneOsc.connect(droneGain);

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    droneGain.connect(masterGain);

    whiteNoise.start();
    lfo.start();
    droneOsc.start();

    activeNodes.push(whiteNoise, lfo, droneOsc, filter, lfoGain, droneGain);
  }

  // 2. 432 Hz Solfeggio & Ney Çanağı
  function playSolfeggioSound() {
    stopCurrentSound();
    setupAudioContext();

    const osc432 = audioCtx.createOscillator();
    osc432.type = 'sine';
    osc432.frequency.setValueAtTime(432, audioCtx.currentTime);

    const osc528 = audioCtx.createOscillator();
    osc528.type = 'sine';
    osc528.frequency.setValueAtTime(528, audioCtx.currentTime);

    const subOsc = audioCtx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(108, audioCtx.currentTime);

    const toneGain = audioCtx.createGain();
    toneGain.gain.setValueAtTime(0.045, audioCtx.currentTime);

    const subGain = audioCtx.createGain();
    subGain.gain.setValueAtTime(0.035, audioCtx.currentTime);

    osc432.connect(toneGain);
    osc528.connect(toneGain);
    subOsc.connect(subGain);

    toneGain.connect(masterGain);
    subGain.connect(masterGain);

    osc432.start();
    osc528.start();
    subOsc.start();

    activeNodes.push(osc432, osc528, subOsc, toneGain, subGain);
  }

  // 3. Dingin Gece Yağmuru
  function playRainSound() {
    stopCurrentSound();
    setupAudioContext();

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.06;
    }

    const rainSource = audioCtx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, audioCtx.currentTime);
    filter.Q.setValueAtTime(0.8, audioCtx.currentTime);

    rainSource.connect(filter);
    filter.connect(masterGain);
    rainSource.start();

    activeNodes.push(rainSource, filter);
  }

  // 4. Kahverengi Gürültü (Derin Odak)
  function playBrownNoise() {
    stopCurrentSound();
    setupAudioContext();

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 0.35;
    }

    const brownSource = audioCtx.createBufferSource();
    brownSource.buffer = noiseBuffer;
    brownSource.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, audioCtx.currentTime);

    brownSource.connect(filter);
    filter.connect(masterGain);
    brownSource.start();

    activeNodes.push(brownSource, filter);
  }

  function startSelectedSound() {
    if (currentSoundscape === 'solfeggio') playSolfeggioSound();
    else if (currentSoundscape === 'rain') playRainSound();
    else if (currentSoundscape === 'brown') playBrownNoise();
    else playOceanSound();
  }

  // Su Damlası / Çan Çalma Fonksiyonu (Genel kullanım için dışarı aktar)
  window.playWaterSplashChime = function () {
    if (!audioCtx) return;
    try {
      const chimeOsc = audioCtx.createOscillator();
      const chimeGain = audioCtx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(880, audioCtx.currentTime);
      chimeOsc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.6);

      chimeGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(masterGain);
      chimeOsc.start();
      chimeOsc.stop(audioCtx.currentTime + 0.65);
    } catch (e) {}
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (!audioCtx) {
        setupAudioContext();
        startSelectedSound();
        isPlaying = true;
      } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
        startSelectedSound();
        isPlaying = true;
      } else if (isPlaying) {
        audioCtx.suspend();
        isPlaying = false;
      } else {
        audioCtx.resume();
        startSelectedSound();
        isPlaying = true;
      }

      if (isPlaying) {
        toggleBtn.classList.add('border-gold-500', 'bg-gold-500/10', 'text-gold-300');
        if (icon) icon.setAttribute('data-lucide', 'volume-2');
        if (text) text.textContent = 'Ambiyans Açık';
        showToast('Ambiyans sesi açıldı', 'volume-2');
      } else {
        toggleBtn.classList.remove('border-gold-500', 'bg-gold-500/10', 'text-gold-300');
        if (icon) icon.setAttribute('data-lucide', 'volume-x');
        if (text) text.textContent = 'Sükunet Sesi';
        showToast('Ambiyans sesi kapatıldı', 'volume-x');
      }
      if (window.lucide) lucide.createIcons();
    });
  }

  if (soundscapeSelect) {
    soundscapeSelect.addEventListener('change', e => {
      currentSoundscape = e.target.value;
      if (isPlaying) {
        startSelectedSound();
        showToast(`Ambiyans modu: ${e.target.options[e.target.selectedIndex].text}`, 'music');
      }
    });
  }

  window.toggleAudioMute = () => {
    if (toggleBtn) toggleBtn.click();
  };
}

/* ==========================================================================
   3. MANİFESTO OKUMA ARAÇLARI & SESLENDİRME
   ========================================================================== */
function initReadingTools() {
  const progressBar = document.getElementById('readProgressBar');
  const manifesto = document.getElementById('manifesto');
  const fontSerifBtn = document.getElementById('fontToggleSerif');
  const fontSansBtn = document.getElementById('fontToggleSans');
  const fontIncBtn = document.getElementById('fontSizeInc');
  const fontDecBtn = document.getElementById('fontSizeDec');
  const content = document.getElementById('manifestoContent');
  const readAloudBtn = document.getElementById('readAloudBtn');
  const readAloudText = document.getElementById('readAloudText');

  window.addEventListener('scroll', () => {
    if (!manifesto || !progressBar) return;
    const rect = manifesto.getBoundingClientRect();
    const totalHeight = manifesto.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    if (scrolled > 0 && totalHeight > 0) {
      const pct = Math.min(100, Math.max(0, (scrolled / totalHeight) * 100));
      progressBar.style.width = pct + '%';
    } else if (scrolled <= 0) {
      progressBar.style.width = '0%';
    }
  });

  if (fontSerifBtn && fontSansBtn && content) {
    fontSerifBtn.addEventListener('click', () => {
      content.classList.remove('font-sans-reading');
      content.classList.add('font-serif-reading');
      fontSerifBtn.classList.add('bg-ocean-800', 'text-gold-400');
      fontSansBtn.classList.remove('bg-ocean-800', 'text-gold-400');
    });

    fontSansBtn.addEventListener('click', () => {
      content.classList.remove('font-serif-reading');
      content.classList.add('font-sans-reading');
      fontSansBtn.classList.add('bg-ocean-800', 'text-gold-400');
      fontSerifBtn.classList.remove('bg-ocean-800', 'text-gold-400');
    });
  }

  let currentFontSize = 18;
  if (fontIncBtn && content) {
    fontIncBtn.addEventListener('click', () => {
      if (currentFontSize < 26) {
        currentFontSize += 2;
        content.style.fontSize = currentFontSize + 'px';
      }
    });
  }

  if (fontDecBtn && content) {
    fontDecBtn.addEventListener('click', () => {
      if (currentFontSize > 14) {
        currentFontSize -= 2;
        content.style.fontSize = currentFontSize + 'px';
      }
    });
  }

  if (readAloudBtn && window.speechSynthesis) {
    let isSpeaking = false;
    let utterance = null;

    readAloudBtn.addEventListener('click', () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        if (readAloudText) readAloudText.textContent = 'Sesli Dinle';
        readAloudBtn.classList.remove('bg-gold-500/20', 'border-gold-500', 'text-gold-300');
      } else {
        const textToRead = content ? content.innerText : '';
        utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.95;

        utterance.onend = () => {
          isSpeaking = false;
          if (readAloudText) readAloudText.textContent = 'Sesli Dinle';
          readAloudBtn.classList.remove('bg-gold-500/20', 'border-gold-500', 'text-gold-300');
        };

        window.speechSynthesis.speak(utterance);
        isSpeaking = true;
        if (readAloudText) readAloudText.textContent = 'Durdur';
        readAloudBtn.classList.add('bg-gold-500/20', 'border-gold-500', 'text-gold-300');
      }
    });
  }
}

/* ==========================================================================
   4. GÜRÜLTÜ KALKANI (PUSULA)
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
      const copyText = `[Derya Bulanmaz - Gürültü Kalkanı]\n${data.diagTitle}\n${data.diagText}\n\nZırh: ${data.shieldText}\nMüsbet Eylem: ${data.actionText}\nHikmet: ${data.quote}`;
      navigator.clipboard.writeText(copyText).then(() => {
        showToast('Kalkan reçetesi panoya kopyalandı', 'copy');
      });
    });
  }
}

/* ==========================================================================
   5. YENİ MODÜL: MÜSBET HAREKET MATRİSİ & VAKA ÇÖZÜCÜ (INTERACTIVE DILEMMA ENGINE)
   ========================================================================== */
function initMatrixEngine() {
  const container = document.getElementById('matrixContainer');
  const tabsContainer = document.getElementById('matrixTabs');
  const contentArea = document.getElementById('matrixContentArea');
  const exportToJournalBtn = document.getElementById('matrixToJournalBtn');
  const copyMatrixBtn = document.getElementById('matrixCopyBtn');

  if (!container || !contentArea) return;

  let dilemmas = [];
  let activeDilemma = null;

  // Fallback varsayılan veriler
  const fallbackDilemmas = [
    {
      id: 'linc_ve_iftira',
      title: 'Sosyal Medyada veya Toplulukta Haksız Linç & Karalama',
      category: 'Dış Tehdit',
      badge: 'Yüksek Gürültü',
      summary: 'Kalabalıkların ya da dijital güruhların ürettiğiniz eseri, şahsınızı veya niyetinizi çarpıtarak topluca saldırması.',
      diagnostic: 'René Girard\'ın Mimetik Teorisi uyarınca kitleler kendi suçluluklarını bir günah keçisine boşaltırlar. Gustave Le Bon\'a göre kitlede akıl kaybolur; yerini kör histeri alır.',
      enfus_mirror: 'Nefsim neden bu kadar yaralandı? Çünkü gizli bir onaylanma beklentim vardı. Derya olan bir ruh, bardağın alacağı bir kaşık çamurla bulanmaz. Hatan varsa hakikate teslim ol; iftira ise bil ki kir güneşin ışığına yapışmaz.',
      lisan_i_hal: 'Tek kelime cevap verme. Savunma metni yazma. Kavgaya girmek, gürültücünün bataklığına inip onun kurallarıyla boğulmaktır. Sessizlik, zalimin yüzüne inen en asil hakikat sillesidir.',
      eser_insasi: 'Bu haksız saldırının doğurduğu adrenalini hemen 45 dakikalık bir derin inşa seansına aktar. Eserine öyle bir tuğla daha ekle ki, o tuğla onların binlerce gürültüsünden daha gür ses çıkarsın.',
      merhamet_makami: 'Sana saldıranların gece yastığa baş koyduklarında hissettikleri korkunç gayesizlik zindanına acı. Kötülüğe en büyük ceza, onlara benzememektir.',
      action_checklist: [
        'Sosyal medya bildirimlerini 24 saatliğine sessize al.',
        'Klavyeden elini çekip 10 derin sükun nefesi al (4-7-8 ritmi).',
        'Yarım kalan eserinin başına oturup 40 dakika kesintisiz çalış.'
      ],
      prescribed_quote: {
        text: 'Ehl-i dalâletin ve gafletin tahkiriyle sarsılma. Bir divane çamur atsa, derya bulanmaz.',
        author: 'Risale-i Nur Külliyatı'
      }
    }
  ];

  fetch('./data/dilemmas.json')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        dilemmas = data;
        renderTabs();
        selectDilemma(dilemmas[0]);
      }
    })
    .catch(() => {
      dilemmas = fallbackDilemmas;
      renderTabs();
      selectDilemma(dilemmas[0]);
    });

  function renderTabs() {
    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';
    dilemmas.forEach((d, idx) => {
      const btn = document.createElement('button');
      btn.className = `matrix-tab-btn text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
        idx === 0
          ? 'active border-gold-500 bg-gold-500/15 text-gold-300'
          : 'border-ocean-800 bg-ocean-950/70 text-slate-300 hover:border-slate-700'
      }`;
      btn.innerHTML = `
        <div class="truncate pr-2">
          <div class="font-bold text-white truncate">${d.title}</div>
          <span class="text-[10px] text-slate-400 font-mono">${d.badge}</span>
        </div>
        <i data-lucide="chevron-right" class="w-4 h-4 shrink-0 text-slate-500"></i>
      `;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.matrix-tab-btn').forEach(b => {
          b.classList.remove('active', 'border-gold-500', 'bg-gold-500/15', 'text-gold-300');
          b.classList.add('border-ocean-800', 'bg-ocean-950/70', 'text-slate-300');
        });
        btn.classList.add('active', 'border-gold-500', 'bg-gold-500/15', 'text-gold-300');
        btn.classList.remove('border-ocean-800', 'bg-ocean-950/70', 'text-slate-300');
        selectDilemma(d);
      });
      tabsContainer.appendChild(btn);
    });
    if (window.lucide) lucide.createIcons();
  }

  function selectDilemma(d) {
    activeDilemma = d;
    if (!contentArea) return;

    contentArea.innerHTML = `
      <div class="space-y-6">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ${d.category}
            </span>
            <span class="text-xs text-slate-400 font-mono">• ${d.badge}</span>
          </div>
          <h3 class="font-cinzel text-xl sm:text-2xl font-bold text-white mb-2">${d.title}</h3>
          <p class="text-sm text-slate-300 italic bg-ocean-950/60 p-3 rounded-xl border border-ocean-800">
            "${d.summary}"
          </p>
        </div>

        <div class="space-y-4">
          <!-- 0. Teşhis -->
          <div class="p-4 rounded-xl bg-sky-950/30 border border-sky-800/40">
            <h4 class="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1 flex items-center gap-1.5">
              <i data-lucide="microscope" class="w-4 h-4"></i> Evrensel Felsefi Teşhis
            </h4>
            <p class="text-xs text-slate-300 leading-relaxed">${d.diagnostic}</p>
          </div>

          <!-- 4 Aşamalı Derya Protokolü -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl glass-panel border-l-4 border-purple-500">
              <span class="text-[11px] font-bold uppercase tracking-wider text-purple-400 block mb-1">1. Enfüs Aynası (İç Muhasebe)</span>
              <p class="text-xs text-slate-300 leading-normal">${d.enfus_mirror}</p>
            </div>

            <div class="p-4 rounded-xl glass-panel border-l-4 border-gold-500">
              <span class="text-[11px] font-bold uppercase tracking-wider text-gold-400 block mb-1">2. Lisan-ı Hal Kalkanı (Sükut Sanatı)</span>
              <p class="text-xs text-slate-300 leading-normal">${d.lisan_i_hal}</p>
            </div>

            <div class="p-4 rounded-xl glass-panel border-l-4 border-emerald-500">
              <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">3. Eserin İnşası (Deep Work)</span>
              <p class="text-xs text-slate-300 leading-normal">${d.eser_insasi}</p>
            </div>

            <div class="p-4 rounded-xl glass-panel border-l-4 border-cyan-500">
              <span class="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">4. Merhamet Makamı (Asalet)</span>
              <p class="text-xs text-slate-300 leading-normal">${d.merhamet_makami}</p>
            </div>
          </div>

          <!-- Eylem Listesi -->
          <div class="p-4 rounded-xl bg-ocean-950/80 border border-ocean-800">
            <h4 class="text-xs font-bold uppercase tracking-wider text-gold-400 mb-2 flex items-center gap-1.5">
              <i data-lucide="check-square" class="w-4 h-4"></i> Hemen Şimdi Uygulanacak Somut Eylemler
            </h4>
            <div class="space-y-2">
              ${d.action_checklist
                .map(
                  (act, i) => `
                <label class="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer hover:text-white">
                  <input type="checkbox" class="accent-gold-500 rounded mt-0.5">
                  <span>${act}</span>
                </label>
              `
                )
                .join('')}
            </div>
          </div>

          ${
            d.prescribed_quote
              ? `
            <div class="p-3 rounded-xl border border-gold-500/20 bg-gold-500/5 flex items-center justify-between text-xs">
              <span class="italic text-slate-300">“${d.prescribed_quote.text}” — <b class="text-gold-400">${d.prescribed_quote.author}</b></span>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  }

  // Günlüğe Aktarma Butonu
  if (exportToJournalBtn) {
    exportToJournalBtn.addEventListener('click', () => {
      if (!activeDilemma) return;
      const inputNoise = document.getElementById('journalNoise');
      const inputWork = document.getElementById('journalWork');
      const inputMercy = document.getElementById('journalMercy');

      if (inputNoise) inputNoise.value = `${activeDilemma.title} karşısında sükutumu korudum.`;
      if (inputWork) inputWork.value = activeDilemma.action_checklist[2] || activeDilemma.eser_insasi;
      if (inputMercy) inputMercy.value = activeDilemma.merhamet_makami;

      const journalSec = document.getElementById('gunluk');
      if (journalSec) {
        journalSec.scrollIntoView({ behavior: 'smooth' });
      }
      showToast('Vaka reçetesi günlüğe aktarıldı. Kaydetmeyi unutmayın!', 'book-marked');
    });
  }

  // Kopyalama Butonu
  if (copyMatrixBtn) {
    copyMatrixBtn.addEventListener('click', () => {
      if (!activeDilemma) return;
      const text = `[DERYA BULANMAZ - MÜSBET HAREKET MATRİSİ]\nVaka: ${activeDilemma.title}\nTeşhis: ${activeDilemma.diagnostic}\n\n1. Enfüs: ${activeDilemma.enfus_mirror}\n2. Lisan-ı Hal: ${activeDilemma.lisan_i_hal}\n3. Eser: ${activeDilemma.eser_insasi}\n4. Merhamet: ${activeDilemma.merhamet_makami}\n\nEylem Adımları:\n${activeDilemma.action_checklist.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Vaka çözüm protokolü panoya kopyalandı', 'copy');
      });
    });
  }
}

/* ==========================================================================
   6. DERYA SESSİZLİĞİ & ODAK SAYACI (DEEP WORK STATION)
   ========================================================================== */
function initFocusTimer() {
  const display = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startTimerBtn');
  const resetBtn = document.getElementById('resetTimerBtn');
  const presets = document.querySelectorAll('.time-preset');
  const goalInput = document.getElementById('focusGoalInput');
  const activeLabel = document.getElementById('activeFocusLabel');
  const zenBtn = document.getElementById('zenModeBtn');

  const tabFocus = document.getElementById('tabFocus');
  const tabBreath = document.getElementById('tabBreath');
  const focusPanel = document.getElementById('focusPanel');
  const breathPanel = document.getElementById('breathPanel');

  if (!display || !startBtn) return;

  let totalSeconds = 25 * 60;
  let remainingSeconds = totalSeconds;
  let timerInterval = null;
  let isRunning = false;

  function updateDisplay() {
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isRunning) return;
      presets.forEach(b => {
        b.classList.remove('active', 'border-gold-500', 'bg-gold-500/20', 'text-gold-300');
        b.classList.add('border-ocean-700', 'bg-ocean-900', 'text-slate-300');
      });
      btn.classList.add('active', 'border-gold-500', 'bg-gold-500/20', 'text-gold-300');
      btn.classList.remove('border-ocean-700', 'bg-ocean-900', 'text-slate-300');

      const mins = parseInt(btn.dataset.mins, 10);
      totalSeconds = mins * 60;
      remainingSeconds = totalSeconds;
      updateDisplay();
    });
  });

  function startTimer() {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4 fill-current"></i> Devam Et';
      if (activeLabel) activeLabel.textContent = 'Duraklatıldı: Zihnin dağılmasına izin verme';
      showToast('Sayaç duraklatıldı', 'pause');
    } else {
      isRunning = true;
      startBtn.innerHTML = '<i data-lucide="pause" class="w-4 h-4"></i> Duraklat';
      const goal = goalInput && goalInput.value.trim() ? goalInput.value.trim() : 'Hakikati İnşa Etmek';
      if (activeLabel) activeLabel.textContent = `İnşa Ediliyor: ${goal}`;
      showToast(`Odak oturumu başladı: ${goal}`, 'hourglass');

      timerInterval = setInterval(() => {
        remainingSeconds--;
        updateDisplay();

        if (remainingSeconds <= 0) {
          clearInterval(timerInterval);
          isRunning = false;
          startBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4 fill-current"></i> Yeniden Başla';
          if (activeLabel) activeLabel.textContent = '✨ Muvaffakiyet! Hakikat adına bir taş kondu.';
          showToast('Oturum tamamlandı! Eserinize sadık kaldınız.', 'check-circle');

          if (window.playWaterSplashChime) {
            window.playWaterSplashChime();
          }
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
    if (activeLabel) activeLabel.textContent = 'Hazır: Sükunete adım at';
    if (window.lucide) lucide.createIcons();
  }

  startBtn.addEventListener('click', startTimer);
  if (resetBtn) resetBtn.addEventListener('click', resetTimer);

  // Zen Modu Kontrolü
  if (zenBtn) {
    zenBtn.addEventListener('click', () => {
      document.body.classList.toggle('zen-mode-active');
      const isZen = document.body.classList.contains('zen-mode-active');
      if (isZen) {
        showToast('Zen Modu: Tüm dikkat dağıtıcılar gizlendi. Çıkmak için tekrar basın.', 'maximize-2');
        zenBtn.innerHTML = '<i data-lucide="minimize-2" class="w-4 h-4"></i> Normal Mod';
      } else {
        showToast('Zen Modundan çıkıldı', 'minimize-2');
        zenBtn.innerHTML = '<i data-lucide="maximize-2" class="w-4 h-4"></i> Zen Modu';
      }
      if (window.lucide) lucide.createIcons();
    });
  }

  // Odak & Nefes Tabları
  if (tabFocus && tabBreath && focusPanel && breathPanel) {
    tabFocus.addEventListener('click', () => {
      tabFocus.classList.add('bg-gold-500', 'text-ocean-950', 'shadow');
      tabFocus.classList.remove('bg-ocean-800', 'text-slate-300');
      tabBreath.classList.add('bg-ocean-800', 'text-slate-300');
      tabBreath.classList.remove('bg-gold-500', 'text-ocean-950', 'shadow');

      focusPanel.classList.remove('hidden');
      breathPanel.classList.add('hidden');
    });

    tabBreath.addEventListener('click', () => {
      tabBreath.classList.add('bg-gold-500', 'text-ocean-950', 'shadow');
      tabBreath.classList.remove('bg-ocean-800', 'text-slate-300');
      tabFocus.classList.add('bg-ocean-800', 'text-slate-300');
      tabFocus.classList.remove('bg-gold-500', 'text-ocean-950', 'shadow');

      breathPanel.classList.remove('hidden');
      focusPanel.classList.add('hidden');
    });
  }

  window.toggleFocusTimer = () => {
    if (startBtn) startBtn.click();
  };
}

/* ==========================================================================
   7. ÇOK MODLU NEFES REHBERİ (4-7-8, KUTU, REZONANS)
   ========================================================================== */
function initBreathingExercise() {
  const circle = document.getElementById('breathCircle');
  const phaseText = document.getElementById('breathPhaseText');
  const counterText = document.getElementById('breathTimerCounter');
  const startBtn = document.getElementById('startBreathBtn');
  const stopBtn = document.getElementById('stopBreathBtn');
  const patternSelect = document.getElementById('breathPatternSelect');

  if (!circle || !startBtn) return;

  let breathInterval = null;
  let isBreathing = false;
  let currentPattern = '478';

  const patterns = {
    '478': {
      name: 'Sükun Nefesi (4-7-8)',
      cssClass: 'breath-478',
      phases: [
        { name: 'Nefes Al', dur: 4 },
        { name: 'Tut', dur: 7 },
        { name: 'Yavaşça Ver', dur: 8 }
      ]
    },
    'box': {
      name: 'Kutu Nefesi (4-4-4-4)',
      cssClass: 'breath-box',
      phases: [
        { name: 'Nefes Al', dur: 4 },
        { name: 'Nefesi Tut', dur: 4 },
        { name: 'Nefes Ver', dur: 4 },
        { name: 'Boşlukta Kal', dur: 4 }
      ]
    },
    'resonance': {
      name: 'Rezonans Nefesi (5-5)',
      cssClass: 'breath-resonance',
      phases: [
        { name: 'Nefes Al', dur: 5 },
        { name: 'Nefes Ver', dur: 5 }
      ]
    }
  };

  function startBreathing() {
    if (isBreathing) return;
    isBreathing = true;

    const p = patterns[currentPattern];
    circle.classList.remove('breath-478', 'breath-box', 'breath-resonance');
    circle.classList.add(p.cssClass);

    let phaseIndex = 0;
    let secInPhase = 0;

    function runPhase() {
      const cur = p.phases[phaseIndex];
      if (phaseText) phaseText.textContent = cur.name;
      if (counterText) counterText.textContent = `${cur.dur - secInPhase}s`;

      if (window.playWaterSplashChime && secInPhase === 0) {
        window.playWaterSplashChime();
      }

      secInPhase++;
      if (secInPhase >= cur.dur) {
        secInPhase = 0;
        phaseIndex = (phaseIndex + 1) % p.phases.length;
      }
    }

    runPhase();
    breathInterval = setInterval(runPhase, 1000);
    showToast(`Nefes egzersizi başladı: ${p.name}`, 'wind');
  }

  function stopBreathing() {
    clearInterval(breathInterval);
    isBreathing = false;
    circle.classList.remove('breath-478', 'breath-box', 'breath-resonance');
    if (phaseText) phaseText.textContent = 'Başla';
    if (counterText) counterText.textContent = '--';
    showToast('Nefes egzersizi durduruldu', 'wind');
  }

  startBtn.addEventListener('click', startBreathing);
  if (stopBtn) stopBtn.addEventListener('click', stopBreathing);

  if (patternSelect) {
    patternSelect.addEventListener('change', e => {
      currentPattern = e.target.value;
      if (isBreathing) {
        stopBreathing();
        startBreathing();
      }
    });
  }
}

/* ==========================================================================
   8. HİKMET SANDIĞI & KART ÜRETİCİSİ (CANVAS 1080x1080 HD)
   ========================================================================== */
function initQuotesAndCards() {
  const container = document.getElementById('quotesGrid');
  const filterBtns = document.querySelectorAll('.quote-filter-btn');
  const searchInput = document.getElementById('quoteSearchInput');
  const exportCanvas = document.getElementById('exportCardCanvas');

  let quotesData = [];
  let currentFilter = 'all';
  let searchQuery = '';
  let favorites = JSON.parse(localStorage.getItem('derya_favorites') || '[]');

  function saveFavorites() {
    localStorage.setItem('derya_favorites', JSON.stringify(favorites));
  }

  fetch('./data/quotes.json')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        quotesData = data;
        renderCards();
      }
    })
    .catch(() => {
      // Yerel dosya sistemi (file://) ise temel veriyle render et
      quotesData = [
        { id: 1, text: 'Ehl-i dalâletin ve gafletin tahkiriyle sarsılma. Bir divane çamur atsa, derya bulanmaz.', author: 'Risale-i Nur Külliyatı', tag: 'derya', theme: 'Metanet & Sarsılmazlık' },
        { id: 2, text: 'Amelinizde rıza-yı İlâhî olmalı. Eğer O razı olsa, bütün dünya küsse ehemmiyeti yok.', author: 'Bediüzzaman Said Nursî', tag: 'ihlas', theme: 'İhlas & Hürriyet' },
        { id: 3, text: 'İnsanın en büyük zindanı, kendi içinde inşa ettiği amaçsızlıktır.', author: 'Carl Gustav Jung', tag: 'felsefe', theme: 'İçsel Boşluk & Gölge' },
        { id: 4, text: 'Başkalarının hayatıyla aşırı ilgilenenler, kendi hayatlarındaki dayanılmaz boşluktan kaçanlardır.', author: 'Arthur Schopenhauer', tag: 'felsefe', theme: 'Kesret Kaosu' },
        { id: 5, text: 'Kötülüğe karşı verilecek en iyi cevap, onlara benzememektir.', author: 'Marcus Aurelius', tag: 'stoa', theme: 'Merhamet Makamı' }
      ];
      renderCards();
    });

  function renderCards() {
    if (!container) return;
    container.innerHTML = '';

    let filtered = quotesData;

    if (currentFilter === 'fav') {
      filtered = filtered.filter(q => favorites.includes(q.id));
    } else if (currentFilter !== 'all') {
      filtered = filtered.filter(q => q.tag === currentFilter);
    }

    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        q =>
          q.text.toLowerCase().includes(qLower) ||
          q.author.toLowerCase().includes(qLower) ||
          q.theme.toLowerCase().includes(qLower)
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-500">
          <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
          <p>Kriterlere uygun hikmet aforizması bulunamadı.</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    filtered.forEach(quote => {
      const isFav = favorites.includes(quote.id);
      const card = document.createElement('div');
      card.className = 'glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-gold-500/40 transition-all group';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span class="px-2 py-0.5 rounded bg-ocean-800 font-mono text-gold-300/90 text-[11px]">${quote.theme}</span>
            <button class="fav-quote-btn text-slate-500 hover:text-gold-400 transition-colors p-1" data-id="${quote.id}" title="${isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}">
              <i data-lucide="star" class="w-4 h-4 ${isFav ? 'fill-gold-400 text-gold-400' : ''}"></i>
            </button>
          </div>
          <p class="font-serif-reading text-slate-200 text-base leading-relaxed mb-4 italic">
            "${quote.text}"
          </p>
        </div>
        <div class="border-t border-ocean-800 pt-3 flex items-center justify-between">
          <span class="text-xs font-semibold text-gold-400 font-sans">— ${quote.author}</span>
          <div class="flex items-center gap-1">
            <button class="copy-quote-btn p-1.5 rounded-lg hover:bg-ocean-800 text-slate-400 hover:text-sky-400 transition-colors" title="Metni Kopyala" data-id="${quote.id}">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            </button>
            <button class="download-card-btn p-1.5 rounded-lg hover:bg-ocean-800 text-slate-400 hover:text-gold-400 transition-colors" title="HD Görsel Kart İndir (1080x1080)" data-id="${quote.id}">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();

    // Kart İndirme
    document.querySelectorAll('.download-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        const item = quotesData.find(q => q.id === id);
        if (item) generateAndDownloadCard(item);
      });
    });

    // Metin Kopyalama
    document.querySelectorAll('.copy-quote-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        const item = quotesData.find(q => q.id === id);
        if (item) {
          navigator.clipboard.writeText(`"${item.text}"\n— ${item.author} [${item.theme}]`).then(() => {
            showToast('Hikmet sözü panoya kopyalandı', 'copy');
          });
        }
      });
    });

    // Favorileme
    document.querySelectorAll('.fav-quote-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        if (favorites.includes(id)) {
          favorites = favorites.filter(f => f !== id);
          showToast('Favorilerden kaldırıldı', 'star-off');
        } else {
          favorites.push(id);
          showToast('Favorilere eklendi', 'star');
        }
        saveFavorites();
        renderCards();
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
      currentFilter = btn.dataset.filter;
      renderCards();
    });
  });

  // Arama Girişi
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value;
      renderCards();
    });
  }

  // Canvas ile 1080x1080 HD Sosyal Medya Kartı
  function generateAndDownloadCard(item) {
    if (!exportCanvas) return;
    const ctx = exportCanvas.getContext('2d');
    const size = 1080;
    exportCanvas.width = size;
    exportCanvas.height = size;

    const bgGrad = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, size / 1.2);
    bgGrad.addColorStop(0, '#0c172a');
    bgGrad.addColorStop(0.7, '#070d18');
    bgGrad.addColorStop(1, '#030712');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // Altın Çerçeve
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

    // Alıntı Metni
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

    const startY = size / 2 - ((lines.length - 1) * lineHeight) / 2 - 20;
    for (let j = 0; j < lines.length; j++) {
      ctx.fillText(lines[j], size / 2, startY + j * lineHeight);
    }

    // Yazar
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#e2b168';
    ctx.fillText(`— ${item.author}`, size / 2, startY + lines.length * lineHeight + 60);

    // Tema
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`[ ${item.theme} ]`, size / 2, startY + lines.length * lineHeight + 100);

    // Filigran
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('derya-bulanmaz.org  •  github.com/bahattinyunus/Derya-Bulanmaz', size / 2, size - 85);

    const image = exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `derya-bulanmaz-${item.id}.png`;
    link.href = image;
    link.click();
    showToast('HD Kart başarıyla indirildi', 'image');
  }
}

/* ==========================================================================
   9. MÜSBET ESER GÜNLÜĞÜ (LOCALSTORAGE DESTEKLİ TEFEKKÜR KAYDI & YEDEKLEME)
   ========================================================================== */
function initJournal() {
  const saveBtn = document.getElementById('saveJournalBtn');
  const exportMdBtn = document.getElementById('exportJournalMdBtn');
  const exportJsonBtn = document.getElementById('exportJournalJsonBtn');
  const importJsonBtn = document.getElementById('importJournalJsonBtn');
  const clearBtn = document.getElementById('clearJournalBtn');
  const list = document.getElementById('journalEntriesList');

  const inputNoise = document.getElementById('journalNoise');
  const inputWork = document.getElementById('journalWork');
  const inputMercy = document.getElementById('journalMercy');
  const tagSelect = document.getElementById('journalTagSelect');

  const STORAGE_KEY = 'derya_journal_entries';
  let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function renderEntries() {
    if (!list) return;
    list.innerHTML = '';

    if (entries.length === 0) {
      list.innerHTML = '<p class="text-xs text-slate-500 italic">Henüz bir kayıt bulunmuyor. İlk tefekkürünüzü yukarıdan kaydedin.</p>';
      return;
    }

    entries.slice().reverse().forEach(entry => {
      const item = document.createElement('div');
      item.className = 'p-3.5 rounded-xl bg-ocean-950/70 border border-ocean-800 text-xs space-y-1.5 relative group';
      item.innerHTML = `
        <div class="flex items-center justify-between text-slate-400">
          <span class="font-mono text-[11px] text-gold-400">${entry.date}</span>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-ocean-800 text-[10px] text-slate-300 font-mono">#${entry.tag || 'Tefekkür'}</span>
            <button class="delete-entry-btn opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-0.5" data-id="${entry.id}">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
        ${entry.noise ? `<p><b class="text-sky-300">Gürültü:</b> ${entry.noise}</p>` : ''}
        ${entry.work ? `<p><b class="text-gold-300">İnşa Edilen Eser:</b> ${entry.work}</p>` : ''}
        ${entry.mercy ? `<p><b class="text-emerald-300">Merhamet:</b> ${entry.mercy}</p>` : ''}
      `;
      list.appendChild(item);
    });

    if (window.lucide) lucide.createIcons();

    document.querySelectorAll('.delete-entry-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        if (confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
          entries = entries.filter(e => e.id !== id);
          saveToStorage();
          renderEntries();
          showToast('Kayıt silindi', 'trash-2');
        }
      });
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const noise = inputNoise ? inputNoise.value.trim() : '';
      const work = inputWork ? inputWork.value.trim() : '';
      const mercy = inputMercy ? inputMercy.value.trim() : '';
      const tag = tagSelect ? tagSelect.value : 'Tefekkür';

      if (!noise && !work && !mercy) {
        alert('Lütfen en az bir alanı doldurunuz.');
        return;
      }

      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        noise,
        work,
        mercy,
        tag
      };

      entries.push(newEntry);
      saveToStorage();
      renderEntries();

      if (inputNoise) inputNoise.value = '';
      if (inputWork) inputWork.value = '';
      if (inputMercy) inputMercy.value = '';

      showToast('Günün tefekkür kaydı kaydedildi!', 'check');
    });
  }

  // Markdown İndirme
  if (exportMdBtn) {
    exportMdBtn.addEventListener('click', () => {
      if (entries.length === 0) {
        alert('İndirilecek kayıt bulunmuyor.');
        return;
      }
      let md = `# 🌊 Derya Bulanmaz - Müsbet Eser Günlüğü\n*Oluşturulma: ${new Date().toLocaleString('tr-TR')}*\n\n---\n\n`;
      entries.forEach(e => {
        md += `### 📅 ${e.date}  [#${e.tag || 'Tefekkür'}]\n`;
        if (e.noise) md += `- **Duyulmayan Gürültü:** ${e.noise}\n`;
        if (e.work) md += `- **İnşa Edilen Eser:** ${e.work}\n`;
        if (e.mercy) md += `- **Merhamet Makamı:** ${e.mercy}\n`;
        md += `\n---\n\n`;
      });

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `derya-gunluk-${Date.now()}.md`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Günlük Markdown formatında indirildi', 'file-text');
    });
  }

  // JSON Yedek İndirme
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      if (entries.length === 0) {
        alert('Yedeklenecek kayıt bulunmuyor.');
        return;
      }
      const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `derya-gunluk-yedek-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('JSON yedeği indirildi', 'download');
    });
  }

  // JSON Yedek Yükleme
  if (importJsonBtn) {
    importJsonBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          try {
            const data = JSON.parse(ev.target.result);
            if (Array.isArray(data)) {
              entries = data;
              saveToStorage();
              renderEntries();
              showToast(`Yedek başarıyla yüklendi (${data.length} kayıt)`, 'check');
            } else {
              alert('Geçersiz JSON formatı.');
            }
          } catch (err) {
            alert('Dosya okunamadı: ' + err.message);
          }
        };
        reader.readAsText(file);
      };
      input.click();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Tüm günlük kayıtlarını silmek istediğinize emin misiniz?')) {
        entries = [];
        saveToStorage();
        renderEntries();
        showToast('Günlük temizlendi', 'trash');
      }
    });
  }

  renderEntries();
}

/* ==========================================================================
   10. İHLAS & METANET SKALASI (10 SORULUK DETAYLI TEŞHİS)
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
      q: '1. Bir eserinizi veya fikrinizi paylaştığınızda gelen ilk eleştiri veya alayda kalbinizin ilk refleksi nedir?',
      options: [
        { text: 'Hemen öfkelenir, savunmaya geçer veya laf yetiştiririm.', score: 0 },
        { text: 'İçim sıkılır, biraz canım yanar ama yine de susmaya çalışırım.', score: 2 },
        { text: 'Tebessüm ederim; "bir divane çamur attı" der, işime devam ederim.', score: 4 }
      ]
    },
    {
      q: '2. Çevrenizden büyük bir iltifat, beğeni ve alkış aldığınızda kalbinizin durumu nedir?',
      options: [
        { text: 'Kendimi üstün hisseder, başkalarının takdirine bağımlı hale gelirim.', score: 0 },
        { text: 'Hoşuma gider ama çok şımarmamaya dikkat ederim.', score: 2 },
        { text: 'Övgü ile yergiyi eşitlerim; "Ben hakikat için yaptım" derim.', score: 4 }
      ]
    },
    {
      q: '3. Hiçbir takdir, para veya unvan almayacağınızı bilseniz bile o eseri inşa eder miydiniz?',
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
    },
    {
      q: '6. Emek verip geliştirdiğiniz bir fikir başkası tarafından taklit edildiğinde ne hissedersiniz?',
      options: [
        { text: 'Çılgına döner, onu herkese ifşa etmeye çalışırım.', score: 0 },
        { text: 'Hakkımın yenmesine üzülürüm ama bir süre sonra geçer.', score: 2 },
        { text: 'Gülümserim; "kaynak bende oldukça taklit eden tükenir" der, Sürüm 2\'yi yazarım.', score: 4 }
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
            opt => `
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
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (totalScore >= 20) {
      title.textContent = '🌊 Derya-yı Bî-Pâyan (Sarsılmaz Okyanus)';
      desc.textContent =
        'Tebrikler! Kalbiniz kesretin ve kalabalıkların dedikodusundan sıyrılmış. Övgü ve yergiyi eşitlemiş, ihlas zırhını kuşanmışsınız. Eserinizi sessizlikte inşa etmeye devam edin; atılan hiçbir çamur sizin suyunuzu bulandıramaz.';
      badge.textContent = 'Sarsılmazlık Seviyesi: %90+';
      badge.className = 'inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500 text-ocean-950';
    } else if (totalScore >= 12) {
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
   11. KLAVYE KISAYOLLARI MODAL'I & DİNLENMESİ
   ========================================================================== */
function initKeyboardShortcuts() {
  const modal = document.getElementById('shortcutsModal');
  const openBtn = document.getElementById('shortcutsModalBtn');
  const closeBtn = document.getElementById('closeShortcutsModalBtn');

  function toggleModal() {
    if (!modal) return;
    modal.classList.toggle('hidden');
  }

  if (openBtn) openBtn.addEventListener('click', toggleModal);
  if (closeBtn) closeBtn.addEventListener('click', toggleModal);
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) toggleModal();
    });
  }

  window.addEventListener('keydown', e => {
    // Input içindeyse kısayolları engelle
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

    if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
      toggleModal();
    } else if (e.key.toLowerCase() === 'm') {
      if (window.toggleAudioMute) window.toggleAudioMute();
    } else if (e.key.toLowerCase() === 't') {
      if (window.toggleNextTheme) window.toggleNextTheme();
    } else if (e.code === 'Space') {
      e.preventDefault();
      if (window.toggleFocusTimer) window.toggleFocusTimer();
    } else if (e.key.toLowerCase() === 'z') {
      const zenBtn = document.getElementById('zenModeBtn');
      if (zenBtn) zenBtn.click();
    }
  });
}

/* ==========================================================================
   12. MOBİL MENÜ KONTROLÜ
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
      });
    });
  }
}

/* ==========================================================================
   13. SERVICE WORKER KAYDI (PWA / ÇEVRİMDIŞI)
   ========================================================================== */
function initServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then(reg => {
          console.log('Derya Bulanmaz SW devrede:', reg.scope);
        })
        .catch(err => {
          console.warn('SW kaydı başarısız:', err);
        });
    });
  }
}
