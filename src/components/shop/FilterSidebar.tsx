"use client"

import { Button } from "@/components/ui/button"
import { Search, RotateCcw, Car } from "lucide-react"
import { filterProducts } from "@/app/products/actions"
import { useActionState, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

const CAR_MODELS = [
    { name: "Toyota Yaris (Standard)", width: "185", aspect: "60", rim: "15" },
    { name: "Toyota Vios (Standard)", width: "185", aspect: "60", rim: "15" },
    { name: "Honda City (Standard)", width: "185", aspect: "55", rim: "16" },
    { name: "Honda Civic (FC/FK)", width: "215", aspect: "50", rim: "17" },
    { name: "Mazda 2", width: "185", aspect: "65", rim: "15" },
    { name: "Isuzu D-Max (Hi-Lander)", width: "265", aspect: "60", rim: "18" },
    { name: "Toyota Fortuner", width: "265", aspect: "60", rim: "18" },
    { name: "Ford Ranger (Wildtrak)", width: "265", aspect: "60", rim: "18" },
]

export function FilterSidebar() {
    const [state, formAction, isPending] = useActionState(filterProducts, null);
    const searchParams = useSearchParams()
    const router = useRouter()

    // Controlled state for bi-directional updates
    const [width, setWidth] = useState(searchParams.get('width') || '')
    const [aspect, setAspect] = useState(searchParams.get('aspect') || '')
    const [rim, setRim] = useState(searchParams.get('rim') || '')
    const [selectedCar, setSelectedCar] = useState(searchParams.get('car') || '')

    // Reset state when URL params change (e.g. on Reset button)
    useEffect(() => {
        setWidth(searchParams.get('width') || '')
        setAspect(searchParams.get('aspect') || '')
        setRim(searchParams.get('rim') || '')
        setSelectedCar(searchParams.get('car') || '')
    }, [searchParams])

    const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const carName = e.target.value
        setSelectedCar(carName)

        const car = CAR_MODELS.find(c => c.name === carName)
        if (car) {
            setWidth(car.width)
            setAspect(car.aspect)
            setRim(car.rim)
        } else {
            // Optional: Reset if "Select Car" (empty) is chosen? 
            // Better to keep existing values or let user clear them manually.
        }
    }

    const handleReset = () => {
        router.push('/products')
        setSelectedCar('') // Clear local state too
    }

    return (
        <aside className="w-full space-y-6 rounded-lg border border-neutral-700 bg-neutral-800 p-4 shadow-sm">
            <div className="space-y-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-500" />
                    FIND YOUR TIRES
                </h3>
                <p className="text-xs text-gray-400">Filter by size, brand, or vehicle.</p>
            </div>

            <form action={formAction} className="space-y-4" key={searchParams.toString()}>
                {/* Search by Car Model */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-2 text-gray-200">
                        <Car className="w-4 h-4 text-blue-500" /> Select Car Model
                    </label>
                    <select
                        name="carModel" // Not directly used in filter, but useful for UI state
                        value={selectedCar}
                        onChange={handleCarChange}
                        className="w-full px-3 py-2 text-sm border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-neutral-700 text-white"
                    >
                        <option value="">-- Choose Your Car --</option>
                        {CAR_MODELS.map((car) => (
                            <option key={car.name} value={car.name}>
                                {car.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="relative flex items-center py-2">
                    <div className="grow border-t border-gray-700"></div>
                    <span className="shrink-0 px-2 text-xs text-gray-500 font-medium uppercase">OR SEARCH MANUALLY</span>
                    <div className="grow border-t border-gray-700"></div>
                </div>

                {/* Brand Filter */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-200">Tire Brand</label>
                    <select
                        name="brand"
                        defaultValue={searchParams.get('brand') || ''}
                        className="w-full px-3 py-2 text-sm border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-neutral-700 text-white"
                    >
                        <option value="">All Brands</option>
                        <option value="Apollo">Apollo</option>
                        <option value="Bridgestone">Bridgestone</option>
                        <option value="Michelin">Michelin</option>
                        <option value="Maxxis">Maxxis</option>
                    </select>
                </div>

                {/* Specs - Controlled Components */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-200">Width</label>
                        <select
                            name="width"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            className="w-full px-2 py-2 text-sm border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-neutral-700 text-white"
                        >
                            <option value="">Any</option>
                            <option value="175">175</option>
                            <option value="185">185</option>
                            <option value="195">195</option>
                            <option value="205">205</option>
                            <option value="215">215</option>
                            <option value="265">265</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-200">Aspect</label>
                        <select
                            name="aspect"
                            value={aspect}
                            onChange={(e) => setAspect(e.target.value)}
                            className="w-full px-2 py-2 text-sm border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-neutral-700 text-white"
                        >
                            <option value="">Any</option>
                            <option value="50">50</option>
                            <option value="55">55</option>
                            <option value="60">60</option>
                            <option value="65">65</option>
                            <option value="70">70</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-200">Rim</label>
                        <select
                            name="rim"
                            value={rim}
                            onChange={(e) => setRim(e.target.value)}
                            className="w-full px-2 py-2 text-sm border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-neutral-700 text-white"
                        >
                            <option value="">Any</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                        </select>
                    </div>
                </div>

                {/* Price Range */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-200">Price Range</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            name="minPrice"
                            defaultValue={searchParams.get('min') || ''}
                            placeholder="Min"
                            className="w-full px-3 py-2 text-sm border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-neutral-700 text-white placeholder-gray-400"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="number"
                            name="maxPrice"
                            defaultValue={searchParams.get('max') || ''}
                            placeholder="Max"
                            className="w-full px-3 py-2 text-sm border border-neutral-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-neutral-700 text-white placeholder-gray-400"
                        />
                    </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                    <Button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white hover:bg-blue-500 font-bold border-none">
                        {isPending ? "SEARCHING..." : "APPLY FILTER"}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full gap-2 text-gray-400 hover:text-white hover:bg-neutral-700 border border-neutral-600"
                        onClick={handleReset}
                    >
                        <RotateCcw className="w-4 h-4" />
                        RESET
                    </Button>
                </div>
            </form>
        </aside>
    )
}
