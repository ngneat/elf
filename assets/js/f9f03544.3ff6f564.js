"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[49],{858:(e,t,s)=>{s.d(t,{S:()=>i});var n=s(7294),a=s(9979),o=s(2949);const r={core:{"@ngneat/elf":"latest"},entities:{"@ngneat/elf-entities":"latest"},requests:{"@ngneat/elf-requests":"latest"},pagination:{"@ngneat/elf-pagination":"latest"},devtools:{"@ngneat/elf-devtools":"latest"},persist:{"@ngneat/elf-persist-state":"latest"},history:{"@ngneat/elf-state-history":"latest"},rxjs:{rxjs:"latest"},immer:{immer:"latest"}};function i(e){let{src:t,packages:s=[]}=e;const i=(0,n.useRef)(),c=(0,n.useRef)(),u=["core","rxjs",...s],{colorMode:d}=(0,o.I)();return(0,n.useEffect)((()=>{const e=u.reduce(((e,t)=>(Object.assign(e,r[t]),e)),{});a.Z.embedProject(i.current,{description:"this is descrption",title:"Elf Core",files:{"index.html":"","index.ts":t},template:"typescript",dependencies:e,settings:{compile:{clearConsole:!0}}},{hideDevTools:!1,devToolsHeight:99,theme:d,height:"500px"}).then((e=>{c.current=e.editor}))}),[]),(0,n.useEffect)((()=>{c.current&&c.current.setTheme(d)}),[d]),n.createElement("section",{style:{height:"500px"}},n.createElement("div",{ref:i}))}},825:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>d,contentTitle:()=>c,default:()=>m,frontMatter:()=>i,metadata:()=>u,toc:()=>l});var n=s(7462),a=(s(7294),s(3905));const o="import { createStore } from '@ngneat/elf';\nimport {\n  selectAllEntities,\n  setEntities,\n  withEntities,\n} from '@ngneat/elf-entities';\nimport {\n  createRequestDataSource,\n  withRequestsStatus,\n} from '@ngneat/elf-requests';\nimport { fromFetch } from 'rxjs/fetch';\nimport { tap } from 'rxjs/operators';\n\ninterface Todo {\n  id: number;\n  label: string;\n}\n\nconst store = createStore(\n  { name: 'todos' },\n  withEntities<Todo>(),\n  withRequestsStatus()\n);\n\nconst dataSource = createRequestDataSource({\n  store,\n  data$: () => store.pipe(selectAllEntities()),\n  requestKey: 'todos',\n  dataKey: 'todos',\n  idleAsPending: true,\n});\n\nfunction setTodos(todos: Todo[]) {\n  store.update(setEntities(todos), dataSource.setSuccess());\n}\n\ndataSource.data$().subscribe((data) => {\n  console.log(data);\n});\n\n// todos.service.ts\nfunction fecthTodos() {\n  return fromFetch<Todo[]>('https://jsonplaceholder.typicode.com/todos', {\n    selector: (response) => response.json(),\n  }).pipe(tap(setTodos), dataSource.trackRequestStatus());\n}\n\nfecthTodos().subscribe();\n";var r=s(858);const i={},c="Data Source",u={unversionedId:"features/requests/requests-data-source",id:"features/requests/requests-data-source",title:"Data Source",description:"With the createRequestDataSource function, we can easily select the state of an async request from our store:",source:"@site/docs/features/requests/requests-data-source.mdx",sourceDirName:"features/requests",slug:"/features/requests/requests-data-source",permalink:"/elf/docs/features/requests/requests-data-source",draft:!1,editUrl:"https://github.com/ngneat/elf/docusaurus/edit/main/website/docs/features/requests/requests-data-source.mdx",tags:[],version:"current",frontMatter:{}},d={},l=[{value:"Dynamic DataSource",id:"dynamic-datasource",level:2}],p={toc:l},h="wrapper";function m(e){let{components:t,...s}=e;return(0,a.kt)(h,(0,n.Z)({},p,s,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"data-source"},"Data Source"),(0,a.kt)("p",null,"With the ",(0,a.kt)("inlineCode",{parentName:"p"},"createRequestDataSource")," function, we can easily select the state of an async request from our store:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createStore } from '@ngneat/elf';\nimport {\n  withRequestsStatus,\n  withRequestsCache,\n  // highlight-next-line\n  createRequestDataSource,\n} from '@ngneat/elf-requests';\nimport { selectAllEntities, withEntities } from '@ngneat/elf-entities';\n\nconst store = createStore(\n  { name: 'todos' },\n  withEntities<Todo>(),\n  withRequestsStatus(),\n  withRequestsCache()\n);\n\n// highlight-start\nexport const todosDataSource = createRequestDataSource({\n  data$: () => store.pipe(selectAllEntities()),\n  requestKey: 'todos',\n  dataKey: 'todos',\n  store,\n});\n// highlight-end\n")),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"todosDataSource")," will return a function named ",(0,a.kt)("inlineCode",{parentName:"p"},"data$")," that returns an observable with the following shape:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"todosDataSource.data$().subscribe(({ todos, loading, error }) => {});\n")),(0,a.kt)("p",null,"And the following operators and functions that operates on the provided ",(0,a.kt)("inlineCode",{parentName:"p"},"requestKey"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"store.update(\n  setTodos(todos),\n  todosDataSource.setSuccess();\n  todosDataSource.setCached();\n)\n\ntodosDataSource.trackRequestStatus();\ntodosDataSource.skipWhileCached();\n")),(0,a.kt)(r.S,{src:o,packages:["entities","requests"],mdxType:"LiveDemo"}),(0,a.kt)("h2",{id:"dynamic-datasource"},"Dynamic DataSource"),(0,a.kt)("p",null,"We can use the ",(0,a.kt)("inlineCode",{parentName:"p"},"createRequestDataSource")," with a dynamic key:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createStore } from '@ngneat/elf';\nimport {\n  withRequestsStatus,\n  withRequestsCache,\n  createRequestDataSource,\n} from '@ngneat/elf-requests';\nimport { selectEntity, withEntities } from '@ngneat/elf-entities';\n\nconst store = createStore(\n  { name: 'todos' },\n  withEntities<Todo>(),\n  withRequestsStatus(),\n  withRequestsCache()\n);\n\n// highlight-start\nexport const todoDataSource = createRequestDataSource({\n  data$: (key: number) => store.pipe(selectEntity(key)),\n  dataKey: 'todo',\n  store,\n});\n// highlight-end\n")),(0,a.kt)("p",null,"Note that you should not pass a ",(0,a.kt)("inlineCode",{parentName:"p"},"requestKey")," in this case. With this change, you will get the following API:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"todoDataSource.data$({ key: 1 }).subscribe(({ todo, loading, error }) => {})\n\nstore.update(\n  addTodo(todo),\n  todoDataSource.setSuccess({ key: 1 });\n  todoDataSource.setCached({ key: 1 });\n)\n\ntodoDataSource.trackRequestStatus({ key: 1 });\ntodoDataSource.skipWhileCached({ key: 1 });\n")))}m.isMDXComponent=!0}}]);