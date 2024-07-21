"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[900],{5680:(e,t,r)=>{r.d(t,{xA:()=>g,yg:()=>m});var n=r(6540);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},s=Object.keys(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var i=n.createContext({}),c=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},g=function(e){var t=c(e.components);return n.createElement(i.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},y=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,s=e.originalType,i=e.parentName,g=l(e,["components","mdxType","originalType","parentName"]),p=c(r),y=o,m=p["".concat(i,".").concat(y)]||p[y]||u[y]||s;return r?n.createElement(m,a(a({ref:t},g),{},{components:r})):n.createElement(m,a({ref:t},g))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var s=r.length,a=new Array(s);a[0]=y;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l[p]="string"==typeof e?e:o,a[1]=l;for(var c=2;c<s;c++)a[c]=r[c];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}y.displayName="MDXCreateElement"},3754:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>a,default:()=>u,frontMatter:()=>s,metadata:()=>l,toc:()=>c});var n=r(8168),o=(r(6540),r(5680));const s={},a="Registry",l={unversionedId:"miscellaneous/registry",id:"miscellaneous/registry",title:"Registry",description:"Elf keeps your stores in a registry and exposes the following functions:",source:"@site/docs/miscellaneous/registry.mdx",sourceDirName:"miscellaneous",slug:"/miscellaneous/registry",permalink:"/elf/docs/miscellaneous/registry",draft:!1,editUrl:"https://github.com/ngneat/elf/docusaurus/edit/main/website/docs/miscellaneous/registry.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"Operators",permalink:"/elf/docs/miscellaneous/operators"},next:{title:"Hooks",permalink:"/elf/docs/miscellaneous/hooks"}},i={},c=[{value:"getRegistry",id:"getregistry",level:2},{value:"getStore",id:"getstore",level:2},{value:"getStoresSnapshot",id:"getstoressnapshot",level:2},{value:"registry$",id:"registry-1",level:2}],g={toc:c},p="wrapper";function u(e){let{components:t,...r}=e;return(0,o.yg)(p,(0,n.A)({},g,r,{components:t,mdxType:"MDXLayout"}),(0,o.yg)("h1",{id:"registry"},"Registry"),(0,o.yg)("p",null,"Elf keeps your stores in a ",(0,o.yg)("inlineCode",{parentName:"p"},"registry")," and exposes the following functions:"),(0,o.yg)("h2",{id:"getregistry"},"getRegistry"),(0,o.yg)("p",null,"Get the the registry:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import { getRegistry } from '@ngneat/elf';\n\nconst stores = getRegistry();\n")),(0,o.yg)("h2",{id:"getstore"},"getStore"),(0,o.yg)("p",null,"Get a reference to a store by name:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import { getStore } from '@ngneat/elf';\n\nconst todosStore = getStore('name');\n")),(0,o.yg)("h2",{id:"getstoressnapshot"},"getStoresSnapshot"),(0,o.yg)("p",null,"Get a snapshot of stores values:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import { getStoresSnapshot } from '@ngneat/elf';\n\nconst storesValues = getStoresSnapshot();\n")),(0,o.yg)("h2",{id:"registry-1"},"registry$"),(0,o.yg)("p",null,"An observable that emits when a store is added or removed:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-ts"},"import { registry$ } from '@ngneat/elf';\n\nregistry$.subscribe(event => {\n  // event = { type: 'add' | 'remove'; store: Store }\n})\n")))}u.isMDXComponent=!0}}]);