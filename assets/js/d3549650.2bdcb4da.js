"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[13],{2600:(e,t,n)=>{n.d(t,{k:()=>r});var o=n(6540),i=n(2908),s=n(5293);const a={core:{"@ngneat/elf":"latest"},entities:{"@ngneat/elf-entities":"latest"},requests:{"@ngneat/elf-requests":"latest"},pagination:{"@ngneat/elf-pagination":"latest"},devtools:{"@ngneat/elf-devtools":"latest"},persist:{"@ngneat/elf-persist-state":"latest"},history:{"@ngneat/elf-state-history":"latest"},rxjs:{rxjs:"latest"},immer:{immer:"latest"}};function r(e){let{src:t,packages:n=[]}=e;const r=(0,o.useRef)(),l=(0,o.useRef)(),d=["core","rxjs",...n],{colorMode:u}=(0,s.G)();return(0,o.useEffect)((()=>{const e=d.reduce(((e,t)=>(Object.assign(e,a[t]),e)),{});i.A.embedProject(r.current,{description:"this is descrption",title:"Elf Core",files:{"index.html":"","index.ts":t},template:"typescript",dependencies:e,settings:{compile:{clearConsole:!0}}},{hideDevTools:!1,devToolsHeight:99,theme:u,height:"500px"}).then((e=>{l.current=e.editor}))}),[]),(0,o.useEffect)((()=>{l.current&&l.current.setTheme(u)}),[u]),o.createElement("section",{style:{height:"500px"}},o.createElement("div",{ref:r}))}},5697:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>l,default:()=>g,frontMatter:()=>r,metadata:()=>d,toc:()=>y});var o=n(8168),i=(n(6540),n(5680));const s="import { createStore } from '@ngneat/elf';\nimport {\n  selectAllEntities,\n  withEntities,\n  withUIEntities,\n  UIEntitiesRef,\n  updateEntities,\n} from '@ngneat/elf-entities';\nimport { entitiesStateHistory } from '@ngneat/elf-state-history';\n\ninterface Todo {\n  id: number;\n  label: string;\n}\n\ninterface TodoUI {\n  id: number;\n  selected: boolean;\n}\n\nconst todosStore = createStore(\n  { name: 'auth' },\n  withEntities<Todo>({\n    initialValue: [\n      { id: 0, label: 'Todo 1' },\n      { id: 1, label: 'Todo 2' },\n    ],\n  }),\n  withUIEntities<TodoUI>({\n    initialValue: [\n      { id: 0, selected: false },\n      { id: 1, selected: false },\n    ],\n  })\n);\n\nexport const todosStateHistory = entitiesStateHistory(todosStore);\nexport const todosUIStateHistory = entitiesStateHistory(todosStore, {\n  entitiesRef: UIEntitiesRef,\n});\n\ntodosStore\n  .pipe(selectAllEntities())\n  .subscribe((entities) => console.log('Entities: ', entities));\ntodosStore\n  .pipe(selectAllEntities({ ref: UIEntitiesRef }))\n  .subscribe((entities) => console.log('UI Entities: ', entities));\n\ntodosStore.update(\n  updateEntities([0, 1], { label: 'Renamed Todo' }),\n  updateEntities([0, 1], { selected: true }, { ref: UIEntitiesRef })\n);\n\ntodosStateHistory.undo(0);\ntodosUIStateHistory.undo(0);\n";var a=n(2600);const r={},l="Entities State History",d={unversionedId:"features/history/entities-history",id:"features/history/entities-history",title:"Entities State History",description:"The entitiesStateHistory function provides a convenient way for undo and redo functionality for specific entity, saving you the trouble of maintaining a history of the entity yourself.",source:"@site/docs/features/history/entities-history.mdx",sourceDirName:"features/history",slug:"/features/history/entities-history",permalink:"/elf/docs/features/history/entities-history",draft:!1,editUrl:"https://github.com/ngneat/elf/docusaurus/edit/main/website/docs/features/history/entities-history.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"State History",permalink:"/elf/docs/features/history/"},next:{title:"DevTools",permalink:"/elf/docs/dev-tools"}},u={},y=[{value:"API",id:"api",level:2},{value:"<code>undo</code>",id:"undo",level:3},{value:"<code>redo</code>",id:"redo",level:3},{value:"<code>jumpToPast</code>",id:"jumptopast",level:3},{value:"<code>jumpToFuture</code>",id:"jumptofuture",level:3},{value:"<code>clearPast</code>",id:"clearpast",level:3},{value:"<code>clearFuture</code>",id:"clearfuture",level:3},{value:"<code>clear</code>",id:"clear",level:3},{value:"<code>pause</code>",id:"pause",level:3},{value:"<code>resume</code>",id:"resume",level:3},{value:"<code>getEntitiesPast</code>",id:"getentitiespast",level:3},{value:"<code>hasPast</code>",id:"haspast",level:3},{value:"<code>hasFuture</code>",id:"hasfuture",level:3},{value:"<code>getEntitiesFuture</code>",id:"getentitiesfuture",level:3}],c={toc:y},p="wrapper";function g(e){let{components:t,...n}=e;return(0,i.yg)(p,(0,o.A)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,i.yg)("h1",{id:"entities-state-history"},"Entities State History"),(0,i.yg)("p",null,"The ",(0,i.yg)("inlineCode",{parentName:"p"},"entitiesStateHistory")," function provides a convenient way for ",(0,i.yg)("inlineCode",{parentName:"p"},"undo")," and ",(0,i.yg)("inlineCode",{parentName:"p"},"redo")," functionality for specific entity, saving you the trouble of maintaining a history of the entity yourself."),(0,i.yg)("p",null,"First, you need to install the package by using the CLI command ",(0,i.yg)("inlineCode",{parentName:"p"},"elf-cli install")," and selecting the stat-history package, or via npm:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-bash"},"npm i @ngneat/elf-state-history\n")),(0,i.yg)("p",null,"Then, call the ",(0,i.yg)("inlineCode",{parentName:"p"},"entitiesStateHistory")," method when you want to start monitoring."),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import { createStore } from '@ngneat/elf';\nimport { entitiesStateHistory } from '@ngneat/elf-state-history';\n\nconst { withCartEntities, cartEntitiesRef } = entitiesPropsFactory('cart');\n\nconst todosStore = createStore(\n  { name },\n  withEntities<Todo>(),\n  withUIEntities<TodoUI>(),\n  withCartEntities<CartItem>()\n);\n\nexport const todosStateHistory = entitiesStateHistory(todosStore);\nexport const todosUIStateHistory = entitiesStateHistory(todosStore, {\n  entitiesRef: UIEntitiesRef,\n});\nexport const cartsStateHistory = entitiesStateHistory(todosStore, {\n  entitiesRef: cartEntitiesRef,\n});\n")),(0,i.yg)("p",null,"As the second parameter you can pass a ",(0,i.yg)("inlineCode",{parentName:"p"},"EntitiesStateHistoryOptions")," object:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"export const todosUIStateHistory = entitiesStateHistory(todosStore, {\n  maxAge: 15,\n\n  // Ref to entities plugin\n  entitiesRef: UIEntitiesRef,\n\n  // Define which entities should be monitoring. By default, all entities are monitored.\n  entityIds: [1, 5, 15]\n\n  // entitiesStateHistory always checks entity changes by top level refs. You can pass comparatorFn to perform extra checks, e.g. deep equal checks.\n  comparatorFn: deepEqual,\n});\n")),(0,i.yg)(a.k,{src:s,packages:["history","entities"],mdxType:"LiveDemo"}),(0,i.yg)("h2",{id:"api"},"API"),(0,i.yg)("h3",{id:"undo"},(0,i.yg)("inlineCode",{parentName:"h3"},"undo")),(0,i.yg)("p",null,"Undo the last change:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"// Performs `undo` for each entity.\ntodosStateHistory.undo();\n\ntodosStateHistory.undo(id);\n\ntodosStateHistory.undo([id, id]);\n")),(0,i.yg)("h3",{id:"redo"},(0,i.yg)("inlineCode",{parentName:"h3"},"redo")),(0,i.yg)("p",null,"redo the last change:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"// Performs `redo` for each entity.\ntodosStateHistory.redo();\n\ntodosStateHistory.redo(id);\n\ntodosStateHistory.redo([id, id]);\n")),(0,i.yg)("h3",{id:"jumptopast"},(0,i.yg)("inlineCode",{parentName:"h3"},"jumpToPast")),(0,i.yg)("p",null,"Jump to the provided index in the past (assuming index is valid):"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"// Performs `jumpToPast` for each entity.\ntodosStateHistory.jumpToPast(number);\n\ntodosStateHistory.jumpToPast(number, id);\n\ntodosStateHistory.jumpToPast(number, [id, id]);\n")),(0,i.yg)("h3",{id:"jumptofuture"},(0,i.yg)("inlineCode",{parentName:"h3"},"jumpToFuture")),(0,i.yg)("p",null,"Jump to the provided index in the future (assuming index is valid):"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"// Performs `jumpToFuture` for each entity.\ntodosStateHistory.jumpToFuture(number);\n\ntodosStateHistory.jumpToFuture(number, id);\n\ntodosStateHistory.jumpToFuture(number, [id, id]);\n")),(0,i.yg)("h3",{id:"clearpast"},(0,i.yg)("inlineCode",{parentName:"h3"},"clearPast")),(0,i.yg)("p",null,"Clear the past history:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"// Clear past for each entity.\ntodosStateHistory.clearPast();\n\ntodosStateHistory.clearPast(id);\n\ntodosStateHistory.clearPast([id, id]);\n")),(0,i.yg)("h3",{id:"clearfuture"},(0,i.yg)("inlineCode",{parentName:"h3"},"clearFuture")),(0,i.yg)("p",null,"Clear the future history:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"// Clear future for each entity.\ntodosStateHistory.clearFuture();\n\ntodosStateHistory.clearFuture(id);\n\ntodosStateHistory.clearFuture([id, id]);\n")),(0,i.yg)("h3",{id:"clear"},(0,i.yg)("inlineCode",{parentName:"h3"},"clear")),(0,i.yg)("p",null,"Clear the history:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"// Clear history for each entity.\ntodosStateHistory.clear();\ntodosStateHistory.clear([], customUpdateFn);\n\ntodosStateHistory.clear(id);\ntodosStateHistory.clear(id, customUpdateFn);\n\ntodosStateHistory.clear([id, id]);\ntodosStateHistory.clear([id, id], customUpdateFn);\n")),(0,i.yg)("h3",{id:"pause"},(0,i.yg)("inlineCode",{parentName:"h3"},"pause")),(0,i.yg)("p",null,"Stop monitoring the entity changes:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"// Pause monitoring of changes for each entity.\ntodosStateHistory.pause();\n\ntodosStateHistory.pause(id);\n\ntodosStateHistory.pause([id, id]);\n")),(0,i.yg)("h3",{id:"resume"},(0,i.yg)("inlineCode",{parentName:"h3"},"resume")),(0,i.yg)("p",null,"Continue monitoring the entity changes:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"// Resume monitoring of changes for each entity.\ntodosStateHistory.resume();\n\ntodosStateHistory.resume(id);\n\ntodosStateHistory.resume([id, id]);\n")),(0,i.yg)("h3",{id:"getentitiespast"},(0,i.yg)("inlineCode",{parentName:"h3"},"getEntitiesPast")),(0,i.yg)("p",null,"Get an object with past of each entity:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"todosStateHistory.getEntitiesPast();\n\n// Add an empty array if entity's past is absent.\ntodosStateHistory.getEntitiesPast({ showIfEmpty: true });\n")),(0,i.yg)("h3",{id:"haspast"},(0,i.yg)("inlineCode",{parentName:"h3"},"hasPast")),(0,i.yg)("p",null,"A boolean flag that returns whether the entity history is not empty:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"todosStateHistory.hasPast(id);\n")),(0,i.yg)("h3",{id:"hasfuture"},(0,i.yg)("inlineCode",{parentName:"h3"},"hasFuture")),(0,i.yg)("p",null,"A boolean flag that returns whether entity is not in the latest step in the history:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"todosStateHistory.hasFuture(id);\n")),(0,i.yg)("h3",{id:"getentitiesfuture"},(0,i.yg)("inlineCode",{parentName:"h3"},"getEntitiesFuture")),(0,i.yg)("p",null,"Get an object with past of each entity:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"todosStateHistory.getEntitiesFuture();\n\n// Add an empty array if entity's future is absent.\ntodosStateHistory.getEntitiesFuture({ showIfEmpty: true });\n")))}g.isMDXComponent=!0}}]);