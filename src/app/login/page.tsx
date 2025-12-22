'use client'

import { useActionState, useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { isLineInApp } from "@/lib/isLineInApp";
import { Button } from "@/components/ui/button"
import { login, signup, resendConfirmation } from "./actions"
import Turnstile from 'react-turnstile'

const initialState = {
  error: '',
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaKey, setCaptchaKey] = useState(0) // Force reset Turnstile
  const [email, setEmail] = useState('')

  const [stateLogin, loginAction, isPendingLogin] = useActionState(login, initialState)
  const [stateSignup, signupAction, isPendingSignup] = useActionState(signup, initialState)
  const [stateResend, resendAction, isPendingResend] = useActionState(resendConfirmation, { error: '', success: '' } as any)

  // Reset Captcha when standard actions complete with error or success
  useEffect(() => {
    if (stateLogin?.error || stateSignup?.error || stateResend?.error || stateResend?.success) {
      setCaptchaKey(prev => prev + 1)
      setCaptchaToken('')
    }
  }, [stateLogin, stateSignup, stateResend])

  const handleGoogleLogin = async () => {
    // 1. Check for LINE in-app browser FIRST
    if (isLineInApp()) {
      const currentUrl = new URL(window.location.href);
      if (!currentUrl.searchParams.has("openExternalBrowser")) {
        currentUrl.searchParams.append("openExternalBrowser", "1");
        window.location.href = currentUrl.toString();
        return; // Stop here, let the page reload in external browser
      }
    }

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const redirectTo = `${window.location.origin}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    const url = data?.url;
    if (!url) {
      alert("Missing OAuth URL");
      return;
    }

    // Normal browser or already external
    window.location.assign(url);
  }

  return (
    <div className="flex min-h-[700px] flex-col items-center justify-center bg-neutral-900 py-12">
      <div className="w-full max-w-md space-y-8 p-8 bg-neutral-800 rounded-lg shadow-lg border border-neutral-700">

        {/* Tabs */}
        <div className="flex border-b border-neutral-700">
          <button
            className={`flex-1 pb-4 text-center font-bold text-sm uppercase tracking-wider transition-colors ${activeTab === 'login' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 pb-4 text-center font-bold text-sm uppercase tracking-wider transition-colors ${activeTab === 'register' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('register')}
          >
            Create Account
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black text-white">Welcome Back</h2>
              <p className="mt-2 text-sm text-gray-400">Access your order history and profile</p>
            </div>

            <form
              action={loginAction}
              className="space-y-6"
              onSubmit={(e) => {
                if (!captchaToken) {
                  e.preventDefault()
                  alert('กรุณายืนยันตัวตน (Captcha) ด้านล่างก่อนเข้าสู่ระบบ')
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="email-login" className="sr-only">Email address</label>
                  <input
                    id="email-login"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border border-neutral-600 bg-neutral-700 py-2 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-3 focus:outline-none"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password-login" className="sr-only">Password</label>
                  <input
                    id="password-login"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border border-neutral-600 bg-neutral-700 py-2 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-3 focus:outline-none"
                    placeholder="Password"
                  />
                </div>
                {/* Hidden input for Turnstile Token */}
                <input type="hidden" name="cf-turnstile-response" value={captchaToken} />
              </div>

              {/* Turnstile Widget */}
              <div className="flex justify-center">
                <Turnstile
                  key={`turnstile-login-${captchaKey}`}
                  sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                  onVerify={(token) => setCaptchaToken(token)}
                  theme="light"
                />
              </div>

              {stateLogin?.error && (
                <div className="text-center">
                  <p className="text-sm text-red-500 font-medium mb-2">{stateLogin.error}</p>
                  {stateLogin.error.includes("Email not confirmed") && (
                    <p className="text-xs text-gray-400">
                      Verify your email or <button type="button" className="text-blue-400 font-bold hover:underline" onClick={() => document.getElementById('resend-btn')?.click()} disabled={!captchaToken}>resend confirmation</button>.
                      {!captchaToken && <span className="block text-[10px] text-gray-500 mt-1">(Please verify captcha above first)</span>}
                    </p>
                  )}
                </div>
              )}

              <Button type="submit" disabled={isPendingLogin} className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold h-10 disabled:opacity-50">
                {isPendingLogin ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            {/* Hidden Resend Form */}
            <form action={resendAction} className="hidden">
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="cf-turnstile-response" value={captchaToken} />
              <button id="resend-btn" type="submit"></button>
            </form>

            {stateResend?.success && (
              <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md text-center border border-green-200">
                {stateResend.success}
              </div>
            )}
            {stateResend?.error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md text-center border border-red-200">
                {stateResend.error}
              </div>
            )}
          </div>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black text-white">Join Us</h2>
              <p className="mt-2 text-sm text-gray-400">Create an account to track orders</p>
            </div>

            {/* Success Message for Registration */}
            {stateSignup?.success ? (
              <div className="text-center py-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 mb-4">
                  <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">ลงทะเบียนสำเร็จ!</h3>
                <p className="text-gray-400 mb-6">
                  เราได้ส่งลิงก์ยืนยันไปที่อีเมลของคุณแล้ว<br />
                  กรุณาตรวจสอบกล่องจดหมาย (หรือโฟลเดอร์ขยะ) เพื่อยืนยันตัวตน
                </p>
                <Button
                  onClick={() => {
                    setActiveTab('login');
                    window.location.reload();
                  }}
                  className="bg-blue-600 text-white hover:bg-blue-700 font-bold"
                >
                  เข้าสู่ระบบ
                </Button>
              </div>
            ) : (
              <form
                action={signupAction}
                className="space-y-6"
                onSubmit={(e) => {
                  if (!captchaToken) {
                    e.preventDefault()
                    alert('กรุณายืนยันตัวตน (Captcha) ด้านล่างก่อนสร้างบัญชี')
                  }
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email-register" className="sr-only">Email address</label>
                    <input
                      id="email-register"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border border-neutral-600 bg-neutral-700 py-2 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-3 focus:outline-none"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="password-register" className="sr-only">Password</label>
                    <input
                      id="password-register"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="block w-full rounded-md border border-neutral-600 bg-neutral-700 py-2 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 px-3 focus:outline-none"
                      placeholder="Password"
                    />
                  </div>
                  {/* Hidden input for Turnstile Token */}
                  <input type="hidden" name="cf-turnstile-response" value={captchaToken} />
                </div>

                {/* Turnstile Widget */}
                <div className="flex justify-center">
                  <Turnstile
                    key={`turnstile-register-${captchaKey}`}
                    sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                    onVerify={(token) => setCaptchaToken(token)}
                    theme="light"
                  />
                </div>

                {stateSignup?.error && (
                  <p className="text-sm text-red-500 text-center font-medium">{stateSignup.error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isPendingSignup}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold h-10 disabled:opacity-50"
                >
                  {isPendingSignup ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Social Login (Common) */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-neutral-600" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-neutral-800 px-2 text-gray-400">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button type="button" variant="outline" className="w-full bg-neutral-700 text-white border-neutral-600 hover:bg-neutral-600 hover:text-white" onClick={handleGoogleLogin}>
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            Google
          </Button>
          <Button type="button" variant="outline" className="w-full bg-neutral-700 text-gray-400 border-neutral-600" disabled>Facebook</Button>
        </div>
      </div>
    </div>
  )
}
