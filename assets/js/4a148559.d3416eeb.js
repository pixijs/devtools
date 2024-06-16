"use strict";(self.webpackChunk_devtool_docs=self.webpackChunk_devtool_docs||[]).push([[746],{2617:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>r,default:()=>p,frontMatter:()=>i,metadata:()=>l,toc:()=>h});var t=s(1085),o=s(1184);const i={sidebar_position:3},r="F.A.Q",l={id:"guide/faq",title:"F.A.Q",description:"The PixiJS Devtools don't show up",source:"@site/docs/guide/faq.md",sourceDirName:"guide",slug:"/guide/faq",permalink:"/devtools/docs/guide/faq",draft:!1,unlisted:!1,editUrl:"https://github.com/pixijs/devtools/tree/main/packages/docs/docs/guide/faq.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"guide",previous:{title:"Features",permalink:"/devtools/docs/guide/features"}},d={},h=[{value:"The PixiJS Devtools don&#39;t show up",id:"the-pixijs-devtools-dont-show-up",level:2},{value:"Scene isn&#39;t updating in the Devtools",id:"scene-isnt-updating-in-the-devtools",level:2},{value:"Property is not displayed",id:"property-is-not-displayed",level:2}];function c(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",hr:"hr",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.R)(),...e.components},{Details:s}=n;return s||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"faq",children:"F.A.Q"}),"\n",(0,t.jsx)(n.h2,{id:"the-pixijs-devtools-dont-show-up",children:"The PixiJS Devtools don't show up"}),"\n",(0,t.jsx)(n.p,{children:"Here are some troubleshooting steps to help you if you don't the PixiJS devtools in your browser:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Check if the extension is installed and enabled:"}),"\n",(0,t.jsxs)(n.p,{children:["Open the Chrome extensions page by typing ",(0,t.jsx)(n.code,{children:"chrome://extensions"})," in the address bar. Make sure the PixiJS Devtools extension is installed and enabled.\nIf it's not installed, please read the ",(0,t.jsx)(n.a,{href:"/docs/guide/installation",children:"installation guide"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Try closing the devtools pane, refreshing the page and opening the devtools pane again**."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Try restarting the browser or the computer."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"If you have multiple pages with the PixiJS Devtools open, try closing all of them and opening a new one."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"If you have multiple versions of the devtools installed, it's recommended to disable/remove the others. n"}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Look for errors in the browser Console."}),"\n",(0,t.jsxs)(n.p,{children:["If you see any errors, please report them in the ",(0,t.jsx)(n.a,{href:"https://github.com/pixijs/devtools/issues",children:"GitHub issues"}),"."]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsx)(n.h2,{id:"scene-isnt-updating-in-the-devtools",children:"Scene isn't updating in the Devtools"}),"\n",(0,t.jsx)(n.p,{children:"If the scene isn't updating in the devtools, try the following steps:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Close the devtools pane."}),"\n",(0,t.jsx)(n.li,{children:"Refresh the page."}),"\n",(0,t.jsx)(n.li,{children:"Open the devtools pane again."}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"If the scene still isn't updating, try looking for errors in the console:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Open the browser console, you can do this by pressing ",(0,t.jsx)(n.code,{children:"ESC"})]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:'Look for errors in the devtools Console.\nYou can open the devtools console by right-clicking on the devtools pane and selecting "Inspect".'}),"\n",(0,t.jsxs)(s,{children:[(0,t.jsx)("summary",{children:"How to open the devtools console"}),(0,t.jsx)("img",{src:"/devtools/gif/devtool-right-click.gif",alt:"Right click on the devtools pane and select Inspect"})]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["If you see any errors, please report them in the ",(0,t.jsx)(n.a,{href:"https://github.com/pixijs/devtools/issues",children:"GitHub issues"}),"."]}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsx)(n.h2,{id:"property-is-not-displayed",children:"Property is not displayed"}),"\n",(0,t.jsx)(n.p,{children:"If a property is not displayed in the devtools, it might be because the property is not set on the object."}),"\n",(0,t.jsxs)(n.p,{children:["For example, the ",(0,t.jsx)(n.code,{children:"filterArea"})," property is not displayed in the devtool until it's set on the object in your code.\nTo get the property to display, you can set it on the object like this:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:"const sprite = new Sprite(texture);\nsprite.filterArea = new Rectangle(0, 0, 100, 100);\n"})}),"\n",(0,t.jsxs)(n.p,{children:["If you think a property should be displayed, please report it in the ",(0,t.jsx)(n.a,{href:"https://github.com/pixijs/devtools/issues",children:"GitHub issues"}),"."]})]})}function p(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},1184:(e,n,s)=>{s.d(n,{R:()=>r,x:()=>l});var t=s(4041);const o={},i=t.createContext(o);function r(e){const n=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),t.createElement(i.Provider,{value:n},e.children)}}}]);