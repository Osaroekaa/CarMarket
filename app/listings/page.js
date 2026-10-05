'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { carsData, makes, locations } from '../../lib/carsData'

export default function Listings() {
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const filtered = carsData.filter((car) => {
    if (selectedMake && car.make !== selectedMake) return false
    if (selectedLocation && car.location !== selectedLocation) return false
    if (maxPrice && car.price > Number(maxPrice)) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 sm:px-6 sm:py-8 md:flex-row">
      <div className="w-full md:w-64 md:shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:sticky md:top-4">
          <h3 className="font-bold text-gray-800 mb-4">Filters</h3>
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">Make</label>
            <select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">All makes</option>
              {makes.map((make) => (<option key={make} value={make}>{make}</option>))}
            </select>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">Location</label>
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">All cities</option>
              {locations.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
            </select>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">Max Price (₦)</label>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="e.g. 20000000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button onClick={() => { setSelectedMake(''); setSelectedLocation(''); setMaxPrice(''); }} className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">
            Clear filters
          </button>
        </div>
      </div>

      <div className="min-w-0 flex-1">
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
                  <button className="w-full bg-white text-gray-900 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-100 transition-colors">
                    View Details
                  </button>
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