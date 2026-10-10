# Catture del simulatore per le figure della lezione.
# Uso: python strumenti/shots.py            -> tutte le figure
#      python strumenti/shots.py f9_prove   -> salva solo le figure nominate (la sequenza gira comunque intera)
import sys, time
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
URL=(ROOT/'dist'/'potenziale-cariche.html').as_uri()     # prima: make simulatore
FIG=str(ROOT/'figure')+'/'
SOLO=set(sys.argv[1:])
def shot(loc, name):
    if not SOLO or name in SOLO: loc.screenshot(path=FIG+name+'.png'); print('salvata', name)
def plot_xy(pg, x, y):
    b=pg.locator('#top').bounding_box(); w,h=b['width'],b['height']
    ml,mr,mt,mb=44,88,30,36; P=max(60,min(w-ml-mr,h-mt-mb)); x0=ml+max(0,(w-ml-mr-P)/2); y0=mt+max(0,(h-mt-mb-P)/2)
    return b['x']+x0+(x+10)/20*P, b['y']+y0+(10-y)/20*P
with sync_playwright() as p:
    br=p.chromium.launch()
    pg=br.new_page(viewport={'width':1500,'height':860}, device_scale_factor=2); pg.goto(URL); pg.wait_for_timeout(700)
    shot(pg, 'f0_interfaccia')
    # 1 carica singola con sonda a 2 cm
    pg.click('#presets button[data-p=singola]'); pg.wait_for_timeout(300)
    pg.mouse.move(*plot_xy(pg,2,0)); pg.wait_for_timeout(300)
    shot(pg.locator('.views'), 'f1_singola')
    # 2 dipolo
    pg.click('#presets button[data-p=dipolo]'); pg.mouse.move(*plot_xy(pg,-1.5,4)); pg.wait_for_timeout(400)
    shot(pg.locator('.views'), 'f2_dipolo')
    # 3 linee di campo (solo 2D)
    pg.mouse.move(5,5); pg.click('#fieldSeg button[data-v=lines]'); pg.wait_for_timeout(400)
    shot(pg.locator('#view2d'), 'f3_linee')
    pg.click('#fieldSeg button[data-v=none]')
    # 4 partenza da ferma
    pg.click('.tabs button[data-tab="2"]'); pg.click('#tpresets2 button[data-t=ferma]'); pg.wait_for_timeout(2600)
    shot(pg.locator('#view2d'), 'f4_ferma')
    # 5 ellittiche e rutherford
    pg.click('#tpresets2 button[data-t=ellittiche]'); pg.wait_for_timeout(7000)
    shot(pg.locator('#view2d'), 'f5_ellittiche')
    pg.click('#tpresets2 button[data-t=rutherford]'); pg.wait_for_timeout(4000)
    shot(pg.locator('#view2d'), 'f5_rutherford')
    # 6 orbita circolare nello spazio delle fasi
    pg.click('#tpresets2 button[data-t=circolare]'); pg.click('#rightSeg button[data-v=phase]'); pg.wait_for_timeout(6000)
    shot(pg.locator('.views'), 'f6_circolare_fasi')
    # 7 punto fisso e ciclo limite
    pg.click('.tabs button[data-tab="3"]')
    pg.click('#tab3 .try[data-s=puntofisso]'); pg.wait_for_timeout(9000)
    shot(pg.locator('.views'), 'f7_puntofisso')
    pg.click('#tab3 .try[data-s=ciclo]'); pg.wait_for_timeout(12000)
    shot(pg.locator('.views'), 'f7_ciclo')
    # 8 biliardo e attrattore
    pg.click('#tab3 .try[data-s=caos]'); pg.wait_for_timeout(14000)
    print('caos t', pg.inner_text('#simTime'))
    shot(pg.locator('.views'), 'f8_biliardo')
    pg.click('#tab3 .try[data-s=attrattore]'); pg.wait_for_timeout(45000)
    print('attr t', pg.inner_text('#simTime'))
    shot(pg.locator('.views'), 'f8_attrattore')
    # 9 prove a mano sui punti sfida (prima della mappa): ogni partenza si colora come la carica su cui finisce
    pg.click('#tab3 .try[data-s=bacini]'); pg.click('#speedSeg button[data-v="4"]')
    for n in range(9): pg.click(f'#chalList li[data-n="{n}"] button[data-a=go]')
    pg.wait_for_timeout(5000)
    shot(pg.locator('#view2d'), 'f9_prove')
    # 9 bacini, risoluzione fine
    pg.click('#tab3 .try[data-s=bacini]')
    pg.click('#basinRes button[data-v="150"]'); pg.click('#basinGo')
    t0=time.time()
    while not pg.inner_text('#basinStatus').startswith('Fatto') and time.time()-t0<120: pg.wait_for_timeout(1000)
    print('bacini', round(time.time()-t0), pg.inner_text('#basinStatus'))
    shot(pg.locator('.views'), 'f9_bacini')
    br.close()
