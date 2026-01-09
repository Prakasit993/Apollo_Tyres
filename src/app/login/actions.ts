'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

// Validation schema
const loginSchema = z.object({
    email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
    password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
})

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Get IP for rate limiting
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const email = formData.get('email') as string

    // Rate limiting - 10 attempts per hour per IP
    const rateLimitKey = `login:${ip}:${email}`
    const rateLimit = checkRateLimit(rateLimitKey)

    if (!rateLimit.allowed) {
        const minutesLeft = Math.ceil((rateLimit.resetAt - Date.now()) / 60000)
        return {
            error: `พยายามเข้าสู่ระบบมากเกินไป กรุณารอ ${minutesLeft} นาที`
        }
    }

    // Validate inputs
    const validation = loginSchema.safeParse({
        email,
        password: formData.get('password') as string,
    })

    if (!validation.success) {
        const firstError = validation.error.issues[0]
        return { error: firstError.message }
    }

    const password = formData.get('password') as string
    const captchaToken = formData.get('cf-turnstile-response') as string

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
            captchaToken,
        },
    })

    if (error) {
        // Generic error to prevent user enumeration
        return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }
    }

    if (data.user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, phone, address')
            .eq('id', data.user.id)
            .single()

        // If profile exists but missing key info, redirect to edit profile
        if (profile && (!profile.full_name || !profile.phone || !profile.address)) {
            revalidatePath('/', 'layout')
            redirect('/account/edit')
        }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

// Signup validation schema
const signupSchema = z.object({
    email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
    password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
})

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Get IP for rate limiting
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const email = formData.get('email') as string

    // Rate limiting - 10 attempts per hour per IP
    const rateLimitKey = `signup:${ip}:${email}`
    const rateLimit = checkRateLimit(rateLimitKey)

    if (!rateLimit.allowed) {
        const minutesLeft = Math.ceil((rateLimit.resetAt - Date.now()) / 60000)
        return {
            error: `พยายามสมัครมากเกินไป กรุณารอ ${minutesLeft} นาที`
        }
    }

    // Validate inputs
    const validation = signupSchema.safeParse({
        email,
        password: formData.get('password') as string,
    })

    if (!validation.success) {
        const firstError = validation.error.issues[0]
        return { error: firstError.message }
    }

    const password = formData.get('password') as string
    const captchaToken = formData.get('cf-turnstile-response') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            captchaToken,
        },
    })

    if (error) {
        console.log('Signup Action Error:', error)
        if (error.message.includes("User already registered") || error.code === 'user_already_exists') {
            return { error: 'อีเมลนี้มีผู้ใช้งานแล้ว กรุณาเข้าสู่ระบบ' }
        }
        // Generic error for other cases
        return { error: 'ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่อีกครั้ง' }
    }

    return { success: true }
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function resendConfirmation(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    // Check if captcha is required for resend (depends on settings), 
    // but usually resend might need rate limiting. 
    // Supabase handles rate limits.
    const captchaToken = formData.get('cf-turnstile-response') as string

    const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
            captchaToken
        }
    })

    if (error) {
        return { error: error.message }
    }

    return { success: 'Confirmation email sent! Please check your inbox.' }
}
