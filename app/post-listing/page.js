'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const initialForm = {
  title: '',
  description: '',
  price: '',
  make: '',
  model: '',
  year: '',
  mileage: '',
  location: '',
  condition: 'Used',
  image: ''
}

export default function PostListingPage() {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setForm((previous) => ({
        ...previous,
        image: reader.result,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Something went wrong')
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:text-3xl">Post a vehicle listing</h1>
        <p className="text-gray-500 mb-8">List your car and reach buyers across Nigeria.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              placeholder="2021 Toyota Corolla"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              placeholder="Describe the car, highlights, condition and ownership history"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Price (₦)</label>
              <input
                type="number"
                required
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Condition</label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Certified">Certified</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Make</label>
              <input
                type="text"
                required
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Model</label>
              <input
                type="text"
                required
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Year</label>
              <input
                type="number"
                required
                min="1900"
                max="2100"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Mileage (km)</label>
              <input
                type="number"
                min="0"
                value={form.mileage}
                onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Location</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              placeholder="Lagos, Nigeria"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white"
            />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="mt-3 w-full h-48 object-cover rounded-lg border border-gray-200"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Posting listing...' : 'Post listing'}
          </button>
        </form>
      </div>
    </div>
  )
}
