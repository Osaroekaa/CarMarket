'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { carsData } from '../../../lib/carsData'

export default function ListingDetail() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const sampleCar = carsData.find((item) => String(item.id) === String(id))
  const [car, setCar] = useState(sampleCar || null)
  const [loading, setLoading] = useState(!sampleCar)
  const [error, setError] = useState('')

  useEffect(() => {
    if (sampleCar || !id) return

    async function loadListing() {
      try {
        const response = await fetch(`/api/listings/${encodeURIComponent(id)}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'This listing could not be found.')
          return
        }

        setCar({
          ...data.listing,
          image: data.listing.images?.[0] || '/cars/Black Toyota Camry 2019.jpg'
        })
      } catch {
        setError('Unable to load this listing. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadListing()
  }, [id, sampleCar])

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-20 text-center text-gray-500">Loading listing...</div>
  }

  if (!car) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Car not found</h1>
        {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
        <Link href="/listings" className="text-blue-600 hover:underline">Back to listings</Link>
      </div>
    )
  }

  const seller = car.user
  const sellerInitials = seller?.name
    ? seller.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    : 'S'

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/listings" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
        ← Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2">
          <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-6 sm:h-96">
            <Image src={car.image} alt={car.title} fill className="object-cover" unoptimized={car.image.startsWith('data:')} />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-4">Specifications</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {[
              ['Year', car.year],
              ['Mileage', `${Number(car.mileage).toLocaleString()} km`],
              ['Condition', car.condition],
              ['Make', car.make],
              ['Model', car.model],
              ['Location', car.location]
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="font-bold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-600 leading-relaxed">{car.description}</p>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{car.title}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-6">₦{Number(car.price).toLocaleString()}</p>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-2">Seller</p>
            {seller ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                    {sellerInitials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{seller.name || 'CarMarket seller'}</p>
                    <p className="text-xs text-gray-500">
                      Member since {new Date(seller.createdAt).getFullYear()}
                    </p>
                  </div>
                </div>
                <a
                  href={`mailto:${encodeURIComponent(seller.email)}?subject=${encodeURIComponent(`Question about ${car.title}`)}`}
                  className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700"
                >
                  Email seller
                </a>
                <p className="mt-3 break-all text-center text-sm text-gray-500">{seller.email}</p>
              </>
            ) : (
              <p className="text-sm text-gray-600">
                This is a sample vehicle listing. Seller contact details are not available.
              </p>
            )}
          </div>

          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
            Stay safe: inspect the car in person and verify its documents before making any payment.
          </div>
        </div>
      </div>
    </div>
  )
}
