#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DERYA BULANMAZ - Python CLI & Yerel Sunucu
"Kesretin Gürültüsünden Vahdetin İnşasına"

Zenginleştirilmiş Python Terminal Deneyimi:
- quote: Rastgele / filtreli hikmet sözü
- manifesto: Manifestonun tam metni
- shield: Gürültü kalkanı (linc, cevre, haset, kibir, ofke, daginiklik)
- matrix: Müsbet hareket matrisi & vaka çözücü
- breathe: Terminal nefes rehberi (4-7-8, kutu)
- focus: Derya derin odak sayacı
- journal: Terminal günlüğü (yaz / oku)
- stats: Portal ve irfan istatistikleri
- card: Terminal kartı
- serve: Yerel web sunucusu
"""

import sys
import os
import json
import random
import time
import http.server
import socketserver
import webbrowser
from datetime import datetime

# Windows konsolunda UTF-8 desteği sağla
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
QUOTES_FILE = os.path.join(DATA_DIR, 'quotes.json')
MANIFESTO_FILE = os.path.join(DATA_DIR, 'manifesto.json')
DILEMMAS_FILE = os.path.join(DATA_DIR, 'dilemmas.json')
JOURNAL_FILE = os.path.join(DATA_DIR, 'journal.json')

GOLD = '\033[93m'
SKY = '\033[94m'
CYAN = '\033[96m'
EMERALD = '\033[92m'
SLATE = '\033[90m'
WHITE = '\033[97m'
PURPLE = '\033[95m'
BOLD = '\033[1m'
RESET = '\033[0m'
ITALIC = '\033[3m'

def print_banner():
    print(f"\n{GOLD}{BOLD}" + "═" * 68 + f"{RESET}")
    print(f"  🌊  {BOLD}D E R Y A   B U L A N M A Z{RESET}")
    print(f"      {SKY}Kesretin Gürültüsünden Vahdetin İnşasına{RESET}")
    print(f"      {ITALIC}{SLATE}\"Bir divane çamur atsa, derya bulanmaz.\" — Risale-i Nur{RESET}")
    print(f"{GOLD}{BOLD}" + "═" * 68 + f"{RESET}\n")

def load_json(filepath):
    if not os.path.exists(filepath):
        return []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def get_random_quote(filter_arg=None):
    quotes = load_json(QUOTES_FILE)
    if not quotes:
        print("quotes.json dosyası bulunamadı.")
        return

    candidates = quotes
    if filter_arg:
        f = filter_arg.lower()
        if filter_arg.isdigit():
            candidates = [q for q in quotes if q.get('id') == int(filter_arg)]
        else:
            candidates = [
                q for q in quotes if
                f in q.get('tag', '').lower() or
                f in q.get('theme', '').lower() or
                f in q.get('author', '').lower() or
                f in q.get('text', '').lower()
            ]
        if not candidates:
            print(f"{GOLD}Filtreye uygun hikmet bulunamadı: '{filter_arg}'. Rastgele seçiliyor...{RESET}")
            candidates = quotes

    q = random.choice(candidates)
    print_banner()
    print(f"{SKY}[ #{q.get('id', '?')} • {q.get('theme', 'Hikmet')} ]{RESET}  {SLATE}(Etiket: {q.get('tag', 'genel')}){RESET}\n")
    print(f"{BOLD}“{q['text']}”{RESET}\n")
    print(f"  {GOLD}— {q['author']}{RESET}")
    if q.get('context'):
        print(f"  {SLATE}{ITALIC}Kaynak: {q['context']}{RESET}")
    print()

def print_card(id_arg=None):
    quotes = load_json(QUOTES_FILE)
    if not quotes:
        return
    if id_arg and id_arg.isdigit():
        target = next((q for q in quotes if q.get('id') == int(id_arg)), quotes[0])
    else:
        target = random.choice(quotes)

    width = 64
    border = "═" * width
    print(f"\n{GOLD}╔{border}╗{RESET}")
    print(f"{GOLD}║{RESET}  {SKY}{BOLD}D E R Y A   B U L A N M A Z{RESET}".ljust(width + 12) + f"{GOLD}║{RESET}")
    print(f"{GOLD}║{RESET}  {SLATE}Kesretin Gürültüsünden Vahdetin İnşasına{RESET}".ljust(width + 10) + f"{GOLD}║{RESET}")
    print(f"{GOLD}╠" + "─" * width + f"╣{RESET}")

    words = target['text'].split()
    line = ""
    lines = []
    for w in words:
        if len(line + " " + w) > width - 6:
            lines.append(line.strip())
            line = w + " "
        else:
            line += w + " "
    if line.strip():
        lines.append(line.strip())

    print(f"{GOLD}║{RESET}".ljust(width + 9) + f"{GOLD}║{RESET}")
    for l in lines:
        print(f"{GOLD}║{RESET}  {WHITE}{BOLD}{l}{RESET}".ljust(width + 17) + f"{GOLD}║{RESET}")
    print(f"{GOLD}║{RESET}".ljust(width + 9) + f"{GOLD}║{RESET}")

    meta = f"— {target['author']}  [{target.get('theme', '')}]"
    print(f"{GOLD}║{RESET}  {GOLD}{meta}{RESET}".ljust(width + 10) + f"{GOLD}║{RESET}")
    print(f"{GOLD}╚{border}╝{RESET}\n")

def read_manifesto():
    m = load_json(MANIFESTO_FILE)
    if not m:
        print("manifesto.json dosyası bulunamadı.")
        return
    print_banner()
    print(f"{GOLD}{BOLD}# {m['title']}{RESET}\n")
    print(f"{ITALIC}{m['motto']}{RESET}\n")
    print(f"{SLATE}" + "─" * 68 + f"{RESET}\n")

    for sec in m.get('sections', []):
        print(f"\n{SKY}{BOLD}{sec['number']}. {sec['title']}{RESET}")
        if sec.get('subtitle'):
            print(f"{SLATE}{ITALIC}{sec['subtitle']}{RESET}\n")
        for p in sec.get('paragraphs', []):
            print(f"  {p}\n")
        for sub in sec.get('subsections', []):
            print(f"  {GOLD}{sub['letter']}. {sub['title']}{RESET}")
            print(f"  {sub['text']}\n")
            if sub.get('quote'):
                print(f"    {ITALIC}\"{sub['quote']['text']}\" — {sub['quote']['author']}{RESET}\n")
        for st in sec.get('steps', []):
            print(f"  {GOLD}Aşama {st['step']}: {st['title']}{RESET}")
            print(f"  {st['text']}\n")
            for q in st.get('quotes', []):
                print(f"    {ITALIC}\"{q['text']}\" — {q['author']}{RESET}")
            print()
        for q in sec.get('quotes', []):
            print(f"  {ITALIC}“{q['text']}”{RESET} {GOLD}— {q['author']}{RESET}")
        print()

def show_shield(case_key=None):
    cases = {
        'linc': {
            'name': 'Dijital Güruh & Sosyal Medya Linci',
            'diag': 'Kitle içinde bireysel akıl kaybolur; yerini kör histeri alır. Kendi hiçliğini bastırmak için günah keçisi ararlar.',
            'shield': '"Bir divane çamur atsa, derya bulanmaz." Attıkları çamur ancak karşılık verirsen eline bulaşır.',
            'action': 'Cevap verme, savunma yapma. Bildirimleri kapat. 30 dakika kesintisiz sıradaki projene odaklan.',
            'quote': '"Kötülüğe verilecek en iyi cevap, onlara benzememektir." — Marcus Aurelius'
        },
        'cevre': {
            'name': 'Yakın Çevre Alayı ("Neden bu kadar kasıyorsun?")',
            'diag': 'Senin dik yürüyüşün, onların yatay ataletine ayna tutar. Alay, vicdan azabını bastırma savunmasıdır.',
            'shield': '"Hiçbir şey yapmayanlar, her şeyi eleştirme hakkını kendilerinde bulurlar." Onların onayıyla başlamadın.',
            'action': 'Onları ikna etmeye çalışma. Tebessüm et ve sessizce çalış. Arı bala daldığında vızıltı çıkarmaz.',
            'quote': '"Büyük beyinler fikirleri tartışır, küçük beyinler insanları." — Eleanor Roosevelt'
        },
        'haset': {
            'name': 'Yengeç Sepeti Hasedi & Paçadan Çekme',
            'diag': 'Başarın sürüdeki kuralı bozar: "Biz yapamıyorsak o da yapamamalı." Bu saldırı yükseldiğinin ispatıdır.',
            'shield': '"Senin penceren kirli ise, benim çiçeklerim sana çamur görünür." Haset sahibinin ciğerini dağlar.',
            'action': 'Hasetçiye verilecek en asil cevap daha büyük bir eser ortaya koymaktır. Atılan taşlarla kale inşa et.',
            'quote': '"Arı inler bal içinde..." — Anadolu İrfanı'
        },
        'kibir': {
            'name': 'Övgü Zehirlenmesi & Alkış Bağımlılığı',
            'diag': 'Gelen aşırı övgü kınamadan daha tehlikelidir. Zihin alkışa bağlandığı an, alkışlayanın kölesi olur.',
            'shield': '"Amelinizde rıza-yı İlâhî olmalı. O razı olsa, bütün dünya küsse ehemmiyeti yok."',
            'action': 'Hemen kendine sor: "Bunu insanların alkışı için mi yapıyorum, hakikat için mi?" Mahviyete sığın.',
            'quote': '"İnsanların seni kınaması veya övmesi kalbinde eşitlenmediyse, henüz hür değilsin." — İbn Ataullah'
        },
        'ofke': {
            'name': 'Ego Tuzağı & Nefsin Kışkırtması',
            'diag': 'Sana taş atana taş atmak seni onun çukuruna indirir. Gürültücünün arenasında hakikat konuşulmaz.',
            'shield': '"Sessizlik en güçlü çığlıktır." Sarsılmayan bir irade karşısında saldırgan kendi hiçliğinde ezilir.',
            'action': 'Klavyeden elini çek. 10 derin sükun nefesi al. Saldırganın gayesiz zindanına acı ve merhamet et.',
            'quote': '"Karanlığa sövmektense, bir mum yak." — Konfüçyüs'
        },
        'daginiklik': {
            'name': 'Kesret Kaosu & Zihin Parçalanması',
            'diag': 'Bildirimler ve anlık gündemler zihni atomlarına ayırır. Gaye-i hayal kaybolunca zihin esir olur.',
            'shield': 'Kainatın bütün dağınıklığı, hakikate adanmış tek bir saatin sükunetinde erir.',
            'action': 'Telefonu uçak moduna al. `python derya.py focus 25` komutunu çalıştır ve tek bir amele kilitlen.',
            'quote': '"İnsanın en büyük zindanı, kendi içinde inşa ettiği amaçsızlıktır." — C. G. Jung'
        }
    }

    print_banner()
    k = (case_key or '').lower()
    if not k or k not in cases:
        print(f"{BOLD}🛡️  GÜRÜLTÜ KALKANI VAKA REHBERİ{RESET}\n")
        print("Lütfen zırh kuşanmak istediğiniz durumu belirtin:")
        for key, val in cases.items():
            print(f"  {GOLD}python derya.py shield {key}{RESET}  →  {val['name']}")
        print(f"\n{SLATE}Örnek: python derya.py shield linc{RESET}\n")
        return

    c = cases[k]
    print(f"{EMERALD}{BOLD}🛡️  GÜRÜLTÜ KALKANI AKTİF: {c['name']}{RESET}\n")
    print(f"{SKY}{BOLD}1. Teşhis (Psikolojik / Sosyolojik):{RESET}")
    print(f"   {c['diag']}\n")
    print(f"{GOLD}{BOLD}2. İhlas Zırhı (Manevi Hakikat):{RESET}")
    print(f"   {c['shield']}\n")
    print(f"{CYAN}{BOLD}3. Müsbet Eylem Reçetesi:{RESET}")
    print(f"   {c['action']}\n")
    print(f"{PURPLE}{ITALIC}{c['quote']}{RESET}\n")

def show_matrix(dilemma_arg=None):
    dilemmas = load_json(DILEMMAS_FILE)
    if not dilemmas:
        print("dilemmas.json dosyası bulunamadı.")
        return

    print_banner()
    if not dilemma_arg:
        print(f"{GOLD}{BOLD}🏛️  MÜSBET HAREKET MATRİSİ & VAKA ÇÖZÜCÜ{RESET}\n")
        print("Mevcut Vaka Protokolleri:")
        for idx, d in enumerate(dilemmas):
            print(f"  {GOLD}{idx + 1}.{RESET} {WHITE}{BOLD}{d['title']}{RESET} [{SKY}{d['id']}{RESET}]")
            print(f"     {SLATE}{d['summary']}{RESET}")
        print(f"\n{EMERALD}Kullanım:{RESET} python derya.py matrix <vaka_id_veya_numara>")
        print(f"{SLATE}Örnek: python derya.py matrix linc_ve_iftira  veya  python derya.py matrix 1{RESET}\n")
        return

    target = None
    if dilemma_arg.isdigit():
        idx = int(dilemma_arg) - 1
        if 0 <= idx < len(dilemmas):
            target = dilemmas[idx]
    else:
        arg_lower = dilemma_arg.lower()
        target = next((d for d in dilemmas if arg_lower in d['id'].lower()), None)

    if not target:
        print(f"Geçersiz vaka. Seçenekler için: python derya.py matrix")
        return

    print(f"{GOLD}{BOLD}" + "═" * 68 + f"{RESET}")
    print(f"  {WHITE}{BOLD}{target['title'].upper()}{RESET}")
    print(f"  {SKY}Kategori: {target.get('category')}  |  Karakter: {target.get('badge')}{RESET}")
    print(f"{GOLD}{BOLD}" + "═" * 68 + f"{RESET}\n")

    print(f"{SLATE}{ITALIC}\"{target['summary']}\"{RESET}\n")
    print(f"{SKY}{BOLD}▶ 0. Evrensel Teşhis:{RESET}\n  {target['diagnostic']}\n")
    print(f"{PURPLE}{BOLD}▶ 1. Enfüs Aynası:{RESET}\n  {target['enfus_mirror']}\n")
    print(f"{GOLD}{BOLD}▶ 2. Lisan-ı Hal Kalkanı:{RESET}\n  {target['lisan_i_hal']}\n")
    print(f"{EMERALD}{BOLD}▶ 3. Eserin İnşası:{RESET}\n  {target['eser_insasi']}\n")
    print(f"{CYAN}{BOLD}▶ 4. Merhamet Makamı:{RESET}\n  {target['merhamet_makami']}\n")

    print(f"{GOLD}{BOLD}✓ Hemen Şimdi Yapılacak Somut Eylemler:{RESET}")
    for i, act in enumerate(target.get('action_checklist', [])):
        print(f"  [{i + 1}] {act}")

    pq = target.get('prescribed_quote')
    if pq:
        print(f"\n{SLATE}" + "─" * 68 + f"{RESET}")
        print(f"{ITALIC}“{pq['text']}”{RESET}\n  {GOLD}— {pq['author']}{RESET}\n")

def run_breathing(type_arg='478'):
    print_banner()
    t = type_arg.lower()
    if t in ('kutu', 'box', '4444'):
        name = "Kutu Nefesi (Stoic Box 4-4-4-4) — Sarsılmaz Odak"
        phases = [
            ("Nefes Al...", 4, "▲"),
            ("Nefesi Tut...", 4, "■"),
            ("Nefes Ver...", 4, "▼"),
            ("Boşlukta Kal...", 4, "○")
        ]
    elif t in ('denge', '55'):
        name = "Rezonans Nefesi (5-5) — Kalp & Zihin Dengesi"
        phases = [
            ("Derin Nefes Al...", 5, "▲"),
            ("Yavaşça Ver...", 5, "▼")
        ]
    else:
        name = "Sükun Nefesi (4-7-8) — Parasempatik Sinir Sistemi"
        phases = [
            ("4 sn: Nefes Al...", 4, "▲"),
            ("7 sn: Nefesi Tut...", 7, "■"),
            ("8 sn: Sakince Ver...", 8, "▼")
        ]

    print(f"{EMERALD}{BOLD}🌬️  {name}{RESET}")
    print(f"{SLATE}\"Nefes aldıkça deryanın derinliğini, nefes verdikçe dünyanın gürültüsünü bırakın.\"{RESET}")
    print(f"{SLATE}(Durdurmak için Ctrl+C tuşlarına basın)\n{RESET}")

    cycle = 1
    try:
        while True:
            for text, dur, char in phases:
                for s in range(1, dur + 1):
                    bar = (char * int((s / dur) * 20)).ljust(20, '·')
                    sys.stdout.write(f"\r  {GOLD}[Tur {cycle}]{RESET} {CYAN}{text}{RESET} [{EMERALD}{bar}{RESET}] {s}/{dur} sn  ")
                    sys.stdout.flush()
                    time.sleep(1)
            print(f"\n  {SLATE}✓ Bir döngü tamamlandı. Zihin duruluyor...{RESET}")
            cycle += 1
    except KeyboardInterrupt:
        print(f"\n\n{GOLD}✨ Nefes seansı tamamlandı. Derya gibi sakin kalın.{RESET}\n")

def run_focus(mins=25):
    try:
        total_sec = int(mins) * 60
    except ValueError:
        total_sec = 25 * 60
    initial_sec = total_sec

    print_banner()
    print(f"{EMERALD}{BOLD}🌊 Derya Sessizliği Başladı ({total_sec // 60} dakika){RESET}")
    print(f"{SLATE}\"Arı inler bal içinde...\" Dış dünyayı susturun ve eserinizi inşa edin.{RESET}")
    print(f"{SLATE}(Durdurmak için Ctrl+C){RESET}\n")

    try:
        while total_sec >= 0:
            m, s = divmod(total_sec, 60)
            elapsed = initial_sec - total_sec
            pct = int((elapsed / initial_sec) * 100) if initial_sec > 0 else 100
            bar = ("█" * int((elapsed / initial_sec) * 20)).ljust(20, '░')
            sys.stdout.write(f"\r  {GOLD}⏳ Kalan Süre: {m:02d}:{s:02d}{RESET} [{SKY}{bar}{RESET}] {pct}%  ")
            sys.stdout.flush()
            time.sleep(1)
            total_sec -= 1
        print(f"\n\n{EMERALD}{BOLD}✨ Oturum Tamamlandı! Hakikat adına bir taş yerine kondu.{RESET}\n")
    except KeyboardInterrupt:
        print(f"\n\n{SLATE}Odak seansı sonlandırıldı.{RESET}\n")

def handle_journal(subcmd='oku'):
    entries = load_json(JOURNAL_FILE)
    print_banner()

    if subcmd in ('oku', 'list', 'read'):
        print(f"{GOLD}{BOLD}📖  MÜSBET TEFEKKÜR GÜNLÜĞÜ ({len(entries)} Kayıt){RESET}\n")
        if not entries:
            print("Henüz kaydedilmiş bir tefekkür bulunmuyor.")
            print("Yeni kayıt: python derya.py journal yaz\n")
            return
        for e in reversed(entries[-5:]):
            print(f"{SKY}── [{e.get('date')}] #{e.get('tag', 'Tefekkür')} ────────────────────────{RESET}")
            print(f"  {BOLD}Gürültü:{RESET} {e.get('noise')}")
            print(f"  {EMERALD}İnşa Eseri:{RESET} {e.get('work')}")
            print(f"  {GOLD}Merhamet:{RESET} {e.get('mercy')}\n")
        return

    print(f"{GOLD}{BOLD}✍️  YENİ TEFEKKÜR KAYDI EKLE{RESET}\n")
    try:
        noise = input("1. Bugün dışarıdan gelen hangi gürültüyü duymadın?: ").strip() or "Sükut korundu."
        work = input("2. Hakikat adına hangi eseri inşa ettin?: ").strip() or "Sabır ve niyet yenilendi."
        mercy = input("3. Sana eziyet edenlere nasıl merhamet ettin?: ").strip() or "Kin tutulmadı."
        tag = input("4. Etiket (Tefekkür, Zırh, İnşa, Şükür): ").strip() or "Tefekkür"

        new_entry = {
            'id': int(time.time() * 1000),
            'date': datetime.now().strftime("%d.%m.%Y %H:%M"),
            'noise': noise,
            'work': work,
            'mercy': mercy,
            'tag': tag
        }
        entries.append(new_entry)
        with open(JOURNAL_FILE, 'w', encoding='utf-8') as f:
            json.dump(entries, f, ensure_ascii=False, indent=2)
        print(f"\n{EMERALD}{BOLD}✨ Tefekkür kaydı muvaffakiyetle kaydedildi!{RESET}\n")
    except (KeyboardInterrupt, EOFError):
        print(f"\n{SLATE}İptal edildi.{RESET}\n")

def show_stats():
    quotes = load_json(QUOTES_FILE)
    manifesto = load_json(MANIFESTO_FILE)
    dilemmas = load_json(DILEMMAS_FILE)
    journal = load_json(JOURNAL_FILE)

    print_banner()
    print(f"{GOLD}{BOLD}📊  DERYA BULANMAZ İRFANİ & TEKNİK METRİKLER{RESET}\n")
    print(f"  {SKY}✦ Toplam Hikmet Sözü:{RESET}        {BOLD}{len(quotes)}{RESET} aforizma")
    print(f"  {EMERALD}✦ Manifesto Bölüm Sayısı:{RESET}    {BOLD}{len(manifesto.get('sections', []))}{RESET} ana risale babı")
    print(f"  {PURPLE}✦ Müsbet Hareket Vakaları:{RESET}   {BOLD}{len(dilemmas)}{RESET} kritik vaka protokolü")
    print(f"  {CYAN}✦ Yerel Tefekkür Kayıtları:{RESET}  {BOLD}{len(journal)}{RESET} kaydedilmiş tefekkür")
    print(f"  {WHITE}✦ Çevreler:{RESET}                 Python 3 CLI, Node.js CLI, Modern Web Portalı\n")

def serve_web(port=3000):
    root_dir = BASE_DIR
    os.chdir(root_dir)

    handler = http.server.SimpleHTTPRequestHandler
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            print_banner()
            print(f"{EMERALD}{BOLD}Derya Bulanmaz Web Portalı Yayında!{RESET}")
            print(f"  Tarayıcı adresi: {GOLD}http://localhost:{port}{RESET}")
            print(f"{SLATE}Kapatmak için Ctrl+C tuşlarına basın.{RESET}\n")
            try:
                webbrowser.open(f"http://localhost:{port}")
            except Exception:
                pass
            httpd.serve_forever()
    except OSError:
        print(f"Port {port} meşgul, {port+1} deneniyor...")
        serve_web(port + 1)
    except KeyboardInterrupt:
        print(f"\n{SLATE}Sunucu kapatıldı.{RESET}")

def show_help():
    print_banner()
    print(f"{BOLD}Kullanım:{RESET}")
    print("  python derya.py [komut] [parametreler]\n")
    print(f"{BOLD}Temel Komutlar:{RESET}")
    print(f"  {GOLD}quote [filtre]{RESET}       Hikmet sözü getirir (ihlas, derya, stoa...)")
    print(f"  {GOLD}manifesto{RESET}            Manifestonun tam metnini okutur")
    print(f"  {GOLD}shield [vaka]{RESET}        Gürültü Kalkanı: linc, cevre, haset, kibir, ofke, daginiklik")
    print(f"  {GOLD}matrix [vaka]{RESET}        Müsbet Hareket Matrisi: 4 adımlı vaka çözümü")
    print(f"  {GOLD}breathe [ritim]{RESET}      Terminal nefes rehberi (4-7-8, kutu, denge)")
    print(f"  {GOLD}focus [dakika]{RESET}       Derya derin odak sayacı başlatır (Varsayılan: 25)")
    print(f"  {GOLD}journal [yaz|oku]{RESET}    Tefekkür günlüğüne not kaydet veya oku")
    print(f"  {GOLD}card [id]{RESET}            ASCII biçimli tefekkür kartı")
    print(f"  {GOLD}stats{RESET}                İrfani ve teknik metrikleri gösterir")
    print(f"  {GOLD}serve [port]{RESET}         Yerel web arayüzünü tarayıcıda sunar (Varsayılan: 3000)")
    print(f"  {GOLD}help{RESET}                 Bu yardım kılavuzunu görüntüler\n")

if __name__ == '__main__':
    args = sys.argv[1:]
    cmd = args[0].lower() if args else 'help'

    if cmd in ('quote', 'soz', 'hikmet'):
        get_random_quote(args[1] if len(args) > 1 else None)
    elif cmd in ('manifesto', 'oku'):
        read_manifesto()
    elif cmd in ('card', 'kart'):
        print_card(args[1] if len(args) > 1 else None)
    elif cmd in ('shield', 'kalkan', 'zirh'):
        show_shield(args[1] if len(args) > 1 else None)
    elif cmd in ('matrix', 'matris', 'cozum', 'vaka'):
        show_matrix(args[1] if len(args) > 1 else None)
    elif cmd in ('breathe', 'nefes'):
        run_breathing(args[1] if len(args) > 1 else '478')
    elif cmd in ('focus', 'odak'):
        mins = args[1] if len(args) > 1 else 25
        run_focus(mins)
    elif cmd in ('journal', 'gunluk', 'tefekkur'):
        handle_journal(args[1] if len(args) > 1 else 'oku')
    elif cmd in ('stats', 'istatistik'):
        show_stats()
    elif cmd in ('serve', 'sunucu', 'web'):
        port = int(args[1]) if len(args) > 1 else 3000
        serve_web(port)
    else:
        show_help()
