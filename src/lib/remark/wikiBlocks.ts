import type { Root } from "mdast";
import type { Node, Parent } from "unist";


type ShortcodeDef =
    | {
        block: true;
        node(params: object, children: Node[]): NodeMD;
    }
    | {
        block: false;
        node(params: object): NodeMD;
    };

type NodeMD = Node & Parent & { value?: unknown };

/**
 * Checks an AST node to see if it's a wiki shortcode. If it is, it'll will parse the contents
 * of the shortcode and providing information about it.
 */
function getShortCodeContents(node: NodeMD): null | string {
    if (!Array.isArray(node.children)) return null;

    const [child] = node.children as NodeMD[];
    if (!child) return null;
    if (typeof child.value !== "string") return null;
    if (!child.value.startsWith("{{")) return null;
    if (!child.value.endsWith("}}")) return null;

    // remove the {{ }} brackets and trim spaces from the result
    return child.value.slice(2, -2).trim();
}

/**
 * Attempts to parse and returning the opening tag for shortcode.
 */
function parseOpeningTag(node: NodeMD) {
    let tokens = getShortCodeContents(node);
    if (tokens && tokens.charAt(0) !== "/") {

        // try to find the first space in the tokens string
        const firstSpace = tokens.indexOf(" ");

        // if there isn't one, then we _should_ just have a tag
        if (firstSpace === -1) {
            return { tag: tokens, params: {} };
        }

        // if there is a space, then we must have params - let's split up our tokens
        const tag = tokens.slice(0, firstSpace);
        const params: { [key: string]: boolean | string } = {};
        tokens = tokens.slice(firstSpace);

        tokens.replaceAll(/([a-z]+)(="([^"]+)")?/g, (full, name, assign, value) => {
            params[name] = value || true;
            return "";
        });

        return { tag, params };
    }

    return null;
}

/**
 * Returns true if the given node is the desired closing tag.
 */
function isClosingTag(node: NodeMD, tag: string) {
    const tokens = getShortCodeContents(node);
    return (tokens && tokens.charAt(0) === "/" && tokens.slice(1) === tag);
}

/**
 * Creates the node factory for a hint.
 */
const createHintType = (type: string): ShortcodeDef => ({
    block: true,
    node: (params, children) => ({
        type: "element",
        data: {
            hName: "div",
            hProperties: { className: `hint is-${type}` },
        },
        children,
    }),
});


const SHORTCODES: { [key: string]: ShortcodeDef } = {
    tip: createHintType("tip"),
    note: createHintType("note"),
    todo: createHintType("todo"),
    success: createHintType("success"),
    warning: createHintType("warning"),
    danger: createHintType("danger"),
    blueprint: {
        block: false,
        node: ({ id = "" }: Record<string, string>) => ({
            type: "element",
            data: {
                hName: id.length === 8 ? "iframe" : "div",
                hProperties: {
                    className: id.length === 8 ? "blueprint" : "blueprint is-invalid",
                    src: `https://blueprintue.com/render/${id}`,
                    scrolling: "no",
                    allowFullScreen: true,
                    height: "500",
                },
            },
            children: [],
        }),
    },
    version: {
        block: true,
        node: ({ gt = "", gte = "", lt = "", lte = "", is = "" }: Record<string, string>, children) => {
            let rules = "";

            // only accept one is
            if (is) rules = `version == ${is}`;
            else {
                const _rules = [];

                // only accept one gte/gt
                if (gte) _rules.push(`version >= ${gte}`);
                else if (gt) _rules.push(`version > ${gt}`);

                // only accept one lte/lt
                if (lte) _rules.push(`version <= ${lte}`);
                else if (lt) _rules.push(`version < ${lt}`);

                rules = _rules.join(" && ");
            }

            return {
                type: "element",
                data: {
                    hName: "div",
                    hProperties: { class: "version", "data-rules": rules },
                },
                children,
            };
        },
    },
};


/**
 * Parses the wiki-specific shortcodes.
 */
export const remarkWikiBlocks = () => (tree: Root) => {
    const nodes = (tree as NodeMD).children as NodeMD[];
    for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];

        // is this a shortcode?
        const sc = parseOpeningTag(node);
        if (!sc) continue;

        // is it configured shortcode with a valid handler?
        const handler = SHORTCODES[sc.tag];
        if (!handler) continue;

        // if it's NOT a block type, then just replace the current node and move on
        if (!handler.block) {
            nodes[i] = handler.node(sc.params);
        }

        // if so, find the closing statement in the following nodes
        for (let j = i + 1; j < nodes.length; j++) {
            const sibling = nodes[j];

            // is this the closing tag?
            if (sibling.type !== "paragraph") continue;
            if (!isClosingTag(sibling, sc.tag)) continue;

            // get the nodes in-between the open/close tags
            const shortcodeChildren = nodes.slice(i + 1, j);

            // remove the tags from the parent array, except this node - we're going to replace it
            nodes.splice(i + 1, shortcodeChildren.length + 1);

            // replace this node
            nodes[i] = handler.node(sc.params, shortcodeChildren);
        }
    }

    return tree;
};