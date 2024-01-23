This application is written in [Typescript](https://www.typescriptlang.org/) and uses the following, core technologies:

- [Sveltekit](https://nextjs.org/) web framework for frontend and backend
- [MongoDB](https://www.mongodb.com/) as the primary database
- [Amazon S3](https://aws.amazon.com/s3) for image/file upload support
- [Discord](https://discord.com) for notifying moderators of reports and content changes
- [BlueprintUE](https://blueprintue.com) for uploading Blueprints
- [Sentry](https://sentry.io) for error and performance monitoring
- [Google Analytics](https://analytics.google.com) for usage metrics

## Development

Copy the `.env.example` file to `.env` and fill in the necessary values. You'll need the minimum of [NodeJS](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/) installed on your machine. You can then run `npm install` to install the necessary dependencies and `npm run dev` to start the development server.

It is recommended that you also install [MailHog](https://github.com/mailhog/MailHog) for testing emails locally. Especially if you wish to test any features related to an authenticated user, as the application sends one-time passwords via email.

If you wish to test file uploads, you can use [Minio](https://min.io/) to run a local S3 server.

### Environment Variables

The following environment variables should be set in either your `.env` file (when developing locally) or on your host machine. **Because credentials used by the application are provided via environment variables, it is important that you do NOT commit this `.env` files (or similar) to Git!**

Variable | Description
---------|------------
`PORT` | The port that the application should listen on.
`ORIGIN` | The URL that the application is hosted on. This is used for CORS and CSRF protection.
`SMTP_HOST` | The SMTP host to use for sending emails. 
`SMTP_PORT` | The SMTP port to use for sending emails. 
`SMTP_USER` | The SMTP username to use for sending emails.
`SMTP_PASS` | The SMTP password to use for sending emails.
`DATABASE_URL` | Connection string that points to the MongoDB host with credentials and database URI path.
`TOKEN_SECRET` | A string value with at least 32 characters, used for encrypting session cookies.
`DISCORD_MOD_WEBHOOK_URL` | The webhook URL for posting messages to a Discord channel that only contains moderators. When not provided, messages will not be sent and instead will be logged to the console.
`BLUEPRINT_UE_API_KEY` | The API key used for uploading embedded Blueprints via [BlueprintUE](https://blueprintue.com).
`SENTRY_AUTH_TOKEN` | Auth token used for uploading source maps to [Sentry](https://sentry.io).
`PUBLIC_SENTRY_DSN` | The API key used for reporting errors to [Sentry](https://sentry.io) for error and performance monitoring. _This key will be public to end users!_
`PUBLIC_SENTRY_TRACE_SAMPLE_RATE` | Sample rate for tracing requests. _This key will be public to end users!_
`PUBLIC_SENTRY_REPLAYS_SAMPLE_RATE` | Sample rate for tracing replays. _This key will be public to end users!_
`PUBLIC_SENTRY_ERROR_SAMPLE_RATE` | Sample rate for tracing errors. _This key will be public to end users!_
`PUBLIC_GA_TRACKING_ID` | The API key used for reporting usage metrics to Google Analytics. _This key will be public to end users!_
`S3_ACCESS_KEY_ID` | The API key used for accessing AWS. Necessary for image uploading via S3.
`S3_SECRET_ACCESS_KEY` | The API secret used for accessing AWS. Necessary for image uploading via S3.
`S3_BUCKET` | The S3 bucket that images should be uploaded to. Necessary for image uploading via S3.
`S3_DEFAULT_REGION` | The default region to use when accessing AWS and its resources. Necessary for image uploading via S3.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for more information.