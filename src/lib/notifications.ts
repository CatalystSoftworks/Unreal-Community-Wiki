import { writable } from "svelte/store";

export interface Notification {
    /** The message to display. */
    message: string;
    /** When present, marks the notification as an error. */
    error?: unknown;
    /** The time in milliseconds to display the notification. */
    duration: number;
    /** Custom actions to display on the notification. */
    actions: {
        /** The text to display on the action button. */
        text: string;
        /** The action to perform when the button is clicked. */
        action(): void;
    }[];
}

export type NotificationInput = Partial<Notification> & Pick<Notification, "message">;

const { update, subscribe } = writable<Notification[]>([]);

/** The notifications to display. */
export const notifications = { subscribe: subscribe };

/** Pushes a notification to the notification store. */
export function notify(notification: NotificationInput) {
    const cta = (notification.actions && notification.actions.length > 0);
    const n: Notification = {
        error: notification.error,
        message: notification.message,
        duration: notification.duration ?? (cta ? 0 : 5000),
        actions: notification.actions ?? [],
    };

    update(notifications => [...notifications, n]);

    if (n.duration > 0) {
        setTimeout(() => dismiss(n), n.duration);
    }
}

/** Dismisses a notification. */
export function dismiss(notification: Notification) {
    update(notifications => {
        const index = notifications.indexOf(notification);
        if (index !== -1) notifications.splice(index, 1);
        return notifications;
    });
}