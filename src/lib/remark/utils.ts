import type { Node, Parent } from "unist";

type NodeMD = Node & Parent & { value?: unknown };

type NodeIteratee = (node: NodeMD, index: number, parent: null | NodeMD) => NodeMD;


// from github.com/syntax-tree/unist-util-map/blob/bb0567f651517b2d521af711d7376475b3d8446a/index.js
export function map(tree: NodeMD, iteratee: NodeIteratee) {
    const preorder: NodeIteratee = (node, index, parent) => {
        const newNode = iteratee(node, index, parent);

        if (Array.isArray(newNode.children)) {
            newNode.children = newNode.children.map((child, index) => {
                return preorder(child as NodeMD, index, node);
            });
        }

        return newNode;
    };

    return preorder(tree, 0, null);
};