import re, io, base64, html
import markdown, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image
plt.rcParams['mathtext.fontset']='dejavuserif'

FIG='/mnt/user-data/outputs/figure/'
IMG={"L'interfaccia del laboratorio":'f0_interfaccia',"Una carica singola e la sonda":'f1_singola',
"Il dipolo in due e tre dimensioni":'f2_dipolo',"Linee di campo e isoipse del dipolo":'f3_linee',
"Traiettoria e linea di campo nel dipolo":'f4_ferma',"Orbite ellittiche e diffusione di Rutherford":'f5_orbite_rutherford',
"Orbita circolare nello spazio delle fasi":'f6_circolare_fasi',"Quattro comportamenti a lungo termine":'f6_schema_comportamenti',
"Il punto fisso":'f7_puntofisso',"Il ciclo limite":'f7_ciclo',"Il biliardo elettrico":'f8_biliardo',
"Crescita della distanza tra due traiettorie vicine":'f8_separazione',"L'attrattore strano del laboratorio":'f8_attrattore',
"La mappa dei bacini nel laboratorio":'f9_bacini_2d',"Ingrandimento di un confine tra bacini":'f9_zoom'}
CHARTS={'f6_schema_comportamenti','f8_separazione','f9_zoom'}

def img_uri(name):
    im=Image.open(FIG+name+'.png').convert('RGB')
    if im.width>1300: im=im.resize((1300,round(im.height*1300/im.width)),Image.LANCZOS)
    b=io.BytesIO()
    if name in CHARTS: im.save(b,'PNG',optimize=True); mime='image/png'
    else: im.save(b,'JPEG',quality=86,optimize=True); mime='image/jpeg'
    return f'data:{mime};base64,'+base64.b64encode(b.getvalue()).decode()

def tex_to_mathtext(t):
    t=t.replace('\\tfrac12','\\frac{1}{2}').replace('\\frac','\\dfrac')
    t=re.sub(r'\\text\{([^}]*)\}',lambda m:'\\mathrm{'+m.group(1).replace(' ','\\ ').replace('·','\\cdot ')+'}',t)
    return t
def formula_svg(tex):
    fig=plt.figure(figsize=(0.01,0.01))
    fig.text(0,0,'$'+tex_to_mathtext(tex)+'$',fontsize=17,color='#142a4c')
    b=io.StringIO(); fig.savefig(b,format='svg',bbox_inches='tight',pad_inches=0.04,transparent=True); plt.close(fig)
    svg=b.getvalue(); svg=svg[svg.find('<svg'):]
    return 'data:image/svg+xml;base64,'+base64.b64encode(svg.encode()).decode()

def md_to_html(s):
    # formule
    def f(m):
        tex=m.group(1).strip()
        return f'\n<div class="formula"><img alt="{html.escape(tex)}" src="{formula_svg(tex)}"></div>\n'
    s=re.sub(r'```latex\n(.*?)\n```',f,s,flags=re.S)
    # immagini (segnaposto dell'esportazione)
    def g(m):
        alt=m.group(1); name=IMG[alt]
        return f'\n<img class="fig" alt="{html.escape(alt)}" src="{img_uri(name)}">\n'
    s=re.sub(r'&#91;image: (.*?)\\\]',g,s)
    h=markdown.markdown(s,extensions=['tables'])
    h=re.sub(r'<p>\s*(<img class="fig"[^>]*>)\s*</p>',r'\1',h)
    h=re.sub(r'<p>\s*(<div class="formula">.*?</div>)\s*</p>',r'\1',h,flags=re.S)
    h=h.replace('<blockquote>','<aside class="tip">').replace('</blockquote>','</aside>')
    parts=re.split(r'(<[^>]+>)',h)
    for i,p in enumerate(parts):
        if not p.startswith('<'):
            parts[i]=re.sub(r'(?<![A-Za-z])([rvVTδ])\\?_(max|prev|[A-Za-z0-9])(?![A-Za-z])',r'\1<sub>\2</sub>',p)
    return ''.join(parts)

def sections(md):
    parts=re.split(r'^## ',md,flags=re.M)
    head=parts[0]; out=[]
    for p in parts[1:]:
        title,_,body=p.partition('\n'); out.append((title.strip(),body))
    return head,out
def key(title):
    m=re.match(r'(\d)\s*·',title); return m.group(1) if m else title

can_head,can=sections(open('canovaccio.md').read())
_,rel=sections(open('relatore.md').read())
_,stu=sections(open('studente.md').read())
relD={key(t):(t,b) for t,b in rel}; stuD={key(t):(t,b) for t,b in stu}

byline=re.search(r'\n\n(.*?)\n',can_head).group(1)
byline=byline.replace('Oct 10, 2026','10 ottobre 2026').replace('@','')

PATH_SVG='''<svg class="path" viewBox="0 0 760 388" role="img" aria-label="Nove tappe in tre incontri: dal potenziale ai frattali" font-family="system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" font-size="13">
<defs><marker id="pa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#9aa5b8"/></marker></defs>
<text x="24" y="32" font-size="15" font-weight="600" fill="#142a4c">Nove tappe in tre incontri: dal potenziale ai frattali</text>
{conts}{arrows}{boxes}</svg>'''
cx=lambda i:24+i*248; by=lambda r:88+r*68
conts=''.join(f'<rect x="{cx(i)}" y="56" width="216" height="308" rx="8" fill="#f1f5fa" stroke="#c9d2e0"/><text x="{cx(i)+16}" y="78" font-weight="600" fill="#142a4c">{n}</text>' for i,n in enumerate(['A · Il potenziale','B · Cariche in moto','C · Sistemi dinamici']))
B=[(0,0,'1 · Da Coulomb a V','lavoro, V = kq/r'),(0,1,'2 · Isoipse e 3D','leggere il paesaggio'),(0,2,'3 · Campo e potenziale','E perpendicolare alle isoipse'),
   (1,0,'4 · Carica in moto','F = q₀E, energia'),(1,1,'5 · Orbite','Keplero, Rutherford'),
   (2,0,'6 · Spazio delle fasi','stato e determinismo'),(2,1,'7 · Attrattori','punto fisso, ciclo limite'),(2,2,'8 · Caos','attrattore strano'),(2,3,'9 · Bacini frattali','confini a ogni scala')]
boxes=''
for i,r,a,b in B:
    acc=a.startswith('9')
    boxes+=f'<a href="#tappa-{a[0]}"><rect x="{cx(i)+16}" y="{by(r)}" width="184" height="56" rx="8" fill="{"#dbe7fb" if acc else "#ffffff"}" stroke="{"#2052c9" if acc else "#9aa5b8"}" stroke-width="{2 if acc else 1.25}"/><text x="{cx(i)+28}" y="{by(r)+24}" font-weight="600" fill="#142a4c">{a}</text><text x="{cx(i)+28}" y="{by(r)+42}" font-size="11.5" fill="#5d6b82">{b}</text></a>'
arrows='<g fill="none" stroke="#9aa5b8" stroke-width="1.25">'
for i,r in [(0,0),(0,1),(1,0),(2,0),(2,1),(2,2)]: arrows+=f'<path d="M{cx(i)+108} {by(r)+56}V{by(r+1)-1}" marker-end="url(#pa)"/>'
arrows+=f'<path d="M{cx(0)+200} {by(2)+28}H{cx(0)+232}V{by(0)+28}H{cx(1)+15}" marker-end="url(#pa)"/><path d="M{cx(1)+200} {by(1)+28}H{cx(1)+232}V{by(0)+28}H{cx(2)+15}" marker-end="url(#pa)"/></g>'
path_svg=PATH_SVG.format(conts=conts,arrows=arrows,boxes=boxes)

def clean_can(body):
    body=re.sub(r'\n*Approfondisci:.*\n?','\n',body)
    body=body.replace('**Note per il relatore** Note per il relatore:','**Note per il relatore** (pannello apribile sotto ogni tappa):')
    body=body.replace('**Testo per lo studente** Testo per lo studente:','**Testo per lo studente** (secondo pannello apribile):')
    body=body.replace('**Canovaccio** (questa scheda):','**Canovaccio** (sempre visibile):')
    body=re.sub(r'&#91;embedded content:.*?\\\]','@@PATH@@',body)
    body=body.replace('le domande sono in fondo al testo per lo studente Testo per lo studente, le soluzioni in fondo alle note per il relatore Note per il relatore.',
                      'le domande sono nel pannello «Testo per lo studente» qui sotto, le soluzioni nel pannello «Note per il relatore».')
    h=md_to_html(body).replace('<p>@@PATH@@</p>',path_svg)
    return h

def panel(kind,title,body,open_=False):
    lab={'rel':'Note per il relatore','stu':'Testo per lo studente'}[kind]
    ico={'rel':'R','stu':'S'}[kind]
    return f'''<details class="lvl {kind}"><summary><span class="ico">{ico}</span>{lab}<span class="hint">apri</span></summary><div class="lvl-body"><h3 class="lvl-title">{html.escape(title)}</h3>{md_to_html(body)}</div></details>'''

secs=[]
for title,body in can:
    k=key(title)
    sid='intro' if title.startswith('Come usare') else ('tappa-'+k if k.isdigit() else 'chiusura')
    inner=f'<h2 class="tappa-title">{html.escape(title)}</h2><div class="can">{clean_can(body)}</div>'
    if sid=='intro':
        t,b=stuD['Come usare il laboratorio']; inner+=panel('stu',t,b)
    elif sid=='chiusura':
        t,b=stuD['Mettiti alla prova']; inner+=panel('stu',t,b)
        t,b=relD['Soluzioni delle domande di verifica']; inner+=panel('rel',t,b)
    else:
        if k in relD: t,b=relD[k]; inner+=panel('rel',t,b)
        if k in stuD: t,b=stuD[k]; inner+=panel('stu',t,b)
    secs.append(f'<section class="tappa" id="{sid}">{inner}</section>')

nav=''.join(f'<a href="#{"tappa-"+key(t) if key(t).isdigit() else ("intro" if t.startswith("Come") else "chiusura")}">{html.escape(key(t) if key(t).isdigit() else ("Intro" if t.startswith("Come") else "Fine"))}</a>' for t,_ in can)

page=open('template.html').read().replace('@@BYLINE@@',html.escape(byline)).replace('@@NAV@@',nav).replace('@@SECTIONS@@','\n'.join(secs))
open('/mnt/user-data/outputs/lezione-dal-potenziale-al-caos.html','w').write(page)
print(len(page)//1024,'kB')
