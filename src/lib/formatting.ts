/** Capitalizes the given string. */
export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Creates a hash code from the given string. */
export function hashCode(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return hash;
}

/** Creates initials from the given string, ensuring that 2 characters are returned. */
export function getInitials(str: string) {
	str = str.trim();
	if (str.length === 0) return "--";
	if (str.length === 1) return str;
	const i = str.indexOf(" ");
	return i === -1 ? str[0] + str[str.length - 1] : str[0] + str[i + 1];
}

/**
 * Attempts to parse the given string as a number, returning the fallback value
 * if the string is null, empty, or not a number.
 */
export function tryGetNum(val: string | null, fallback: number): number {
	if (val === null) {
		return fallback;
	}

	const num = Number(val);
	if (Number.isNaN(num)) {
		return fallback;
	}

	return num;
}
