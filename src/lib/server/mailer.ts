import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { env } from "$env/dynamic/private";

const auth = env.SMTP_USER && env.SMTP_PASS
    ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
    : undefined;

const mailer = nodemailer.createTransport({
    host: env.SMTP_HOST || "localhost",
    port: Number(env.SMTP_PORT || "587"),
    secure: env.SMTP_SECURE || false,
    auth,
});

const mailgen = new Mailgen({
    theme: "default",
    product: {
        name: "Unreal Community Wiki",
        link: "" + env.ORIGIN,
        logo: env.ORIGIN + "/logo.svg",
    },
});

interface SendEmailOpts {
    /** The email address to send the email to. */
    to: string | string[];
    /** Subject of the email. */
    subject: string;
    /** Mailgen configuration used to generate the email. */
    body: Mailgen.Content["body"];
}

/** Helper method that sends an email through mailgun using mailgen. */
export function sendEmail({ to, subject, body }: SendEmailOpts) {
    const text = mailgen.generatePlaintext({ body });
    const html = mailgen.generate({ body });

    return mailer.sendMail({
        from: env.SMTP_FROM,
        to,
        subject,
        text,
        html,
    });
}
