"use strict";(self.webpackChunk_devtool_docs=self.webpackChunk_devtool_docs||[]).push([[663],{6754:(e,i,n)=>{n.r(i),n.d(i,{Gif:()=>a,assets:()=>d,contentTitle:()=>l,default:()=>g,frontMatter:()=>s,metadata:()=>r,toc:()=>c});var o=n(1085),t=n(1184);n(4041);const s={sidebar_position:2,title:"Features"},l="Features",r={id:"guide/features",title:"Features",description:"Editing PixiJS Objects",source:"@site/docs/guide/features.mdx",sourceDirName:"guide",slug:"/guide/features",permalink:"/devtools/docs/guide/features",draft:!1,unlisted:!1,editUrl:"https://github.com/pixijs/devtools/tree/main/packages/docs/docs/guide/features.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,title:"Features"},sidebar:"guide",previous:{title:"Installation",permalink:"/devtools/docs/guide/installation"},next:{title:"F.A.Q",permalink:"/devtools/docs/guide/faq"}},d={},a=({src:e,alt:i})=>{const n={div:"div",img:"img",...(0,t.R)()};return(0,o.jsx)(n.div,{style:{display:"flex",justifyContent:"center",padding:"2rem 4rem",paddingTop:"1rem"},children:(0,o.jsx)(n.img,{src:e,alt:i,style:{maxWidth:"100%",borderRadius:"0.5rem",border:"1px solid #676767"}})})},c=[{value:"Editing PixiJS Objects",id:"editing-pixijs-objects",level:2},{value:"Searching for PixiJS Objects",id:"searching-for-pixijs-objects",level:3},{value:"Overlay Highlight",id:"overlay-highlight",level:2},{value:"Selection",id:"selection",level:2},{value:"Stats",id:"stats",level:2},{value:"Rename Nodes",id:"rename-nodes",level:2},{value:"Deleting Nodes",id:"deleting-nodes",level:2},{value:"Reparenting Nodes",id:"reparenting-nodes",level:2},{value:"Locking Nodes",id:"locking-nodes",level:2},{value:"Copying Properties",id:"copying-properties",level:2},{value:"Ignoring Nodes",id:"ignoring-nodes",level:2}];function h(e){const i={admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(i.h1,{id:"features",children:"Features"}),"\n",(0,o.jsx)(i.h2,{id:"editing-pixijs-objects",children:"Editing PixiJS Objects"}),"\n",(0,o.jsx)(i.p,{children:"The PixiJS Devtools allows you to edit the properties of PixiJS objects in real-time."}),"\n",(0,o.jsx)(i.p,{children:"You can change the properties of a PixiJS object and see the changes reflected in the scene immediately.\nThis includes properties such as position, scale, rotation, and more."}),"\n",(0,o.jsx)(a,{src:"/devtools/gif/devtool-properties.gif",alt:"Editing PixiJS objects in the PixiJS Devtools"}),"\n",(0,o.jsxs)(i.admonition,{type:"info",children:[(0,o.jsx)(i.p,{children:"By default pixi properties that do not exist on the object are not shown."}),(0,o.jsxs)(i.p,{children:["For example ",(0,o.jsx)(i.code,{children:"filterArea"})," is not shown in the devtools until it's set on the object in your code."]}),(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{className:"language-js",children:"const sprite = new Sprite(texture);\nsprite.filterArea = new Rectangle(0, 0, 100, 100);\n"})})]}),"\n",(0,o.jsx)(i.h3,{id:"searching-for-pixijs-objects",children:"Searching for PixiJS Objects"}),"\n",(0,o.jsx)(i.p,{children:"The search feature in the PixiJS Devtools allows you to search for specific PixiJS objects in the scene by their name or other properties,\nmaking it easier to locate and edit objects in complex scenes."}),"\n",(0,o.jsx)(a,{src:"/devtools/gif/devtool-search.gif",alt:"Searching for PixiJS objects in the PixiJS Devtools"}),"\n",(0,o.jsx)(i.hr,{}),"\n",(0,o.jsx)(i.h2,{id:"overlay-highlight",children:"Overlay Highlight"}),"\n",(0,o.jsx)(i.p,{children:"The overlay feature in the PixiJS Devtools allows you to highlight the bounds of a PixiJS object in the scene.\nThis is useful for debugging layout and alignment issues."}),"\n",(0,o.jsx)(a,{src:"/devtools/gif/devtool-highlight.gif",alt:"Highlight overlay for the PixiJS Devtools"}),"\n",(0,o.jsx)(i.hr,{}),"\n",(0,o.jsx)(i.h2,{id:"selection",children:"Selection"}),"\n",(0,o.jsx)(i.p,{children:"The selection feature in the PixiJS Devtools allows you to select specific PixiJS objects in the scene, enabling focused editing and inspection."}),"\n",(0,o.jsx)(a,{src:"/devtools/gif/devtool-selection.gif",alt:"Selecting nodes in the PixiJS Devtools"}),"\n",(0,o.jsx)(i.hr,{}),"\n",(0,o.jsx)(i.h2,{id:"stats",children:"Stats"}),"\n",(0,o.jsx)(i.p,{children:"The stats feature in the PixiJS Devtools allows you to view the total number of PixiJS objects in the scene.\nThis can help you identify performance issues and optimize your application."}),"\n",(0,o.jsx)(a,{src:"/devtools/gif/devtool-stats.gif",alt:"Viewing stats in the PixiJS Devtools"}),"\n",(0,o.jsx)(i.hr,{}),"\n",(0,o.jsx)(i.h2,{id:"rename-nodes",children:"Rename Nodes"}),"\n",(0,o.jsx)(i.p,{children:"The rename nodes feature in the PixiJS Devtools allows you to rename specific PixiJS objects in the scene,\nwhich is particularly useful for organizing and managing your scene graph."}),"\n",(0,o.jsx)(a,{src:"/devtools/gif/devtool-rename.gif",alt:"Renaming nodes in the PixiJS Devtools"}),"\n",(0,o.jsx)(i.hr,{}),"\n",(0,o.jsx)(i.h2,{id:"deleting-nodes",children:"Deleting Nodes"}),"\n",(0,o.jsx)(i.p,{children:"The delete nodes feature in the PixiJS Devtools allows you to delete specific PixiJS objects from the scene, helping you to manage debug your scene graph."}),"\n",(0,o.jsx)(a,{src:"/devtools/gif/devtool-delete.gif",alt:"Deleting nodes in the PixiJS Devtools"}),"\n",(0,o.jsx)(i.hr,{}),"\n",(0,o.jsx)(i.h2,{id:"reparenting-nodes",children:"Reparenting Nodes"}),"\n",(0,o.jsx)(i.p,{children:"The reparent nodes feature in the PixiJS Devtools allows you to move your PixiJS objects around the scene.\nThis can be useful for debugging layout issues."}),"\n",(0,o.jsx)(a,{src:"/devtools/gif/devtool-reparent.gif",alt:"Reparenting nodes in the PixiJS Devtools"}),"\n",(0,o.jsx)(i.hr,{}),"\n",(0,o.jsx)(i.h2,{id:"locking-nodes",children:"Locking Nodes"}),"\n",(0,o.jsx)(i.p,{children:"The lock nodes feature in the PixiJS Devtools allows you to lock specific PixiJS objects in the scene."}),"\n",(0,o.jsx)(i.p,{children:"This means that the node can no longer by edited, moved, deleted, or selected using the selection tool."}),"\n",(0,o.jsx)(a,{src:"/devtools/gif/devtool-lock.gif",alt:"Locking nodes in the PixiJS Devtools"}),"\n",(0,o.jsx)(i.hr,{}),"\n",(0,o.jsx)(i.h2,{id:"copying-properties",children:"Copying Properties"}),"\n",(0,o.jsx)(i.p,{children:"The copy properties feature in the PixiJS Devtools allows you to copy specific properties of a PixiJS object and paste them back into your code, saving you time and effort."}),"\n",(0,o.jsx)(a,{src:"/devtools/gif/devtool-copy.gif",alt:"Copying properties in the PixiJS Devtools"}),"\n",(0,o.jsx)(i.hr,{}),"\n",(0,o.jsx)(i.h2,{id:"ignoring-nodes",children:"Ignoring Nodes"}),"\n",(0,o.jsx)(i.p,{children:"The ignore nodes feature in the PixiJS Devtools allows you to hide specific PixiJS objects in the scene.\nThis can be useful when you have a large number of objects in the scene and you are seeing performance issues with the devtools."}),"\n",(0,o.jsx)(i.p,{children:"You have the option to ignore a node and its children, or just its children."}),"\n",(0,o.jsx)(i.pre,{children:(0,o.jsx)(i.code,{className:"language-js",children:"// Example of ignoring a node\nconst manyChildren = new Container();\nmanyChildren.__devtoolsIgnore = true;\nmanyChildren.__devtoolsIgnoreChildren = true;\n"})}),"\n",(0,o.jsx)(i.admonition,{type:"info",children:(0,o.jsxs)(i.p,{children:["Installing ",(0,o.jsx)(i.code,{children:"@pixi/devtools"})," will automatically add the ",(0,o.jsx)(i.code,{children:"__devtoolsIgnore"})," and ",(0,o.jsx)(i.code,{children:"__devtoolsIgnoreChildren"})," types"]})})]})}function g(e={}){const{wrapper:i}={...(0,t.R)(),...e.components};return i?(0,o.jsx)(i,{...e,children:(0,o.jsx)(h,{...e})}):h(e)}},1184:(e,i,n)=>{n.d(i,{R:()=>l,x:()=>r});var o=n(4041);const t={},s=o.createContext(t);function l(e){const i=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function r(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:l(e.components),o.createElement(s.Provider,{value:i},e.children)}}}]);