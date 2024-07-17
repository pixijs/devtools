"use strict";(self.webpackChunk_devtool_docs=self.webpackChunk_devtool_docs||[]).push([[990],{4355:(e,o,n)=>{n.r(o),n.d(o,{CustomLink:()=>h,CustomLinks:()=>p,assets:()=>c,contentTitle:()=>a,default:()=>g,frontMatter:()=>l,metadata:()=>d,toc:()=>u});var t=n(1085),i=n(1184),s=n(4041),r=n(2727);const l={sidebar_position:0,title:"Installation"},a="Installation",d={id:"guide/installation",title:"Installation",description:"hoverLogo = hoverLogo || logo;",source:"@site/docs/guide/installation.mdx",sourceDirName:"guide",slug:"/guide/installation",permalink:"/devtools/docs/guide/installation",draft:!1,unlisted:!1,editUrl:"https://github.com/pixijs/devtools/tree/main/packages/docs/docs/guide/installation.mdx",tags:[],version:"current",sidebarPosition:0,frontMatter:{sidebar_position:0,title:"Installation"},sidebar:"guide",next:{title:"Scene",permalink:"/devtools/docs/guide/features/scene"}},c={},h=({logo:e,hoverLogo:o,label:n,href:l,external:a})=>{const d={a:"a",img:"img",...(0,i.R)()},[c,h]=s.useState(!1),{colorMode:p}=(0,r.G)();o=o||e;const u="dark"===p?"var(--ifm-color-primary-darker)":"var(--ifm-color-primary-light)",x={border:"1px solid #f3f4f6",borderRadius:"0.375rem",display:"flex",alignItems:"center",gap:"1rem",padding:"1rem",textDecoration:"none",color:c?"white":"inherit",backgroundColor:c?u:"transparent",borderColor:c?u:"#f3f4f6"};return(0,t.jsxs)(d.a,{href:l,target:a?"_blank":void 0,rel:a?"noopener noreferrer":void 0,style:x,onMouseEnter:()=>h(!0),onMouseLeave:()=>h(!1),children:[(0,t.jsx)(d.img,{src:c?o:e,alt:n,style:{maxWidth:"2rem",maxHeight:"2rem"}}),n]})},p=({links:e})=>{const o={div:"div",...(0,i.R)()};return(0,t.jsx)(o.div,{style:{display:"flex",flexDirection:"column",gap:"1rem",justifyContent:"center"},children:e.map(((e,o)=>(0,t.jsx)(h,{...e},o)))})},u=[{value:"Extensions",id:"extensions",level:2},{value:"Application Setup",id:"application-setup",level:2},{value:"Automatic Setup",id:"automatic-setup",level:3},{value:"Manual Setup",id:"manual-setup",level:3},{value:"LastRenderedObject",id:"lastrenderedobject",level:3},{value:"Unofficial Setup",id:"unofficial-setup",level:3}];function x(e){const o={admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.h1,{id:"installation",children:"Installation"}),"\n",(0,t.jsx)(o.admonition,{title:"PixiJS Support",type:"info",children:(0,t.jsxs)(o.p,{children:["This extension is designed to work with PixiJS ",(0,t.jsx)(o.code,{children:"v7"}),"/",(0,t.jsx)(o.code,{children:"v8"})," applications."]})}),"\n",(0,t.jsx)(o.h2,{id:"extensions",children:"Extensions"}),"\n",(0,t.jsx)(o.p,{children:"Install the PixiJS Devtools extension through the Chrome Web Store, or download the latest release from GitHub."}),"\n",(0,t.jsx)(p,{links:[{label:"Install on Chrome",logo:"/devtools/img/logo-chrome.svg",hoverLogo:"/devtools/img/logo-chrome.svg",href:"https://chrome.google.com/webstore/detail/pixijs-devtools/dlkffcaaoccbofklocbjcmppahjjboce",external:!0},{label:"Install latest release",logo:"/devtools/img/logo.svg",hoverLogo:"/devtools/img/logo-light.svg",href:"https://github.com/pixijs/devtools/releases",external:!0}]}),"\n",(0,t.jsx)(o.hr,{}),"\n",(0,t.jsx)(o.h2,{id:"application-setup",children:"Application Setup"}),"\n",(0,t.jsx)(o.p,{children:"To use the extension, you need to set up the devtool in your application. There are a couple of ways to do this:"}),"\n",(0,t.jsx)(o.h3,{id:"automatic-setup",children:"Automatic Setup"}),"\n",(0,t.jsxs)(o.p,{children:["The preferred method for setting up the devtool is to install the ",(0,t.jsx)(o.code,{children:"@pixi/devtools"})," package."]}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-bash",children:"npm install @pixi/devtools\n"})}),"\n",(0,t.jsxs)(o.p,{children:["To enable the devtool, you need to configure it with your PixiJS application. This is done by setting the ",(0,t.jsx)(o.code,{children:"app"})," property in the configuration object,\nor you can pass the ",(0,t.jsx)(o.code,{children:"stage"})," and ",(0,t.jsx)(o.code,{children:"renderer"})," properties directly if you are not using the ",(0,t.jsx)(o.code,{children:"Application"})," class."]}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-js",children:"import { initDevtools } from '@pixi/devtools';\n\ninitDevtools({ app });\n// or\ninitDevtools({ stage, renderer });\n"})}),"\n",(0,t.jsxs)(o.p,{children:["The benefit of using the ",(0,t.jsx)(o.code,{children:"@pixi/devtools"})," package is that you get TypeScript support for extension development,\nand the package will automatically import ",(0,t.jsx)(o.code,{children:"pixi.js"})," dynamically if you do not provide pixi in the configuration."]}),"\n",(0,t.jsx)(o.hr,{}),"\n",(0,t.jsx)(o.h3,{id:"manual-setup",children:"Manual Setup"}),"\n",(0,t.jsxs)(o.p,{children:["Alternatively, you can manually set up the devtool by configuring the ",(0,t.jsx)(o.code,{children:"window.__PIXI_DEVTOOLS__"})," object directly."]}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-js",children:"window.__PIXI_DEVTOOLS__ = {\n  app\n};\n"})}),"\n",(0,t.jsxs)(o.p,{children:["If you are not using the PixiJS ",(0,t.jsx)(o.code,{children:"Application"})," class, you can set the ",(0,t.jsx)(o.code,{children:"stage"})," and ",(0,t.jsx)(o.code,{children:"renderer"})," properties directly."]}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-js",children:"window.__PIXI_DEVTOOLS__ = {\n  stage,\n  renderer\n};\n"})}),"\n",(0,t.jsx)(o.hr,{}),"\n",(0,t.jsx)(o.h3,{id:"lastrenderedobject",children:"LastRenderedObject"}),"\n",(0,t.jsxs)(o.p,{children:["If you do not provide a ",(0,t.jsx)(o.code,{children:"stage"})," then the devtool will use the last rendered object as the root of the tree. This is less accurate than providing the ",(0,t.jsx)(o.code,{children:"stage"})," directly,\nso it is recommended to provide the ",(0,t.jsx)(o.code,{children:"stage"})," if possible."]}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-js",children:"window.__PIXI_DEVTOOLS__ = {\n  renderer\n};\n"})}),"\n",(0,t.jsx)(o.hr,{}),"\n",(0,t.jsx)(o.h3,{id:"unofficial-setup",children:"Unofficial Setup"}),"\n",(0,t.jsxs)(o.p,{children:["Before the PixiJS team released our extension, there was an unofficial ",(0,t.jsx)(o.code,{children:"pixi-inspector"})," extension available. Due to the popularity of this extension we have made an effort to\nmake the same setup work with the our extension."]}),"\n",(0,t.jsx)(o.p,{children:"The setup below is not recommended but is still available for those who are using the other extension."}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-js",children:"window.__PIXI_APP__ = app;\n// or\nwindow.__PIXI_STAGE__ = yourContainer;\nwindow.__PIXI_RENDERER__ = yourRenderer;\n"})})]})}function g(e={}){const{wrapper:o}={...(0,i.R)(),...e.components};return o?(0,t.jsx)(o,{...e,children:(0,t.jsx)(x,{...e})}):x(e)}},1184:(e,o,n)=>{n.d(o,{R:()=>r,x:()=>l});var t=n(4041);const i={},s=t.createContext(i);function r(e){const o=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function l(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),t.createElement(s.Provider,{value:o},e.children)}}}]);