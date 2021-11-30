import { VNode } from "../vnode/vnode";

import { diff } from "../diff";

test("VDOM差分比較 単一ノード", () => {
  const aNode = new VNode("div", "VNode");
  const bNode = new VNode("div", "VNode");
  expect(diff(aNode, bNode)).toBe({});
});
