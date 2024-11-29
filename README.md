# The Startup Stack

Get independence from expensive SaaS without loosing its developer experience,
the infra primitives to adapt to any future requirement, and the tools to build
delightful, secure user experiences.

## Features

- **[Remix][]** as the full-stack **[React][]** framework.
- **[SST][]** for infrastructure as code on AWS and Cloudflare.
- **[Hono][]** API on [AWS Lambda][].
- **[Postgres][]** database through **[Neon][]**.
- **[Drizzle ORM][]** as the headless TypeScript ORM.
- **[Stripe][]** for subscription plans, customer portal, and more.
- **[shadcn][]** React components.
- **[Tailwind CSS][]** utility CSS Framework.
- **[React Email][]**, customizable emails with React.
- **[Conform][]**, type-safe form validation based on web fundamentals.
- **[Zod][]**, type-safe runtime schema validation.
- **Authentication** through email code, magic link and social logins.
- **Easy Theming**, switch between light and dark modes with ease.
- **Client & Server Toasts**, display toasts on your app.
- **CSRF and Honeypot Protection**, prevent malicious attacks.
- **I18N**, support multiple languages in your app.
- **GitHub Actions** for CI/CD Workflows.

### Planned

- Postgres Row-Level Security (see [Drizzle](https://orm.drizzle.team/docs/rls)
  and [Neon](https://neon.tech/docs/guides/neon-authorize) docs)
- The new SST authentication component when it comes out.
- Tailwind [v4.0](https://tailwindcss.com/blog/tailwindcss-v4-beta) when it comes out.

## What is this?

A tech stack where you don’t have to choose between capabilities, convenience,
and price as you grow. A stack in which every tool is chosen because it has
proven itself, not the latest hype, and that those tools have commitment to
long-term stability.

### Infrastructure

The Startup Stack is built on [SST][], an infrastructure tool that strikes the
perfect balance between developer convenience and long-term flexibility. In the
article
[“The Cloud Hasn't Been Won Yet”](https://olivergilan.com/blog/cloud-hasnt-been-won/),
Oliver Gilan sees it for what it is: most Platform as a Service (PaaS) solutions
fall into a trap – they're either too simple and limiting (or expensive) for
growing teams or too complex from the start. SST solves this by providing a
powerful Infrastructure as Code (IaC) approach that adapts to your project's
evolving needs. With SST, you get:

- **Flexible Complexity**: Start with simple, one-line configurations for common
  services, but have the full power to dive into granular infrastructure details
  when needed. As your startup grows, your infrastructure can seamlessly grow
  with you.

- **Type-Safe Configurations**.

- **Multi-Cloud Compatibility**: Easily deploy across AWS and Cloudflare, with
  the potential to expand to other providers. Take a second to appreciate how
  cool it is that your
  [Stripe products are defined in code](https://github.com/Murderlon/the-startup-stack/blob/main/infra/stripe.ts)
  or with a one-line change you can combine two different providers:

```diff
export const www = new sst.aws.Remix('Remix', {
  domain: {
    name: domain,
+   dns: sst.cloudflare.dns(),
  }
}
```

The entire stack is serverless and in TypeScript. Serverless is powerful because
it abstracts away infrastructure management, allowing developers to focus solely
on building and deploying code, which accelerates development cycles. It also
automatically scales to handle varying workloads, ensuring cost-efficiency and
optimal performance without manual intervention.

Prefer servers and containers?
[Just change ten lines of SST code](https://sst.dev/docs/examples/#aws-remix-container-with-redis).

### Backend

Building on the ideas of SST, where you can adapt to changing requirements, is
the decision to use [Postgres][]. No matter what data requirements may surface,
you can rest assured that Postgres will be able to handle it, either directly or
through an [extension](https://neon.tech/docs/extensions/pg-extensions).

> [!NOTE]  
> _Why [Neon][] instead of
> [Postgres on AWS with SST](https://sst.dev/docs/component/aws/postgres), you
> may ask?_
>
> An exception is made as the developer experience of Neon still beats Postgres
> on AWS, mainly because of features such as
> [branching](https://neon.tech/flow), and the fact that you start for free and
> scale-to-zero while on AWS you pay per hour.
>
> Neon is built on top of AWS and is available in the AWS marketplace so you
> still only have a single bill to pay.

Interfacing with your database through an ORM or not remains a debated topic.
That’s why [Drizzle][Drizzle ORM], the headless ORM, is chosen:

> Other ORMs and data frameworks tend to deviate/abstract you away from SQL,
> which leads to a double learning curve: needing to know both SQL and the
> framework’s API. Drizzle is the opposite. We embrace SQL and built Drizzle to
> be SQL-like at its core, so you can have zero to no learning curve and access
> to the full power of SQL. —
> [Why SQL-like?](https://orm.drizzle.team/docs/overview#why-sql-like)

This template also includes a public facing API on [AWS Lambda][] with [Hono][],
which also handles the Stripe webhooks. Hono allows you to compose an incredibly
powerful developer experience with
[`@hono/zod-openapi`](https://hono.dev/examples/zod-openapi), in which you can
validate values and types using [Zod][] and generate OpenAPI Swagger
documentation.

At the same time, you can use [Hono RPC](https://hono.dev/docs/guides/rpc) next
to it to consume your API on the Remix server or client completely type-safe.
Note that for most UI data and actions you can just use Remix loaders and
actions without going to your API.

### Frontend

The frontend is built with [Remix][], a full-stack [React][] framework that
prioritizes web standards and delivers long-term stability for modern web
applications. Remix’s commitment to working with the browser, rather than
against it, means you can leverage fundamental web features like form
submissions, progressive enhancement, and caching out of the box.

Whether you're deploying to traditional Node.js servers, serverless environments
like AWS Lambda, or cutting-edge edge runtimes like Cloudflare Workers, Remix
runs seamlessly. This flexibility lets you adapt to infrastructure changes
without rewriting your frontend logic.

With Remix, the rug is not pulled out from under you to chase innovation (not pointing fingers 👀).
Instead, you get incremental
[future flags](https://remix.run/docs/en/main/guides/api-development-strategy).

Meanwhile you build interfaces rapidly with [shadcn][] and [Tailwind CSS][],
which let’s be honest, they don’t need a pitch anymore at this point.

## When should I use this?

## Use

## Questions? Answers.

## Acknowledgments

## License

<!-- Definitions -->

[Remix]: https://remix.run
[React]: https://react.dev
[SST]: https://sst.dev
[Postgres]: https://postgresql.org
[Neon]: https://neon.tech
[Drizzle ORM]: https://orm.drizzle.team
[Stripe]: https://stripe.com
[shadcn]: https://ui.shadcn.com
[Tailwind CSS]: https://tailwindcss.com
[React Email]: https://react.email
[Conform]: https://conform.guide
[Hono]: https://hono.dev
[AWS Lambda]: https://aws.amazon.com/lambda
[Zod]: https://zod.dev
