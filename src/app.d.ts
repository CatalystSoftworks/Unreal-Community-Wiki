// See https://kit.svelte.dev/docs/types#app

import type { SessionData } from "$lib/server/session";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}

		interface Locals { 
			/** Current user session. */
			session?: SessionData;
			/** User model for the current session. */
			user?: DBO.User;
		}

		// interface PageData {}
		// interface Platform {}
	}
}

export { };
