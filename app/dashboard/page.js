'use client'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [listings, setListings] = useState([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [error, setError] = useState('')
  const [workingId, setWorkingId] = useState('')

  const loadListings = useCallback(async () => {
    try {
      const response = await fetch('/api/listings?mine=true')
      const data = await response.json()
      setError('')

      if (!response.ok) {
        setError(data.message || 'Unable to load your listings.')
        return
      }

      setListings(data.listings || [])
    } catch {
      setError('Unable to load your listings. Please try again.')
    } finally {
      setLoadingListings(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login')
    }
    if (status === 'authenticated') {
      Promise.resolve().then(loadListings)
    }
  }, [status, router, loadListings])

  const updateStatus = async (listing, nextStatus) => {
    setWorkingId(listing.id)
    setError('')

    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Unable to update this listing.')
        return
      }

      setListings((current) => current.map((item) => (
        item.id === listing.id ? { ...item, status: nextStatus } : item
      )))
    } catch {
      setError('Unable to update this listing. Please try again.')
    } finally {
      setWorkingId('')
    }
  }

  const deleteListing = async (listing) => {
    if (!window.confirm(`Delete "${listing.title}"? This cannot be undone.`)) return

    setWorkingId(listing.id)
    setError('')

    try {
      const response = await fetch(`/api/listings/${listing.id}`, { method: 'DELETE' })
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Unable to delete this listing.')
        return
      }

      setListings((current) => current.filter((item) => item.id !== listing.id))
    } catch {
      setError('Unable to delete this listing. Please try again.')
    } finally {
      setWorkingId('')
    }
  }

  if (status === 'loading' || (status === 'authenticated' && loadingListings)) {
    return <div className="max-w-4xl mx-auto px-6 py-16 text-center text-gray-500">Loading your dashboard...</div>
  }

  if (!session) return null

  const activeCount = listings.filter((listing) => listing.status === 'active').length
  const soldCount = listings.filter((listing) => listing.status === 'sold').length

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {session.user.name || 'Seller'}!</h1>
          <p className="text-gray-500">{session.user.email}</p>
        </div>
        <Link href="/post-listing" className="inline-flex justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          + Post a car
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 my-8">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Active listings</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Marked as sold</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{soldCount}</p>
        </div>
      </div>

      {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Your inventory</h2>
        <button onClick={loadListings} className="text-sm font-medium text-blue-600 hover:underline">
          Refresh
        </button>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <h3 className="font-semibold text-gray-800">No car listings yet</h3>
          <p className="mt-2 text-sm text-gray-500">Post your first car and manage it here.</p>
          <Link href="/post-listing" className="mt-5 inline-block font-semibold text-blue-600 hover:underline">Create a listing</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => {
            const image = listing.images?.[0] || '/cars/Black Toyota Camry 2019.jpg'
            const isWorking = workingId === listing.id

            return (
              <article key={listing.id} className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white sm:flex-row">
                <div className="relative h-48 sm:h-auto sm:w-56 sm:shrink-0">
                  <Image src={image} alt={listing.title} fill className="object-cover" unoptimized={image.startsWith('data:')} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-900">{listing.title}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${listing.status === 'sold' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                        {listing.status === 'sold' ? 'Sold' : 'Active'}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-blue-600">₦{Number(listing.price).toLocaleString()}</p>
                    <p className="mt-1 text-sm text-gray-500">{listing.year} · {listing.mileage.toLocaleString()} km · {listing.location}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/listings/${listing.id}`} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      View
                    </Link>
                    <button
                      onClick={() => updateStatus(listing, listing.status === 'sold' ? 'active' : 'sold')}
                      disabled={isWorking}
                      className="rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                    >
                      {listing.status === 'sold' ? 'Mark active' : 'Mark sold'}
                    </button>
                    <button
                      onClick={() => deleteListing(listing)}
                      disabled={isWorking}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
