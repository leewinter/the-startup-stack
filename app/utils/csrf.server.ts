/**
 * Learn more about CSRF protection:
 * @see https://github.com/sergiodxa/remix-utils?tab=readme-ov-file#csrf
 */
import { isPermanentStage } from '#infra/stage.ts'
import { createCookie } from '@remix-run/node'
import { CSRF, CSRFError } from 'remix-utils/csrf/server'
import { Resource } from 'sst'

export const CSRF_COOKIE_KEY = '_csrf'

const cookie = createCookie(CSRF_COOKIE_KEY, {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secrets: [Resource.SESSION_SECRET.value || 'NOT_A_STRONG_SECRET'],
  secure: isPermanentStage,
})

export const csrf = new CSRF({ cookie })

export async function validateCSRF(formData: FormData, headers: Headers) {
  try {
    await csrf.validate(formData, headers)
  } catch (err: unknown) {
    if (err instanceof CSRFError) {
      throw new Response('Invalid CSRF token', { status: 403 })
    }
    throw err
  }
}
