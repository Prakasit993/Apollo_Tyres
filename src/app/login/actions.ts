'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
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
        return { error: error.message }
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

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
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
        return { error: error.message }
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
