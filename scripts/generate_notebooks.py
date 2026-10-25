from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ["https://arxiv.org/abs/2308.11999", "https://www.irif.fr/~berthe/Articles/3d.pdf", "https://en.wikipedia.org/wiki/Three-gap_theorem"]
HAL = "https://hal.science/hal-04769002/document"
TOPICS = [
 {"topic":"01-getting-started","files":["the-problem-and-the-data","the-method-step-by-step"],"lessons":[
  {"level":1,"en_title":"The circle, the orbit, and the measured gaps","es_title":"El círculo, la órbita y las brechas medidas","en_obj":"Define the finite orbit convention, sort its points cyclically, and verify that the wraparound interval closes a partition of the circle.","es_obj":"Define la convención de órbita finita, ordena sus puntos cíclicamente y verifica que el intervalo de cierre completa una partición del círculo.","method":"orbit","source":SOURCES[:2]},
  {"level":2,"en_title":"One insertion splits one parent gap","es_title":"Una inserción divide una brecha principal","en_obj":"Compare N and N+1 orbit points and identify the parent interval split by the new point; distinguish this geometric mechanism from a numerical pattern alone.","es_obj":"Compara N y N+1 puntos de órbita e identifica el intervalo principal dividido por el punto nuevo; distingue el mecanismo geométrico de un patrón numérico aislado.","method":"split","source":SOURCES[:2]},
 ]},
 {"topic":"02-arithmetic-and-boundaries","files":["farey-scales","rational-and-contrast","research-perspectives"],"lessons":[
  {"level":1,"en_title":"Farey brackets and continued-fraction scales","es_title":"Intervalos de Farey y escalas de fracciones continuas","en_obj":"Compute convergents and a finite Farey bracket for a rotation parameter, then relate the approximation scale to the observed gap lengths without treating a decimal as proof of irrationality.","es_obj":"Calcula convergentes y un intervalo de Farey finito para un parámetro de rotación, y relaciona la escala de aproximación con las brechas observadas sin tratar un decimal como prueba de irracionalidad.","method":"farey","source":SOURCES[:2]},
  {"level":2,"en_title":"Rational boundaries and allocation controls","es_title":"Fronteras racionales y controles de asignación","en_obj":"Compare a rational periodic orbit with seeded-random and farthest-point allocations; preserve the distinction between theorem cases, boundary cases, and negative controls.","es_obj":"Compara una órbita periódica racional con asignaciones aleatorias reproducibles y de punto más lejano; conserva la diferencia entre casos del teorema, fronteras y controles negativos.","method":"contrast","source":[SOURCES[2]]},
  {"level":3,"en_title":"What the literature establishes and what the instrument adds","es_title":"Qué establece la literatura y qué aporta el instrumento","en_obj":"Map the geometric proof, arithmetic descriptions, and word-theoretic perspective to the app’s finite views, recording the boundary between published results and exploratory presentation.","es_obj":"Relaciona la demostración geométrica, las descripciones aritméticas y la perspectiva de combinatoria de palabras con las vistas finitas de la aplicación, delimitando resultados publicados y presentación exploratoria.","method":"research","source":[SOURCES[0],SOURCES[1],HAL]},
 ]}
]
TEXT = {
'en': {"setup":"This notebook uses the repository’s deterministic implementation. From the repository root, install the notebook pins with `python -m pip install -r notebooks/requirements.txt`; the execution gate runs it in an isolated kernel.","data":"The scenario below is intentionally small and explicit. `pointCount` means the number of orbit points, indexed from zero, and the cyclic partition includes the final wrap from the largest point to the smallest.","method":"The notebook imports the product engine; it does not reimplement allocation or gap grouping.","state":"The three-gap theorem assumes an irrational rotation. A finite floating-point parameter is not a proof of irrationality; the certificate reports finite geometry and declared input status separately.","beyond":"None claimed. The cited literature already covers the theorem and its arithmetic and combinatorial descriptions; this notebook contributes an inspectable finite calculation, not a new theorem.","results":"Read the grouped lengths and multiplicities, then check the complete cyclic sum and the input status.","summary":"The direct finite partition is reproducible, includes the wrap gap, and remains logically distinct from proving the infinite theorem.","refs":"## References\n\n"},
'es': {"setup":"Este cuaderno usa la implementación determinista del repositorio. Desde la raíz, instala las versiones fijadas con `python -m pip install -r notebooks/requirements.txt`; la compuerta de ejecución usa un kernel aislado.","data":"El escenario siguiente es pequeño y explícito. `pointCount` es el número de puntos de órbita, indexados desde cero, y la partición cíclica incluye el cierre desde el punto mayor hasta el menor.","method":"El cuaderno importa el motor del producto; no vuelve a implementar la asignación ni la agrupación de brechas.","state":"El teorema de tres brechas supone una rotación irracional. Un parámetro finito en coma flotante no prueba irracionalidad; el certificado separa geometría finita y estado declarado de la entrada.","beyond":"No se afirma novedad. La literatura citada ya cubre el teorema y sus descripciones aritméticas y combinatorias; este cuaderno aporta un cálculo finito inspeccionable, no un teorema nuevo.","results":"Lee las longitudes agrupadas y sus multiplicidades; luego verifica la suma cíclica completa y el estado de la entrada.","summary":"La partición finita directa es reproducible, incluye la brecha de cierre y se distingue lógicamente de demostrar el teorema infinito.","refs":"## Referencias\n\n"}
}

CELL_ID = 0
def next_id():
 global CELL_ID
 CELL_ID += 1
 return f"g{CELL_ID:07d}"
def md(text): return {"cell_type":"markdown","id":next_id(),"metadata":{},"source":text.splitlines(keepends=True)}
def code(text, count): return {"cell_type":"code","id":next_id(),"execution_count":count,"metadata":{},"outputs":[],"source":text.splitlines(keepends=True)}

def cells(lang, lesson):
 t=TEXT[lang]; es=lang=='es'; title=lesson['es_title' if es else 'en_title']; obj=lesson['es_obj' if es else 'en_obj']
 section = ["Objetivos" if es else "Objectives", "Preparación" if es else "Setup", "Datos" if es else "Data", "Método" if es else "Method"]
 c=[md(f"# {title}\n\n- **Level / Nivel:** {lesson['level']}\n- **Prerequisites / Prerrequisitos:** {('topic 01-getting-started' if lesson['topic'].startswith('02') else 'none') if not es else ('tema 01-getting-started' if lesson['topic'].startswith('02') else 'ninguno')}\n- **Reading time / Tiempo:** 8 minutes / 8 minutos\n\n## {section[0]}\n\n{obj}"),md(f"## {section[1]}\n\n{t['setup']}\n\n```text\npython -m pip install -r notebooks/requirements.txt\n```"),md(f"## {section[2]}\n\n{t['data']}"),md(f"## {section[3]}\n\n{t['method']}\n\nThe standard example uses the golden rotation, N=13, and phase 0.07.\n\n{t['state']}")]
 c.append(code("# Import the canonical GapTheo engine from the repository pipeline.\nimport sys\nfrom pathlib import Path\nsys.path.insert(0, str(Path.cwd().parents[2] / 'data-pipeline'))\nfrom pipeline.gaptheo.model import certificate, allocate, gap_partition, continued_fraction, farey_bracket\nscenario = {'id': 'golden-study', 'category': 'irrational', 'alpha': (5**0.5 - 1) / 2, 'alphaMode': 'irrational', 'pointCount': 13, 'phase': 0.07, 'allocator': 'rotation'}\nresult = certificate(scenario)\nprint(result['theoremStatus'], result['pointCount'], result['distinctCount'], result['partitionResidual'])",1))
 method=lesson['method']
 if method=='orbit': extra="print([(round(group['length'], 6), group['count']) for group in result['groups']])\nprint('sum of cyclic gaps:', sum(gap['length'] for gap in result['gaps']))"
 elif method=='split':
  extra="smaller = dict(scenario, pointCount=12)\nlarge = certificate(scenario)\nsmall = certificate(smaller)\nnew_point = large['points'][-1]['value']\nparent = next(gap for gap in small['gaps'] if gap['start'] < new_point < gap['end'])\nprint('new point:', round(new_point, 6), 'parent gap:', round(parent['length'], 6))\nprint('N, N+1 distinct lengths:', small['distinctCount'], large['distinctCount'])"
 elif method=='farey': extra="print('continued fraction:', result['continuedFraction']['terms'][:8])\nprint('Farey bracket:', farey_bracket(scenario['alpha'], scenario['pointCount']))\nprint('gap groups:', [(round(g['length'], 6), g['count']) for g in result['groups']])"
 elif method=='contrast': extra="rational = dict(scenario, id='rational-boundary', alpha=5/13, alphaMode='rational', rationalP=5, rationalQ=13)\ncontrol = dict(scenario, id='farthest-control', allocator='farthest')\nfor case in (rational, control):\n    cert = certificate(case)\n    print(case['id'], cert['theoremStatus'], cert['distinctCount'])"
 else: extra="print('geometric source:', result['source'])\nprint('arithmetic terms:', result['continuedFraction']['terms'][:8])\nprint('finite certificate hash:', result['hash'])"
 c.extend([md(f"## {('Resultados' if es else 'Results')}\n\n{t['results']}"),code("# Compare a second view or a deliberately different regime using the same engine.\n"+extra,2)])
 if lesson['level']>=3: c.append(md(f"## {('Estado del arte' if es else 'State of the art')}\n\nHamada’s geometric proof, the arithmetic account of convergents and neighboring fractions, and the word-combinatorics treatment are complementary published perspectives. The app’s linked views are finite computations and explanatory encodings; they do not assert a new classification.\n\n{t['beyond']}"))
 if lesson['level']>=3:
  state = c.pop(-1)
  results_index = next(i for i, cell in enumerate(c) if cell['cell_type']=='markdown' and ("## Results" in ''.join(cell['source']) or "## Resultados" in ''.join(cell['source'])))
  c.insert(results_index, state)
 c.extend([md(f"## {('Resumen' if es else 'Summary')}\n\n{t['summary']}"),md(t['refs']+"\n".join(f"- [{u}]({u})" for u in lesson['source'])+"\n")])
 return c

for topic in TOPICS:
 for lang in ('en','es'):
  for index, lesson in enumerate(topic['lessons']):
   lesson['topic']=topic['topic']
   CELL_ID = 0
   stem=topic['files'][index]
   path=ROOT/'notebooks'/lang/topic['topic']/(f"{index+1:02d}-{stem}.ipynb")
   path.parent.mkdir(parents=True, exist_ok=True)
   sources=lesson['source']
   doc={'cells':cells(lang,lesson),'metadata':{'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'},'language_info':{'name':'python'},'caos':{'language':lang,'topic':topic['topic'],'level':lesson['level'],'title':lesson['es_title' if lang=='es' else 'en_title'],'packages':[],'data':['data/input/canonical-scenarios.json'],'sources':sources,'beyond':[]}},'nbformat':4,'nbformat_minor':5}
   path.write_text(json.dumps(doc,ensure_ascii=False,indent=1)+'\n',encoding='utf-8',newline='\n')
