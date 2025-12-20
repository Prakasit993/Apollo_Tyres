export interface TireSpecs {
    width: number
    aspect_ratio: number
    construction: 'R' | 'D' | 'B'
    rim: number
}

// Example: "195/65R15" -> { width: 195, aspect_ratio: 65, construction: 'R', rim: 15 }
export function parseTireSize(sizeStr: string): TireSpecs | null {
    const regex = /^(\d{3})\/(\d{2})([RDB])(\d{2})$/i
    const match = sizeStr.match(regex)

    if (!match) return null

    return {
        width: parseInt(match[1]),
        aspect_ratio: parseInt(match[2]),
        construction: match[3].toUpperCase() as 'R' | 'D' | 'B',
        rim: parseInt(match[4]),
    }
}
