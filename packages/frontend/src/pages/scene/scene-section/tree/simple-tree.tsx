import { BridgeFn } from '@devtool/frontend/lib/utils';
import { SceneGraphEntry } from '@devtool/frontend/types';
import { useEffect, useMemo, useState } from 'react';
import { DeleteHandler, MoveHandler, NodeApi, RenameHandler, SimpleTree } from 'react-arborist';

function removeEmptyChildren(node: Partial<SceneGraphEntry>) {
  if (node.children?.length === 0) {
    delete node.children;
  } else if (node.children) {
    node.children.forEach(removeEmptyChildren);
  }
}

export function useSimpleTree<T extends SceneGraphEntry>(bridge: BridgeFn, initialData: T) {
  removeEmptyChildren(initialData);
  const [data, setData] = useState([initialData]);
  const tree = useMemo(() => new SimpleTree<T>(data as T[]), [data]);

  useEffect(() => {
    if (JSON.stringify(data[0]) !== JSON.stringify(initialData)) {
      setData([initialData]);
    }
  }, [initialData, data]);

  const onMove: MoveHandler<T> = (args: { dragIds: string[]; parentId: null | string; index: number }) => {
    if (!args.parentId) return;
    const node = tree.find(args.dragIds[0]);
    const parent = tree.find(args.parentId!);

    if (!node || !parent) return;

    tree.move({ id: args.dragIds[0], parentId: args.parentId, index: args.index });
    bridge(
      `window.__PIXI_DEVTOOLS_WRAPPER__?.tree.moveNode(${JSON.stringify(node.data.metadata.uid)}, ${JSON.stringify(parent.data.metadata.uid)}, ${JSON.stringify(args.index)})`,
    );
    setData(tree.data);
  };

  const onRename: RenameHandler<T> = ({ name, id }) => {
    tree.update({ id, changes: { name } as any });
    setData(tree.data);
    const node = tree.find(id);
    bridge(
      `window.__PIXI_DEVTOOLS_WRAPPER__?.tree.renameNode(${JSON.stringify(node?.data.metadata.uid)}, ${JSON.stringify(name)})`,
    );
  };

  // TODO: allow for creating new nodes
  // const onCreate: CreateHandler<T> = ({ parentId, index, type }) => {
  //   const data = { id: `simple-tree-id-${nextId++}`, name: '' } as any;
  //   if (type === 'internal') data.children = [];
  //   tree.create({ parentId, index, data });
  //   setData(tree.data);
  //   return data;
  // };

  const onDelete: DeleteHandler<T> = (args: { ids: string[] }) => {
    const node = tree.find(args.ids[0]);
    args.ids.forEach((id) => tree.drop({ id }));
    setData(tree.data);
    bridge(`window.__PIXI_DEVTOOLS_WRAPPER__?.tree.deleteNode(${JSON.stringify(node?.data.metadata.uid)})`);
  };

  const onSelect = (nodes: NodeApi[]) => {
    const node = nodes[0];
    if (!node) return;
    bridge(
      `window.__PIXI_DEVTOOLS_WRAPPER__?.tree.setSelected(${node ? JSON.stringify(node.data.metadata.uid) : null})`,
    );
  };

  const controller = { onMove, onRename, onDelete, onSelect };

  return [data, controller] as const;
}
