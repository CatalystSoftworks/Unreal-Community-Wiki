import type { Node, Parent } from "unist";
import type { Root } from "mdast";
import { IS_YOUTUBE_LINK } from "../regex";
import { map } from "./utils";

type NodeMD = Node & Parent & { value?: unknown };


/**
 * Converts single-link paragraph nodes into embedded videos. Only supports YouTube links for now.
 */
export const remarkVideo = () => (tree: Root) => {
    return map(tree as NodeMD, (node, index, parent) => {
        // skip nodes whose parent ISN'T the root node
        if (!parent || parent.type !== "root") {
            return node;
        }

        // skip non-paragraphs
        if (node.type !== "paragraph") {
            return node;
        }

        // skip paragraphs that don't have a single link child
        const children = node.children as Node[];
        if (children.length !== 1 || children[0].type !== "link") {
            return node;
        }

        // check the contents of the link
        const linkNode = children[0] as unknown as { url: string };

        // <iframe width="560" height="315" src="https://www.youtube.com/embed/31PtYw7WeLU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

        const m = linkNode.url.match(IS_YOUTUBE_LINK);
        if (m) {
            return createIframeNode(node, {
                src: `https://www.youtube.com/embed/${m[1]}`,
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowfullscreen: true,
                title: "YouTube Video Player",
            });
        }

        return node;
    });
};


/**
 * Renders an iframe node within a 16 x 9 aspect ratio container.
 */
function createIframeNode<T extends object>(fromNode: Node, props: T) {
    return {
        type: "html",
        data: {
            hName: "div",
            hProperties: {
                className: "video",
            },
            hChildren: [
                {
                    type: "element",
                    tagName: "iframe",
                    properties: props,
                    children: [],
                },
            ],
        },
        position: fromNode.position,
        children: [],
    };
}