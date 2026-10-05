'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { carsData } from '../../../lib/carsData'

export default function ListingDetail() {
  const params = useParams()
  const car = carsData.find((c) => c.id === Number(params.id))

  if (!car) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Car not found</h1>
        <Link href="/listings" className="text-blue-600 hover:underline">Back to listings</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/listings" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
        ← Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Left: Image + specs */}
        <div className="lg:col-span-2">
          <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-6 sm:h-96">
            <Image src={car.image} alt={car.title} fill className="object-cover" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-4">Specifications</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Year</p>
              <p className="font-bold text-gray-800">{car.year}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Mileage</p>
              <p className="font-bold text-gray-800">{car.mileage.toLocaleString()} km</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Condition</p>
              <p className="font-bold text-gray-800">{car.condition}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Make</p>
              <p className="font-bold text-gray-800">{car.make}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Model</p>
              <p className="font-bold text-gray-800">{car.model}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Location</p>
              <p className="font-bold text-gray-800">{car.location}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-600 leading-relaxed">{car.description}</p>
        </div>

        {/* Right: Price + seller card */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{car.title}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-6">₦{car.price.toLocaleString()}</p>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-2">Seller</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                JO
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">John Okafor</p>
                <p className="text-xs text-gray-500">Member since 2023</p>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 mb-2">
              Send Message
            </button>
            <button className="w-full border border-blue-600 text-blue-600 py-2.5 rounded-xl font-semibold hover:bg-blue-50">
              Show Phone Number
            </button>
          </div>

          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
            🛡️ Stay safe — never pay before inspecting the car in person
          </div>
        </div>
      </div>
    </div>
  )
}