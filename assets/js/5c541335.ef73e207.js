"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[806],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},s=Object.keys(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var i=n.createContext({}),c=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(i.Provider,{value:t},e.children)},u="mdxType",g={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,s=e.originalType,i=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(r),m=o,f=u["".concat(i,".").concat(m)]||u[m]||g[m]||s;return r?n.createElement(f,a(a({ref:t},p),{},{components:r})):n.createElement(f,a({ref:t},p))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var s=r.length,a=new Array(s);a[0]=m;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l[u]="string"==typeof e?e:o,a[1]=l;for(var c=2;c<s;c++)a[c]=r[c];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8424:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>a,default:()=>g,frontMatter:()=>s,metadata:()=>l,toc:()=>c});var n=r(7462),o=(r(7294),r(3905));const s={},a="Registry",l={unversionedId:"miscellaneous/registry",id:"miscellaneous/registry",title:"Registry",description:"Elf keeps your stores in a registry and exposes the following functions:",source:"@site/docs/miscellaneous/registry.mdx",sourceDirName:"miscellaneous",slug:"/miscellaneous/registry",permalink:"/elf/docs/miscellaneous/registry",draft:!1,editUrl:"https://github.com/ngneat/elf/docusaurus/edit/main/website/docs/miscellaneous/registry.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"Operators",permalink:"/elf/docs/miscellaneous/operators"},next:{title:"Hooks",permalink:"/elf/docs/miscellaneous/hooks"}},i={},c=[{value:"getRegistry",id:"getregistry",level:2},{value:"getStore",id:"getstore",level:2},{value:"getStoresSnapshot",id:"getstoressnapshot",level:2},{value:"registry$",id:"registry-1",level:2}],p={toc:c},u="wrapper";function g(e){let{components:t,...r}=e;return(0,o.kt)(u,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"registry"},"Registry"),(0,o.kt)("p",null,"Elf keeps your stores in a ",(0,o.kt)("inlineCode",{parentName:"p"},"registry")," and exposes the following functions:"),(0,o.kt)("h2",{id:"getregistry"},"getRegistry"),(0,o.kt)("p",null,"Get the the registry:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { getRegistry } from '@ngneat/elf';\n\nconst stores = getRegistry();\n")),(0,o.kt)("h2",{id:"getstore"},"getStore"),(0,o.kt)("p",null,"Get a reference to a store by name:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { getStore } from '@ngneat/elf';\n\nconst todosStore = getStore('name');\n")),(0,o.kt)("h2",{id:"getstoressnapshot"},"getStoresSnapshot"),(0,o.kt)("p",null,"Get a snapshot of stores values:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { getStoresSnapshot } from '@ngneat/elf';\n\nconst storesValues = getStoresSnapshot();\n")),(0,o.kt)("h2",{id:"registry-1"},"registry$"),(0,o.kt)("p",null,"An observable that emits when a store is added or removed:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { registry$ } from '@ngneat/elf';\n\nregistry$.subscribe(event => {\n  // event = { type: 'add' | 'remove'; store: Store }\n})\n")))}g.isMDXComponent=!0}}]);