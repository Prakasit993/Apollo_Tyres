export async function sendN8NWebhook(event: string, data: any) {
    const webhookUrl = process.env.N8N_WEBHOOK_URL

    if (!webhookUrl) {
        return { success: false, message: "N8N_WEBHOOK_URL not configured" }
    }

    try {
        const payload = {
            event,
            timestamp: new Date().toISOString(),
            data
        }

        // Fire and forget - don't await the response to block the UI
        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(err => console.error(`Failed to send n8n webhook (${event})`, err))

        return { success: true }
    } catch (error) {
        console.error("n8n webhook error:", error)
        return { success: false, error }
    }
}
