import { VNode } from "./vnode/vnode";
import { VPatch, VPatches } from "./vtree/patch";

export function diff(currNode: VNode, newNode: VNode): VPatches {
  let patches: VPatches = {};
  walk(currNode, newNode, patches, 0);
  return patches;
}

export function walk(
  currNode: VNode,
  newNode: VNode,
  patches: VPatches,
  idx: number
): void {
  if (
    currNode.tagName === newNode.tagName &&
    isSameAttributes(currNode.attribiutes, newNode.attribiutes)
  ) {
    // タグが同じ、かつ属性が同じ場合、子要素をみる
    if (currNode.children) {
      if (newNode.children) {
        patches[idx] = new VPatch("NONE", null, null);
        diffChildren(currNode, newNode, patches, idx);
      } else {
        patches[idx] = new VPatch("REMOVE", null, null);
      }
    } else {
      if (newNode.children) {
        patches[idx] = new VPatch("VNODE", newNode.children, null);
      } else {
        return;
      }
    }
  } else {
    // タグor属性が異なる場合、差分はVNODEとなる
    patches[idx] = new VPatch("VNODE", newNode, null);
  }
}

// 子要素の差分をみる
// （子要素が存在する場合のみ呼び出し）
function diffChildren(
  currentNode: VNode,
  newNode: VNode,
  patches: VPatches,
  idx: number
): void {
  const currChildren = currentNode.children;
  if (!currChildren || !newNode.children) {
    return;
  }
  const { children: newChildren } = reorder(currChildren, newNode.children);
  const currLen = currChildren.length;
  const newLen = newChildren.length;
  const len = currLen >= newLen ? currLen : newLen;
  for (let i = 0; i < len; i++) {
    const leftNode = currChildren[i];
    const rightNode = newChildren[i];
    if (!leftNode) {
      if (rightNode) {
        // newNodeのみ存在する場合
        patches[idx] = new VPatch("VNODE", rightNode, null);
      }
    }
    if (leftNode && rightNode) {
      // 両方の要素が存在する場合、再帰的に差分を確認する
      diffChildren(leftNode, rightNode, patches, idx);
    }
  }
}

// VNodeの子要素（children）の振り分け型
type KeyIndex = {
  keys: { [key: string]: number };
  free: VNode[];
};

type Reordered = {
  children: VNode[];
  moves: {} | null;
};

// キーをもつvdpmの場合、差分比較の最適化を行う
// キーを持たない場合、そのまま返す
function reorder(currChildren: VNode[], newChildren: VNode[]): Reordered {
  // キーが割り当てられている要素と、そうでない要素を振り分ける
  const { keys: newKeys, free: newFree } = keyIndex(newChildren);
  if (newFree.length === newChildren.length) {
    // もしnewChildrenにkey要素が含まれない場合、index判定に夜差分はないので、
    // そのままreturnする
    return {
      children: newChildren,
      moves: null,
    };
  }
  const { keys: currKeys, free: currFree } = keyIndex(currChildren);
  if (currFree.length === currChildren.length) {
    // currChildrenにkey要素が存在しなかった場合も、同様に洗い替え更新なので、
    // newChildrenをそのまま差分として返す
    return {
      children: newChildren,
      moves: null,
    };
  }

  // TODO: 仮実装として、現状newCHildrenをそのまま返却する作りとするが、
  // ふられているkeyを見て、差分のみを取得する実装にする
  return {
    children: newChildren,
    moves: null,
  };
}

// indexが割り当てられているnodeとそうでないnodeを振り分ける
export function keyIndex(nodes: VNode[]): KeyIndex {
  // TODO: reduceでできそう
  let keys = {};
  let freeNodes: VNode[] = [];
  for (let idx in nodes) {
    if (nodes[idx].key) {
      keys[nodes[idx].key] = idx;
    } else {
      freeNodes.push(nodes[idx]);
    }
  }

  return {
    keys,
    free: freeNodes,
  };
}

// VDOMの属性値比較
const isSameAttributes = (
  a?: Map<string, string>,
  b?: Map<string, string>
): boolean => {
  if (!a || !b) {
    return true;
  }
  if (a.size !== b.size) {
    return false;
  }
  for (const [k, v] of a) {
    if (b.get(k) !== v) {
      return false;
    }
  }

  return true;
};
