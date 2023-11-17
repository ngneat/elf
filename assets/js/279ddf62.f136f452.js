"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[369],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,s=e.originalType,l=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),u=p(n),f=o,d=u["".concat(l,".").concat(f)]||u[f]||m[f]||s;return n?r.createElement(d,i(i({ref:t},c),{},{components:n})):r.createElement(d,i({ref:t},c))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var s=n.length,i=new Array(s);i[0]=f;var a={};for(var l in t)hasOwnProperty.call(t,l)&&(a[l]=t[l]);a.originalType=e,a[u]="string"==typeof e?e:o,i[1]=a;for(var p=2;p<s;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},9260:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>m,frontMatter:()=>s,metadata:()=>a,toc:()=>p});var r=n(7462),o=(n(7294),n(3905));const s={},i="Stale emission",a={unversionedId:"troubleshooting/stale-emission",id:"troubleshooting/stale-emission",title:"Stale emission",description:"If you have two properties(for example filter and counter) in the store and queries for them and on subscription emission of the filter$ you're updating counter property then you will get stale emission. Let's see the code example:",source:"@site/docs/troubleshooting/stale-emission.mdx",sourceDirName:"troubleshooting",slug:"/troubleshooting/stale-emission",permalink:"/elf/docs/troubleshooting/stale-emission",draft:!1,editUrl:"https://github.com/ngneat/elf/docusaurus/edit/main/website/docs/troubleshooting/stale-emission.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"Sync State",permalink:"/elf/docs/third-party/sync-state"},next:{title:"FAQ",permalink:"/elf/docs/faq"}},l={},p=[],c={toc:p},u="wrapper";function m(e){let{components:t,...n}=e;return(0,o.kt)(u,(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"stale-emission"},"Stale emission"),(0,o.kt)("p",null,"If you have two properties(for example ",(0,o.kt)("inlineCode",{parentName:"p"},"filter")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"counter"),") in the store and queries for them and on subscription emission of the ",(0,o.kt)("inlineCode",{parentName:"p"},"filter$")," you're updating ",(0,o.kt)("inlineCode",{parentName:"p"},"counter")," property then you will get stale emission. Let's see the code example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="store.ts"',title:'"store.ts"'},"import { createStore, withProps, select } from '@ngneat/elf';\n\ninterface Props {\n  filter: string | null;\n  counter: number;\n}\n\nexport const store = createStore(\n  { name: 'todo' },\n  withProps<Props>({ filter: null, counter: 0 })\n);\n\nexport const filter$ = store.pipe(select(({ filters }) => filters));\nexport const counter$ = store.pipe(select(({ counter }) => counter));\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="component.ts"',title:'"component.ts"'},"import { filter$, counter$, store } from './store.ts';\n\n// FIRST SUBSCRIBER\nfilter$.subscribe(() => {\n  store.update((state) => ({\n    ...state,\n    counter: state.counter + 1,\n  }));\n});\n\n// SECOND SUBSCRIBER\ncounter$.subscribe((counter) => {\n  console.log(counter);\n});\n\n// Update the filter\nstore.update((state) => ({\n  ...state,\n  filter: 'test',\n}));\n")),(0,o.kt)("p",null,"Why would we see ",(0,o.kt)("strong",{parentName:"p"},"1 2 1")," in logs? Once ",(0,o.kt)("inlineCode",{parentName:"p"},"FIRST SUBSCRIBER")," receives first emission on subscribing it updates counter to ",(0,o.kt)("strong",{parentName:"p"},"1"),". After that, ",(0,o.kt)("inlineCode",{parentName:"p"},"SECOND SUBSCRIBER")," receives first emission on subscribing and logs ",(0,o.kt)("strong",{parentName:"p"},"1"),". When we update the filter it first passes to ",(0,o.kt)("inlineCode",{parentName:"p"},"FIRST SUBSCRIBER")," which updates the ",(0,o.kt)("inlineCode",{parentName:"p"},"counter")," property. The ",(0,o.kt)("inlineCode",{parentName:"p"},"SECOND SUBSCRIBER")," receives this emission and logs the value ",(0,o.kt)("strong",{parentName:"p"},"2"),". But the ",(0,o.kt)("inlineCode",{parentName:"p"},"SECOND SUBSCRIBER")," will still receive the value ",(0,o.kt)("strong",{parentName:"p"},"1"),", since the emission of the filter update is still in the pipeline with a ",(0,o.kt)("strong",{parentName:"p"},"staled")," state."),(0,o.kt)("p",null,"There are two ways to get around this issue:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Change the subscriptions order - ",(0,o.kt)("inlineCode",{parentName:"li"},"SECONED SUBSCRIBER")," and then ",(0,o.kt)("inlineCode",{parentName:"li"},"FIRST SUBSCRIBER"),":")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="component.ts"',title:'"component.ts"'},"import { filter$, counter$, store } from './store.ts';\n\ncounter$.subscribe((counter) => {\n  console.log(counter);\n});\n\nfilter$.subscribe(() => {\n  store.update((state) => ({\n    ...state,\n    counter: state.counter + 1,\n  }));\n});\n")),(0,o.kt)("ol",{start:2},(0,o.kt)("li",{parentName:"ol"},"Delay the ",(0,o.kt)("inlineCode",{parentName:"li"},"FIRST SUBSCRIBER")," update using one of RxJS operators. (e.g auditTime(0)):")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="component.ts"',title:'"component.ts"'},"import { filter$, counter$, store } from './store.ts';\nimport { auditTime } from 'rxjs';\n\nfilter$.pipe(auditTime(0)).subscribe(() => {\n  store.update((state) => ({\n    ...state,\n    counter: state.counter + 1,\n  }));\n});\n\ncounter$.subscribe((counter) => {\n  console.log(counter);\n});\n")))}m.isMDXComponent=!0}}]);