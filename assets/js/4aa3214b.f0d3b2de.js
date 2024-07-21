"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[263],{5680:(e,n,t)=>{t.d(n,{xA:()=>p,yg:()=>d});var o=t(6540);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,o,r=function(e,n){if(null==e)return{};var t,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)t=a[o],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)t=a[o],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var c=o.createContext({}),l=function(e){var n=o.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},p=function(e){var n=l(e.components);return o.createElement(c.Provider,{value:n},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return o.createElement(o.Fragment,{},n)}},y=o.forwardRef((function(e,n){var t=e.components,r=e.mdxType,a=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=l(t),y=r,d=u["".concat(c,".").concat(y)]||u[y]||m[y]||a;return t?o.createElement(d,s(s({ref:n},p),{},{components:t})):o.createElement(d,s({ref:n},p))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var a=t.length,s=new Array(a);s[0]=y;var i={};for(var c in n)hasOwnProperty.call(n,c)&&(i[c]=n[c]);i.originalType=e,i[u]="string"==typeof e?e:r,s[1]=i;for(var l=2;l<a;l++)s[l]=t[l];return o.createElement.apply(null,s)}return o.createElement.apply(null,t)}y.displayName="MDXCreateElement"},2035:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>m,frontMatter:()=>a,metadata:()=>i,toc:()=>l});var o=t(8168),r=(t(6540),t(5680));const a={},s="Batching",i={unversionedId:"miscellaneous/batching",id:"miscellaneous/batching",title:"Batching",description:"When using the store's update function, you can pass multiple mutation functions:",source:"@site/docs/miscellaneous/batching.mdx",sourceDirName:"miscellaneous",slug:"/miscellaneous/batching",permalink:"/elf/docs/miscellaneous/batching",draft:!1,editUrl:"https://github.com/ngneat/elf/docusaurus/edit/main/website/docs/miscellaneous/batching.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"Hooks",permalink:"/elf/docs/miscellaneous/hooks"},next:{title:"Entity Events",permalink:"/elf/docs/miscellaneous/entity-events"}},c={},l=[{value:"emitOnce",id:"emitonce",level:2},{value:"emitOnceAsync",id:"emitonceasync",level:2}],p={toc:l},u="wrapper";function m(e){let{components:n,...t}=e;return(0,r.yg)(u,(0,o.A)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"batching"},"Batching"),(0,r.yg)("p",null,"When using the store's ",(0,r.yg)("inlineCode",{parentName:"p"},"update")," function, you can pass multiple mutation functions:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"store.update(\n  setProp('count', 1),\n  addEntities([todo, todo]),\n  deleteEntities(1)\n);\n")),(0,r.yg)("p",null,"In this case, subscribers will only receive ",(0,r.yg)("strong",{parentName:"p"},"one")," emission instead of three."),(0,r.yg)("h2",{id:"emitonce"},"emitOnce"),(0,r.yg)("p",null,"There are cases where you have multiple update functions of the ",(0,r.yg)("strong",{parentName:"p"},"same")," store that you want to batch together. To do so you can use the ",(0,r.yg)("inlineCode",{parentName:"p"},"emitOnce")," function:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts",metastring:"title=todos.repository.ts",title:"todos.repository.ts"},"export function updateCount() {\n  store.update(\n    setProp('count', 1),\n  );\n}\n\nexport function updateUser() {\n  store.update(\n    setProp('user', null),\n  );\n}\n")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import { emitOnce } from '@elf/store';\nimport { updateCount, updateUser } from './todos.repository';\n\nemitOnce(() => {\n  updateCount();\n  updateUser();\n});\n")),(0,r.yg)("p",null,"In this case, subscribers will only receive ",(0,r.yg)("strong",{parentName:"p"},"one")," emission instead of two."),(0,r.yg)("p",null,"Also, you might face the need to use functions that use ",(0,r.yg)("inlineCode",{parentName:"p"},"emitOnce")," inside another ",(0,r.yg)("inlineCode",{parentName:"p"},"emitOnce"),":"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts",metastring:"title=table.repository.ts",title:"table.repository.ts"},"export function restoreFilters() {\n  emitOnce(() => {\n    store.update(\n      setProp('filters', null),\n    );\n    resetPagination();\n  });\n}\n\nexport function resetSort() {\n  emitOnce(() => {\n    store.update(\n      setProp('sort', null),\n    );\n    resetPagination();\n  });\n}\n\nexport function resetPagination() {\n  store.update(\n    setProp('pagination', null),\n  );\n}\n")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import { emitOnce } from '@elf/store';\nimport { restoreFilters, resetSort } from './table.repository';\n\nemitOnce(() => {\n  restoreFilters();\n  resetSort();\n});\n")),(0,r.yg)("p",null,"In this case, subscribers will only receive ",(0,r.yg)("strong",{parentName:"p"},"one")," emission instead of two."),(0,r.yg)("h2",{id:"emitonceasync"},"emitOnceAsync"),(0,r.yg)("p",null,"In some cases, you might need to use ",(0,r.yg)("inlineCode",{parentName:"p"},"emitOnce")," with async functions or observables. To do so, you can use ",(0,r.yg)("inlineCode",{parentName:"p"},"emitOnceAsync"),":"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts",metastring:"title=todos.repository.ts",title:"todos.repository.ts"},"export async function updateCount() {\n  const newCount = await fetchCount(); // Fetch count from API\n  store.update(setProp('count', newCount));\n}\n\nexport async function updateUser() {\n  const newUser = await fetchUser(); // Fetch user from API\n  store.update(setProp('user', newUser));\n}\n\nexport function clearCount() {\n  store.update(setProp('user', null));\n}\n\nexport function clearUser() {\n  store.update(setProp('user', null));\n}\n")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import { emitOnceAsync } from '@elf/store';\nimport { updateCount, updateUser } from './todos.repository';\n\nawait emitOnceAsync(async () => {\n  await updateCount();\n  await updateUser();\n});\n")),(0,r.yg)("p",null,"In this case, subscribers will also only receive ",(0,r.yg)("strong",{parentName:"p"},"one")," emission instead of two."),(0,r.yg)("p",null,"You can also use ",(0,r.yg)("inlineCode",{parentName:"p"},"emitOnce")," and ",(0,r.yg)("inlineCode",{parentName:"p"},"emitOnceAsync")," inside another ",(0,r.yg)("inlineCode",{parentName:"p"},"emitOnceAsync"),":"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"import { emitOnce, emitOnceAsync } from '@elf/store';\nimport { updateCount, updateUser } from './todos.repository';\n\nasync function updateCountAndUser() {\n  await emitOnceAsync(async () => {\n    await updateCount();\n    await updateUser();\n  });\n}\n\nawait emitOnceAsync(async () => {\n  emitOnce(() => {\n    clearCount();\n    clearUser();\n  });\n  await updateCountAndUser();\n});\n")),(0,r.yg)("p",null,"You can also provide an observable to ",(0,r.yg)("inlineCode",{parentName:"p"},"emitOnceAsync"),", in this case, the store will only update when the observable emits its ",(0,r.yg)("strong",{parentName:"p"},"first")," value."),(0,r.yg)("p",null,"Using ",(0,r.yg)("inlineCode",{parentName:"p"},"emitOnceAsync")," inside ",(0,r.yg)("inlineCode",{parentName:"p"},"emitOnce")," will not work as expected because ",(0,r.yg)("inlineCode",{parentName:"p"},"emitOnce")," will not wait for the async function to finish."),(0,r.yg)("p",null,"Use ",(0,r.yg)("inlineCode",{parentName:"p"},"emitOnceAsync")," with caution, the store will not update until the async function finishes or the observable emits its first value.\nIf your async function or observable takes too long to finish, the app might appear unresponsive."))}m.isMDXComponent=!0}}]);