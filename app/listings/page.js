'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { carsData, makes, locations } from '../../lib/carsData'

function ListingsContent() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState(carsData)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadListings() {
      try {
        const response = await fetch('/api/listings')
        const data = await response.json()
        setError('')

        if (!response.ok) {
          setError(data.message || 'Unable to load listings.')
          return
        }

        const databaseListings = (data.listings || []).map((listing) => ({
          ...listing,
          image: listing.images?.[0] || '/cars/Black Toyota Camry 2019.jpg'
        }))

        setListings([...databaseListings, ...carsData])
      } catch {
        setError('Unable to load listings. Please try again.')
      }
    }

    loadListings()
  }, [])

  const filtered = listings.filter((car) => {
    const searchText = search.trim().toLowerCase()
    const matchesSearch = !searchText || [
      car.title,
      car.make,
      car.model,
      car.location,
      car.description
    ].some((value) => value?.toLowerCase().includes(searchText))

    if (!matchesSearch) return false
    if (selectedMake && car.make !== selectedMake) return false
    if (selectedLocation && car.location !== selectedLocation) return false
    if (maxPrice && car.price > Number(maxPrice)) return false
    return true
  })
  const availableMakes = [...new Set([...makes, ...listings.map((car) => car.make)])].filter(Boolean).sort()
  const availableLocations = [...new Set([...locations, ...listings.map((car) => car.location)])].filter(Boolean).sort()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 sm:px-6 sm:py-8 md:flex-row">
      <div className="w-full md:w-64 md:shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:sticky md:top-4">
          <h3 className="font-bold text-gray-800 mb-4">Filters</h3>
          <div className="mb-4">
            <label htmlFor="listing-search" className="text-sm text-gray-500 mb-1 block">Search</label>
            <input
              id="listing-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Make, model, location..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">Make</label>
            <select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">All makes</option>
              {availableMakes.map((make) => (<option key={make} value={make}>{make}</option>))}
            </select>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">Location</label>
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">All cities</option>
              {availableLocations.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
            </select>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">Max Price (₦)</label>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="e.g. 20000000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button onClick={() => { setSearch(''); setSelectedMake(''); setSelectedLocation(''); setMaxPrice(''); }} className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">
            Clear filters
          </button>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <p className="text-gray-500 mb-4">{filtered.length} cars found</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((car) => (
            <Link href={`/listings/${car.id}`} key={car.id}>
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-72 group">
                <Image
                  src={car.image}
                  alt={car.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized={car.image.startsWith('data:')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                    {car.condition}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="bg-black/60 backdrop-blur text-white text-sm font-bold px-3 py-1.5 rounded-full">
                    ₦{car.price.toLocaleString()}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg mb-1">{car.title}</h3>
                  <p className="text-gray-200 text-xs mb-3 line-clamp-1">
                    {car.description}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-white/20 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full">
                      {car.mileage.toLocaleString()} km
                    </span>
                    <span className="bg-white/20 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full">
                      {car.location}
                    </span>
                  </div>
                  <span className="block w-full bg-white text-center text-gray-900 font-semibold py-2.5 rounded-xl text-sm group-hover:bg-gray-100 transition-colors">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (<div className="text-center py-16 text-gray-400">No cars match your filters.</div>)}
      </div>
    </div>
  )
}

export default function Listings() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10 text-center text-gray-500">Loading listings...</div>}>
      <ListingsContent />
    </Suspense>
  )
}