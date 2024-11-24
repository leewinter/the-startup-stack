import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { authenticator } from '#app/modules/auth/auth.server'
import { useTheme } from '#app/utils/hooks/use-theme.js'
import { siteConfig } from '#app/utils/constants/brand'
import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/auth+/login'
import { buttonVariants } from '#app/components/ui/button'
import { Logo } from '#app/components/logo'

export const meta: MetaFunction = () => {
  return [{ title: `${siteConfig.siteTitle} - Starter Kit` }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request)
  return { user: sessionUser }
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>()
  const theme = useTheme()

  return (
    <div className="relative flex h-full w-full flex-col bg-card">
      {/* Navigation */}
      <div className="sticky top-0 z-50 mx-auto flex w-full max-w-screen-lg items-center justify-between p-6 py-3">
        <Link to="/" prefetch="intent" className="flex h-10 items-center gap-1">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <Link to={LOGIN_PATH} className={buttonVariants({ size: 'sm' })}>
            {user ? 'Dashboard' : 'Get Started'}
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="z-10 mx-auto flex w-full max-w-screen-lg flex-col gap-4 px-6">
        <div className="z-10 flex h-full w-full flex-col items-center justify-center gap-4 p-12 md:p-24">
          <h1 className="text-center text-6xl font-bold leading-tight text-primary md:text-7xl lg:leading-tight">
            The Startup Stack
          </h1>
        </div>
      </div>

      {/* Background */}
      <img
        src="/images/shadow.png"
        alt="Hero"
        className={`fixed left-0 top-0 z-0 h-full w-full opacity-60 ${theme === 'dark' ? 'invert' : ''}`}
      />
      <div className="base-grid fixed h-screen w-screen opacity-40" />
      <div className="fixed bottom-0 h-screen w-screen bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
    </div>
  )
}
