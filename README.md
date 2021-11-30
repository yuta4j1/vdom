# vdom

TypeScriptでvirtual-dom実装

## データ型

VDOM / PATCHがある。

PATCHは差分に当たる。
VDOMにおける差分とは、数種類ある。
VNODE(INSERT) / REMOVE / PROPS(attribute)など？
VNODE treeデータの差分を、patchesに格納する。

Patchesは差分アルゴリズムを適用している。