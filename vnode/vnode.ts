type VNodeType = "VNode" | "VNodeText";

export class VNode {
  tagName: string;
  type: VNodeType;
  attribiutes?: Map<string, string>;
  children?: VNode[];
  key?: string;

  constructor(
    tagName: string,
    type: VNodeType,
    attribiutes?: Map<string, string>,
    children?: VNode[],
    key?: string
  ) {
    this.tagName = tagName;
    this.type = type;
    this.key = key;
    this.children = children;
    this.attribiutes = attribiutes;
  }
}
