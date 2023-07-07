"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[190],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>h});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),p=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},c=function(e){var t=p(e.components);return a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=p(n),h=r,m=d["".concat(l,".").concat(h)]||d[h]||u[h]||o;return n?a.createElement(m,s(s({ref:t},c),{},{components:n})):a.createElement(m,s({ref:t},c))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,s=new Array(o);s[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:r,s[1]=i;for(var p=2;p<o;p++)s[p]=n[p];return a.createElement.apply(null,s)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9987:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>u,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var a=n(7462),r=(n(7294),n(3905));const o={},s="Sync State",i={unversionedId:"third-party/sync-state",id:"third-party/sync-state",title:"Sync State",description:"npm GitHub GitHub Repo stars",source:"@site/docs/third-party/sync-state.mdx",sourceDirName:"third-party",slug:"/third-party/sync-state",permalink:"/elf/docs/third-party/sync-state",draft:!1,editUrl:"https://github.com/ngneat/elf/docusaurus/edit/main/website/docs/third-party/sync-state.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"Recipes",permalink:"/elf/docs/recipes"},next:{title:"Stale emission",permalink:"/elf/docs/troubleshooting/stale-emission"}},l={},p=[{value:"Sync a subset of the state",id:"sync-a-subset-of-the-state",level:2},{value:"Pre Update interceptor",id:"pre-update-interceptor",level:2},{value:"Integration with Elf",id:"integration-with-elf",level:2}],c={toc:p};function u(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"sync-state"},"Sync State"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/elf-sync-state"},(0,r.kt)("img",{parentName:"a",src:"https://img.shields.io/npm/v/elf-sync-state?logo=npm&style=flat-square",alt:"npm"}))," ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/RicardoJBarrios/elf-sync-state/blob/main/LICENSE.md"},(0,r.kt)("img",{parentName:"a",src:"https://img.shields.io/github/license/ricardojbarrios/elf-sync-state?style=flat-square",alt:"GitHub"}))," ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/RicardoJBarrios/elf-sync-state"},(0,r.kt)("img",{parentName:"a",src:"https://img.shields.io/github/stars/ricardojbarrios/elf-sync-state?logo=github&style=flat-square",alt:"GitHub Repo stars"}))),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Syncs elf store state across tabs")),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"syncState()")," function gives you the ability to synchronize an ",(0,r.kt)("a",{parentName:"p",href:"https://ngneat.github.io/elf/"},"elf store")," state across multiple tabs, windows or iframes using the ",(0,r.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API"},"Broadcast Channel API"),"."),(0,r.kt)("p",null,"First, you need to install the package via npm:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm i elf-sync-state\n")),(0,r.kt)("p",null,"To use it you should call the ",(0,r.kt)("inlineCode",{parentName:"p"},"syncState()")," function passing the store:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { createStore, withProps } from '@ngneat/elf';\nimport { syncState } from 'elf-sync-state';\n\ninterface AuthProps {\n  user: { id: string } | null;\n  token: string | null;\n}\n\nconst authStore = createStore(\n  { name: 'auth' },\n  withProps<AuthProps>({ user: null, token: null })\n);\n\nsyncState(authStore);\n")),(0,r.kt)("p",null,"As the second parameter you can pass an optional ",(0,r.kt)("inlineCode",{parentName:"p"},"Options")," object, which can be used to define the following:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"channel"),": the name of the channel (by default - the store name plus a ",(0,r.kt)("inlineCode",{parentName:"li"},"@store")," suffix)."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"source"),": a function that receives the store and return what to sync from it. The default is ",(0,r.kt)("inlineCode",{parentName:"li"},"(store) => store"),"."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"preUpdate"),": a function to map the event message and get the data. The default is ",(0,r.kt)("inlineCode",{parentName:"li"},"(event) => event.data"),"."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"runGuard"),": a function that returns whether the actual implementation should be run. The default is ",(0,r.kt)("inlineCode",{parentName:"li"},"() => typeof window !== 'undefined' && typeof window.BroadcastChannel !== 'undefined'"),".")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { syncState } from 'elf-sync-state';\nimport { authStore } from './auth.store';\n\nsyncState(authStore, { channel: 'auth-channel' });\n")),(0,r.kt)("p",null,"The sync state also returns the ",(0,r.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel"},(0,r.kt)("inlineCode",{parentName:"a"},"BroadcastChannel"))," object created or ",(0,r.kt)("inlineCode",{parentName:"p"},"undefined")," if the ",(0,r.kt)("inlineCode",{parentName:"p"},"runGuard")," function returns ",(0,r.kt)("inlineCode",{parentName:"p"},"false"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { syncState } from 'elf-sync-state';\nimport { authStore } from './auth.store';\n\nconst channel: BroadcastChannel | undefined = syncState(authStore);\n")),(0,r.kt)("h2",{id:"sync-a-subset-of-the-state"},"Sync a subset of the state"),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"includeKeys()")," operator can be used to sync a subset of the state:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { includeKeys, syncState } from 'elf-sync-state';\nimport { authStore } from './auth.store';\n\nsyncState(authStore, {\n  source: (store) => store.pipe(includeKeys(['user'])),\n});\n")),(0,r.kt)("h2",{id:"pre-update-interceptor"},"Pre Update interceptor"),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"preUpdate")," option can be used to intercept the ",(0,r.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent"},(0,r.kt)("inlineCode",{parentName:"a"},"MessageEvent")),"\nand modify the data to be synchronized taking into account other properties of the event."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { includeKeys, syncState } from 'elf-sync-state';\nimport { authStore } from './auth.store';\n\nsyncState(authStore, {\n  preUpdate: (event) => {\n    console.log(event);\n    return event.origin === '' ? undefined : event.data;\n  },\n});\n")),(0,r.kt)("h2",{id:"integration-with-elf"},"Integration with Elf"),(0,r.kt)("p",null,"The use of this library has been tested together with other Elf libraries, such as ",(0,r.kt)("a",{parentName:"p",href:"../features/entities-management/entities"},"elf-entities"),", ",(0,r.kt)("a",{parentName:"p",href:"../features/persist-state"},"elf-persist-state")," or ",(0,r.kt)("a",{parentName:"p",href:"../features/history"},"elf-state-history"),". I have also tried to be consistent with their programming style and documentation to help with integration."),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://stackblitz.com/edit/angular-elf-sync-state?devToolsHeight=33&file=src/app/todo.repository.ts"},"Here")," you can see an example of using all of these in an Angular application. Just open the result in two different tabs to see the library in action."),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"\u26a0\ufe0f There may be a desync due to hot reload")))}u.isMDXComponent=!0}}]);