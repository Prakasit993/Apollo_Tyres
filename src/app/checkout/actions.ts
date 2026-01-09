'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const OrderSchema = z.object({
    fullName: z.string().min(1, "Name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    address: z.string().min(1, "Address is required"),
    district: z.string().optional(),
    amphoe: z.string().optional(),
    province: z.string().optional(),
    zipcode: z.string().optional(),
    deliveryMethod: z.enum(['pickup', 'standard']),
    paymentMethod: z.enum(['cash', 'transfer', 'qr']),
})

export type CheckoutState = {
    message?: string
    errors?: {
        [key: string]: string[]
    }
    success?: boolean
    orderId?: string
}

// New action to update profile directly from Checkout "Save" button
export async function updateProfileAddress(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { message: "Unauthorized" }

    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const district = formData.get('district') as string
    const amphoe = formData.get('amphoe') as string
    const province = formData.get('province') as string
    const zipcode = formData.get('zipcode') as string

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: fullName,
            phone: phone,
            address: address, // House No.
            district: district,
            amphoe: amphoe,
            province: province,
            zipcode: zipcode,
            is_complete: true,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

    if (error) {
        console.error("Profile update error", error)
        return { message: "Failed to update profile" }
    }

    revalidatePath('/checkout')
    return { success: true }
}

export async function placeOrder(
    prevState: CheckoutState,
    formData: FormData,
    cartItems: any[], // Passed from client store
    cartTotal: number
): Promise<CheckoutState> {
    const supabase = await createClient()

    // 1. Check Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { message: 'You must be logged in to place an order.' }
    }

    // 2. Validate Form
    const validatedFields = OrderSchema.safeParse({
        fullName: formData.get('fullName'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        district: formData.get('district'),
        amphoe: formData.get('amphoe'),
        province: formData.get('province'),
        zipcode: formData.get('zipcode'),
        deliveryMethod: formData.get('deliveryMethod'),
        paymentMethod: formData.get('paymentMethod'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please check your inputs.',
        }
    }

    const { address, phone, fullName, district, amphoe, province, zipcode, deliveryMethod, paymentMethod } = validatedFields.data

    let slipUrl = null
    if (paymentMethod === 'transfer') {
        const slipFile = formData.get('slip') as File
        if (slipFile && slipFile.size > 0) {
            // Upload Slip
            const fileExt = slipFile.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}.${fileExt}`
            const bucketName = 'slips'

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(fileName, slipFile)

            if (uploadError) {
                console.error("Slip upload error:", uploadError)
                return { message: "Failed to upload payment slip. Please try again." }
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(fileName)

            slipUrl = publicUrl
        }
    }

    try {
        // 2.5 Check Stock Availability
        const { createAdminClient } = await import('@/lib/supabase-admin')
        const supabaseAdmin = createAdminClient()

        for (const item of cartItems) {
            const { data: product, error: stockCheckError } = await supabaseAdmin
                .from('tyres_products')
                .select('stock, brand, model')
                .eq('id', item.id)
                .single()

            if (stockCheckError || !product) {
                console.error(`Stock check failed for ${item.id}`, stockCheckError)
                return { message: "Error checking product stock. Please try again." }
            }

            if (product.stock < item.quantity) {
                const { getContactSettings } = await import('@/app/admin/contact/actions')
                const contact = await getContactSettings()
                const contactInfo = [contact.phone1, contact.line ? `Line: ${contact.line}` : ''].filter(Boolean).join(' หรือ ')

                return {
                    message: `ขออภัย สินค้า ${product.brand} ${product.model} มีสินค้าไม่เพียงพอ กรุณาติดต่อ ${contactInfo}`
                }
            }
        }

        // 3. Update Profile (Save latest address including granular fields)
        await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                address: address,
                district: district,
                amphoe: amphoe,
                province: province,
                zipcode: zipcode,
                phone: phone,
                is_complete: true
            })
            .eq('id', user.id)

        // 4. Create Order
        const { data: order, error: orderError } = await supabase
            .from('tyres_orders')
            .insert({
                user_id: user.id,
                total_price: cartTotal,
                status: 'pending',
                delivery_method: deliveryMethod,
                payment_method: paymentMethod,
                shipping_address: address,
                slip_url: slipUrl
            })
            .select()
            .single()

        if (orderError) {
            console.error('Order Error:', orderError)
            throw new Error(`Failed to create order: ${orderError.message}`)
        }

        // 5. Create Order Items
        const orderItems = cartItems.map((item: any) => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity // Add Rule of 4 logic check here if needed server-side
        }))

        const { error: itemsError } = await supabase
            .from('tyres_order_items')
            .insert(orderItems)

        if (itemsError) {
            console.error('Items Error:', itemsError)
            // Ideally we should rollback here, but Supabase doesn't support transactions via Client easily yet without RPC.
            // For MVP, we assume consistency.
            throw new Error('Failed to add items')
        }

        // 5.5 Deduct Stock
        try {
            const { createAdminClient } = await import('@/lib/supabase-admin')
            const supabaseAdmin = createAdminClient()

            for (const item of cartItems) {
                try {
                    // Fetch current stock using Admin to bypass RLS
                    const { data: product, error: fetchError } = await supabaseAdmin
                        .from('tyres_products')
                        .select('stock')
                        .eq('id', item.id)
                        .single()

                    if (fetchError || !product) {
                        console.error(`Failed to fetch stock for ${item.id}`, fetchError)
                        continue
                    }

                    const newStock = product.stock - item.quantity

                    // Double check to prevent negative stock (Race condition guard)
                    if (newStock < 0) {
                        console.error(`Insufficient stock for ${item.id} during deduction.`)
                        // Ideally we should alert admin, but for now we log.
                        // We continue to try to deduct others or stop? 
                        // If we stop, we have partial deduction.
                        // Let's throw to trigger adminClientError catch? No, per item catch.
                        throw new Error("Stock became insufficient during processing")
                    }

                    const { error: updateError } = await supabaseAdmin
                        .from('tyres_products')
                        .update({ stock: newStock })
                        .eq('id', item.id)

                    if (updateError) {
                        console.error(`Failed to update stock for ${item.id}`, updateError)
                    }
                } catch (e) {
                    console.error(`Stock update exception for ${item.id}`, e)
                }
            }
        } catch (adminClientError) {
            console.error("Failed to initialize admin client for stock deduction", adminClientError)
        }

        // 6. Notify n8n Webhook (Fire and forget) + Send Email
        try {
            // Send Email
            if (user.email) {
                // We don't await this to block the user, but for server actions it might be better to await 
                // to ensure it sends, or treat it as fire-and-forget
                const { sendOrderConfirmationEmail } = await import('@/lib/email')
                await sendOrderConfirmationEmail(
                    user.email,
                    order.id,
                    cartItems,
                    cartTotal,
                    fullName
                )
            }

            // Notify n8n
            console.log("Notifying n8n...")
            const { sendN8NWebhook } = await import('@/lib/n8n')

            // Prepare payload
            const n8nPayload = {
                order_id: order.id,
                customer: {
                    name: fullName,
                    phone: phone,
                    address: address
                },
                items: cartItems.map((item: any) => ({
                    product: `${item.brand} ${item.model}`,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: cartTotal,
                payment_method: paymentMethod,
                delivery_method: deliveryMethod,
                slip_url: slipUrl
            }

            await sendN8NWebhook('order.created', n8nPayload)
        } catch (e) {
            // Ignore webhook/email errors so we don't fail the order if email fails
            console.error("Notification setup error", e)
        }

        // 7. Return Success with Order ID
        revalidatePath('/orders')
        return { success: true, orderId: order.id }

    } catch (error: any) {
        console.error("Full Order Error:", error)
        return { message: `Database Error: ${error.message || JSON.stringify(error)}` }
    }
}
