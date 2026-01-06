import { createClient } from '@/lib/supabase-server'

/**
 * Generate full Supabase storage URL from a relative path
 * @param path - Relative path in storage (e.g., "images/shop-gallery/111.jpg")
 * @returns Full storage URL
 */
export function getStorageUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    if (!baseUrl) {
        console.warn('NEXT_PUBLIC_SUPABASE_URL is not defined')
        return ''
    }
    
    // If path already contains http:// or https://, return as-is (external URL)
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
    }
    
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    
    return `${baseUrl}/storage/v1/object/public/${cleanPath}`
}

/**
 * Fetch hero image URL from database settings
 * @returns Promise with full hero image URL or fallback
 */
export async function getHeroImageUrl(): Promise<string> {
    const fallbackPath = 'images/shop-gallery/111.jpg'
    
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('tyres_site_settings')
            .select('value')
            .eq('key', 'hero_image_url')
            .single()
        
        if (error) {
            console.error('Error fetching hero image URL:', error)
            return getStorageUrl(fallbackPath)
        }
        
        const imagePath = data?.value || fallbackPath
        return getStorageUrl(imagePath)
    } catch (err) {
        console.error('Failed to fetch hero image URL:', err)
        return getStorageUrl(fallbackPath)
    }
}
