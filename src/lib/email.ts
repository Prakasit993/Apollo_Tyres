import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendOrderConfirmationEmail(
  to: string,
  orderId: string,
  items: { brand: string; model: string; quantity: number; price: number }[],
  total: number,
  customerName: string
) {
  const itemsHtml = items.map(item => `
    <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.brand} ${item.model}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.price.toLocaleString()} THB</td>
    </tr>
  `).join('')

  const mailOptions = {
    from: `"Tire Select" <${process.env.GMAIL_USER}>`,
    to: to,
    subject: `Order Confirmation #${orderId.slice(0, 8)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d4af37;">Thank You for Your Order!</h1>
        <p>Hi ${customerName},</p>
        <p>We have received your order. Here are the details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: left;">Qty</th>
              <th style="padding: 10px; text-align: left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 10px; font-weight: bold;">${total.toLocaleString()} THB</td>
            </tr>
          </tfoot>
        </table>

        <p style="margin-top: 30px;">
            We will contact you shortly to confirm the delivery details.
        </p>

        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          Tire Select - Premium Tires at Best Prices
        </p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Order confirmation email sent to', to)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}
