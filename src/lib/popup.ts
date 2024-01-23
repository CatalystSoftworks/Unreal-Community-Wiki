/**
 * Svelte action that ensures the element is always visible in the viewport.
 * Will attempt to place the element at the given position, and adjust if it
 * would be outside the viewport.
 */
export function popup(node: HTMLElement, { x, y }: { x: number, y: number }) {
    const rect = node.getBoundingClientRect();
    const { innerWidth, innerHeight } = window;

    const hw = rect.width / 2;
    const left = Math.max(0, Math.min(x - hw, innerWidth - rect.width));
    const top = Math.max(0, Math.min(y, innerHeight - rect.height));

    node.style.left = `${left}px`;
    node.style.top = `${top}px`;

    return {
        // update({ left, top }: { left: number, top: number }) {
        //     const right = left + width;
        //     const bottom = top + height;
        //     const leftDiff = Math.min(0, left);
        //     const rightDiff = Math.max(0, right - innerWidth);
        //     const topDiff = Math.min(0, top);
        //     const bottomDiff = Math.max(0, bottom - innerHeight);
        //     node.style.left = `${left - leftDiff + rightDiff}px`;
        //     node.style.top = `${top - topDiff + bottomDiff}px`;
        // },
    };
}