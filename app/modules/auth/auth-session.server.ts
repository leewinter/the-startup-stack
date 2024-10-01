import { isPermanentStage } from '#infra/stage.ts'
import { createCookieSessionStorage } from '@remix-run/node'
import { Resource } from 'sst'

export const AUTH_SESSION_KEY = '_auth'
export const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: AUTH_SESSION_KEY,
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secrets: [Resource.SESSION_SECRET.value || 'NOT_A_STRONG_SECRET'],
    secure: isPermanentStage,
  },
})

export const { getSession, commitSession, destroySession } = authSessionStorage
