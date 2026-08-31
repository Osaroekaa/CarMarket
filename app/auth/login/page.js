'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false
    })

    if (res?.error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h1>
      <p className="text-gray-500 mb-6">Log in to manage your listings</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            placeholder="Your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}
