import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { handle } from 'hono/aws-lambda'
import * as stripe from './stripe'

const app = new Hono().use(logger())

app.get('/', (ctx) => ctx.text('This works'))
app.route('/hook/stripe', stripe.route)

export const handler = handle(app)
