'use client'

import { useActionState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button"
import { login, signup } from "./actions"

const initialState = {
  error: '',
}

export default function LoginPage() {
  const [stateLogin, loginAction, isPendingLogin] = useActionState(login, initialState)
  const [stateSignup, signupAction, isPendingSignup] = useActionState(signup, initialState)

  const handleGoogleLogin = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center bg-cream-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-lg border border-border">
        <div className="text-center">
          <h2 className="text-3xl font-black text-charcoal-900">Sign in</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your order history and profile
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6 px-3"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6 px-3"
                placeholder="Password"
              />
            </div>
          </div>

          {(stateLogin?.error || stateSignup?.error) && (
            <p className="text-sm text-red-500 text-center font-medium">
              {stateLogin?.error || stateSignup?.error}
            </p>
          )}

          <div className="flex flex-col gap-3">
            <Button formAction={loginAction} disabled={isPendingLogin} className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold">
              {isPendingLogin ? 'Signing in...' : 'Sign in'}
            </Button>
            <Button formAction={signupAction} disabled={isPendingSignup} variant="outline" className="w-full">
              {isPendingSignup ? 'Signing up...' : 'Sign up'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin}>
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
              Google
            </Button>
            <Button type="button" variant="outline" className="w-full" disabled>Facebook</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
