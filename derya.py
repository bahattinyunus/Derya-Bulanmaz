#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DERYA BULANMAZ - Python CLI & Yerel Sunucu
"Kesretin Gürültüsünden Vahdetin İnşasına"
"""

import sys
import os
import json
import random
import time
import http.server
import socketserver
import webbrowser

# Windows konsolunda UTF-8 desteği sağla
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
QUOTES_FILE = os.path.join(DATA_DIR, 'quotes.json')
MANIFESTO_FILE = os.path.join(DATA_DIR, 'manifesto.json')

GOLD = '\033[93m'
SKY = '\033[94m'
EMERALD = '\033[92m'
SLATE = '\033[90m'
BOLD = '\033[1m'
RESET = '\033[0m'
ITALIC = '\033[3m'

def print_banner():
    print(f"\n{GOLD}{BOLD}" + "═" * 68 + f"{RESET}")
    print(f"  🌊  {BOLD}D E R Y A   B U L A N M A Z{RESET}")
    print(f"      {SKY}Kesretin Gürültüsünden Vahdetin İnşasına{RESET}")
    print(f"      {ITALIC}{SLATE}\"Bir divane çamur atsa, derya bulanmaz.\" — Risale-i Nur{RESET}")
    print(f"{GOLD}{BOLD}" + "═" * 68 + f"{RESET}\n")

def get_random_quote():
    if not os.path.exists(QUOTES_FILE):
        print("quotes.json dosyası bulunamadı.")
        return
    with open(QUOTES_FILE, 'r', encoding='utf-8') as f:
        quotes = json.load(f)
    q = random.choice(quotes)
    print_banner()
    print(f"{SKY}[{q.get('theme', 'Hikmet')}]{RESET}\n")
    print(f"{BOLD}“{q['text']}”{RESET}\n")
    print(f"  {GOLD}— {q['author']}{RESET}\n")

def read_manifesto():
    if not os.path.exists(MANIFESTO_FILE):
        print("manifesto.json dosyası bulunamadı.")
        return
    with open(MANIFESTO_FILE, 'r', encoding='utf-8') as f:
        m = json.load(f)
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

def run_focus(mins=25):
    try:
        total_sec = int(mins) * 60
    except ValueError:
        total_sec = 25 * 60

    print_banner()
    print(f"{EMERALD}{BOLD}Derya Sessizliği Başladı ({total_sec // 60} dakika){RESET}")
    print(f"{SLATE}\"Arı inler bal içinde...\" Dış dünyayı susturun ve eserinizi inşa edin.{RESET}")
    print(f"{SLATE}(Durdurmak için Ctrl+C){RESET}\n")

    try:
        while total_sec >= 0:
            m, s = divmod(total_sec, 60)
            sys.stdout.write(f"\r  {GOLD}⏳ Kalan Süre: {m:02d}:{s:02d}{RESET}  ")
            sys.stdout.flush()
            time.sleep(1)
            total_sec -= 1
        print(f"\n\n{EMERALD}{BOLD}✨ Oturum Tamamlandı! Hakikat adına bir taş yerine kondu.{RESET}\n")
    except KeyboardInterrupt:
        print(f"\n\n{SLATE}Odak seansı sonlandırıldı.{RESET}\n")

def serve_web(port=3000):
    root_dir = os.path.dirname(os.path.abspath(__file__))
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
    print("  python derya.py [komut]\n")
    print(f"{BOLD}Komutlar:{RESET}")
    print(f"  {GOLD}quote{RESET}           Rastgele bir hikmet & hakikat aforizması getirir")
    print(f"  {GOLD}manifesto{RESET}       Manifestonun tam metnini terminalde okutur")
    print(f"  {GOLD}focus [dakika]{RESET}  Derya derin odak sayacı başlatır (Varsayılan: 25)")
    print(f"  {GOLD}serve [port]{RESET}    Yerel web arayüzünü tarayıcıda sunar (Varsayılan: 3000)")
    print(f"  {GOLD}help{RESET}            Bu yardım kılavuzunu görüntüler\n")

if __name__ == '__main__':
    args = sys.argv[1:]
    cmd = args[0].lower() if args else 'help'

    if cmd in ('quote', 'soz', 'hikmet'):
        get_random_quote()
    elif cmd in ('manifesto', 'oku'):
        read_manifesto()
    elif cmd in ('focus', 'odak'):
        mins = args[1] if len(args) > 1 else 25
        run_focus(mins)
    elif cmd in ('serve', 'sunucu', 'web'):
        port = int(args[1]) if len(args) > 1 else 3000
        serve_web(port)
    else:
        show_help()
