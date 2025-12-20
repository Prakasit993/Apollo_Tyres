export interface Product {
    id: string
    brand: string
    model: string
    width: number
    aspect_ratio: number
    construction: 'R' | 'D' | 'B'
    rim: number
    price: number
    stock: number
    image_url: string
    featured?: boolean
}

export const products: Product[] = [
    {
        id: "p1",
        brand: "Apollo",
        model: "Amazer XP",
        width: 195,
        aspect_ratio: 65,
        construction: "R",
        rim: 15,
        price: 1800,
        stock: 20,
        image_url: "/placeholder-tire.png",
        featured: true
    },
    {
        id: "p2",
        brand: "Apollo",
        model: "Alnac 4G",
        width: 205,
        aspect_ratio: 55,
        construction: "R",
        rim: 16,
        price: 2200,
        stock: 16,
        image_url: "/placeholder-tire.png"
    },
    {
        id: "p3",
        brand: "Bridgestone",
        model: "Ecopia EP300",
        width: 185,
        aspect_ratio: 60,
        construction: "R",
        rim: 15,
        price: 2500,
        stock: 12,
        image_url: "/placeholder-tire.png"
    },
    {
        id: "p4",
        brand: "Michelin",
        model: "Primacy 4",
        width: 215,
        aspect_ratio: 55,
        construction: "R",
        rim: 17,
        price: 4500,
        stock: 8,
        image_url: "/placeholder-tire.png",
        featured: true
    },
    {
        id: "p5",
        brand: "Maxxis",
        model: "i-PRO",
        width: 195,
        aspect_ratio: 50,
        construction: "R",
        rim: 16,
        price: 1900,
        stock: 24,
        image_url: "/placeholder-tire.png"
    },
    {
        id: "p6",
        brand: "Yokohama",
        model: "Advan dB",
        width: 225,
        aspect_ratio: 45,
        construction: "R",
        rim: 18,
        price: 5200,
        stock: 4,
        image_url: "/placeholder-tire.png"
    },
    {
        id: "p7",
        brand: "Apollo",
        model: "Aspire 4G",
        width: 225,
        aspect_ratio: 50,
        construction: "R",
        rim: 17,
        price: 2800,
        stock: 10,
        image_url: "/placeholder-tire.png"
    },
    {
        id: "p8",
        brand: "Dunlop",
        model: "Enasave",
        width: 185,
        aspect_ratio: 65,
        construction: "R",
        rim: 14,
        price: 1600,
        stock: 8,
        image_url: "/placeholder-tire.png"
    },
    // Add more as needed to reach 12
    {
        id: "p9",
        brand: "Goodyear",
        model: "Assurance",
        width: 205,
        aspect_ratio: 60,
        construction: "R",
        rim: 16,
        price: 2900,
        stock: 15,
        image_url: "/placeholder-tire.png"
    },
    {
        id: "p10",
        brand: "Hankook",
        model: "Kinergy",
        width: 195,
        aspect_ratio: 55,
        construction: "R",
        rim: 15,
        price: 2100,
        stock: 20,
        image_url: "/placeholder-tire.png"
    },
    {
        id: "p11",
        brand: "Continental",
        model: "UltraContact",
        width: 215,
        aspect_ratio: 50,
        construction: "R",
        rim: 17,
        price: 3800,
        stock: 6,
        image_url: "/placeholder-tire.png"
    },
    {
        id: "p12",
        brand: "Dayton",
        model: "DT30",
        width: 205,
        aspect_ratio: 55,
        construction: "R",
        rim: 16,
        price: 1850,
        stock: 12,
        image_url: "/placeholder-tire.png"
    }
]
