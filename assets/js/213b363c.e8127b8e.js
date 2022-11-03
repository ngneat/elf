"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[697],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return d}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=l(n),d=o,f=m["".concat(c,".").concat(d)]||m[d]||u[d]||i;return n?r.createElement(f,a(a({ref:t},p),{},{components:n})):r.createElement(f,a({ref:t},p))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=m;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var l=2;l<i;l++)a[l]=n[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5666:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return l},toc:function(){return p},default:function(){return m}});var r=n(7462),o=n(3366),i=(n(7294),n(3905)),a=["components"],s={},c="Recipes",l={unversionedId:"recipes",id:"recipes",isDocsHomePage:!1,title:"Recipes",description:"Selectors Optimization",source:"@site/docs/recipes.mdx",sourceDirName:".",slug:"/recipes",permalink:"/elf/docs/recipes",editUrl:"https://github.com/ngneat/elf/docusaurus/edit/main/website/docs/recipes.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"Batching",permalink:"/elf/docs/miscellaneous/batching"},next:{title:"Sync State",permalink:"/elf/docs/third-party/sync-state"}},p=[{value:"Selectors Optimization",id:"selectors-optimization",children:[],level:2},{value:"Reset Stores",id:"reset-stores",children:[],level:2}],u={toc:p};function m(e){var t=e.components,n=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"recipes"},"Recipes"),(0,i.kt)("h2",{id:"selectors-optimization"},"Selectors Optimization"),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Beware of premature optimizations"))),(0,i.kt)("p",null,"Imagine we have a ",(0,i.kt)("inlineCode",{parentName:"p"},"todos")," store and we subscribe to the following selectors twice, at two different places simultaneously:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="todos.repository.ts"',title:'"todos.repository.ts"'},"export const todos$ = store.pipe(selectAllEntities());\n\n// One component\nuseObservable(todos$) // React\ntodos$ | async // Angular\n\n// Second component\nuseObservable(todos$) // React\ntodos$ | async // Angular\n")),(0,i.kt)("p",null,"Due to the nature of observables, the ",(0,i.kt)("inlineCode",{parentName:"p"},"selectAllEntities()")," operator will map over the entities twice, once for each subscription. We can use the ",(0,i.kt)("inlineCode",{parentName:"p"},"shareReplay")," operator to optimize it:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="todos.repository.ts"',title:'"todos.repository.ts"'},"import { shareReplay } from 'rxjs/operators';\n\nexport const todos$ = store.pipe(selectAllEntities(), shareReplay({ refCount: true }))\n")),(0,i.kt)("p",null,"With this change, the ",(0,i.kt)("inlineCode",{parentName:"p"},"selectAllEntities")," operator will now share the result with every subscriber."),(0,i.kt)("h2",{id:"reset-stores"},"Reset Stores"),(0,i.kt)("p",null,"Resetting your stores can be useful when you want to clean the store's data upon user logout. We can combine the ",(0,i.kt)("inlineCode",{parentName:"p"},"registry")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"store.reset()")," to create a ",(0,i.kt)("inlineCode",{parentName:"p"},"resetStores")," function:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { getRegistry } from '@ngneat/elf';\n\nexport function resetStores() {\n  getRegistry().forEach(store => store.reset())\n}\n")))}m.isMDXComponent=!0}}]);