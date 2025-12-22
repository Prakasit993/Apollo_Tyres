import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

// Helper to clean private key (handle newlines)
const getPrivateKey = () => {
    const key = process.env.GOOGLE_PRIVATE_KEY
    if (!key) return ''
    return key.replace(/\\n/g, '\n')
}

const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: getPrivateKey(),
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
})

export async function getSheetDoc() {
    if (!process.env.GOOGLE_SHEET_ID) {
        throw new Error("GOOGLE_SHEET_ID is missing from environment variables")
    }

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth)
    await doc.loadInfo()
    return doc
}

export async function getTransactionsSetup() {
    const doc = await getSheetDoc()

    // Try to find existing sheet or create new one
    let sheet = doc.sheetsByTitle['Transactions']
    if (!sheet) {
        try {
            sheet = await doc.addSheet({ title: 'Transactions' })
            await sheet.setHeaderRow([
                'Date',
                'Type', // "Income" or "Expense"
                'Category', // "Product Sale", "Rent", "Utility", etc.
                'Amount',
                'Description',
                'ReferenceID' // Order ID or manually entered ref
            ])
        } catch (e: any) {
            // If it failed because it already exists, just load it
            if (e.message && e.message.includes('already exists')) {
                await doc.loadInfo() // Refresh cache
                sheet = doc.sheetsByTitle['Transactions']
            } else {
                throw e
            }
        }
    }
    return sheet
}
