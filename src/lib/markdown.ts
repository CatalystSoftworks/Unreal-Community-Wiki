import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkMath from "remark-math";
import { remarkVideo } from "./remark/video";
import { remarkWikiBlocks } from "./remark/wikiBlocks";
import remarkGfm from "remark-gfm";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

export function createProcessor() {
    return unified()
        .use(remarkParse)
        // .use(remarkShiki, { highlighter })
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkVideo)
        .use(remarkWikiBlocks)
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(rehypeSlug)
        .use(rehypeKatex)
        .use(rehypeStringify);
}

const processor = createProcessor();

/**
 * Renders markdown into HTML.
 */
export function renderMarkdown(md: string) {
    return processor.processSync(md).toString();
}