import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import isbot from "isbot";
import { PassThrough } from "node:stream";
import crypto from "node:crypto";
import { RemixServer, useFormAction, useNavigation, useLoaderData, Form, useActionData, useRouteLoaderData, useLocation, Link, Outlet, useFetcher, useSubmit, useNavigate, useRevalidator, useParams, useRouteError, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "@remix-run/react";
import { createCookie, createReadableStreamFromReadable, createCookieSessionStorage, redirect, json, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler, MaxPartSizeExceededError } from "@remix-run/node";
import { renderToPipeableStream } from "react-dom/server";
import { createInstance } from "i18next";
import { initReactI18next, I18nextProvider, useTranslation } from "react-i18next";
import * as React from "react";
import { createContext, useContext, useRef, useEffect, useState } from "react";
import { RemixI18Next } from "remix-i18next/server";
import { useChangeLanguage } from "remix-i18next/react";
import { AuthenticityTokenInput, AuthenticityTokenProvider } from "remix-utils/csrf/react";
import { HoneypotInputs, HoneypotProvider } from "remix-utils/honeypot/react";
import { relations, eq } from "drizzle-orm";
import { Authenticator } from "remix-auth";
import { TOTPStrategy } from "remix-auth-totp";
import { GitHubStrategy } from "remix-auth-github";
import { Resource } from "sst";
import { render } from "@react-email/render";
import { Html, Head, Preview, Body, Container, Img, Heading, Section, Button as Button$1, Text, Hr } from "@react-email/components";
import { z } from "zod";
import { getClientLocales } from "remix-utils/locales/server";
import { useHydrated } from "remix-utils/use-hydrated";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { Loader2, ShoppingBasket, ExternalLink, ChevronDown, ChevronUp, Check, Sun, Moon, Monitor, Languages, ChevronRight, Circle, Slash, Settings, LogOut, HelpCircle, Star, Plus, BadgeCheck, AlertTriangle, Upload } from "lucide-react";
import Stripe from "stripe";
import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { text, customType, timestamp, pgTable, integer, boolean, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { CSRF, CSRFError } from "remix-utils/csrf/server";
import { Honeypot, SpamError } from "remix-utils/honeypot/server";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as cookie$1 from "cookie";
import { getHintUtils } from "@epic-web/client-hints";
import { clientHint, subscribeToSchemeChange } from "@epic-web/client-hints/color-scheme";
import { clientHint as clientHint$1 } from "@epic-web/client-hints/time-zone";
import { safeRedirect } from "remix-utils/safe-redirect";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { toast, Toaster as Toaster$1 } from "sonner";
const NonceContext = createContext("");
const NonceProvider = NonceContext.Provider;
const useNonce = () => useContext(NonceContext);
const en = {
  title: "Create your App",
  description: "Build your app on top of Remix SaaS, explore the documentation and start your journey."
};
const es = {
  title: "Crea tu Aplicación",
  description: "Construye tu aplicación sobre Remix SaaS, explora la documentación y comienza tu viaje."
};
const supportedLngs = ["es", "en"];
const fallbackLng = "en";
const defaultNS = "translation";
const resources = {
  en: { translation: en },
  es: { translation: es }
};
const i18n = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  defaultNS,
  fallbackLng,
  resources,
  supportedLngs
}, Symbol.toStringTag, { value: "Module" }));
const localeCookie = createCookie("lng", {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true
});
const i18nServer = new RemixI18Next({
  detection: {
    supportedLanguages: supportedLngs,
    fallbackLanguage: fallbackLng,
    cookie: localeCookie
  },
  // Configuration for i18next used when
  // translating messages server-side only.
  i18next: {
    ...i18n
  }
});
const ABORT_DELAY = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, remixContext, _) {
  const callbackName = isbot(request.headers.get("user-agent")) ? "onAllReady" : "onShellReady";
  const nonce = crypto.randomBytes(16).toString("hex");
  responseHeaders.set(
    "Content-Security-Policy",
    `script-src 'nonce-${nonce}' 'strict-dynamic'; object-src 'none'; base-uri 'none';`
  );
  const instance = createInstance();
  const lng = await i18nServer.getLocale(request);
  const ns = i18nServer.getRouteNamespaces(remixContext);
  await instance.use(initReactI18next).init({
    ...i18n,
    lng,
    ns
  });
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(NonceProvider, { value: nonce, children: /* @__PURE__ */ jsx(I18nextProvider, { i18n: instance, children: /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ) }) }),
      {
        [callbackName]: () => {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
        nonce
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const AUTH_SESSION_KEY = "_auth";
const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: AUTH_SESSION_KEY,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secrets: [Resource.SESSION_SECRET.value || "NOT_A_STRONG_SECRET"],
    secure: process.env.NODE_ENV === "production"
  }
});
const { getSession, commitSession, destroySession } = authSessionStorage;
const ERRORS = {
  // Authentication.
  AUTH_EMAIL_NOT_SENT: "Unable to send email.",
  AUTH_USER_NOT_CREATED: "Unable to create user.",
  AUTH_SOMETHING_WENT_WRONG: "Something went wrong while trying to authenticate.",
  // Onboarding.
  ONBOARDING_USERNAME_ALREADY_EXISTS: "Username already exists.",
  ONBOARDING_SOMETHING_WENT_WRONG: "Something went wrong while trying to onboard.",
  // Stripe.
  STRIPE_MISSING_SIGNATURE: "Unable to verify webhook signature.",
  STRIPE_MISSING_ENDPOINT_SECRET: "Unable to verify webhook endpoint.",
  STRIPE_CUSTOMER_NOT_CREATED: "Unable to create customer.",
  STRIPE_SOMETHING_WENT_WRONG: "Something went wrong while trying to handle Stripe API.",
  // Misc.
  UNKNOWN: "Unknown error.",
  ENVS_NOT_INITIALIZED: "Environment variables not initialized.",
  SOMETHING_WENT_WRONG: "Something went wrong."
};
const ResendSuccessSchema = z.object({
  id: z.string()
});
const ResendErrorSchema = z.union([
  z.object({
    name: z.string(),
    message: z.string(),
    statusCode: z.number()
  }),
  z.object({
    name: z.literal("UnknownError"),
    message: z.literal("Unknown Error"),
    statusCode: z.literal(500),
    cause: z.any()
  })
]);
async function sendEmail(options) {
  if (!Resource.RESEND_API_KEY.value) {
    throw new Error(`Resend - ${ERRORS.ENVS_NOT_INITIALIZED}`);
  }
  const from = "onboarding@resend.dev";
  const email = { from, ...options };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Resource.RESEND_API_KEY.value}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(email)
  });
  const data = await response.json();
  const parsedData = ResendSuccessSchema.safeParse(data);
  if (response.ok && parsedData.success) {
    return { status: "success", data: parsedData };
  }
  const parsedErrorResult = ResendErrorSchema.safeParse(data);
  if (parsedErrorResult.success) {
    console.error(parsedErrorResult.data);
    throw new Error(ERRORS.AUTH_EMAIL_NOT_SENT);
  }
  console.error(data);
  throw new Error(ERRORS.AUTH_EMAIL_NOT_SENT);
}
function AuthEmail({ code, magicLink }) {
  return /* @__PURE__ */ jsxs(Html, { children: [
    /* @__PURE__ */ jsx(Head, {}),
    /* @__PURE__ */ jsx(Preview, { children: "Your login code for Remix Auth TOTP" }),
    /* @__PURE__ */ jsx(
      Body,
      {
        style: {
          backgroundColor: "#ffffff",
          fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
        },
        children: /* @__PURE__ */ jsxs(Container, { style: { margin: "0 auto", padding: "20px 0 48px" }, children: [
          /* @__PURE__ */ jsx(
            Img,
            {
              src: "https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-logo.png",
              width: "40",
              height: "37",
              alt: ""
            }
          ),
          /* @__PURE__ */ jsx(
            Heading,
            {
              style: {
                fontSize: "24px",
                letterSpacing: "-0.5px",
                lineHeight: "1.2",
                fontWeight: "400",
                color: "#484848",
                padding: "12px 0 0"
              },
              children: "Your login code for Remix Auth TOTP"
            }
          ),
          magicLink && /* @__PURE__ */ jsx(Section, { style: { padding: "8px 0px" }, children: /* @__PURE__ */ jsx(
            Button$1,
            {
              pY: 11,
              pX: 23,
              style: {
                display: "block",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "600",
                textDecoration: "none",
                textAlign: "center",
                borderRadius: "3px",
                backgroundColor: "#5e6ad2"
              },
              href: magicLink,
              children: "Login to totp.fly"
            }
          ) }),
          /* @__PURE__ */ jsx(Text, { style: { fontSize: "14px", lineHeight: "20px" }, children: "This link and code will only be valid for the next 60 seconds. If the link does not work, you can use the login verification code directly:" }),
          /* @__PURE__ */ jsx(
            "code",
            {
              style: {
                padding: "1px 4px",
                color: "#3c4149",
                fontFamily: "sans-serif",
                fontSize: "24px",
                fontWeight: "700",
                letterSpacing: "2px"
              },
              children: code
            }
          ),
          /* @__PURE__ */ jsx(Hr, { style: { margin: "20px 0", borderColor: "#cccccc" } }),
          /* @__PURE__ */ jsx(Text, { style: { color: "#8898aa", fontSize: "12px" }, children: "200 totp.fly.dev - Los Angeles, CA" })
        ] })
      }
    )
  ] });
}
function renderAuthEmailEmail(args) {
  return render(/* @__PURE__ */ jsx(AuthEmail, { ...args }));
}
async function sendAuthEmail({ email, code, magicLink }) {
  const html = renderAuthEmailEmail({ email, code, magicLink });
  await sendEmail({
    to: email,
    subject: "Your login code for Remix Auth TOTP",
    html
  });
}
const PLANS = {
  FREE: "free",
  PRO: "pro"
};
const INTERVALS = {
  MONTH: "month",
  YEAR: "year"
};
const CURRENCIES = {
  DEFAULT: "usd",
  USD: "usd",
  EUR: "eur"
};
const PRICING_PLANS = {
  [PLANS.FREE]: {
    id: PLANS.FREE,
    name: "Free",
    description: "Start with the basics, upgrade anytime.",
    prices: {
      [INTERVALS.MONTH]: {
        [CURRENCIES.USD]: 0,
        [CURRENCIES.EUR]: 0
      },
      [INTERVALS.YEAR]: {
        [CURRENCIES.USD]: 0,
        [CURRENCIES.EUR]: 0
      }
    }
  },
  [PLANS.PRO]: {
    id: PLANS.PRO,
    name: "Pro",
    description: "Access to all features and unlimited projects.",
    prices: {
      [INTERVALS.MONTH]: {
        [CURRENCIES.USD]: 1990,
        [CURRENCIES.EUR]: 1990
      },
      [INTERVALS.YEAR]: {
        [CURRENCIES.USD]: 19990,
        [CURRENCIES.EUR]: 19990
      }
    }
  }
};
const HOST_URL = process.env.HOST_URL;
function getDomainUrl(request) {
  const host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("Host");
  if (!host) return null;
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}
function getDomainPathname(request) {
  const pathname = new URL(request.url).pathname;
  if (!pathname) return null;
  return pathname;
}
function getLocaleCurrency(request) {
  const locales = getClientLocales(request);
  if (!locales) return CURRENCIES.DEFAULT;
  return locales.find((locale) => locale === "en-US") ? CURRENCIES.USD : CURRENCIES.EUR;
}
function combineHeaders(...headers) {
  const combined = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of new Headers(header).entries()) {
      combined.append(key, value);
    }
  }
  return combined;
}
const ROUTE_PATH$h = "/auth/logout";
async function loader$l({ request }) {
  return authenticator.logout(request, { redirectTo: "/" });
}
async function action$9({ request }) {
  return authenticator.logout(request, { redirectTo: "/" });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$h,
  action: action$9,
  loader: loader$l
}, Symbol.toStringTag, { value: "Module" }));
if (!Resource.STRIPE_SECRET_KEY.value) {
  throw new Error(`Stripe - ${ERRORS.ENVS_NOT_INITIALIZED})`);
}
const stripe = new Stripe(Resource.STRIPE_SECRET_KEY.value, {
  apiVersion: "2024-04-10",
  typescript: true
});
const primaryId = (name = "id") => text(name).primaryKey().$defaultFn(() => ulid());
const bytea = customType({
  dataType() {
    return "bytea";
  },
  toDriver(value) {
    return value;
  },
  fromDriver(value) {
    return value;
  }
});
const timestamps = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
};
const price = pgTable("price", {
  id: primaryId(),
  planId: text("plan_id").notNull().references(() => plan.id, { onDelete: "cascade", onUpdate: "cascade" }),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  interval: text("interval").notNull(),
  ...timestamps
});
const priceRelations = relations(price, ({ one, many }) => ({
  plan: one(plan, {
    fields: [price.planId],
    references: [plan.id]
  }),
  subscriptions: many(subscription)
}));
const plan = pgTable("plan", {
  id: primaryId(),
  name: text("name").notNull(),
  description: text("description"),
  ...timestamps
});
const planRelations = relations(plan, ({ many }) => ({
  prices: many(price),
  subscriptions: many(subscription)
}));
const subscription = pgTable("subscription", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }).unique(),
  planId: text("plan_id").notNull().references(() => plan.id, { onDelete: "restrict", onUpdate: "cascade" }),
  priceId: text("price_id").notNull().references(() => price.id, { onDelete: "restrict", onUpdate: "cascade" }),
  interval: text("interval").notNull(),
  status: text("status").notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  ...timestamps
});
const subscriptionRelations = relations(subscription, ({ one }) => ({
  price: one(price, {
    fields: [subscription.priceId],
    references: [price.id]
  }),
  plan: one(plan, {
    fields: [subscription.planId],
    references: [plan.id]
  }),
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id]
  })
}));
const user = pgTable("user", {
  id: primaryId(),
  email: text("email").notNull().unique(),
  username: text("username").unique(),
  customerId: text("customer_id").unique(),
  ...timestamps
});
const userRelations = relations(user, ({ many, one }) => ({
  image: one(userImage),
  subscription: one(subscription),
  roles: many(roleToUser)
}));
const userImage = pgTable("user_image", {
  id: primaryId(),
  altText: text("alt_text"),
  contentType: text("content_type").notNull(),
  blob: bytea("blob").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }).unique(),
  ...timestamps
});
const userImageRelations = relations(userImage, ({ one }) => ({
  user: one(user, {
    fields: [userImage.userId],
    references: [user.id]
  })
}));
const roleEnum = pgEnum("name", ["user", "admin"]);
const role = pgTable("role", {
  id: primaryId(),
  name: roleEnum("name").notNull().unique(),
  description: text("description").default("").notNull(),
  ...timestamps
});
const roleRelations = relations(role, ({ many }) => ({
  roleToUser: many(roleToUser),
  permissionToRole: many(permissionToRole)
}));
const roleToUser = pgTable(
  "role_to_user",
  {
    roleId: text("role_id").notNull().references(() => role.id, { onDelete: "cascade", onUpdate: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    ...timestamps
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.userId] })
  })
);
const roleToUserRelations = relations(roleToUser, ({ one }) => ({
  user: one(user, {
    fields: [roleToUser.userId],
    references: [user.id]
  }),
  role: one(role, {
    fields: [roleToUser.roleId],
    references: [role.id]
  })
}));
const entityEnum = pgEnum("entity", ["user"]);
const actionEnum = pgEnum("action", ["create", "read", "update", "delete"]);
const accessEnum = pgEnum("access", ["own", "any"]);
const permission = pgTable("permission", {
  id: primaryId(),
  entity: entityEnum("entity").notNull(),
  action: actionEnum("action").notNull(),
  access: accessEnum("access").notNull(),
  description: text("description").default("").notNull(),
  ...timestamps
});
const permissionRelations = relations(permission, ({ many }) => ({
  permissionToRoles: many(permissionToRole)
}));
const permissionToRole = pgTable(
  "permission_to_role",
  {
    permissionId: text("permission_id").notNull().references(() => permission.id, { onDelete: "cascade", onUpdate: "cascade" }),
    roleId: text("role_id").notNull().references(() => role.id, { onDelete: "cascade", onUpdate: "cascade" }),
    ...timestamps
  },
  (t) => ({
    pk: primaryKey({ columns: [t.permissionId, t.roleId] })
  })
);
const permissionToRoleRelations = relations(permissionToRole, ({ one }) => ({
  role: one(role, {
    fields: [permissionToRole.roleId],
    references: [role.id]
  }),
  permission: one(permission, {
    fields: [permissionToRole.permissionId],
    references: [permission.id]
  })
}));
const schema = {
  user,
  userRelations,
  userImage,
  userImageRelations,
  role,
  roleRelations,
  permission,
  permissionRelations,
  plan,
  planRelations,
  price,
  priceRelations,
  subscription,
  subscriptionRelations,
  roleToUser,
  roleToUserRelations,
  permissionToRole,
  permissionToRoleRelations
};
neonConfig.webSocketConstructor = ws;
const connection = new Pool({
  connectionString: Resource.DATABASE_URL.value,
  max: process.env.DB_MIGRATING || process.env.DB_SEEDING ? 1 : void 0
});
const db = drizzle(connection, {
  schema
});
async function createCustomer({ userId }) {
  const user2 = await db.query.user.findFirst({ where: eq(schema.user.id, userId) });
  if (!user2 || user2.customerId) throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED);
  const email = user2.email ?? void 0;
  const name = user2.username ?? void 0;
  const customer = await stripe.customers.create({ email, name }).catch((err) => console.error(err));
  if (!customer) throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED);
  await db.update(schema.user).set({ customerId: customer.id }).where(eq(schema.user.id, user2.id));
  return true;
}
async function createFreeSubscription({
  userId,
  request
}) {
  const user2 = await db.query.user.findFirst({ where: eq(schema.user.id, userId) });
  if (!user2 || !user2.customerId) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  const subscription2 = await db.query.subscription.findFirst({
    where: eq(schema.subscription.userId, user2.id)
  });
  if (subscription2) return false;
  const currency = getLocaleCurrency(request);
  const plan2 = await db.query.plan.findFirst({
    where: eq(schema.plan.id, PLANS.FREE),
    with: { prices: true }
  });
  const yearlyPrice = plan2?.prices.find(
    (price2) => price2.interval === "year" && price2.currency === currency
  );
  if (!yearlyPrice) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  const stripeSubscription = await stripe.subscriptions.create({
    customer: String(user2.customerId),
    items: [{ price: yearlyPrice.id }]
  });
  if (!stripeSubscription) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  await db.insert(schema.subscription).values({
    id: stripeSubscription.id,
    userId: user2.id,
    planId: String(stripeSubscription.items.data[0].plan.product),
    priceId: String(stripeSubscription.items.data[0].price.id),
    interval: String(stripeSubscription.items.data[0].plan.interval),
    status: stripeSubscription.status,
    currentPeriodStart: new Date(stripeSubscription.current_period_start * 1e3),
    currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1e3),
    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end
  });
  return true;
}
async function createSubscriptionCheckout({
  userId,
  planId,
  planInterval,
  request
}) {
  const user2 = await db.query.user.findFirst({ where: eq(schema.user.id, userId) });
  if (!user2 || !user2.customerId) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  const subscription2 = await db.query.subscription.findFirst({
    where: eq(schema.subscription.userId, user2.id)
  });
  if (subscription2?.planId !== PLANS.FREE) return;
  const currency = getLocaleCurrency(request);
  const plan2 = await db.query.plan.findFirst({
    where: eq(schema.plan.id, planId),
    with: { prices: true }
  });
  const price2 = plan2?.prices.find(
    (price22) => price22.interval === planInterval && price22.currency === currency
  );
  if (!price2) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  const checkout = await stripe.checkout.sessions.create({
    customer: user2.customerId,
    line_items: [{ price: price2.id, quantity: 1 }],
    mode: "subscription",
    payment_method_types: ["card"],
    success_url: `${HOST_URL}/dashboard/checkout`,
    cancel_url: `${HOST_URL}/dashboard/settings/billing`
  });
  if (!checkout) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  return checkout.url;
}
async function createCustomerPortal({ userId }) {
  const user2 = await db.query.user.findFirst({ where: eq(schema.user.id, userId) });
  if (!user2 || !user2.customerId) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  const customerPortal = await stripe.billingPortal.sessions.create({
    customer: user2.customerId,
    return_url: `${HOST_URL}/dashboard/settings/billing`
  });
  if (!customerPortal) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  return customerPortal.url;
}
const CSRF_COOKIE_KEY = "_csrf";
const cookie = createCookie(CSRF_COOKIE_KEY, {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secrets: [Resource.SESSION_SECRET.value || "NOT_A_STRONG_SECRET"],
  secure: process.env.NODE_ENV === "production"
});
const csrf = new CSRF({ cookie });
async function validateCSRF(formData, headers) {
  try {
    await csrf.validate(formData, headers);
  } catch (err) {
    if (err instanceof CSRFError) {
      throw new Response("Invalid CSRF token", { status: 403 });
    }
    throw err;
  }
}
const honeypot = new Honeypot({
  encryptionSeed: Resource.HONEYPOT_ENCRYPTION_SEED.value
});
function checkHoneypot(formData) {
  try {
    honeypot.check(formData);
  } catch (err) {
    if (err instanceof SpamError) {
      throw new Response("Form not submitted properly", { status: 400 });
    }
    throw err;
  }
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function userHasRole(user2, role2) {
  if (!user2) return false;
  return user2.roles.some((r) => r.role.name === role2);
}
function getUserImgSrc(imageId) {
  return imageId ? `/resources/user-images/${imageId}` : "";
}
function useIsPending({
  formAction,
  formMethod = "POST",
  state = "non-idle"
} = {}) {
  const contextualFormAction = useFormAction();
  const navigation = useNavigation();
  const isPendingState = state === "non-idle" ? navigation.state !== "idle" : navigation.state === state;
  return isPendingState && navigation.formAction === (formAction ?? contextualFormAction) && navigation.formMethod === formMethod;
}
function callAll(...fns) {
  return (...args) => fns.forEach((fn) => fn?.(...args));
}
const siteConfig = {
  siteTitle: "Remix SaaS",
  siteDescription: "A Lightweight, Production-Ready Remix Stack for your next SaaS Application.",
  siteUrl: "https://remix-saas.fly.dev",
  siteImage: "/images/og-image.png",
  favicon: "/favicon.ico",
  twitterHandle: "@remix_saas",
  email: "hello@remix-saas.run",
  address: ""
};
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const ROUTE_PATH$g = "/auth/verify";
const VerifyLoginSchema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters.")
});
const meta$a = () => {
  return [{ title: `${siteConfig.siteTitle} - Verify` }];
};
async function loader$k({ request }) {
  await authenticator.isAuthenticated(request, {
    successRedirect: ROUTE_PATH$9
  });
  const cookie2 = await getSession(request.headers.get("Cookie"));
  const authEmail = cookie2.get("auth:email");
  const authError = cookie2.get(authenticator.sessionErrorKey);
  if (!authEmail) return redirect("/auth/login");
  return json({ authEmail, authError }, {
    headers: {
      "Set-Cookie": await commitSession(cookie2)
    }
  });
}
async function action$8({ request }) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  await validateCSRF(formData, clonedRequest.headers);
  checkHoneypot(formData);
  await authenticator.authenticate("TOTP", request, {
    successRedirect: pathname,
    failureRedirect: pathname
  });
}
function Verify() {
  const { authEmail, authError } = useLoaderData();
  const inputRef = useRef(null);
  const isHydrated = useHydrated();
  const [codeForm, { code }] = useForm({
    constraint: getZodConstraint(VerifyLoginSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyLoginSchema });
    }
  });
  useEffect(() => {
    isHydrated && inputRef.current?.focus();
  }, [isHydrated]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-2 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("p", { className: "text-center text-2xl text-primary", children: "Check your inbox!" }),
      /* @__PURE__ */ jsxs("p", { className: "text-center text-base font-normal text-primary/60", children: [
        "We've just emailed you a temporary password.",
        /* @__PURE__ */ jsx("br", {}),
        "Please enter it below."
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "POST",
        autoComplete: "off",
        className: "flex w-full flex-col items-start gap-1",
        ...getFormProps(codeForm),
        children: [
          /* @__PURE__ */ jsx(AuthenticityTokenInput, {}),
          /* @__PURE__ */ jsx(HoneypotInputs, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "code", className: "sr-only", children: "Code" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Code",
                ref: inputRef,
                required: true,
                className: `bg-transparent ${code.errors && "border-destructive focus-visible:ring-destructive"}`,
                ...getInputProps(code, { type: "text" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            !authError && code.errors && /* @__PURE__ */ jsx("span", { className: "mb-2 text-sm text-destructive dark:text-destructive-foreground", children: code.errors.join(" ") }),
            authEmail && authError && /* @__PURE__ */ jsx("span", { className: "mb-2 text-sm text-destructive dark:text-destructive-foreground", children: authError.message })
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Continue" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(Form, { method: "POST", className: "flex w-full flex-col", children: [
      /* @__PURE__ */ jsx(AuthenticityTokenInput, {}),
      /* @__PURE__ */ jsx(HoneypotInputs, {}),
      /* @__PURE__ */ jsx("p", { className: "text-center text-sm font-normal text-primary/60", children: "Did not receive the code?" }),
      /* @__PURE__ */ jsx(Button, { type: "submit", variant: "ghost", className: "w-full hover:bg-transparent", children: "Request New Code" })
    ] })
  ] });
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$g,
  VerifyLoginSchema,
  action: action$8,
  default: Verify,
  loader: loader$k,
  meta: meta$a
}, Symbol.toStringTag, { value: "Module" }));
const ROUTE_PATH$f = "/auth/login";
const LoginSchema = z.object({
  email: z.string().max(256).email("Email address is not valid.")
});
const meta$9 = () => {
  return [{ title: `${siteConfig.siteTitle} - Login` }];
};
async function loader$j({ request }) {
  await authenticator.isAuthenticated(request, {
    successRedirect: ROUTE_PATH$9
  });
  const cookie2 = await getSession(request.headers.get("Cookie"));
  const authEmail = cookie2.get("auth:email");
  const authError = cookie2.get(authenticator.sessionErrorKey);
  return json({ authEmail, authError }, {
    headers: {
      "Set-Cookie": await commitSession(cookie2)
    }
  });
}
async function action$7({ request }) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  await validateCSRF(formData, clonedRequest.headers);
  checkHoneypot(formData);
  await authenticator.authenticate("TOTP", request, {
    successRedirect: ROUTE_PATH$g,
    failureRedirect: pathname
  });
}
function Login() {
  const { authEmail, authError } = useLoaderData();
  const inputRef = useRef(null);
  const isHydrated = useHydrated();
  const isPending = useIsPending();
  const [emailForm, { email }] = useForm({
    constraint: getZodConstraint(LoginSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema });
    }
  });
  useEffect(() => {
    isHydrated && inputRef.current?.focus();
  }, [isHydrated]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-2 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-center text-2xl font-medium text-primary", children: "Continue to Remix SaaS" }),
      /* @__PURE__ */ jsx("p", { className: "text-center text-base font-normal text-primary/60", children: "Welcome back! Please log in to continue." })
    ] }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "POST",
        autoComplete: "off",
        className: "flex w-full flex-col items-start gap-1",
        ...getFormProps(emailForm),
        children: [
          /* @__PURE__ */ jsx(AuthenticityTokenInput, {}),
          /* @__PURE__ */ jsx(HoneypotInputs, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "sr-only", children: "Email" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Email",
                ref: inputRef,
                defaultValue: authEmail ? authEmail : "",
                className: `bg-transparent ${email.errors && "border-destructive focus-visible:ring-destructive"}`,
                ...getInputProps(email, { type: "email" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            !authError && email.errors && /* @__PURE__ */ jsx("span", { className: "mb-2 text-sm text-destructive dark:text-destructive-foreground", children: email.errors.join(" ") }),
            !authEmail && authError && /* @__PURE__ */ jsx("span", { className: "mb-2 text-sm text-destructive dark:text-destructive-foreground", children: authError.message })
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: isPending ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : "Continue with Email" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative flex w-full items-center justify-center", children: [
      /* @__PURE__ */ jsx("span", { className: "absolute w-full border-b border-border" }),
      /* @__PURE__ */ jsx("span", { className: "z-10 bg-card px-2 text-xs font-medium uppercase text-primary/60", children: "Or continue with" })
    ] }),
    /* @__PURE__ */ jsx(Form, { action: "/auth/github", method: "POST", className: "w-full", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "w-full gap-2 bg-transparent", children: [
      /* @__PURE__ */ jsx(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          className: "h-4 w-4 text-primary/80 group-hover:text-primary",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              fill: "currentColor",
              fillRule: "nonzero",
              d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            }
          )
        }
      ),
      "Github"
    ] }) }),
    /* @__PURE__ */ jsxs("p", { className: "px-12 text-center text-sm font-normal leading-normal text-primary/60", children: [
      "By clicking continue, you agree to our",
      " ",
      /* @__PURE__ */ jsx("a", { href: "/", className: "underline hover:text-primary", children: "Terms of Service" }),
      " ",
      "and",
      " ",
      /* @__PURE__ */ jsx("a", { href: "/", className: "underline hover:text-primary", children: "Privacy Policy." })
    ] })
  ] });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  LoginSchema,
  ROUTE_PATH: ROUTE_PATH$f,
  action: action$7,
  default: Login,
  loader: loader$j,
  meta: meta$9
}, Symbol.toStringTag, { value: "Module" }));
const ROUTE_PATH$e = "/onboarding/username";
const UsernameSchema$2 = z.object({
  username: z.string().min(3).max(20).toLowerCase().trim().regex(/^[a-zA-Z0-9]+$/, "Username may only contain alphanumeric characters.")
});
const meta$8 = () => {
  return [{ title: "Remix SaaS - Username" }];
};
async function loader$i({ request }) {
  await requireSessionUser(request, { redirectTo: ROUTE_PATH$f });
  return json({});
}
async function action$6({ request }) {
  const sessionUser = await requireSessionUser(request, {
    redirectTo: ROUTE_PATH$f
  });
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  await validateCSRF(formData, clonedRequest.headers);
  checkHoneypot(formData);
  const submission = parseWithZod(formData, { schema: UsernameSchema$2 });
  if (submission.status !== "success") {
    return json(submission.reply(), { status: submission.status === "error" ? 400 : 200 });
  }
  const { username } = submission.value;
  const user2 = await db.query.user.findFirst({
    where: eq(schema.user.username, username)
  });
  if (user2) {
    return json(
      submission.reply({
        fieldErrors: {
          username: [ERRORS.ONBOARDING_USERNAME_ALREADY_EXISTS]
        }
      })
    );
  }
  await db.update(schema.user).set({ username }).where(eq(schema.user.id, sessionUser.id));
  await createCustomer({ userId: sessionUser.id });
  const subscription2 = await db.query.subscription.findFirst({
    where: eq(schema.subscription.userId, sessionUser.id)
  });
  if (!subscription2) await createFreeSubscription({ userId: sessionUser.id, request });
  return redirect(ROUTE_PATH$9);
}
function OnboardingUsername() {
  const lastResult = useActionData();
  const inputRef = useRef(null);
  const isHydrated = useHydrated();
  const isPending = useIsPending();
  const [form, { username }] = useForm({
    lastResult,
    constraint: getZodConstraint(UsernameSchema$2),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UsernameSchema$2 });
    }
  });
  useEffect(() => {
    isHydrated && inputRef.current?.focus();
  }, [isHydrated]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-2 select-none text-6xl", children: "👋" }),
      /* @__PURE__ */ jsx("h3", { className: "text-center text-2xl font-medium text-primary", children: "Welcome!" }),
      /* @__PURE__ */ jsx("p", { className: "text-center text-base font-normal text-primary/60", children: "Let's get started by choosing a username." })
    ] }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "POST",
        autoComplete: "off",
        className: "flex w-full flex-col items-start gap-1",
        ...getFormProps(form),
        children: [
          /* @__PURE__ */ jsx(AuthenticityTokenInput, {}),
          /* @__PURE__ */ jsx(HoneypotInputs, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "username", className: "sr-only", children: "Username" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Username",
                autoComplete: "off",
                ref: inputRef,
                required: true,
                className: `bg-transparent ${username.errors && "border-destructive focus-visible:ring-destructive"}`,
                ...getInputProps(username, { type: "text" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: username.errors && /* @__PURE__ */ jsx("span", { className: "mb-2 text-sm text-destructive dark:text-destructive-foreground", children: username.errors.join(" ") }) }),
          /* @__PURE__ */ jsx(Button, { type: "submit", size: "sm", className: "w-full", children: isPending ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : "Continue" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "px-6 text-center text-sm font-normal leading-normal text-primary/60", children: "You can update your username at any time from your account settings." })
  ] });
}
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$e,
  UsernameSchema: UsernameSchema$2,
  action: action$6,
  default: OnboardingUsername,
  loader: loader$i,
  meta: meta$8
}, Symbol.toStringTag, { value: "Module" }));
function useRequestInfo() {
  const data = useRouteLoaderData("root");
  if (!data?.requestInfo) throw new Error("No request info found in Root loader.");
  return data.requestInfo;
}
async function requireUserWithRole(request, name) {
  const user2 = await requireUser(request, { redirectTo: ROUTE_PATH$f });
  const hasRole = userHasRole(user2, name);
  if (!hasRole) {
    throw json(
      {
        error: "Unauthorized",
        requiredRole: name,
        message: `Unauthorized: required role: ${name}`
      },
      { status: 403 }
    );
  }
  return user2;
}
const ROUTE_PATH$d = "/admin";
const meta$7 = () => {
  return [{ title: `${siteConfig.siteTitle} - Admin` }];
};
async function loader$h({ request }) {
  const user2 = await requireUserWithRole(request, "admin");
  const subscription2 = await db.query.subscription.findFirst({
    where: eq(schema.subscription.userId, user2.id)
  });
  return json({ user: user2, subscription: subscription2 });
}
function Admin() {
  const { user: user2, subscription: subscription2 } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[100vh] w-full flex-col bg-secondary dark:bg-black", children: [
    /* @__PURE__ */ jsx(Navigation, { user: user2, planId: subscription2?.planId }),
    /* @__PURE__ */ jsx("div", { className: "flex h-full w-full px-6 py-8", children: /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-full w-full max-w-screen-xl gap-12", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black", children: [
      /* @__PURE__ */ jsx("div", { className: "flex w-full flex-col rounded-lg p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Customers" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "Simple admin panel to manage your products and sales." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex w-full px-6", children: /* @__PURE__ */ jsx("div", { className: "w-full border-b border-border" }) }),
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex w-full flex-col items-center p-6", children: /* @__PURE__ */ jsxs("div", { className: "relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "z-10 flex max-w-[460px] flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40", children: /* @__PURE__ */ jsx(ShoppingBasket, { className: "h-8 w-8 stroke-[1.5px] text-primary/60" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-base font-medium text-primary", children: "Track your Sales" }),
            /* @__PURE__ */ jsx("p", { className: "text-center text-base font-normal text-primary/60", children: "This is a simple Demo that you could use to manage your products and sales." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "z-10 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
          "a",
          {
            target: "_blank",
            rel: "noreferrer",
            href: "https://github.com/dev-xo/remix-saas/tree/main/docs#welcome-to-%EF%B8%8F-remix-saas-documentation",
            className: cn(
              `${buttonVariants({ variant: "ghost", size: "sm" })} gap-2`
            ),
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-primary/60 group-hover:text-primary", children: "Explore Documentation" }),
              /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 stroke-[1.5px] text-primary/60 group-hover:text-primary" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "base-grid absolute h-full w-full opacity-40" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" })
      ] }) })
    ] }) }) })
  ] });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$d,
  default: Admin,
  loader: loader$h,
  meta: meta$7
}, Symbol.toStringTag, { value: "Module" }));
const INTENTS = {
  INTENT: "INTENT",
  USER_UPDATE_USERNAME: "USER_UPDATE_USERNAME",
  USER_DELETE_ACCOUNT: "USER_DELETE_ACCOUNT",
  USER_DELETE: "USER_DELETE",
  SUBSCRIPTION_CREATE_CHECKOUT: "SUBSCRIPTION_CREATE_CHECKOUT",
  SUBSCRIPTION_CREATE_CUSTOMER_PORTAL: "SUBSCRIPTION_CREATE_CUSTOMER_PORTAL"
};
const Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;
const ROUTE_PATH$c = "/dashboard/settings/billing";
const meta$6 = () => {
  return [{ title: "Remix SaaS - Billing" }];
};
async function loader$g({ request }) {
  const sessionUser = await requireSessionUser(request, {
    redirectTo: ROUTE_PATH$f
  });
  const subscription2 = await db.query.subscription.findFirst({
    where: eq(schema.subscription.userId, sessionUser.id)
  });
  const currency = getLocaleCurrency(request);
  return json({ subscription: subscription2, currency });
}
async function action$5({ request }) {
  const sessionUser = await requireSessionUser(request, {
    redirectTo: ROUTE_PATH$f
  });
  const formData = await request.formData();
  const intent = formData.get(INTENTS.INTENT);
  if (intent === INTENTS.SUBSCRIPTION_CREATE_CHECKOUT) {
    const planId = String(formData.get("planId"));
    const planInterval = String(formData.get("planInterval"));
    const checkoutUrl = await createSubscriptionCheckout({
      userId: sessionUser.id,
      planId,
      planInterval,
      request
    });
    if (!checkoutUrl) return json({ success: false });
    return redirect(checkoutUrl);
  }
  if (intent === INTENTS.SUBSCRIPTION_CREATE_CUSTOMER_PORTAL) {
    const customerPortalUrl = await createCustomerPortal({
      userId: sessionUser.id
    });
    if (!customerPortalUrl) return json({ success: false });
    return redirect(customerPortalUrl);
  }
  return json({});
}
function DashboardBilling() {
  const { subscription: subscription2, currency } = useLoaderData();
  const [selectedPlanId, setSelectedPlanId] = useState(
    subscription2?.planId ?? PLANS.FREE
  );
  const [selectedPlanInterval, setSelectedPlanInterval] = useState(
    INTERVALS.MONTH
  );
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full w-full flex-col gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-2 p-6 py-2", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "This is a demo app." }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm font-normal text-primary/60", children: [
        "Remix SaaS is a demo app that uses Stripe test environment. You can find a list of test card numbers on the",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://stripe.com/docs/testing#cards",
            target: "_blank",
            rel: "noreferrer",
            className: "font-medium text-primary/80 underline",
            children: "Stripe docs"
          }
        ),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-start rounded-lg border border-border bg-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Plan" }),
        /* @__PURE__ */ jsxs("p", { className: "flex items-start gap-1 text-sm font-normal text-primary/60", children: [
          "You are currently on the",
          " ",
          /* @__PURE__ */ jsx("span", { className: "flex h-[18px] items-center rounded-md bg-primary/10 px-1.5 text-sm font-medium text-primary/80", children: subscription2 ? subscription2.planId?.charAt(0).toUpperCase() + subscription2.planId.slice(1) : "Free" }),
          "plan."
        ] })
      ] }),
      subscription2?.planId === PLANS.FREE && /* @__PURE__ */ jsx("div", { className: "flex w-full flex-col items-center justify-evenly gap-2 border-border p-6 pt-0", children: Object.values(PRICING_PLANS).map((plan2) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          tabIndex: 0,
          className: `flex w-full select-none items-center rounded-md border border-border hover:border-primary/60 ${selectedPlanId === plan2.id && "border-primary/60"}`,
          onClick: () => setSelectedPlanId(plan2.id),
          onKeyDown: (e) => {
            if (e.key === "Enter") setSelectedPlanId(plan2.id);
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-start p-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-base font-medium text-primary", children: plan2.name }),
                plan2.id !== PLANS.FREE && /* @__PURE__ */ jsxs("span", { className: "flex items-center rounded-md bg-primary/10 px-1.5 text-sm font-medium text-primary/80", children: [
                  currency === CURRENCIES.USD ? "$" : "€",
                  " ",
                  selectedPlanInterval === INTERVALS.MONTH ? plan2.prices[INTERVALS.MONTH][currency] / 100 : plan2.prices[INTERVALS.YEAR][currency] / 100,
                  " ",
                  "/ ",
                  selectedPlanInterval === INTERVALS.MONTH ? "month" : "year"
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-start text-sm font-normal text-primary/60", children: plan2.description })
            ] }),
            plan2.id !== PLANS.FREE && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4", children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "interval-switch",
                  className: "text-start text-sm text-primary/60",
                  children: selectedPlanInterval === INTERVALS.MONTH ? "Monthly" : "Yearly"
                }
              ),
              /* @__PURE__ */ jsx(
                Switch,
                {
                  id: "interval-switch",
                  checked: selectedPlanInterval === INTERVALS.YEAR,
                  onCheckedChange: () => setSelectedPlanInterval(
                    (prev) => prev === INTERVALS.MONTH ? INTERVALS.YEAR : INTERVALS.MONTH
                  )
                }
              )
            ] })
          ]
        },
        plan2.id
      )) }),
      subscription2 && subscription2.planId !== PLANS.FREE && /* @__PURE__ */ jsx("div", { className: "flex w-full flex-col items-center justify-evenly gap-2 border-border p-6 pt-0", children: /* @__PURE__ */ jsx("div", { className: "flex w-full items-center overflow-hidden rounded-md border border-primary/60", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-start p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-base font-medium text-primary", children: subscription2.planId.charAt(0).toUpperCase() + subscription2.planId.slice(1) }),
          /* @__PURE__ */ jsxs("p", { className: "flex items-start gap-1 text-sm font-normal text-primary/60", children: [
            subscription2.cancelAtPeriodEnd === true ? /* @__PURE__ */ jsx("span", { className: "flex h-[18px] items-center text-sm font-medium text-red-500", children: "Expires" }) : /* @__PURE__ */ jsx("span", { className: "flex h-[18px] items-center text-sm font-medium text-green-500", children: "Renews" }),
            "on:",
            " ",
            new Date(subscription2.currentPeriodEnd).toLocaleDateString("en-US"),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-start text-sm font-normal text-primary/60", children: PRICING_PLANS[PLANS.PRO].description })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 py-3 dark:bg-card", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "You will not be charged for testing the subscription upgrade." }),
        subscription2?.planId === PLANS.FREE && /* @__PURE__ */ jsxs(Form, { method: "POST", children: [
          /* @__PURE__ */ jsx("input", { type: "hidden", name: "planId", value: selectedPlanId }),
          /* @__PURE__ */ jsx("input", { type: "hidden", name: "planInterval", value: selectedPlanInterval }),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              size: "sm",
              name: INTENTS.INTENT,
              value: INTENTS.SUBSCRIPTION_CREATE_CHECKOUT,
              disabled: selectedPlanId === PLANS.FREE,
              children: "Upgrade to PRO"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-start rounded-lg border border-border bg-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Manage Subscription" }),
        /* @__PURE__ */ jsx("p", { className: "flex items-start gap-1 text-sm font-normal text-primary/60", children: "Update your payment method, billing address, and more." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 py-3 dark:bg-card", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "You will be redirected to the Stripe Customer Portal." }),
        /* @__PURE__ */ jsx(Form, { method: "POST", children: /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            size: "sm",
            name: INTENTS.INTENT,
            value: INTENTS.SUBSCRIPTION_CREATE_CUSTOMER_PORTAL,
            children: "Manage"
          }
        ) })
      ] })
    ] })
  ] });
}
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$c,
  action: action$5,
  default: DashboardBilling,
  loader: loader$g,
  meta: meta$6
}, Symbol.toStringTag, { value: "Module" }));
const ROUTE_PATH$b = "/dashboard/settings";
const UsernameSchema$1 = z.object({
  username: z.string().min(3).max(20).toLowerCase().trim().regex(/^[a-zA-Z0-9]+$/, "Username may only contain alphanumeric characters.")
});
const meta$5 = () => {
  return [{ title: "Settings" }];
};
async function loader$f({ request }) {
  const user2 = await requireUser(request);
  return json({ user: user2 });
}
function DashboardSettings$1() {
  const location2 = useLocation();
  const isSettingsPath = location2.pathname === ROUTE_PATH$b;
  const isBillingPath = location2.pathname === ROUTE_PATH$c;
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full px-6 py-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-full w-full max-w-screen-xl gap-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "hidden w-full max-w-64 flex-col gap-0.5 lg:flex", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: ROUTE_PATH$b,
          prefetch: "intent",
          className: cn(
            `${buttonVariants({ variant: "ghost" })} ${isSettingsPath && "bg-primary/5"} justify-start rounded-md`
          ),
          children: /* @__PURE__ */ jsx(
            "span",
            {
              className: cn(
                `text-sm text-primary/80 ${isSettingsPath && "font-medium text-primary"}`
              ),
              children: "General"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: ROUTE_PATH$c,
          prefetch: "intent",
          className: cn(
            `${buttonVariants({ variant: "ghost" })} ${isBillingPath && "bg-primary/5"} justify-start rounded-md`
          ),
          children: /* @__PURE__ */ jsx(
            "span",
            {
              className: cn(
                `text-sm text-primary/80 ${isBillingPath && "font-medium text-primary"}`
              ),
              children: "Billing"
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Outlet, {})
  ] }) });
}
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$b,
  UsernameSchema: UsernameSchema$1,
  default: DashboardSettings$1,
  loader: loader$f,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
const hintsUtils = getHintUtils({
  theme: clientHint,
  timeZone: clientHint$1
});
const { getHints } = hintsUtils;
function useHints() {
  const requestInfo = useRequestInfo();
  return requestInfo.hints;
}
const ThemeSchema = z.object({
  theme: z.enum(["system", "light", "dark"]),
  redirectTo: z.string().optional()
});
const THEME_COOKIE_KEY = "_theme";
function getTheme(request) {
  const cookieHeader = request.headers.get("Cookie");
  const parsed = cookieHeader ? cookie$1.parse(cookieHeader)[THEME_COOKIE_KEY] : "light";
  if (parsed === "light" || parsed === "dark") {
    return parsed;
  }
  return null;
}
function setTheme(theme) {
  if (theme === "system") {
    return cookie$1.serialize(THEME_COOKIE_KEY, "", {
      path: "/",
      maxAge: -1,
      sameSite: "lax"
    });
  }
  return cookie$1.serialize(THEME_COOKIE_KEY, theme, {
    path: "/",
    maxAge: 31536e3,
    sameSite: "lax"
  });
}
function useTheme() {
  const hints = useHints();
  const requestInfo = useRequestInfo();
  const optimisticMode = useOptimisticThemeMode();
  if (optimisticMode) {
    return optimisticMode === "system" ? hints.theme : optimisticMode;
  }
  return requestInfo.userPrefs.theme ?? hints.theme;
}
function useOptimisticThemeMode() {
  const themeFetcher = useFetcher({ key: "theme-fetcher" });
  if (themeFetcher?.formData) {
    const formData = Object.fromEntries(themeFetcher.formData);
    const { theme } = ThemeSchema.parse(formData);
    return theme;
  }
}
const ROUTE_PATH$a = "/resources/update-theme";
async function action$4({ request }) {
  const formData = Object.fromEntries(await request.formData());
  const { theme, redirectTo } = ThemeSchema.parse(formData);
  const responseInit = {
    headers: { "Set-Cookie": setTheme(theme) }
  };
  if (redirectTo) {
    return redirect(safeRedirect(redirectTo), responseInit);
  }
  return new Response(null, responseInit);
}
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$a,
  action: action$4
}, Symbol.toStringTag, { value: "Module" }));
const Select = SelectPrimitive.Root;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
function ThemeSwitcher({
  userPreference,
  triggerClass
}) {
  const submit = useSubmit();
  const optimisticMode = useOptimisticThemeMode();
  const mode2 = optimisticMode ?? userPreference ?? "system";
  const themes = ["light", "dark", "system"];
  return /* @__PURE__ */ jsxs(
    Select,
    {
      onValueChange: (theme) => submit(
        { theme },
        {
          method: "POST",
          action: ROUTE_PATH$a,
          navigate: false,
          fetcherKey: "theme-fetcher"
        }
      ),
      children: [
        /* @__PURE__ */ jsx(
          SelectTrigger,
          {
            className: cn(
              "h-6 rounded border-primary/20 bg-secondary !px-2 hover:border-primary/40",
              triggerClass
            ),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
              mode2 === "light" ? /* @__PURE__ */ jsx(Sun, { className: "h-[14px] w-[14px]" }) : mode2 === "dark" ? /* @__PURE__ */ jsx(Moon, { className: "h-[14px] w-[14px]" }) : /* @__PURE__ */ jsx(Monitor, { className: "h-[14px] w-[14px]" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: mode2.charAt(0).toUpperCase() + mode2.slice(1) })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(SelectContent, { children: themes.map((theme) => /* @__PURE__ */ jsx(
          SelectItem,
          {
            value: theme,
            className: `text-sm font-medium text-primary/60 ${mode2 === theme && "text-primary"}`,
            children: theme && theme.charAt(0).toUpperCase() + theme.slice(1)
          },
          theme
        )) })
      ]
    }
  );
}
function ThemeSwitcherHome() {
  const fetcher = useFetcher({ key: "theme-fetcher" });
  const themes = ["light", "dark", "system"];
  return /* @__PURE__ */ jsx(fetcher.Form, { method: "POST", action: ROUTE_PATH$a, className: "flex gap-3", children: themes.map((theme) => /* @__PURE__ */ jsx("button", { type: "submit", name: "theme", value: theme, children: theme === "light" ? /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4 text-primary/80 hover:text-primary" }) : theme === "dark" ? /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4 text-primary/80 hover:text-primary" }) : /* @__PURE__ */ jsx(Monitor, { className: "h-4 w-4 text-primary/80 hover:text-primary" }) }, theme)) });
}
function LanguageSwitcher() {
  const navigate = useNavigate();
  const pathname = location.pathname.replace(/\/$/, "");
  const { i18n: i18n2 } = useTranslation();
  const language = i18n2.resolvedLanguage;
  const langs = [
    { text: "English", value: "en" },
    { text: "Spanish", value: "es" }
  ];
  const formatLanguage = (lng) => {
    return langs.find((lang) => lang.value === lng)?.text;
  };
  return /* @__PURE__ */ jsxs(Select, { onValueChange: (value) => navigate(`${pathname}?lng=${value}`), children: [
    /* @__PURE__ */ jsx(SelectTrigger, { className: "h-6 rounded border-primary/20 bg-secondary !px-2 hover:border-primary/40", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsx(Languages, { className: "h-[14px] w-[14px]" }),
      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: formatLanguage(language || "en") })
    ] }) }),
    /* @__PURE__ */ jsx(SelectContent, { children: langs.map(({ text: text2, value }) => /* @__PURE__ */ jsx(
      SelectItem,
      {
        value,
        className: "text-sm font-medium text-primary/60",
        children: text2
      },
      value
    )) })
  ] });
}
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
function Logo({ width, height, className, ...args }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      ...args,
      width: width ?? 40,
      height: height ?? 40,
      xmlns: "http://www.w3.org/2000/svg",
      className: cn(`text-primary ${className}`),
      viewBox: "0 0 24 24",
      fill: "none",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M13.5475 3.25H13.5475C15.3866 3.24999 16.8308 3.24998 17.9694 3.3786C19.1316 3.50988 20.074 3.78362 20.8574 4.40229C21.0919 4.58749 21.3093 4.79205 21.507 5.0138C22.1732 5.76101 22.4707 6.66669 22.6124 7.77785C22.75 8.85727 22.75 10.2232 22.75 11.9473V12.0528C22.75 13.7768 22.75 15.1427 22.6124 16.2222C22.4707 17.3333 22.1732 18.239 21.507 18.9862C21.3093 19.208 21.0919 19.4125 20.8574 19.5977C20.074 20.2164 19.1316 20.4901 17.9694 20.6214C16.8308 20.75 15.3866 20.75 13.5475 20.75H10.4525C8.61345 20.75 7.16917 20.75 6.03058 20.6214C4.86842 20.4901 3.926 20.2164 3.14263 19.5977C2.90811 19.4125 2.69068 19.2079 2.49298 18.9862C1.82681 18.239 1.52932 17.3333 1.38763 16.2222C1.24998 15.1427 1.24999 13.7767 1.25 12.0527V12.0527V11.9473V11.9472C1.24999 10.2232 1.24998 8.85727 1.38763 7.77785C1.52932 6.66669 1.82681 5.76101 2.49298 5.0138C2.69068 4.79205 2.90811 4.58749 3.14263 4.40229C3.926 3.78362 4.86842 3.50988 6.03058 3.3786C7.16917 3.24998 8.61345 3.24999 10.4525 3.25H10.4525H13.5475ZM10 8C7.79086 8 6 9.79086 6 12C6 14.2091 7.79086 16 10 16C10.7286 16 11.4117 15.8052 12.0001 15.4648C12.5884 15.8049 13.2719 16 13.9998 16C16.2089 16 17.9998 14.2091 17.9998 12C17.9998 9.79086 16.2089 8 13.9998 8C13.2719 8 12.5884 8.19505 12.0001 8.53517C11.4117 8.19481 10.7286 8 10 8ZM8 12C8 10.8954 8.89543 10 10 10C11.1046 10 12 10.8954 12 12C12 13.1046 11.1046 14 10 14C8.89543 14 8 13.1046 8 12ZM13.9998 14C13.8271 14 13.6599 13.9783 13.5004 13.9374C13.8187 13.3634 14 12.7029 14 12C14 11.2971 13.8187 10.6366 13.5004 10.0626C13.6599 10.0217 13.8271 10 13.9998 10C15.1043 10 15.9998 10.8954 15.9998 12C15.9998 13.1046 15.1043 14 13.9998 14Z",
          fill: "currentColor"
        }
      )
    }
  );
}
function Navigation({ user: user2, planId }) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const requestInfo = useRequestInfo();
  const location2 = useLocation();
  const isAdminPath = location2.pathname === ROUTE_PATH$d;
  const isDashboardPath = location2.pathname === ROUTE_PATH$9;
  const isSettingsPath = location2.pathname === ROUTE_PATH$b;
  const isBillingPath = location2.pathname === ROUTE_PATH$c;
  return /* @__PURE__ */ jsxs("nav", { className: "sticky top-0 z-50 flex w-full flex-col border-b border-border bg-card px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-screen-xl items-center justify-between py-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex h-10 items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: ROUTE_PATH$9,
            prefetch: "intent",
            className: "flex h-10 items-center gap-1",
            children: /* @__PURE__ */ jsx(Logo, {})
          }
        ),
        /* @__PURE__ */ jsx(Slash, { className: "h-6 w-6 -rotate-12 stroke-[1.5px] text-primary/10" }),
        /* @__PURE__ */ jsxs(DropdownMenu, { modal: false, children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              className: "gap-2 px-2 data-[state=open]:bg-primary/5",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  user2?.image?.id ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      className: "h-8 w-8 rounded-full object-cover",
                      alt: user2.username ?? user2.email,
                      src: getUserImgSrc(user2.image?.id)
                    }
                  ) : /* @__PURE__ */ jsx("span", { className: "h-8 w-8 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-primary/80", children: user2?.username || "" }),
                  /* @__PURE__ */ jsx("span", { className: "flex h-5 items-center rounded-full bg-primary/10 px-2 text-xs font-medium text-primary/80", children: planId && planId.charAt(0).toUpperCase() + planId.slice(1) || "Free" })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-center justify-center", children: [
                  /* @__PURE__ */ jsx(ChevronUp, { className: "relative top-[3px] h-[14px] w-[14px] stroke-[1.5px] text-primary/60" }),
                  /* @__PURE__ */ jsx(ChevronDown, { className: "relative bottom-[3px] h-[14px] w-[14px] stroke-[1.5px] text-primary/60" })
                ] })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { sideOffset: 8, className: "min-w-56 bg-card p-2", children: [
            /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "flex items-center text-xs font-normal text-primary/60", children: "Personal Account" }),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "h-10 w-full cursor-pointer justify-between rounded-md bg-secondary px-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                user2?.image?.id ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    className: "h-6 w-6 rounded-full object-cover",
                    alt: user2.username ?? user2.email,
                    src: getUserImgSrc(user2.image?.id)
                  }
                ) : /* @__PURE__ */ jsx("span", { className: "h-6 w-6 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-primary/80", children: user2?.username || "" })
              ] }),
              /* @__PURE__ */ jsx(Check, { className: "h-[18px] w-[18px] stroke-[1.5px] text-primary/60" })
            ] }),
            planId && planId === PLANS.FREE && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "mx-0 my-2" }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { className: "p-0 focus:bg-transparent", children: /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  className: "w-full",
                  onClick: () => navigate(ROUTE_PATH$c),
                  children: "Upgrade to PRO"
                }
              ) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex h-10 items-center gap-3", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "https://github.com/dev-xo/remix-saas/tree/main/docs#welcome-to-%EF%B8%8F-remix-saas-documentation",
            className: cn(
              `${buttonVariants({ variant: "outline", size: "sm" })} group hidden h-8 gap-2 rounded-full bg-transparent px-2 pr-2.5 md:flex`
            ),
            children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-5 w-5 text-primary",
                  viewBox: "0 0 24 24",
                  fill: "currentColor",
                  children: /* @__PURE__ */ jsx("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" })
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-primary/60 transition group-hover:text-primary group-focus:text-primary", children: "Documentation" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(DropdownMenu, { modal: false, children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "h-8 w-8 rounded-full", children: user2?.image?.id ? /* @__PURE__ */ jsx(
            "img",
            {
              className: "min-h-8 min-w-8 rounded-full object-cover",
              alt: user2.username ?? user2.email,
              src: getUserImgSrc(user2.image?.id)
            }
          ) : /* @__PURE__ */ jsx("span", { className: "min-h-8 min-w-8 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" }) }) }),
          /* @__PURE__ */ jsxs(
            DropdownMenuContent,
            {
              sideOffset: 8,
              className: "fixed -right-4 min-w-56 bg-card p-2",
              children: [
                /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "group flex-col items-start focus:bg-transparent", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-primary/80 group-hover:text-primary group-focus:text-primary", children: user2?.username || "" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-primary/60", children: user2?.email })
                ] }),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: "group h-9 w-full cursor-pointer justify-between rounded-md px-2",
                    onClick: () => navigate(ROUTE_PATH$b),
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "text-sm text-primary/60 group-hover:text-primary group-focus:text-primary", children: "Settings" }),
                      /* @__PURE__ */ jsx(Settings, { className: "h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: cn(
                      "group flex h-9 justify-between rounded-md px-2 hover:bg-transparent"
                    ),
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "w-full text-sm text-primary/60 group-hover:text-primary group-focus:text-primary", children: "Theme" }),
                      /* @__PURE__ */ jsx(ThemeSwitcher, { userPreference: requestInfo.userPrefs.theme })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: cn(
                      "group flex h-9 justify-between rounded-md px-2 hover:bg-transparent"
                    ),
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "w-full text-sm text-primary/60 group-hover:text-primary group-focus:text-primary", children: "Language" }),
                      /* @__PURE__ */ jsx(LanguageSwitcher, {})
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "mx-0 my-2" }),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: "group h-9 w-full cursor-pointer justify-between rounded-md px-2",
                    onClick: () => submit({}, { action: ROUTE_PATH$h, method: "POST" }),
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "text-sm text-primary/60 group-hover:text-primary group-focus:text-primary", children: "Log Out" }),
                      /* @__PURE__ */ jsx(LogOut, { className: "h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" })
                    ]
                  }
                )
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-screen-xl items-center gap-3", children: [
      user2 && userHasRole(user2, "admin") && /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex h-12 items-center border-b-2 ${isAdminPath ? "border-primary" : "border-transparent"}`,
          children: /* @__PURE__ */ jsx(
            Link,
            {
              to: ROUTE_PATH$d,
              prefetch: "intent",
              className: cn(
                `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80`
              ),
              children: "Admin"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex h-12 items-center border-b-2 ${isDashboardPath ? "border-primary" : "border-transparent"}`,
          children: /* @__PURE__ */ jsx(
            Link,
            {
              to: ROUTE_PATH$9,
              prefetch: "intent",
              className: cn(
                `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80`
              ),
              children: "Dashboard"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex h-12 items-center border-b-2 ${isSettingsPath ? "border-primary" : "border-transparent"}`,
          children: /* @__PURE__ */ jsx(
            Link,
            {
              to: ROUTE_PATH$b,
              prefetch: "intent",
              className: cn(
                `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80`
              ),
              children: "Settings"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex h-12 items-center border-b-2 ${isBillingPath ? "border-primary" : "border-transparent"}`,
          children: /* @__PURE__ */ jsx(
            Link,
            {
              to: ROUTE_PATH$c,
              prefetch: "intent",
              className: cn(
                `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80`
              ),
              children: "Billing"
            }
          )
        }
      )
    ] })
  ] });
}
const ROUTE_PATH$9 = "/dashboard";
async function loader$e({ request }) {
  const user2 = await requireUser(request);
  if (!user2.username) return redirect(ROUTE_PATH$e);
  const subscription2 = await db.query.subscription.findFirst({
    where: eq(schema.subscription.userId, user2.id)
  });
  return json({ user: user2, subscription: subscription2 });
}
function Dashboard() {
  const { user: user2, subscription: subscription2 } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[100vh] w-full flex-col bg-secondary dark:bg-black", children: [
    /* @__PURE__ */ jsx(Navigation, { user: user2, planId: subscription2?.planId }),
    /* @__PURE__ */ jsx(Outlet, {})
  ] });
}
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$9,
  default: Dashboard,
  loader: loader$e
}, Symbol.toStringTag, { value: "Module" }));
const ROUTE_PATH$8 = "/auth/magic-link";
async function loader$d({ request }) {
  return authenticator.authenticate("TOTP", request, {
    successRedirect: ROUTE_PATH$9,
    failureRedirect: ROUTE_PATH$f
  });
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$8,
  loader: loader$d
}, Symbol.toStringTag, { value: "Module" }));
function getUserWithImageAndRole(email) {
  return db.query.user.findFirst({
    where: eq(schema.user.email, email),
    with: {
      image: { columns: { id: true } },
      roles: {
        columns: {},
        with: {
          role: {
            columns: {
              name: true
            }
          }
        }
      }
    }
  });
}
function createUseWithImageAndRole(email) {
  return db.transaction(async (tx) => {
    const [newUser] = await tx.insert(schema.user).values({ email }).returning();
    const roles = await tx.select({ id: schema.role.id }).from(schema.role).where(eq(schema.role.name, "user"));
    await tx.insert(schema.roleToUser).values(roles.map((role2) => ({ roleId: role2.id, userId: newUser.id })));
    return getUserWithImageAndRole(email);
  });
}
const authenticator = new Authenticator(authSessionStorage);
authenticator.use(
  new TOTPStrategy(
    {
      secret: Resource.ENCRYPTION_SECRET.value || "NOT_A_STRONG_SECRET",
      magicLinkPath: ROUTE_PATH$8,
      sendTOTP: async ({ email, code, magicLink }) => {
        if (process.env.NODE_ENV === "development") {
          console.log("=============================");
          console.log("[ Dev-Only ] TOTP Code:", code);
          console.log("=============================");
          if (email.startsWith("admin")) {
            console.log("Not sending email for admin user.");
            return;
          }
        }
        await sendAuthEmail({ email, code, magicLink });
      }
    },
    async ({ email }) => {
      let user2 = await getUserWithImageAndRole(email);
      if (!user2) {
        user2 = await createUseWithImageAndRole(email);
        if (!user2) throw new Error(ERRORS.AUTH_USER_NOT_CREATED);
      }
      return user2;
    }
  )
);
authenticator.use(
  new GitHubStrategy(
    {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      redirectURI: `${HOST_URL}/auth/github/callback`
    },
    async ({ profile }) => {
      const email = profile._json.email || profile.emails[0].value;
      let user2 = await getUserWithImageAndRole(email);
      if (!user2) {
        user2 = await createUseWithImageAndRole(email);
        if (!user2) throw new Error(ERRORS.AUTH_USER_NOT_CREATED);
      }
      return user2;
    }
  )
);
async function requireSessionUser(request, { redirectTo } = {}) {
  const sessionUser = await authenticator.isAuthenticated(request);
  if (!sessionUser) {
    if (!redirectTo) throw redirect(ROUTE_PATH$h);
    throw redirect(redirectTo);
  }
  return sessionUser;
}
async function requireUser(request, { redirectTo } = {}) {
  const sessionUser = await authenticator.isAuthenticated(request);
  const user2 = sessionUser?.email ? await getUserWithImageAndRole(sessionUser?.email) : null;
  if (!user2) {
    if (!redirectTo) throw redirect(ROUTE_PATH$h);
    throw redirect(redirectTo);
  }
  return user2;
}
const TOAST_SESSION_KEY = "_toast";
const TOAST_SESSION_FLASH_KEY = "_toast_flash";
const toastSessionStorage = createCookieSessionStorage({
  cookie: {
    name: TOAST_SESSION_KEY,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secrets: [Resource.SESSION_SECRET.value || "NOT_A_STRONG_SECRET"],
    secure: process.env.NODE_ENV === "production"
  }
});
const ToastSchema = z.object({
  description: z.string(),
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  title: z.string().optional(),
  type: z.enum(["message", "success", "error"]).default("message")
});
async function getToastSession(request) {
  const sessionUser = await toastSessionStorage.getSession(request.headers.get("Cookie"));
  const result = ToastSchema.safeParse(sessionUser.get(TOAST_SESSION_FLASH_KEY));
  const toast2 = result.success ? result.data : null;
  return {
    toast: toast2,
    headers: toast2 ? new Headers({
      "Set-Cookie": await toastSessionStorage.commitSession(sessionUser)
    }) : null
  };
}
async function createToastHeaders(toastInput) {
  const sessionUser = await toastSessionStorage.getSession();
  const toast2 = ToastSchema.parse(toastInput);
  sessionUser.flash(TOAST_SESSION_FLASH_KEY, toast2);
  const cookie2 = await toastSessionStorage.commitSession(sessionUser);
  return new Headers({ "Set-Cookie": cookie2 });
}
function useToast(toast$1) {
  useEffect(() => {
    if (toast$1) {
      setTimeout(() => {
        toast[toast$1.type](toast$1.title, {
          id: toast$1.id,
          description: toast$1.description
        });
      }, 0);
    }
  }, [toast$1]);
}
const Toaster = ({ theme, ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function ClientHintCheck({ nonce }) {
  const { revalidate } = useRevalidator();
  useEffect(() => subscribeToSchemeChange(() => revalidate()), [revalidate]);
  return /* @__PURE__ */ jsx(
    "script",
    {
      nonce,
      dangerouslySetInnerHTML: {
        __html: hintsUtils.getClientHintCheckScript()
      }
    }
  );
}
function GenericErrorBoundary({
  statusHandlers,
  defaultStatusHandler = ({ error }) => /* @__PURE__ */ jsxs("p", { children: [
    error.status,
    " ",
    error.status,
    " ",
    error.data
  ] }),
  unexpectedErrorHandler = (error) => /* @__PURE__ */ jsx("p", { children: getErrorMessage(error) })
}) {
  const params = useParams();
  const error = useRouteError();
  if (typeof document !== "undefined") {
    console.error(error);
  }
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col items-center justify-center", children: isRouteErrorResponse(error) ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
    error,
    params
  }) : unexpectedErrorHandler(error) });
}
function getErrorMessage(err) {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err && typeof err.message === "string") {
    return err.message;
  }
  console.error("Unable to get error message for error:", err);
  return "Unknown error";
}
const RootCSS = "/assets/root-XIloWU53.css";
const handle = { i18n: ["translation"] };
const meta$4 = ({ data }) => {
  return [
    { title: data ? `${siteConfig.siteTitle}` : `Error | ${siteConfig.siteTitle}` },
    {
      name: "description",
      content: siteConfig.siteDescription
    }
  ];
};
const links = () => {
  return [{ rel: "stylesheet", href: RootCSS }];
};
async function loader$c({ request }) {
  const sessionUser = await authenticator.isAuthenticated(request);
  const user2 = sessionUser?.id && await db.query.user.findFirst({
    where: eq(schema.user.id, sessionUser.id),
    with: {
      image: { columns: { id: true } },
      roles: {
        columns: {},
        with: {
          role: {
            columns: {
              name: true
            }
          }
        }
      }
    }
  });
  const locale = await i18nServer.getLocale(request);
  const { toast: toast2, headers: toastHeaders } = await getToastSession(request);
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken();
  return json(
    {
      user: user2,
      locale,
      toast: toast2,
      csrfToken,
      honeypotProps: honeypot.getInputProps(),
      requestInfo: {
        hints: getHints(request),
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
        userPrefs: { theme: getTheme(request) }
      }
    },
    {
      headers: combineHeaders(
        { "Set-Cookie": await localeCookie.serialize(locale) },
        toastHeaders,
        csrfCookieHeader ? { "Set-Cookie": csrfCookieHeader } : null
      )
    }
  );
}
function Document({
  children,
  nonce,
  lang = "en",
  dir = "ltr",
  theme = "light"
}) {
  return /* @__PURE__ */ jsxs(
    "html",
    {
      lang,
      dir,
      className: `${theme} overflow-x-hidden`,
      style: { colorScheme: theme },
      children: [
        /* @__PURE__ */ jsxs("head", { children: [
          /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
          /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
          /* @__PURE__ */ jsx(ClientHintCheck, { nonce }),
          /* @__PURE__ */ jsx(Meta, {}),
          /* @__PURE__ */ jsx(Links, {})
        ] }),
        /* @__PURE__ */ jsxs("body", { className: "h-auto w-full", children: [
          children,
          /* @__PURE__ */ jsx(ScrollRestoration, { nonce }),
          /* @__PURE__ */ jsx(Scripts, { nonce }),
          /* @__PURE__ */ jsx(Toaster, { closeButton: true, position: "bottom-center", theme })
        ] })
      ]
    }
  );
}
function AppWithProviders() {
  const { locale, toast: toast2, csrfToken, honeypotProps } = useLoaderData();
  const nonce = useNonce();
  const theme = useTheme();
  useChangeLanguage(locale);
  useToast(toast2);
  return /* @__PURE__ */ jsx(Document, { nonce, theme, lang: locale ?? "en", children: /* @__PURE__ */ jsx(AuthenticityTokenProvider, { token: csrfToken, children: /* @__PURE__ */ jsx(HoneypotProvider, { ...honeypotProps, children: /* @__PURE__ */ jsx(Outlet, {}) }) }) });
}
function ErrorBoundary$1() {
  const nonce = useNonce();
  const theme = useTheme();
  return /* @__PURE__ */ jsx(Document, { nonce, theme, children: /* @__PURE__ */ jsx(
    GenericErrorBoundary,
    {
      statusHandlers: {
        403: ({ error }) => /* @__PURE__ */ jsxs("p", { children: [
          "You are not allowed to do that: ",
          error?.data.message
        ] })
      }
    }
  ) });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$1,
  default: AppWithProviders,
  handle,
  links,
  loader: loader$c,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
const meta$3 = () => {
  return [{ title: `${siteConfig.siteTitle} - 404 Not Found!` }];
};
async function loader$b() {
  throw new Response("Not found", { status: 404 });
}
function NotFound() {
  return /* @__PURE__ */ jsx(ErrorBoundary, {});
}
function ErrorBoundary() {
  return /* @__PURE__ */ jsx(
    GenericErrorBoundary,
    {
      statusHandlers: {
        404: () => /* @__PURE__ */ jsxs("div", { className: "flex h-screen w-full flex-col items-center justify-center gap-8 rounded-md bg-card px-6", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card hover:border-primary/40", children: /* @__PURE__ */ jsx(HelpCircle, { className: "h-8 w-8 stroke-[1.5px] text-primary/60" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-medium text-primary", children: "Whoops!" }),
            /* @__PURE__ */ jsx("p", { className: "text-center text-lg font-normal text-primary/60", children: "Nothing here yet!" })
          ] }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: ROUTE_PATH$9,
              prefetch: "intent",
              className: `${buttonVariants({ variant: "ghost", size: "sm" })} gap-2`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-primary/60 group-hover:text-primary", children: "Return to Home" }),
                /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 stroke-[1.5px] text-primary/60 group-hover:text-primary" })
              ]
            }
          )
        ] })
      }
    }
  );
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: NotFound,
  loader: loader$b,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const ROUTE_PATH$7 = "/";
async function loader$a() {
  return json({});
}
function Home() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$7,
  default: Home,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
const ShadowPNG = "/assets/shadow-BXkJXZlh.png";
const meta$2 = () => {
  return [{ title: `${siteConfig.siteTitle} - Starter Kit` }];
};
async function loader$9({ request }) {
  const sessionUser = await authenticator.isAuthenticated(request);
  return json({ user: sessionUser });
}
function Index() {
  const { user: user2 } = useLoaderData();
  const theme = useTheme();
  return /* @__PURE__ */ jsxs("div", { className: "relative flex h-full w-full flex-col bg-card", children: [
    /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-50 mx-auto flex w-full max-w-screen-lg items-center justify-between p-6 py-3", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", prefetch: "intent", className: "flex h-10 items-center gap-1", children: /* @__PURE__ */ jsx(Logo, {}) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://github.com/dev-xo/remix-saas/tree/main/docs#welcome-to-%EF%B8%8F-remix-saas-documentation",
              target: "_blank",
              rel: "noreferrer",
              className: cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "group flex gap-3 px-0 text-primary/80 hover:text-primary hover:no-underline"
              ),
              children: "Docs"
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "https://github.com/dev-xo/remix-saas",
              target: "_blank",
              rel: "noreferrer",
              className: cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "group flex gap-3 px-0 text-primary/80 hover:text-primary hover:no-underline"
              ),
              children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5 text-primary/80",
                    viewBox: "0 0 24 24",
                    fill: "currentColor",
                    children: /* @__PURE__ */ jsx("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" })
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "hidden select-none items-center gap-1 rounded-full bg-green-500/5 px-2 py-1 pr-2.5 text-xs font-medium tracking-tight text-green-600 ring-1 ring-inset ring-green-600/20 backdrop-blur-sm dark:bg-yellow-800/40 dark:text-yellow-100 dark:ring-yellow-200/50 md:flex", children: [
                  /* @__PURE__ */ jsx(
                    Star,
                    {
                      className: "h-3 w-3 text-green-600 dark:text-yellow-100",
                      fill: "currentColor"
                    }
                  ),
                  "Star Us on GitHub"
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://twitter.com/DanielKanem",
            target: "_blank",
            rel: "noreferrer",
            className: "flex h-9 w-9 items-center justify-center",
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "h-[18px] w-[18px] text-primary",
                strokeLinejoin: "round",
                viewBox: "0 0 16 16",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M0.5 0.5H5.75L9.48421 5.71053L14 0.5H16L10.3895 6.97368L16.5 15.5H11.25L7.51579 10.2895L3 15.5H1L6.61053 9.02632L0.5 0.5ZM12.0204 14L3.42043 2H4.97957L13.5796 14H12.0204Z",
                    fill: "currentColor"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(Link, { to: ROUTE_PATH$f, className: buttonVariants({ size: "sm" }), children: user2 ? "Dashboard" : "Get Started" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "z-10 mx-auto flex w-full max-w-screen-lg flex-col gap-4 px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "z-10 flex h-full w-full flex-col items-center justify-center gap-4 p-12 md:p-24", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            className: cn(
              "hidden h-8 rounded-full bg-white/40 px-3 text-sm font-bold backdrop-blur hover:text-primary dark:bg-secondary md:flex"
            ),
            children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center font-medium text-primary/60", children: [
                "Introducing",
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "mx-1 h-[14px] w-[14px] text-primary",
                    strokeLinejoin: "round",
                    viewBox: "0 0 16 16",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        clipRule: "evenodd",
                        d: "M0.5 0.5H5.75L9.48421 5.71053L14 0.5H16L10.3895 6.97368L16.5 15.5H11.25L7.51579 10.2895L3 15.5H1L6.61053 9.02632L0.5 0.5ZM12.0204 14L3.42043 2H4.97957L13.5796 14H12.0204Z",
                        fill: "currentColor"
                      }
                    )
                  }
                )
              ] }),
              siteConfig.siteTitle
            ]
          }
        ),
        /* @__PURE__ */ jsxs("h1", { className: "text-center text-6xl font-bold leading-tight text-primary md:text-7xl lg:leading-tight", children: [
          "Production Ready",
          /* @__PURE__ */ jsx("br", {}),
          "SaaS Stack for Remix"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "max-w-screen-md text-center text-lg !leading-normal text-muted-foreground md:text-xl", children: [
          "Launch in days with a modern",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-medium text-primary", children: "Production-Ready Stack" }),
          /* @__PURE__ */ jsx("br", { className: "hidden lg:inline-block" }),
          " Stripe integration. Vite-powered. Open Source."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex w-full items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: ROUTE_PATH$f,
              className: cn(buttonVariants({ size: "sm" }), "hidden sm:flex"),
              children: "Get Started"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://github.com/dev-xo/remix-saas/tree/main/docs#welcome-to-%EF%B8%8F-remix-saas-documentation",
              target: "_blank",
              rel: "noreferrer",
              className: cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "hidden dark:bg-secondary dark:hover:opacity-80 sm:flex"
              ),
              children: "Explore Documentation"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-center font-serif text-xl font-medium text-primary/60", children: "Built for Developers" }),
        /* @__PURE__ */ jsxs("div", { className: "my-8 flex flex-wrap items-center justify-center gap-10 gap-y-8 lg:gap-14", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              target: "_blank",
              rel: "noreferrer",
              "aria-label": "Remix.run",
              className: "flex items-center text-primary opacity-80 grayscale transition hover:opacity-100",
              href: "https://remix.run",
              children: /* @__PURE__ */ jsx("div", { className: "relative flex h-6 w-[98px] items-center justify-center", children: /* @__PURE__ */ jsxs(
                "svg",
                {
                  viewBox: "0 0 1200 627",
                  className: "absolute h-20 w-auto",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: [
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        fillRule: "evenodd",
                        clipRule: "evenodd",
                        d: "M378.379 360.512C380.018 381.564 380.018 391.433 380.018 402.204H331.306C331.306 399.858 331.348 397.712 331.39 395.535C331.522 388.769 331.66 381.714 330.564 367.466C329.115 346.606 320.131 341.971 303.613 341.971H288.979H227V304.018H305.931C326.796 304.018 337.229 297.671 337.229 280.868C337.229 266.092 326.796 257.138 305.931 257.138H227V220H314.625C361.861 220 385.334 242.308 385.334 277.943C385.334 304.597 368.816 321.98 346.502 324.877C365.338 328.644 376.35 339.363 378.379 360.512Z",
                        fill: "currentColor"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M227 402.204V373.912H278.506C287.109 373.912 288.977 380.292 288.977 384.097V402.204H227Z",
                        fill: "currentColor"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M967.943 273.308H919.548L897.523 304.018L876.079 273.308H824.206L870.862 336.757L820.148 402.523H868.544L894.335 367.467L920.127 402.523H972L920.996 334.728L967.943 273.308Z",
                        fill: "currentColor"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M486.716 356.458C482.369 366.598 474.255 370.944 461.504 370.944C447.304 370.944 435.713 363.411 434.553 347.477H525.259V334.439C525.259 299.383 502.365 269.832 459.186 269.832C418.905 269.832 388.766 299.093 388.766 339.944C388.766 381.084 418.325 406 459.765 406C493.961 406 517.724 389.486 524.389 359.934L486.716 356.458ZM435.133 324.878C436.872 312.71 443.537 303.439 458.606 303.439C472.516 303.439 480.051 313.29 480.631 324.878H435.133Z",
                        fill: "currentColor"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M663.111 295.327C657.604 280.261 645.723 269.832 622.829 269.832C603.413 269.832 589.503 278.523 582.548 292.719V273.308H535.602V402.523H582.548V339.075C582.548 319.663 588.054 306.916 603.413 306.916C617.613 306.916 621.091 316.187 621.091 333.86V402.523H668.037V339.075C668.037 319.663 673.253 306.916 688.902 306.916C703.102 306.916 706.29 316.187 706.29 333.86V402.523H753.236V321.402C753.236 294.458 742.804 269.832 707.159 269.832C685.425 269.832 670.066 280.841 663.111 295.327Z",
                        fill: "currentColor"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M768.591 273.308V402.524H815.538V273.308H768.591ZM768.301 261.14H815.827V220H768.301V261.14Z",
                        fill: "currentColor"
                      }
                    )
                  ]
                }
              ) })
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              target: "_blank",
              rel: "noreferrer",
              "aria-label": "Vite",
              className: "flex items-center text-primary opacity-80 grayscale transition hover:opacity-100",
              href: "https://vitejs.dev",
              children: /* @__PURE__ */ jsxs(
                "svg",
                {
                  viewBox: "0 0 256 257",
                  className: "h-8 w-8 transition group-hover:scale-110 group-hover:brightness-125",
                  xmlns: "http://www.w3.org/2000/svg",
                  preserveAspectRatio: "xMidYMid",
                  children: [
                    /* @__PURE__ */ jsxs("defs", { children: [
                      /* @__PURE__ */ jsxs(
                        "linearGradient",
                        {
                          x1: "-.828%",
                          y1: "7.652%",
                          x2: "57.636%",
                          y2: "78.411%",
                          id: "vite-1",
                          children: [
                            /* @__PURE__ */ jsx("stop", { stopColor: "currentColor", offset: "0%" }),
                            /* @__PURE__ */ jsx("stop", { stopColor: "currentColor", offset: "100%" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        "linearGradient",
                        {
                          x1: "43.376%",
                          y1: "2.242%",
                          x2: "50.316%",
                          y2: "89.03%",
                          id: "vite-2",
                          children: [
                            /* @__PURE__ */ jsx("stop", { stopColor: "#FFEA83", offset: "0%" }),
                            /* @__PURE__ */ jsx("stop", { stopColor: "#FFDD35", offset: "8.333%" }),
                            /* @__PURE__ */ jsx("stop", { stopColor: "#FFA800", offset: "100%" })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M255.153 37.938 134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z",
                        fill: "url(#vite-1)"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M185.432.063 96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028 72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z",
                        fill: "url(#vite-2)"
                      }
                    )
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              target: "_blank",
              rel: "noreferrer",
              "aria-label": "Stripe",
              className: "flex items-center text-primary opacity-80 grayscale transition hover:opacity-100",
              href: "https://stripe.com",
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "h-8 w-auto",
                  viewBox: "0 0 60 25",
                  xmlns: "http://www.w3.org/2000/svg",
                  width: 60,
                  height: 25,
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      fill: "currentColor",
                      d: "M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z",
                      fillRule: "evenodd"
                    }
                  )
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              target: "_blank",
              rel: "noreferrer",
              "aria-label": "Prisma",
              className: "flex items-center text-primary opacity-80 grayscale transition hover:opacity-100",
              href: "https://www.prisma.io",
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "h-9 w-auto",
                  viewBox: "0 0 256 310",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M254.313 235.519 148 9.749A17.063 17.063 0 0 0 133.473.037a16.87 16.87 0 0 0-15.533 8.052L2.633 194.848a17.465 17.465 0 0 0 .193 18.747L59.2 300.896a18.13 18.13 0 0 0 20.363 7.489l163.599-48.392a17.929 17.929 0 0 0 11.26-9.722 17.542 17.542 0 0 0-.101-14.76l-.008.008zm-23.802 9.683-138.823 41.05c-4.235 1.26-8.3-2.411-7.419-6.685l49.598-237.484c.927-4.443 7.063-5.147 9.003-1.035l91.814 194.973a6.63 6.63 0 0 1-4.18 9.18h.007z",
                      fill: "currentColor"
                    }
                  )
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              target: "_blank",
              rel: "noreferrer",
              "aria-label": "Resend",
              className: "flex items-center text-primary opacity-80 grayscale transition hover:opacity-100",
              href: "https://resend.com",
              children: /* @__PURE__ */ jsxs(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 65 16",
                  width: 60,
                  fill: "none",
                  className: "h-6 w-auto",
                  children: [
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M0.820068 15V1.00001H7.02007C7.88674 1.00001 8.6734 1.20001 9.38007 1.60001C10.0867 1.98668 10.6401 2.51334 11.0401 3.18001C11.4534 3.84668 11.6601 4.60668 11.6601 5.46001C11.6601 6.30001 11.4534 7.06668 11.0401 7.76001C10.6401 8.44001 10.0867 8.98001 9.38007 9.38001C8.6734 9.78001 7.88674 9.98001 7.02007 9.98001H3.72007V15H0.820068ZM8.76007 15L5.20007 8.68001L8.28007 8.18001L12.2401 15.02L8.76007 15ZM3.72007 7.54001H6.88007C7.24007 7.54001 7.5534 7.46001 7.82007 7.30001C8.10007 7.12668 8.3134 6.89334 8.46007 6.60001C8.60673 6.29335 8.68007 5.95335 8.68007 5.58001C8.68007 5.18001 8.5934 4.83335 8.42007 4.54001C8.24674 4.24668 7.9934 4.02001 7.66007 3.86001C7.32674 3.68668 6.94007 3.60001 6.50007 3.60001H3.72007V7.54001Z",
                        fill: "currentColor"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M18.0534 15.2C16.9067 15.2 15.9 14.9667 15.0333 14.5C14.18 14.0333 13.5134 13.3933 13.0333 12.58C12.5667 11.7667 12.3333 10.8333 12.3333 9.78001C12.3333 8.95335 12.4667 8.20001 12.7333 7.52001C13 6.84001 13.3733 6.25335 13.8533 5.76001C14.3333 5.25335 14.9 4.86668 15.5534 4.60001C16.22 4.32001 16.94 4.18001 17.7134 4.18001C18.4334 4.18001 19.1 4.31335 19.7134 4.58001C20.3267 4.84668 20.8534 5.22001 21.2934 5.70001C21.7467 6.16668 22.0934 6.72668 22.3334 7.38001C22.5734 8.02001 22.68 8.71335 22.6534 9.46001L22.6334 10.34H14.1334L13.6733 8.60001H20.2934L19.9734 8.96001V8.52001C19.9467 8.16001 19.8267 7.84001 19.6133 7.56001C19.4134 7.26668 19.1534 7.04001 18.8334 6.88001C18.5134 6.70668 18.1533 6.62001 17.7533 6.62001C17.1667 6.62001 16.6667 6.73335 16.2533 6.96001C15.8533 7.18668 15.5467 7.52001 15.3333 7.96001C15.12 8.40001 15.0133 8.93335 15.0133 9.56001C15.0133 10.2 15.1467 10.7533 15.4134 11.22C15.6934 11.6867 16.08 12.0533 16.5734 12.32C17.08 12.5733 17.6733 12.7 18.3533 12.7C18.82 12.7 19.2467 12.6267 19.6334 12.48C20.02 12.3333 20.4333 12.08 20.8734 11.72L22.2334 13.62C21.8467 13.9667 21.42 14.26 20.9534 14.5C20.4867 14.7267 20.0067 14.9 19.5133 15.02C19.02 15.14 18.5334 15.2 18.0534 15.2Z",
                        fill: "currentColor"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M27.3121 15.2C26.3254 15.2 25.4454 15.04 24.6721 14.72C23.9121 14.3867 23.2988 13.9333 22.8321 13.36L24.6121 11.84C25.0121 12.28 25.4654 12.6 25.9721 12.8C26.4788 12.9867 26.9854 13.08 27.4921 13.08C27.6921 13.08 27.8721 13.06 28.0321 13.02C28.2054 12.9667 28.3521 12.9 28.4721 12.82C28.5921 12.7267 28.6788 12.62 28.7321 12.5C28.7988 12.3667 28.8321 12.2267 28.8321 12.08C28.8321 11.7867 28.7121 11.56 28.4721 11.4C28.3388 11.32 28.1321 11.2333 27.8521 11.14C27.5721 11.0333 27.2121 10.92 26.7721 10.8C26.0921 10.6267 25.5121 10.4267 25.0321 10.2C24.5654 9.96001 24.1921 9.69335 23.9121 9.40001C23.6721 9.12001 23.4854 8.82001 23.3521 8.50001C23.2321 8.16668 23.1721 7.80001 23.1721 7.40001C23.1721 6.92001 23.2788 6.48668 23.4921 6.10001C23.7054 5.70001 23.9988 5.36001 24.3721 5.08001C24.7588 4.80001 25.1988 4.58668 25.6921 4.44001C26.1854 4.28001 26.7054 4.20001 27.2521 4.20001C27.7988 4.20001 28.3321 4.26668 28.8521 4.40001C29.3721 4.53335 29.8521 4.72668 30.2921 4.98001C30.7454 5.22001 31.1388 5.50668 31.4721 5.84001L29.9521 7.52001C29.7121 7.29334 29.4388 7.08668 29.1321 6.90001C28.8388 6.71335 28.5321 6.56668 28.2121 6.46001C27.8921 6.35335 27.6054 6.30001 27.3521 6.30001C27.1254 6.30001 26.9188 6.32001 26.7321 6.36001C26.5588 6.40001 26.4121 6.46668 26.2921 6.56001C26.1721 6.64001 26.0788 6.74001 26.0121 6.86001C25.9588 6.98001 25.9321 7.11334 25.9321 7.26001C25.9321 7.40668 25.9654 7.54668 26.0321 7.68001C26.1121 7.81335 26.2188 7.92668 26.3521 8.02001C26.4988 8.10001 26.7121 8.19335 26.9921 8.30001C27.2854 8.40668 27.6788 8.52668 28.1721 8.66001C28.8121 8.83335 29.3521 9.02668 29.7921 9.24001C30.2454 9.45335 30.6054 9.70001 30.8721 9.98001C31.0988 10.22 31.2654 10.4933 31.3721 10.8C31.4788 11.1067 31.5321 11.4467 31.5321 11.82C31.5321 12.4733 31.3454 13.0533 30.9721 13.56C30.6121 14.0667 30.1121 14.4667 29.4721 14.76C28.8321 15.0533 28.1121 15.2 27.3121 15.2Z",
                        fill: "currentColor"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M37.5768 15.2C36.4301 15.2 35.4235 14.9667 34.5568 14.5C33.7035 14.0333 33.0368 13.3933 32.5568 12.58C32.0901 11.7667 31.8568 10.8333 31.8568 9.78001C31.8568 8.95335 31.9901 8.20001 32.2568 7.52001C32.5235 6.84001 32.8968 6.25335 33.3768 5.76001C33.8568 5.25335 34.4235 4.86668 35.0768 4.60001C35.7435 4.32001 36.4635 4.18001 37.2368 4.18001C37.9568 4.18001 38.6235 4.31335 39.2368 4.58001C39.8501 4.84668 40.3768 5.22001 40.8168 5.70001C41.2701 6.16668 41.6168 6.72668 41.8568 7.38001C42.0968 8.02001 42.2035 8.71335 42.1768 9.46001L42.1568 10.34H33.6568L33.1968 8.60001H39.8168L39.4968 8.96001V8.52001C39.4701 8.16001 39.3501 7.84001 39.1368 7.56001C38.9368 7.26668 38.6768 7.04001 38.3568 6.88001C38.0368 6.70668 37.6768 6.62001 37.2768 6.62001C36.6901 6.62001 36.1901 6.73335 35.7768 6.96001C35.3768 7.18668 35.0701 7.52001 34.8568 7.96001C34.6435 8.40001 34.5368 8.93335 34.5368 9.56001C34.5368 10.2 34.6701 10.7533 34.9368 11.22C35.2168 11.6867 35.6035 12.0533 36.0968 12.32C36.6035 12.5733 37.1968 12.7 37.8768 12.7C38.3435 12.7 38.7701 12.6267 39.1568 12.48C39.5435 12.3333 39.9568 12.08 40.3968 11.72L41.7568 13.62C41.3701 13.9667 40.9435 14.26 40.4768 14.5C40.0101 14.7267 39.5301 14.9 39.0368 15.02C38.5435 15.14 38.0568 15.2 37.5768 15.2Z",
                        fill: "currentColor"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M43.2755 15V4.42001H45.9955L46.0755 6.58001L45.5155 6.82001C45.6622 6.34001 45.9222 5.90668 46.2955 5.52001C46.6822 5.12001 47.1422 4.80001 47.6755 4.56001C48.2089 4.32001 48.7689 4.20001 49.3555 4.20001C50.1555 4.20001 50.8222 4.36001 51.3555 4.68001C51.9022 5.00001 52.3089 5.48668 52.5755 6.14001C52.8555 6.78001 52.9955 7.57335 52.9955 8.52001V15H50.1555V8.74001C50.1555 8.26001 50.0889 7.86001 49.9555 7.54001C49.8222 7.22001 49.6155 6.98668 49.3355 6.84001C49.0689 6.69334 48.7355 6.62668 48.3355 6.64001C48.0155 6.64001 47.7155 6.69335 47.4355 6.80001C47.1689 6.89334 46.9355 7.03335 46.7355 7.22001C46.5489 7.40668 46.3955 7.62001 46.2755 7.86001C46.1689 8.10001 46.1155 8.36001 46.1155 8.64001V15H44.7155C44.4089 15 44.1355 15 43.8955 15C43.6555 15 43.4489 15 43.2755 15Z",
                        fill: "currentColor"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M58.8569 15.2C57.9236 15.2 57.0903 14.9667 56.3569 14.5C55.6369 14.02 55.0636 13.3733 54.6369 12.56C54.2236 11.7333 54.0169 10.78 54.0169 9.70001C54.0169 8.64668 54.2236 7.70668 54.6369 6.88001C55.0636 6.04001 55.6369 5.38668 56.3569 4.92001C57.0903 4.44001 57.9236 4.20001 58.8569 4.20001C59.3503 4.20001 59.8236 4.28001 60.2769 4.44001C60.7436 4.58668 61.1569 4.79335 61.5169 5.06001C61.8903 5.32668 62.1903 5.62668 62.4169 5.96001C62.6436 6.28001 62.7703 6.61335 62.7969 6.96001L62.0769 7.10001V0.200012H64.9369V15H62.2369L62.1169 12.56L62.6769 12.62C62.6503 12.9533 62.5303 13.2733 62.3169 13.58C62.1036 13.8867 61.8169 14.1667 61.4569 14.42C61.1103 14.66 60.7103 14.8533 60.2569 15C59.8169 15.1333 59.3503 15.2 58.8569 15.2ZM59.4969 12.84C60.0303 12.84 60.4969 12.7067 60.8969 12.44C61.2969 12.1733 61.6103 11.8067 61.8369 11.34C62.0636 10.8733 62.1769 10.3267 62.1769 9.70001C62.1769 9.08668 62.0636 8.54668 61.8369 8.08001C61.6103 7.61335 61.2969 7.24668 60.8969 6.98001C60.4969 6.71335 60.0303 6.58001 59.4969 6.58001C58.9636 6.58001 58.4969 6.71335 58.0969 6.98001C57.7103 7.24668 57.4036 7.61335 57.1769 8.08001C56.9636 8.54668 56.8569 9.08668 56.8569 9.70001C56.8569 10.3267 56.9636 10.8733 57.1769 11.34C57.4036 11.8067 57.7103 12.1733 58.0969 12.44C58.4969 12.7067 58.9636 12.84 59.4969 12.84Z",
                        fill: "currentColor"
                      }
                    )
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              target: "_blank",
              rel: "noreferrer",
              "aria-label": "shadcn/ui",
              className: "flex items-center text-primary opacity-80 grayscale transition hover:opacity-100",
              href: "https://ui.shadcn.com/",
              children: /* @__PURE__ */ jsxs(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 256 256",
                  className: "h-10 w-10",
                  children: [
                    /* @__PURE__ */ jsx("rect", { width: 256, height: 256, fill: "none" }),
                    /* @__PURE__ */ jsx(
                      "line",
                      {
                        x1: 208,
                        y1: 128,
                        x2: 128,
                        y2: 208,
                        fill: "none",
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 16
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "line",
                      {
                        x1: 192,
                        y1: 40,
                        x2: 40,
                        y2: 192,
                        fill: "none",
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 16
                      }
                    )
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              target: "_blank",
              rel: "noreferrer",
              "aria-label": "Fly.io",
              className: "flex items-center text-primary opacity-80 grayscale transition hover:opacity-100",
              href: "https://fly.io",
              children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 259 84", className: "h-9", fillRule: "evenodd", children: [
                /* @__PURE__ */ jsx("title", { id: "title-F7R838wtvsn8DF6B" }),
                /* @__PURE__ */ jsx("desc", { id: "description-F7R838wtzc_8DF6R" }),
                /* @__PURE__ */ jsxs("g", { "buffered-rendering": "static", children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M57.413 10.134h9.454c8.409 0 15.236 6.827 15.236 15.236v33.243c0 8.409-6.827 15.236-15.236 15.236h-.745c-4.328-.677-6.205-1.975-7.655-3.072l-12.02-9.883a1.692 1.692 0 0 0-2.128 0l-3.905 3.211-10.998-9.043a1.688 1.688 0 0 0-2.127 0L12.01 68.503c-3.075 2.501-5.109 2.039-6.428 1.894C2.175 67.601 0 63.359 0 58.613V25.37c0-8.409 6.827-15.236 15.237-15.236h9.433l-.017.038-.318.927-.099.318-.428 1.899-.059.333-.188 1.902-.025.522-.004.183.018.872.043.511.106.8.135.72.16.663.208.718.54 1.52.178.456.94 1.986.332.61 1.087 1.866.416.673 1.517 2.234.219.296 1.974 2.569.638.791 2.254 2.635.463.507 1.858 1.999.736.762 1.216 1.208-.244.204-.152.137c-.413.385-.805.794-1.172 1.224a10.42 10.42 0 0 0-.504.644 8.319 8.319 0 0 0-.651 1.064 6.234 6.234 0 0 0-.261.591 5.47 5.47 0 0 0-.353 1.606l-.007.475a5.64 5.64 0 0 0 .403 1.953 5.44 5.44 0 0 0 1.086 1.703c.338.36.723.674 1.145.932.359.22.742.401 1.14.539a6.39 6.39 0 0 0 2.692.306h.005a6.072 6.072 0 0 0 2.22-.659c.298-.158.582-.341.848-.549a5.438 5.438 0 0 0 1.71-2.274c.28-.699.417-1.446.405-2.198l-.022-.393a5.535 5.535 0 0 0-.368-1.513 6.284 6.284 0 0 0-.285-.618 8.49 8.49 0 0 0-.67-1.061 11.022 11.022 0 0 0-.354-.453 14.594 14.594 0 0 0-1.308-1.37l-.329-.28.557-.55 2.394-2.5.828-.909 1.287-1.448.837-.979 1.194-1.454.808-1.016 1.187-1.587.599-.821.85-1.271.708-1.083 1.334-2.323.763-1.524.022-.047.584-1.414a.531.531 0 0 0 .02-.056l.629-1.962.066-.286.273-1.562.053-.423.016-.259.019-.978-.005-.182-.05-.876-.062-.68-.31-1.961c-.005-.026-.01-.052-.018-.078l-.398-1.45-.137-.403-.179-.446Zm4.494 41.455a3.662 3.662 0 0 0-3.61 3.61 3.663 3.663 0 0 0 3.61 3.609 3.665 3.665 0 0 0 3.611-3.609 3.663 3.663 0 0 0-3.611-3.61Z",
                      fill: "url(#a)",
                      fillOpacity: 1
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M35.639 72.544l-.637.535a3.332 3.332 0 01-2.09.762H15.235a15.176 15.176 0 01-9.654-3.451c1.319.145 3.353.607 6.428-1.894l15.277-13.44a1.693 1.693 0 012.127 0l10.997 9.042 3.904-3.21c.619-.5 1.51-.5 2.128 0l12.019 9.882c1.45 1.097 3.327 2.394 7.654 3.071H58.12a3.394 3.394 0 01-1.963-.654l-.14-.108-.593-.493a1.247 1.247 0 00-.158-.159c-.672-.563-9.187-7.617-9.187-7.617a1 1 0 00-1.281.002s.021.026-9.038 7.615a1.12 1.12 0 00-.121.117zm26.262-20.96a3.678 3.678 0 00-3.61 3.609 3.68 3.68 0 003.61 3.609 3.68 3.68 0 003.61-3.609 3.678 3.678 0 00-3.61-3.609zM38.566 40.648L37.35 39.44l-.736-.762-1.858-1.999-.463-.507-2.253-2.634-.638-.791-1.974-2.569-.219-.296-1.517-2.234-.416-.673-1.087-1.866-.332-.61-.94-1.985-.178-.456-.539-1.52-.208-.718-.16-.663-.135-.72-.106-.8-.043-.511-.018-.872.004-.183.025-.522.188-1.901.059-.333.428-1.899.098-.318.318-.927.102-.24.506-1.112.351-.662.489-.806.487-.718.347-.456.4-.482.44-.484.377-.378.918-.808.671-.549c.016-.014.033-.026.05-.038l.794-.537.631-.402 1.198-.631c.018-.011.039-.02.058-.029l1.698-.705.157-.059 1.51-.442.638-.143.862-.173.572-.087.877-.109.598-.053 1.187-.063.465-.005.881.018.229.013 1.276.106 1.687.238.195.041 1.668.415.49.146.544.188.663.251.524.222.77.363.485.249.872.512.325.2 1.189.868.341.296.828.754.041.041.703.754.242.273.825 1.096.168.262.655 1.106.197.379.369.825.386.963.137.403.398 1.45a.89.89 0 01.018.078l.31 1.961.062.679.05.876.005.182-.019.978-.016.259-.053.423-.273 1.562-.066.286-.629 1.962a.626.626 0 01-.02.056l-.584 1.414-.022.047-.763 1.523-1.334 2.323-.708 1.083-.849 1.271-.599.821-1.187 1.587-.808 1.016-1.194 1.453-.837.979-1.287 1.448-.828.909-2.394 2.5-.556.55.328.28c.465.428.902.885 1.308 1.37.122.148.24.299.354.453.249.336.473.691.67 1.06.106.2.201.407.285.618.191.484.32.996.368 1.513l.022.393c.012.752-.125 1.5-.405 2.198a5.438 5.438 0 01-1.71 2.274c-.266.208-.55.391-.848.549a6.08 6.08 0 01-2.219.659h-.005a6.403 6.403 0 01-2.692-.306 5.882 5.882 0 01-1.14-.539 5.523 5.523 0 01-1.145-.932 5.458 5.458 0 01-1.086-1.703 5.662 5.662 0 01-.403-1.953l.007-.475a5.47 5.47 0 01.353-1.606c.077-.202.164-.399.261-.591.19-.37.408-.725.651-1.063.159-.221.328-.436.504-.644.367-.43.759-.839 1.172-1.224l.152-.137.244-.204z",
                      fill: "currentColor"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M35.002 73.079l9.796-8.267a1 1 0 011.281-.002l9.938 8.269c.604.492 1.36.761 2.139.762h-25.28c.776 0 1.527-.269 2.126-.762zM41.1 43.568l.096.028c.031.015.057.036.085.055l.08.071c.198.182.39.373.575.569.13.139.257.282.379.43.155.187.3.383.432.587.057.09.11.181.16.276.043.082.082.167.116.253.06.15.105.308.119.469l-.003.302a1.726 1.726 0 01-.817 1.343 2.333 2.333 0 01-.994.327l-.373.011-.315-.028a2.398 2.398 0 01-.433-.105 2.07 2.07 0 01-.41-.192l-.246-.18a1.685 1.685 0 01-.56-.96 2.418 2.418 0 01-.029-.19l-.009-.288c.005-.078.017-.155.034-.232.043-.168.105-.331.183-.486.101-.194.216-.381.344-.559.213-.288.444-.562.691-.821.159-.168.322-.331.492-.488l.121-.109c.084-.055.085-.055.181-.083h.101zM40.481 3.42l.039-.003v33.665l-.084-.155a94.101 94.101 0 01-3.093-6.267 67.257 67.257 0 01-2.099-5.255 41.665 41.665 0 01-1.265-4.326c-.265-1.163-.469-2.343-.553-3.535a16.923 16.923 0 01-.029-1.528c.008-.444.026-.887.054-1.33.044-.696.115-1.391.217-2.081.081-.543.181-1.084.304-1.619.098-.425.212-.847.342-1.262.188-.6.413-1.186.675-1.758.096-.206.199-.411.307-.612.65-1.204 1.532-2.313 2.687-3.054a5.609 5.609 0 012.498-.88zm4.365.085l2.265.646c1.049.387 2.059.891 2.987 1.521a11.984 11.984 0 013.212 3.204c.502.748.918 1.555 1.243 2.398.471 1.247.763 2.554.866 3.882.03.348.047.697.054 1.046.008.324.006.649-.02.973-.064.725-.2 1.442-.407 2.14a17.03 17.03 0 01-.587 1.684c-.28.685-.591 1.357-.932 2.013-.754 1.457-1.623 2.852-2.553 4.201a65.451 65.451 0 01-3.683 4.806 91.02 91.02 0 01-4.417 4.896 93.66 93.66 0 002.907-5.949c.5-1.124.971-2.26 1.414-3.407.487-1.26.927-2.537 1.317-3.83.29-.969.546-1.948.757-2.938.181-.849.323-1.707.411-2.57.074-.72.101-1.444.083-2.166a30.867 30.867 0 00-.049-1.325c-.106-1.775-.376-3.545-.894-5.248a15.341 15.341 0 00-.714-1.892c-.663-1.444-1.588-2.793-2.84-3.778l-.42-.307z",
                      fill: "white"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M179.213 64.297l-10.751-23.015c-.898-1.917-1.433-2.618-2.331-3.431l-.874-.788c-.697-.676-1.155-1.302-1.155-2.045 0-1.064.843-1.96 2.378-1.96h9.334c1.465 0 2.378.762 2.378 1.9 0 .635-.292 1.111-.661 1.578-.438.555-1.008 1.096-1.008 2.082 0 .618.18 1.234.527 2.021l6.416 15.025 5.755-14.647c.354-.974.596-1.832.596-2.519 0-1.069-.581-1.505-1.029-1.983-.39-.415-.702-.854-.702-1.557 0-1.149.935-1.9 2.193-1.9h5.748c1.612 0 2.378.834 2.378 1.9 0 .682-.393 1.314-1.166 1.996l-.813.668c-1.132.925-1.656 2.263-2.251 3.647l-8.716 20.998c-1.03 2.455-2.563 5.863-4.905 8.659-2.379 2.84-5.587 5.048-9.932 5.048-3.638 0-5.84-1.737-5.84-4.24 0-2.293 1.696-4.12 3.924-4.12 1.22 0 1.855.576 2.499 1.169.532.489 1.072.991 2.137.991.988 0 1.908-.418 2.742-1.093 1.274-1.03 2.341-2.652 3.129-4.384zm63.175-.082c4.839 0 8.804-1.658 11.897-4.967 3.09-3.304 4.636-7.281 4.636-11.931 0-4.539-1.469-8.268-4.396-11.191-2.926-2.921-6.723-4.388-11.396-4.388-4.92 0-8.944 1.597-12.077 4.78-3.135 3.186-4.703 7.045-4.703 11.578 0 4.493 1.496 8.301 4.483 11.425 2.99 3.126 6.84 4.694 11.556 4.694zm-40.921-.36c2.798 0 4.788-1.884 4.788-4.6 0-2.652-2.055-4.54-4.788-4.54-2.863 0-4.912 1.891-4.912 4.54 0 2.713 2.05 4.6 4.912 4.6zm9.964-4.305l.681-.72c.81-.787 1.071-1.582 1.071-3.774V42.097c0-1.895-.258-2.741-1.062-3.465l-.801-.718c-.785-.693-1.043-1.124-1.043-1.816 0-.984.763-1.791 1.99-2.071l5.44-1.32c.52-.126 1.107-.249 1.562-.249.626 0 1.138.206 1.497.563.36.358.572.873.572 1.517v20.518c0 2.069.251 3.031 1.115 3.758a.359.359 0 01.039.039l.608.708c.764.743 1.081 1.236 1.081 1.914 0 1.209-.912 1.9-2.377 1.9h-9.211c-1.396 0-2.316-.687-2.316-1.9 0-.681.317-1.178 1.154-1.925zm-61.567.001l.681-.721c.811-.787 1.071-1.582 1.071-3.774V27.999c0-1.835-.194-2.736-1.053-3.459l-.822-.796c-.709-.689-.968-1.116-.968-1.805 0-.985.767-1.789 1.927-2.07l5.378-1.32c.521-.126 1.107-.249 1.563-.249.621 0 1.147.187 1.522.542.376.356.608.885.608 1.598v34.616c0 2.074.258 2.981 1.125 3.766l.694.734c.769.748 1.025 1.238 1.025 1.919 0 .502-.153.907-.426 1.216-.385.435-1.03.684-1.89.684h-9.21c-.86 0-1.505-.249-1.891-.684-.272-.309-.425-.714-.425-1.216 0-.682.253-1.176 1.091-1.924zm-25.079-13.934v9.319c0 1.404.278 2.701 1.435 3.768l.748.726c.838.813 1.093 1.3 1.093 2.045 0 1.138-.913 1.9-2.378 1.9h-10.385c-1.465 0-2.377-.762-2.377-1.9 0-.884.259-1.303 1.097-2.049l.745-.724c.868-.786 1.434-1.857 1.434-3.766V30.039c0-1.517-.336-2.758-1.435-3.769l-.749-.726c-.77-.747-1.092-1.238-1.092-1.985 0-1.206.915-1.96 2.377-1.96h27.817c1.063 0 1.997.237 2.594.822.415.407.68.981.71 1.778l.433 6.421c.043.803-.194 1.472-.657 1.885-.319.284-.748.454-1.288.454-.681 0-1.203-.257-1.669-.701-.419-.399-.792-.959-1.213-1.618-1.016-1.624-1.489-2.208-2.572-2.967-1.507-1.112-3.803-1.494-8.145-1.494-2.505 0-4.086.109-5.082.366-.644.166-1.016.382-1.215.699-.204.324-.226.734-.226 1.235v12.618h6.523c1.561 0 2.659-.282 3.931-2.021l.007-.01c.51-.649.879-1.127 1.23-1.444.409-.37.802-.545 1.323-.545a1.9 1.9 0 011.883 1.901v8.699c0 1.165-.908 1.96-1.883 1.96-.485 0-.879-.173-1.289-.535-.353-.31-.723-.775-1.203-1.396-1.392-1.802-2.375-2.089-3.999-2.089h-6.523zm110.214-.22c0-3.121.68-5.364 2.089-6.713 1.392-1.332 2.888-2.006 4.496-2.006 2.212 0 4.205 1.238 6.003 3.672 1.837 2.489 2.746 5.853 2.746 10.086 0 3.124-.682 5.388-2.093 6.776-1.391 1.369-2.886 2.063-4.493 2.063-2.212 0-4.204-1.248-6.002-3.701-1.838-2.51-2.746-5.904-2.746-10.177zm-18.202-16.878c2.804 0 4.788-1.578 4.788-4.3 0-2.658-1.982-4.24-4.788-4.24-2.871 0-4.851 1.583-4.851 4.24 0 2.656 1.981 4.3 4.851 4.3z",
                      fill: "currentColor"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
                  "radialGradient",
                  {
                    cx: "53.096%",
                    cy: "49.564%",
                    fx: "53.096%",
                    fy: "49.564%",
                    r: "93.348%",
                    gradientTransform: "matrix(.77604 0 0 1 .119 0)",
                    id: "a",
                    children: [
                      /* @__PURE__ */ jsx("stop", { stopColor: "#BA7BF0", offset: "0%" }),
                      /* @__PURE__ */ jsx("stop", { stopColor: "#996BEC", offset: "45%" }),
                      /* @__PURE__ */ jsx("stop", { stopColor: "#5046E4", offset: "100%" })
                    ]
                  }
                ) })
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col border border-border backdrop-blur-sm lg:flex-row", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-start justify-center gap-6 border-r border-primary/10 p-10 lg:p-12", children: [
          /* @__PURE__ */ jsxs("p", { className: "h-14 text-lg text-primary/60", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-primary", children: "Production Ready." }),
            " Build your app on a solid, scalable, well-tested foundation."
          ] }),
          /* @__PURE__ */ jsx(Link, { to: ROUTE_PATH$f, className: buttonVariants({ size: "sm" }), children: "Get Started" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-start justify-center gap-6 p-10 lg:w-[60%] lg:border-b-0 lg:p-12", children: [
          /* @__PURE__ */ jsxs("p", { className: "h-14 text-lg text-primary/60", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-primary", children: "Ready to Ship." }),
            " ",
            "Deployments ready with a single command."
          ] }),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://github.com/dev-xo/remix-saas/tree/main/docs#welcome-to-%EF%B8%8F-remix-saas-documentations",
              target: "_blank",
              rel: "noreferrer",
              className: cn(
                `${buttonVariants({ variant: "outline", size: "sm" })} dark:bg-secondary dark:hover:opacity-80`
              ),
              children: "Explore Documentation"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "absolute left-0 top-0 z-10 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx("span", { className: "absolute h-6 w-[1px] bg-primary/40" }),
          /* @__PURE__ */ jsx("span", { className: "absolute h-[1px] w-6 bg-primary/40" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 right-0 z-10 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx("span", { className: "absolute h-6 w-[1px] bg-primary/40" }),
          /* @__PURE__ */ jsx("span", { className: "absolute h-[1px] w-6 bg-primary/40" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "z-10 flex h-full w-full flex-col items-center justify-center gap-6 p-12", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-center text-4xl font-bold leading-tight text-primary md:text-6xl", children: "Proudly Open Source" }),
        /* @__PURE__ */ jsxs("p", { className: "text-center text-lg text-primary/60", children: [
          "Remix SaaS is a fully Open Source project.",
          /* @__PURE__ */ jsx("br", {}),
          "The code is available on GitHub."
        ] }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "https://github.com/dev-xo/remix-saas",
            target: "_blank",
            rel: "noreferrer",
            className: "hidden h-10 select-none items-center gap-2 rounded-full bg-green-500/5 px-2 py-1 pr-2.5 text-base font-medium tracking-tight text-green-600 ring-1 ring-inset ring-green-600/20 backdrop-blur-sm dark:bg-yellow-800/40 dark:text-yellow-100 dark:ring-yellow-200/50 md:flex",
            children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-6 w-6 text-green-600 dark:text-yellow-100",
                  viewBox: "0 0 24 24",
                  fill: "currentColor",
                  children: /* @__PURE__ */ jsx("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" })
                }
              ),
              "Star Us on GitHub"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "z-10 flex w-full flex-col items-center justify-center gap-8 py-6", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://twitter.com/DanielKanem",
          target: "_blank",
          rel: "noreferrer",
          className: "flex items-center justify-center hover:scale-110",
          children: /* @__PURE__ */ jsx(
            "svg",
            {
              className: "h-8 w-8 text-primary",
              strokeLinejoin: "round",
              viewBox: "0 0 16 16",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M0.5 0.5H5.75L9.48421 5.71053L14 0.5H16L10.3895 6.97368L16.5 15.5H11.25L7.51579 10.2895L3 15.5H1L6.61053 9.02632L0.5 0.5ZM12.0204 14L3.42043 2H4.97957L13.5796 14H12.0204Z",
                  fill: "currentColor"
                }
              )
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(ThemeSwitcherHome, {}),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 sm:flex-row", children: [
        /* @__PURE__ */ jsxs("p", { className: "flex items-center whitespace-nowrap text-center text-sm font-medium text-primary/60", children: [
          "Built by ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://twitter.com/DanielKanem",
              target: "_blank",
              rel: "noreferrer",
              className: "flex items-center text-primary hover:text-primary hover:underline",
              children: "DanielKanem"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "flex items-center whitespace-nowrap text-center text-sm font-medium text-primary/60", children: [
          "Source code available on ",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://github.com/dev-xo/remix-saas",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center text-primary hover:text-primary hover:underline",
              children: "GitHub."
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: ShadowPNG,
        alt: "Hero",
        className: `fixed left-0 top-0 z-0 h-full w-full opacity-60 ${theme === "dark" ? "invert" : ""}`
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "base-grid fixed h-screen w-screen opacity-40" }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 h-screen w-screen bg-gradient-to-t from-[hsl(var(--card))] to-transparent" })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader: loader$9,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
async function loader$8({ request }) {
  const user2 = await requireUserWithRole(request, "admin");
  return json({ user: user2 });
}
function AdminIndex() {
  return /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-2 p-6 py-2", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Get Started" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "Explore the Admin Panel and get started with your first app." })
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminIndex,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
const ROUTE_PATH$6 = "/auth";
async function loader$7({ request }) {
  await authenticator.isAuthenticated(request, {
    successRedirect: ROUTE_PATH$9
  });
  const pathname = getDomainPathname(request);
  if (pathname === ROUTE_PATH$6) return redirect(ROUTE_PATH$f);
  return json({});
}
const QUOTES = [
  {
    quote: "There is nothing impossible to they who will try.",
    author: "Alexander the Great"
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    quote: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt"
  },
  {
    quote: "The only thing we have to fear is fear itself.",
    author: "Franklin D. Roosevelt"
  }
];
function Layout() {
  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen w-full", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-10 mx-auto flex -translate-x-1/2 transform lg:hidden", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: ROUTE_PATH$7,
        prefetch: "intent",
        className: "z-10 flex h-10 flex-col items-center justify-center gap-2",
        children: /* @__PURE__ */ jsx(Logo, {})
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "relative hidden h-full w-[50%] flex-col justify-between overflow-hidden bg-card p-10 lg:flex", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: ROUTE_PATH$7,
          prefetch: "intent",
          className: "z-10 flex h-10 w-10 items-center gap-1",
          children: /* @__PURE__ */ jsx(Logo, {})
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "z-10 flex flex-col items-start gap-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-primary", children: randomQuote.quote }),
        /* @__PURE__ */ jsxs("p", { className: "text-base font-normal text-primary/60", children: [
          "- ",
          randomQuote.author
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "base-grid absolute left-0 top-0 z-0 h-full w-full opacity-40" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col border-l border-primary/5 bg-card lg:w-[50%]", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$6,
  default: Layout,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
const ROUTE_PATH$5 = "/auth/:provider";
async function loader$6() {
  return redirect(ROUTE_PATH$f);
}
async function action$3({ request, params }) {
  if (typeof params.provider !== "string") throw new Error("Invalid provider.");
  return authenticator.authenticate(params.provider, request);
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$5,
  action: action$3,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const ROUTE_PATH$4 = "/auth/:provider/callback";
async function loader$5({ request, params }) {
  if (typeof params.provider !== "string") throw new Error("Invalid provider.");
  return authenticator.authenticate(params.provider, request, {
    successRedirect: ROUTE_PATH$9,
    failureRedirect: ROUTE_PATH$f
  });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$4,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const meta$1 = () => {
  return [{ title: `${siteConfig.siteTitle} - Dashboard` }];
};
async function loader$4({ request }) {
  const user2 = await requireUser(request);
  const subscription2 = await db.query.subscription.findFirst({
    where: eq(schema.subscription.userId, user2.id)
  });
  return json({ user: user2, subscription: subscription2 });
}
function DashboardIndex() {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full bg-secondary px-6 py-8 dark:bg-black", children: /* @__PURE__ */ jsx("div", { className: "z-10 mx-auto flex h-full w-full max-w-screen-xl gap-12", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black", children: [
    /* @__PURE__ */ jsx("div", { className: "flex w-full flex-col rounded-lg p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Get Started" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "Explore the Dashboard and get started with your first app." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex w-full px-6", children: /* @__PURE__ */ jsx("div", { className: "w-full border-b border-border" }) }),
    /* @__PURE__ */ jsx("div", { className: "relative mx-auto flex w-full flex-col items-center p-6", children: /* @__PURE__ */ jsxs("div", { className: "relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "z-10 flex max-w-[460px] flex-col items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40", children: /* @__PURE__ */ jsx(Plus, { className: "h-8 w-8 stroke-[1.5px] text-primary/60" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-base font-medium text-primary", children: t("title") }),
          /* @__PURE__ */ jsx("p", { className: "text-center text-base font-normal text-primary/60", children: t("description") }),
          /* @__PURE__ */ jsx("span", { className: "hidden select-none items-center rounded-full bg-green-500/5 px-3 py-1 text-xs font-medium tracking-tight text-green-700 ring-1 ring-inset ring-green-600/20 backdrop-blur-md dark:bg-green-900/40 dark:text-green-100 md:flex", children: "TIP: Try changing the language!" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "z-10 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
        "a",
        {
          target: "_blank",
          rel: "noreferrer",
          href: "https://github.com/dev-xo/remix-saas/tree/main/docs#welcome-to-%EF%B8%8F-remix-saas-documentation",
          className: cn(
            `${buttonVariants({ variant: "ghost", size: "sm" })} gap-2`
          ),
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-primary/60 group-hover:text-primary", children: "Explore Documentation" }),
            /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 stroke-[1.5px] text-primary/60 group-hover:text-primary" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "base-grid absolute h-full w-full opacity-40" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" })
    ] }) })
  ] }) }) });
}
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DashboardIndex,
  loader: loader$4,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
const ROUTE_PATH$3 = "/dashboard/checkout";
const meta = () => {
  return [{ title: `${siteConfig.siteTitle} - Checkout` }];
};
async function loader$3({ request }) {
  const sessionUser = await requireSessionUser(request);
  const subscription2 = await db.query.subscription.findFirst({
    where: eq(schema.subscription.userId, sessionUser.id)
  });
  if (!subscription2) return redirect(ROUTE_PATH$9);
  return json({ isFreePlan: subscription2.planId === PLANS.FREE });
}
function DashboardCheckout() {
  const { isFreePlan } = useLoaderData();
  const { revalidate } = useRevalidator();
  const [retries, setRetries] = useState(0);
  useInterval(
    () => {
      revalidate();
      setRetries(retries + 1);
    },
    isFreePlan && retries !== 3 ? 2e3 : null
  );
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full bg-secondary px-6 py-8 dark:bg-black", children: /* @__PURE__ */ jsx("div", { className: "z-10 mx-auto flex h-full w-full max-w-screen-xl gap-12", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black", children: [
    /* @__PURE__ */ jsx("div", { className: "flex w-full flex-col rounded-lg p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Completing your Checkout" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "We are completing your checkout, please wait ..." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex w-full px-6", children: /* @__PURE__ */ jsx("div", { className: "w-full border-b border-border" }) }),
    /* @__PURE__ */ jsx("div", { className: "relative mx-auto flex w-full flex-col items-center p-6", children: /* @__PURE__ */ jsxs("div", { className: "relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "z-10 flex flex-col items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40", children: [
          isFreePlan && retries < 3 && /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin stroke-[1.5px] text-primary/60" }),
          !isFreePlan && /* @__PURE__ */ jsx(BadgeCheck, { className: "h-8 w-8 stroke-[1.5px] text-primary/60" }),
          isFreePlan && retries === 3 && /* @__PURE__ */ jsx(AlertTriangle, { className: "h-8 w-8 stroke-[1.5px] text-primary/60" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-2", children: /* @__PURE__ */ jsxs("p", { className: "text-center text-base font-medium text-primary", children: [
          isFreePlan && retries < 3 && "Completing your checkout ...",
          !isFreePlan && "Checkout completed!",
          isFreePlan && retries === 3 && "Something went wrong, but don't worry, you will not be charged."
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "z-10 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: ROUTE_PATH$9,
          prefetch: "intent",
          className: `${buttonVariants({ variant: "ghost", size: "sm" })} gap-2`,
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-primary/60 group-hover:text-primary", children: "Return to Dashboard" }),
            /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 stroke-[1.5px] text-primary/60 group-hover:text-primary" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "base-grid absolute h-full w-full opacity-40" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" })
    ] }) })
  ] }) }) });
}
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$3,
  default: DashboardCheckout,
  loader: loader$3,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function useDoubleCheck() {
  const [doubleCheck, setDoubleCheck] = useState(false);
  function getButtonProps(props) {
    const onBlur = () => setDoubleCheck(false);
    const onClick = doubleCheck ? void 0 : (e) => {
      e.preventDefault();
      setDoubleCheck(true);
    };
    const onKeyUp = (e) => {
      if (e.key === "Escape") {
        setDoubleCheck(false);
      }
    };
    return {
      ...props,
      onBlur: callAll(onBlur, props?.onBlur),
      onClick: callAll(onClick, props?.onClick),
      onKeyUp: callAll(onKeyUp, props?.onKeyUp)
    };
  }
  return { doubleCheck, getButtonProps };
}
const ROUTE_PATH$2 = "/resources/upload-image";
const MAX_FILE_SIZE = 1024 * 1024 * 3;
const ImageSchema = z.object({
  imageFile: z.instanceof(File).refine((file) => file.size > 0, "Image is required.")
});
async function action$2({ request, context }) {
  try {
    const user2 = await requireUser(request);
    const formData = await unstable_parseMultipartFormData(
      request,
      unstable_createMemoryUploadHandler({ maxPartSize: MAX_FILE_SIZE })
    );
    const submission = await parseWithZod(formData, {
      schema: ImageSchema.transform(async (data) => {
        return {
          image: {
            contentType: data.imageFile.type,
            blob: Buffer.from(await data.imageFile.arrayBuffer())
          }
        };
      }),
      async: true
    });
    if (submission.status !== "success") {
      return json(submission.reply(), {
        status: submission.status === "error" ? 400 : 200
      });
    }
    const { image } = submission.value;
    await db.transaction(async (tx) => {
      await tx.delete(schema.userImage).where(eq(schema.userImage.userId, user2.id));
      await tx.insert(schema.userImage).values({
        userId: user2.id,
        contentType: image.contentType,
        blob: image.blob
      });
    });
    return json(submission.reply({ fieldErrors: {} }), {
      headers: await createToastHeaders({
        title: "Success!",
        description: "Image uploaded successfully."
      })
    });
  } catch (error) {
    if (error instanceof MaxPartSizeExceededError) {
      const result = {
        initialValue: {},
        status: "error",
        error: {
          imageFile: ["Image size must be less than 3MB."]
        },
        state: {
          validated: {
            imageFile: true
          }
        }
      };
      return json(result, { status: 400 });
    }
    throw error;
  }
}
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ImageSchema,
  MAX_FILE_SIZE,
  ROUTE_PATH: ROUTE_PATH$2,
  action: action$2
}, Symbol.toStringTag, { value: "Module" }));
const ROUTE_PATH$1 = "/resources/reset-image";
async function action$1({ request }) {
  const user2 = await requireUser(request);
  await db.delete(schema.userImage).where(eq(schema.userImage.userId, user2.id));
  return null;
}
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$1,
  action: action$1
}, Symbol.toStringTag, { value: "Module" }));
const UsernameSchema = z.object({
  username: z.string().min(3).max(20).toLowerCase().trim().regex(/^[a-zA-Z0-9]+$/, "Username may only contain alphanumeric characters.")
});
async function loader$2({ request }) {
  const user2 = await requireUser(request);
  return json({ user: user2 });
}
async function action({ request }) {
  const user2 = await requireUser(request);
  const formData = await request.clone().formData();
  const intent = formData.get(INTENTS.INTENT);
  if (intent === INTENTS.USER_UPDATE_USERNAME) {
    const submission = parseWithZod(formData, { schema: UsernameSchema });
    if (submission.status !== "success") {
      return json(submission.reply(), {
        status: submission.status === "error" ? 400 : 200
      });
    }
    const { username } = submission.value;
    const isUsernameTaken = await db.query.user.findFirst({
      where: eq(schema.user.username, username)
    });
    if (isUsernameTaken) {
      return json(
        submission.reply({
          fieldErrors: {
            username: [ERRORS.ONBOARDING_USERNAME_ALREADY_EXISTS]
          }
        })
      );
    }
    await db.update(schema.user).set({ username }).where(eq(schema.user.id, user2.id));
    return json(submission.reply({ fieldErrors: {} }), {
      headers: await createToastHeaders({
        title: "Success!",
        description: "Username updated successfully."
      })
    });
  }
  if (intent === INTENTS.USER_DELETE_ACCOUNT) {
    await db.delete(schema.user).where(eq(schema.user.id, user2.id));
    return redirect(ROUTE_PATH$7, {
      headers: {
        "Set-Cookie": await destroySession(
          await getSession(request.headers.get("Cookie"))
        )
      }
    });
  }
  throw new Error(`Invalid intent: ${intent}`);
}
function DashboardSettings() {
  const { user: user2 } = useLoaderData();
  const lastResult = useActionData();
  const [imageSrc, setImageSrc] = useState(null);
  const imageFormRef = useRef(null);
  const uploadImageFetcher = useFetcher();
  const resetImageFetcher = useFetcher();
  const { doubleCheck, getButtonProps } = useDoubleCheck();
  const [form, { username }] = useForm({
    lastResult,
    constraint: getZodConstraint(UsernameSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UsernameSchema });
    }
  });
  const [avatarForm, avatarFields] = useForm({
    lastResult: uploadImageFetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ImageSchema });
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full w-full flex-col gap-6", children: [
    /* @__PURE__ */ jsxs(
      uploadImageFetcher.Form,
      {
        method: "POST",
        action: ROUTE_PATH$2,
        encType: "multipart/form-data",
        ref: imageFormRef,
        onReset: () => setImageSrc(null),
        ...getFormProps(avatarForm),
        className: "flex w-full flex-col items-start rounded-lg border border-border bg-card",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex w-full items-start justify-between rounded-lg p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Your Avatar" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "This is your avatar. It will be displayed on your profile." })
            ] }),
            /* @__PURE__ */ jsxs(
              "label",
              {
                htmlFor: avatarFields.imageFile.id,
                className: "group relative flex cursor-pointer overflow-hidden rounded-full transition active:scale-95",
                children: [
                  imageSrc || user2.image?.id ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: imageSrc ?? getUserImgSrc(user2.image?.id),
                      className: "h-20 w-20 rounded-full object-cover",
                      alt: user2.username ?? user2.email
                    }
                  ) : /* @__PURE__ */ jsx("div", { className: "h-20 w-20 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" }),
                  /* @__PURE__ */ jsx("div", { className: "absolute z-10 hidden h-full w-full items-center justify-center bg-primary/40 group-hover:flex", children: /* @__PURE__ */ jsx(Upload, { className: "h-6 w-6 text-secondary" }) })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                ...getInputProps(avatarFields.imageFile, { type: "file" }),
                accept: "image/*",
                className: "peer sr-only",
                required: true,
                tabIndex: imageSrc ? -1 : 0,
                onChange: (e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) {
                    const form2 = e.currentTarget.form;
                    if (!form2) return;
                    const reader = new FileReader();
                    reader.onload = (readerEvent) => {
                      setImageSrc(readerEvent.target?.result?.toString() ?? null);
                      uploadImageFetcher.submit(form2);
                    };
                    reader.readAsDataURL(file);
                  }
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 dark:bg-card", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "Click on the avatar to upload a custom one from your files." }),
            user2.image?.id && !avatarFields.imageFile.errors && /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "secondary",
                onClick: () => {
                  resetImageFetcher.submit(
                    {},
                    {
                      method: "POST",
                      action: ROUTE_PATH$1
                    }
                  );
                  if (imageFormRef.current) {
                    imageFormRef.current.reset();
                  }
                },
                children: "Reset"
              }
            ),
            avatarFields.imageFile.errors && /* @__PURE__ */ jsx("p", { className: "text-right text-sm text-destructive dark:text-destructive-foreground", children: avatarFields.imageFile.errors.join(" ") })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "POST",
        className: "flex w-full flex-col items-start rounded-lg border border-border bg-card",
        ...getFormProps(form),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-4 rounded-lg p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Your Username" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "This is your username. It will be displayed on your profile." })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Username",
                autoComplete: "off",
                defaultValue: user2?.username ?? "",
                required: true,
                className: `w-80 bg-transparent ${username.errors && "border-destructive focus-visible:ring-destructive"}`,
                ...getInputProps(username, { type: "text" })
              }
            ),
            username.errors && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive dark:text-destructive-foreground", children: username.errors.join(" ") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 dark:bg-card", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "Please use 32 characters at maximum." }),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                size: "sm",
                name: INTENTS.INTENT,
                value: INTENTS.USER_UPDATE_USERNAME,
                children: "Save"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-start rounded-lg border border-destructive bg-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Delete Account" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "Permanently delete your Remix SaaS account, all of your projects, links and their respective stats." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-red-500/10 px-6 dark:bg-red-500/10", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "This action cannot be undone, proceed with caution." }),
        /* @__PURE__ */ jsx(Form, { method: "POST", children: /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            size: "sm",
            variant: "destructive",
            name: INTENTS.INTENT,
            value: INTENTS.USER_DELETE_ACCOUNT,
            ...getButtonProps(),
            children: doubleCheck ? "Are you sure?" : "Delete Account"
          }
        ) })
      ] })
    ] })
  ] });
}
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  UsernameSchema,
  action,
  default: DashboardSettings,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const ROUTE_PATH = "/onboarding";
async function loader$1({ request }) {
  const user2 = await requireUser(request);
  const pathname = getDomainPathname(request);
  const isOnboardingPathname = pathname === ROUTE_PATH;
  const isOnboardingUsernamePathname = pathname === ROUTE_PATH$e;
  if (isOnboardingPathname) return redirect(ROUTE_PATH$9);
  if (user2.username && isOnboardingUsernamePathname) return redirect(ROUTE_PATH$9);
  return json({});
}
function Onboarding() {
  return /* @__PURE__ */ jsxs("div", { className: "relative flex h-screen w-full bg-card", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-8 mx-auto -translate-x-1/2 transform justify-center", children: /* @__PURE__ */ jsx(Logo, {}) }),
    /* @__PURE__ */ jsx("div", { className: "z-10 h-screen w-screen", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx("div", { className: "base-grid fixed h-screen w-screen opacity-40" }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 h-screen w-screen bg-gradient-to-t from-[hsl(var(--card))] to-transparent" })
  ] });
}
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ROUTE_PATH,
  default: Onboarding,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
async function loader({ params }) {
  if (!params.imageId) {
    throw new Response("Image ID is required", { status: 400 });
  }
  const image = await db.query.userImage.findFirst({
    where: eq(schema.userImage.id, params.imageId),
    columns: { contentType: true, blob: true }
  });
  if (!image) {
    throw new Response("Not found", { status: 404 });
  }
  return new Response(image.blob, {
    headers: {
      "Content-Type": image.contentType,
      "Content-Length": Buffer.byteLength(image.blob).toString(),
      "Content-Disposition": `inline; filename="${params.imageId}"`,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-C6FOLs1d.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/index-DAw2iBXv.js", "/assets/context-ChrYeCtx.js", "/assets/index-DJR8etIf.js", "/assets/components-Bhby6F3L.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-DDRMue7l.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/index-DAw2iBXv.js", "/assets/context-ChrYeCtx.js", "/assets/index-DJR8etIf.js", "/assets/components-Bhby6F3L.js", "/assets/useTranslation-CjEt9MOR.js", "/assets/honeypot-B8ojEnLc.js", "/assets/use-theme-CrgZS6In.js", "/assets/brand-2sN0ZQ2a.js", "/assets/error-boundary-8261IS0k.js", "/assets/index-BgCZZJbK.js"], "css": [] }, "routes/$": { "id": "routes/$", "parentId": "root", "path": "*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/_-A6eBzNzL.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/brand-2sN0ZQ2a.js", "/assets/error-boundary-8261IS0k.js", "/assets/button-DXLxMO3S.js", "/assets/_layout-wxatRzG3.js", "/assets/createLucideIcon-B9RxcC_s.js", "/assets/components-Bhby6F3L.js", "/assets/external-link-mtANY_RP.js", "/assets/index-DJR8etIf.js", "/assets/misc-DExpcjDH.js", "/assets/index-DAw2iBXv.js", "/assets/settings.billing-KtkZgDAY.js", "/assets/misc-CKFZHWnt.js", "/assets/index-CHmExSK5.js", "/assets/use-theme-CrgZS6In.js", "/assets/index-BgCZZJbK.js", "/assets/settings-W3iAG64G.js", "/assets/theme-switcher--CK6PTzp.js", "/assets/useTranslation-CjEt9MOR.js", "/assets/context-ChrYeCtx.js", "/assets/logo-DBvKTkUR.js"], "css": [] }, "routes/_home+/_layout": { "id": "routes/_home+/_layout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_layout-BlCwL1Df.js", "imports": ["/assets/_layout-DYSOx5Vf.js", "/assets/jsx-runtime-BWtM72Fx.js", "/assets/index-DJR8etIf.js"], "css": [] }, "routes/_home+/_index": { "id": "routes/_home+/_index", "parentId": "routes/_home+/_layout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-DqVa0GSp.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/misc-DExpcjDH.js", "/assets/use-theme-CrgZS6In.js", "/assets/brand-2sN0ZQ2a.js", "/assets/login-CM5xx-8C.js", "/assets/button-DXLxMO3S.js", "/assets/theme-switcher--CK6PTzp.js", "/assets/logo-DBvKTkUR.js", "/assets/components-Bhby6F3L.js", "/assets/createLucideIcon-B9RxcC_s.js", "/assets/index-DAw2iBXv.js", "/assets/index-DJR8etIf.js", "/assets/index-BgCZZJbK.js", "/assets/use-hydrated-DfkE8rEP.js", "/assets/honeypot-B8ojEnLc.js", "/assets/input-w4dflGK7.js", "/assets/loader-circle-VNTRYFCh.js", "/assets/index-CHmExSK5.js"], "css": [] }, "routes/admin+/_layout": { "id": "routes/admin+/_layout", "parentId": "root", "path": "admin", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_layout-BMbH5qXH.js", "imports": ["/assets/_layout-wxatRzG3.js", "/assets/jsx-runtime-BWtM72Fx.js", "/assets/settings.billing-KtkZgDAY.js", "/assets/misc-CKFZHWnt.js", "/assets/index-CHmExSK5.js", "/assets/index-DAw2iBXv.js", "/assets/index-DJR8etIf.js", "/assets/button-DXLxMO3S.js", "/assets/misc-DExpcjDH.js", "/assets/components-Bhby6F3L.js", "/assets/use-theme-CrgZS6In.js", "/assets/index-BgCZZJbK.js", "/assets/brand-2sN0ZQ2a.js", "/assets/createLucideIcon-B9RxcC_s.js", "/assets/external-link-mtANY_RP.js", "/assets/settings-W3iAG64G.js", "/assets/theme-switcher--CK6PTzp.js", "/assets/useTranslation-CjEt9MOR.js", "/assets/context-ChrYeCtx.js", "/assets/logo-DBvKTkUR.js"], "css": [] }, "routes/admin+/_index": { "id": "routes/admin+/_index", "parentId": "routes/admin+/_layout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-DMa_zCLY.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js"], "css": [] }, "routes/auth+/_layout": { "id": "routes/auth+/_layout", "parentId": "root", "path": "auth", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_layout-D55GBywI.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/_layout-DYSOx5Vf.js", "/assets/logo-DBvKTkUR.js", "/assets/components-Bhby6F3L.js", "/assets/index-DJR8etIf.js", "/assets/misc-DExpcjDH.js", "/assets/index-DAw2iBXv.js"], "css": [] }, "routes/auth+/$provider": { "id": "routes/auth+/$provider", "parentId": "routes/auth+/_layout", "path": ":provider", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_provider-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/auth+/$provider.callback": { "id": "routes/auth+/$provider.callback", "parentId": "routes/auth+/$provider", "path": "callback", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_provider.callback-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/auth+/login": { "id": "routes/auth+/login", "parentId": "routes/auth+/_layout", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-Dru7EPbd.js", "imports": ["/assets/login-CM5xx-8C.js", "/assets/jsx-runtime-BWtM72Fx.js", "/assets/use-hydrated-DfkE8rEP.js", "/assets/honeypot-B8ojEnLc.js", "/assets/index-BgCZZJbK.js", "/assets/misc-DExpcjDH.js", "/assets/index-DAw2iBXv.js", "/assets/index-DJR8etIf.js", "/assets/brand-2sN0ZQ2a.js", "/assets/input-w4dflGK7.js", "/assets/button-DXLxMO3S.js", "/assets/components-Bhby6F3L.js", "/assets/loader-circle-VNTRYFCh.js", "/assets/createLucideIcon-B9RxcC_s.js"], "css": [] }, "routes/auth+/logout": { "id": "routes/auth+/logout", "parentId": "routes/auth+/_layout", "path": "logout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/logout-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/auth+/magic-link": { "id": "routes/auth+/magic-link", "parentId": "routes/auth+/_layout", "path": "magic-link", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/magic-link-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/auth+/verify": { "id": "routes/auth+/verify", "parentId": "routes/auth+/_layout", "path": "verify", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/verify-D_WvD84q.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/use-hydrated-DfkE8rEP.js", "/assets/honeypot-B8ojEnLc.js", "/assets/index-BgCZZJbK.js", "/assets/brand-2sN0ZQ2a.js", "/assets/input-w4dflGK7.js", "/assets/button-DXLxMO3S.js", "/assets/components-Bhby6F3L.js", "/assets/misc-DExpcjDH.js", "/assets/index-DAw2iBXv.js", "/assets/index-DJR8etIf.js"], "css": [] }, "routes/dashboard+/_layout": { "id": "routes/dashboard+/_layout", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_layout-_g8_Y_kN.js", "imports": ["/assets/_layout-wxatRzG3.js", "/assets/jsx-runtime-BWtM72Fx.js", "/assets/settings.billing-KtkZgDAY.js", "/assets/misc-CKFZHWnt.js", "/assets/index-CHmExSK5.js", "/assets/index-DAw2iBXv.js", "/assets/index-DJR8etIf.js", "/assets/button-DXLxMO3S.js", "/assets/misc-DExpcjDH.js", "/assets/components-Bhby6F3L.js", "/assets/use-theme-CrgZS6In.js", "/assets/index-BgCZZJbK.js", "/assets/brand-2sN0ZQ2a.js", "/assets/createLucideIcon-B9RxcC_s.js", "/assets/external-link-mtANY_RP.js", "/assets/settings-W3iAG64G.js", "/assets/theme-switcher--CK6PTzp.js", "/assets/useTranslation-CjEt9MOR.js", "/assets/context-ChrYeCtx.js", "/assets/logo-DBvKTkUR.js"], "css": [] }, "routes/dashboard+/_index": { "id": "routes/dashboard+/_index", "parentId": "routes/dashboard+/_layout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-CbX1K-Vr.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/misc-DExpcjDH.js", "/assets/brand-2sN0ZQ2a.js", "/assets/button-DXLxMO3S.js", "/assets/useTranslation-CjEt9MOR.js", "/assets/createLucideIcon-B9RxcC_s.js", "/assets/external-link-mtANY_RP.js", "/assets/index-DAw2iBXv.js", "/assets/index-DJR8etIf.js", "/assets/context-ChrYeCtx.js"], "css": [] }, "routes/dashboard+/checkout": { "id": "routes/dashboard+/checkout", "parentId": "routes/dashboard+/_layout", "path": "checkout", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/checkout-n5omlmXI.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/brand-2sN0ZQ2a.js", "/assets/_layout-wxatRzG3.js", "/assets/button-DXLxMO3S.js", "/assets/components-Bhby6F3L.js", "/assets/index-DJR8etIf.js", "/assets/loader-circle-VNTRYFCh.js", "/assets/createLucideIcon-B9RxcC_s.js", "/assets/external-link-mtANY_RP.js", "/assets/settings.billing-KtkZgDAY.js", "/assets/misc-CKFZHWnt.js", "/assets/index-CHmExSK5.js", "/assets/index-DAw2iBXv.js", "/assets/misc-DExpcjDH.js", "/assets/use-theme-CrgZS6In.js", "/assets/index-BgCZZJbK.js", "/assets/settings-W3iAG64G.js", "/assets/theme-switcher--CK6PTzp.js", "/assets/useTranslation-CjEt9MOR.js", "/assets/context-ChrYeCtx.js", "/assets/logo-DBvKTkUR.js"], "css": [] }, "routes/dashboard+/settings": { "id": "routes/dashboard+/settings", "parentId": "routes/dashboard+/_layout", "path": "settings", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/settings-Df4wHrN-.js", "imports": ["/assets/settings-W3iAG64G.js", "/assets/jsx-runtime-BWtM72Fx.js", "/assets/index-BgCZZJbK.js", "/assets/misc-DExpcjDH.js", "/assets/index-DAw2iBXv.js", "/assets/index-DJR8etIf.js", "/assets/settings.billing-KtkZgDAY.js", "/assets/misc-CKFZHWnt.js", "/assets/index-CHmExSK5.js", "/assets/button-DXLxMO3S.js", "/assets/components-Bhby6F3L.js"], "css": [] }, "routes/dashboard+/settings.billing": { "id": "routes/dashboard+/settings.billing", "parentId": "routes/dashboard+/settings", "path": "billing", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/settings.billing-BiFtiaoP.js", "imports": ["/assets/settings.billing-KtkZgDAY.js", "/assets/jsx-runtime-BWtM72Fx.js", "/assets/misc-CKFZHWnt.js", "/assets/index-CHmExSK5.js", "/assets/index-DAw2iBXv.js", "/assets/index-DJR8etIf.js", "/assets/button-DXLxMO3S.js", "/assets/misc-DExpcjDH.js", "/assets/components-Bhby6F3L.js"], "css": [] }, "routes/dashboard+/settings.index": { "id": "routes/dashboard+/settings.index", "parentId": "routes/dashboard+/settings", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/settings.index-D9RoPXPw.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/index-BgCZZJbK.js", "/assets/misc-DExpcjDH.js", "/assets/misc-CKFZHWnt.js", "/assets/input-w4dflGK7.js", "/assets/button-DXLxMO3S.js", "/assets/components-Bhby6F3L.js", "/assets/createLucideIcon-B9RxcC_s.js", "/assets/index-DAw2iBXv.js", "/assets/index-DJR8etIf.js"], "css": [] }, "routes/onboarding+/_layout": { "id": "routes/onboarding+/_layout", "parentId": "root", "path": "onboarding", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_layout-BS6sI69u.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/logo-DBvKTkUR.js", "/assets/index-DJR8etIf.js", "/assets/misc-DExpcjDH.js", "/assets/index-DAw2iBXv.js"], "css": [] }, "routes/onboarding+/username": { "id": "routes/onboarding+/username", "parentId": "routes/onboarding+/_layout", "path": "username", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/username-D34I06Nj.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/use-hydrated-DfkE8rEP.js", "/assets/honeypot-B8ojEnLc.js", "/assets/index-BgCZZJbK.js", "/assets/misc-DExpcjDH.js", "/assets/input-w4dflGK7.js", "/assets/button-DXLxMO3S.js", "/assets/components-Bhby6F3L.js", "/assets/loader-circle-VNTRYFCh.js", "/assets/index-DAw2iBXv.js", "/assets/index-DJR8etIf.js", "/assets/createLucideIcon-B9RxcC_s.js"], "css": [] }, "routes/resources+/reset-image": { "id": "routes/resources+/reset-image", "parentId": "root", "path": "resources/reset-image", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/reset-image-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/resources+/update-theme": { "id": "routes/resources+/update-theme", "parentId": "root", "path": "resources/update-theme", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/update-theme-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/resources+/upload-image": { "id": "routes/resources+/upload-image", "parentId": "root", "path": "resources/upload-image", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/upload-image-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/resources+/user-images.$imageId": { "id": "routes/resources+/user-images.$imageId", "parentId": "root", "path": "resources/user-images/:imageId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/user-images._imageId-l0sNRNKZ.js", "imports": [], "css": [] } }, "url": "/assets/manifest-c3f63fce.js", "version": "c3f63fce" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "unstable_singleFetch": false, "unstable_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/$": {
    id: "routes/$",
    parentId: "root",
    path: "*",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_home+/_layout": {
    id: "routes/_home+/_layout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/_home+/_index": {
    id: "routes/_home+/_index",
    parentId: "routes/_home+/_layout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route3
  },
  "routes/admin+/_layout": {
    id: "routes/admin+/_layout",
    parentId: "root",
    path: "admin",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/admin+/_index": {
    id: "routes/admin+/_index",
    parentId: "routes/admin+/_layout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route5
  },
  "routes/auth+/_layout": {
    id: "routes/auth+/_layout",
    parentId: "root",
    path: "auth",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/auth+/$provider": {
    id: "routes/auth+/$provider",
    parentId: "routes/auth+/_layout",
    path: ":provider",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/auth+/$provider.callback": {
    id: "routes/auth+/$provider.callback",
    parentId: "routes/auth+/$provider",
    path: "callback",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/auth+/login": {
    id: "routes/auth+/login",
    parentId: "routes/auth+/_layout",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/auth+/logout": {
    id: "routes/auth+/logout",
    parentId: "routes/auth+/_layout",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/auth+/magic-link": {
    id: "routes/auth+/magic-link",
    parentId: "routes/auth+/_layout",
    path: "magic-link",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/auth+/verify": {
    id: "routes/auth+/verify",
    parentId: "routes/auth+/_layout",
    path: "verify",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/dashboard+/_layout": {
    id: "routes/dashboard+/_layout",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/dashboard+/_index": {
    id: "routes/dashboard+/_index",
    parentId: "routes/dashboard+/_layout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route14
  },
  "routes/dashboard+/checkout": {
    id: "routes/dashboard+/checkout",
    parentId: "routes/dashboard+/_layout",
    path: "checkout",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/dashboard+/settings": {
    id: "routes/dashboard+/settings",
    parentId: "routes/dashboard+/_layout",
    path: "settings",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/dashboard+/settings.billing": {
    id: "routes/dashboard+/settings.billing",
    parentId: "routes/dashboard+/settings",
    path: "billing",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/dashboard+/settings.index": {
    id: "routes/dashboard+/settings.index",
    parentId: "routes/dashboard+/settings",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route18
  },
  "routes/onboarding+/_layout": {
    id: "routes/onboarding+/_layout",
    parentId: "root",
    path: "onboarding",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/onboarding+/username": {
    id: "routes/onboarding+/username",
    parentId: "routes/onboarding+/_layout",
    path: "username",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/resources+/reset-image": {
    id: "routes/resources+/reset-image",
    parentId: "root",
    path: "resources/reset-image",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/resources+/update-theme": {
    id: "routes/resources+/update-theme",
    parentId: "root",
    path: "resources/update-theme",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "routes/resources+/upload-image": {
    id: "routes/resources+/upload-image",
    parentId: "root",
    path: "resources/upload-image",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "routes/resources+/user-images.$imageId": {
    id: "routes/resources+/user-images.$imageId",
    parentId: "root",
    path: "resources/user-images/:imageId",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
