import { VNode } from "../vnode/vnode";

export type PatchType = "NONE" | "VNODE" | "VTEXT" | "PROPS" | "REMOVE";

export type VPatches = {
  [indesx: number]: VPatch;
};

export class VPatch {
  type: PatchType;
  vnode: VNode | null;
  child: VPatch | null;

  constructor(type: PatchType, vnode: VNode | null, child: VPatch | null) {
    this.type = type;
    this.vnode = vnode;
    this.child = child;
  }
}
