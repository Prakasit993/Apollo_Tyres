/**
 * Simple in-memory rate limiter for login attempts
 * Limits: 10 attempts per hour per identifier (IP or email)
 */

interface RateLimitEntry {
    attempts: number
    resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetAt) {
            rateLimitStore.delete(key)
        }
    }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
    /** Maximum attempts allowed */
    maxAttempts: number
    /** Time window in milliseconds */
    windowMs: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
}

export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now()
    const entry = rateLimitStore.get(identifier)

    // No entry or expired - allow and create new
    if (!entry || now > entry.resetAt) {
        const resetAt = now + config.windowMs
        rateLimitStore.set(identifier, {
            attempts: 1,
            resetAt,
        })
        return {
            allowed: true,
            remaining: config.maxAttempts - 1,
            resetAt,
        }
    }

    // Entry exists and not expired
    if (entry.attempts >= config.maxAttempts) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: entry.resetAt,
        }
    }

    // Increment attempts
    entry.attempts++
    return {
        allowed: true,
        remaining: config.maxAttempts - entry.attempts,
        resetAt: entry.resetAt,
    }
}

/** Get remaining attempts without incrementing */
export function getRateLimitStatus(
    identifier: string,
    config: RateLimitConfig = DEFAULT_CONFIG
): { remaining: number; resetAt: number | null } {
    const now = Date.now()
    const entry = rateLimitStore.get(identifier)

    if (!entry || now > entry.resetAt) {
        return {
            remaining: config.maxAttempts,
            resetAt: null,
        }
    }

    return {
        remaining: Math.max(0, config.maxAttempts - entry.attempts),
        resetAt: entry.resetAt,
    }
}
