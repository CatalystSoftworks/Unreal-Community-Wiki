/** Debounces a function call. */
export function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): T {
    let timeout: number | undefined;
    return function (...args: Parameters<T>) {
        const later = function () {
            timeout = undefined;
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait) as unknown as number;
    } as T;
}