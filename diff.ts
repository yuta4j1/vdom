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
    if (currNode.children) {
      if (newNode.children) {
        patches[idx] = new VPatch("NONE", null, null);
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
    patches[idx] = new VPatch("VNODE", newNode, null);
  }
}

// VDOMの属性値比較
const isSameAttributes = (
  a?: Map<string, string>,
  b?: Map<string, string>
): boolean => {
  if (!a || !b) {
    return false;
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
