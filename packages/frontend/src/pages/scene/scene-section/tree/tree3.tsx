// import {
//   ContextMenu,
//   ContextMenuContent,
//   ContextMenuItem,
//   ContextMenuSeparator,
//   ContextMenuSub,
//   ContextMenuSubContent,
//   ContextMenuSubTrigger,
//   ContextMenuTrigger,
// } from '@devtool/frontend/components/ui/context-menu';
// import { useMemo, useState } from 'react';
// import {
//   CreateHandler,
//   CursorProps,
//   DeleteHandler,
//   MoveHandler,
//   NodeApi,
//   NodeRendererProps,
//   RenameHandler,
//   SimpleTree,
//   SimpleTreeData,
//   Tree,
// } from 'react-arborist';
// import {
//   FaPlus as LayerIconClosed,
//   FaMinus as LayerIconOpen,
//   FaRegObjectGroup as SceneNodeIcon,
// } from 'react-icons/fa6';
// import AutoSizer from 'react-virtualized-auto-sizer';
// import { useDevtoolStore } from '../../../App';
// import { Input as Iinput } from '../../../components/ui/input';
// import { cn } from '../../../lib/utils';
// import { SceneGraphEntry } from '../../../types';

// interface PanelProps {
//   children: React.ReactNode;
//   onSearch?: (searchTerm: string) => void;
// }
// const Panel: React.FC<PanelProps> = ({ children, onSearch }) => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     onSearch?.(e.target.value);
//   };

//   return (
//     <>
//       <div className="relative left-0 top-0 w-full overflow-hidden">
//         {/* panel wrapper */}
//         <div className="flex h-full flex-col">
//           {/* search bar */}
//           <div className="border-border flex h-8 max-h-8 items-center border-b">
//             {/* search wrapper */}
//             <div className="hover:border-b-primary inline-block h-8 w-auto min-w-0 flex-1 cursor-text align-middle hover:border-b-2">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="h-8 w-full border-none bg-transparent p-2 outline-none"
//                 value={searchTerm}
//                 onChange={handleSearch}
//               />
//             </div>
//           </div>
//           {/* content */}
//           <div className="flex-1 overflow-auto p-2">
//             <div className="h-full min-w-max text-sm">{children}</div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// function Input({ node }: { node: NodeApi<SceneGraphEntry> }) {
//   return (
//     <Iinput
//       autoFocus
//       type="text"
//       defaultValue={node.data.name}
//       onFocus={(e) => e.currentTarget.select()}
//       onBlur={() => node.reset()}
//       onKeyDown={(e) => {
//         if (e.key === 'Escape') node.reset();
//         if (e.key === 'Enter') node.submit(e.currentTarget.value);
//       }}
//       className="bg-background max-h-[22px]"
//     />
//   );
// }

// function FolderArrow({ node }: { node: NodeApi<SceneGraphEntry> }) {
//   if (node.isLeaf)
//     return (
//       <span>
//         <SceneNodeIcon />
//       </span>
//     );
//   return <span>{node.isOpen ? <LayerIconOpen /> : <LayerIconClosed />}</span>;
// }

// function Cursor({ top, left, indent }: CursorProps) {
//   return (
//     <div className="pointer-events-none absolute flex items-center" style={{ top: top - 2, left, right: indent }}>
//       <div className="absolute h-1 w-full border-t-2 border-dotted"></div>
//     </div>
//   );
// }

// function Node({ node, style, dragHandle }: NodeRendererProps<SceneGraphEntry>) {
//   const onClick = () => {
//     node.isInternal && node.toggle();
//   };
//   return (
//     <ContextMenu>
//       <ContextMenuTrigger>
//         <div
//           ref={dragHandle}
//           style={style}
//           className={cn('mb-1 flex h-full items-center gap-2 leading-5', node.state)}
//           onDoubleClick={onClick}
//         >
//           <span onClick={onClick}>
//             <FolderArrow node={node} />
//           </span>
//           <span onClick={onClick}>{node.isEditing ? <Input node={node} /> : node.data.name}</span>
//         </div>
//       </ContextMenuTrigger>
//       <ContextMenuContent>
//         <ContextMenuItem onClick={onClick}>Toggle</ContextMenuItem>
//         <ContextMenuSub>
//           <ContextMenuSubTrigger>Add Node</ContextMenuSubTrigger>
//           <ContextMenuSubContent className="w-48">
//             <ContextMenuItem>Container</ContextMenuItem>
//             <ContextMenuItem>Sprite</ContextMenuItem>
//             <ContextMenuItem>Create Shortcut...</ContextMenuItem>
//             <ContextMenuItem>Name Window...</ContextMenuItem>
//             <ContextMenuSeparator />
//             <ContextMenuItem>Developer Tools</ContextMenuItem>
//           </ContextMenuSubContent>
//         </ContextMenuSub>
//       </ContextMenuContent>
//     </ContextMenu>
//   );
// }

// function removeEmptyChildren(node: Partial<SceneGraphEntry>) {
//   if (node.children?.length === 0) {
//     delete node.children;
//   } else if (node.children) {
//     node.children.forEach(removeEmptyChildren);
//   }
// }

// let nextId = 0;

// function useSimpleTree<T extends SimpleTreeData>(initialData: readonly T[]) {
//   const [data, setData] = useState(initialData);
//   const tree = useMemo(() => new SimpleTree<T>(data as T[]), [data]);

//   const onMove: MoveHandler<T> = (args: { dragIds: string[]; parentId: null | string; index: number }) => {
//     for (const id of args.dragIds) {
//       tree.move({ id, parentId: args.parentId, index: args.index });
//     }
//     setData(tree.data);
//   };

//   const onRename: RenameHandler<T> = ({ name, id }) => {
//     tree.update({ id, changes: { name } as any });
//     setData(tree.data);
//   };

//   const onCreate: CreateHandler<T> = ({ parentId, index, type }) => {
//     const data = { id: `simple-tree-id-${nextId++}`, name: '' } as any;
//     if (type === 'internal') data.children = [];
//     tree.create({ parentId, index, data });
//     setData(tree.data);
//     return data;
//   };

//   const onDelete: DeleteHandler<T> = (args: { ids: string[] }) => {
//     args.ids.forEach((id) => tree.drop({ id }));
//     setData(tree.data);
//     console.log(tree.data);
//   };

//   const controller = { onMove, onRename, onDelete };

//   return [data, controller] as const;
// }

// export const Tree2: React.FC = () => {
//   const sceneGraph = useDevtoolStore.use.sceneGraph()!;
//   const selectedNode = useDevtoolStore.use.selectedNode();
//   const sceneGraphClone = JSON.parse(JSON.stringify(sceneGraph));
//   const [currentSearch, setCurrentSearch] = useState('');

//   // loop through the sceneGraph and if the childrens array is empty, remove it
//   removeEmptyChildren(sceneGraphClone);

//   const onSearch = (searchTerm: string) => {
//     setCurrentSearch(searchTerm);
//   };

//   const [data, controller] = useSimpleTree([sceneGraphClone]);

//   return (
//     <Panel onSearch={onSearch}>
//       <AutoSizer style={{ width: '100%', height: '100%' }}>
//         {({ height }) => (
//           <Tree
//             data={data}
//             {...controller}
//             width={'100%'}
//             height={height}
//             renderCursor={Cursor}
//             searchTerm={currentSearch}
//             selection={selectedNode ? selectedNode : undefined}
//             openByDefault={false}
//             // renderContainer={}
//           >
//             {Node}
//           </Tree>
//         )}
//       </AutoSizer>
//     </Panel>
//   );
// };
