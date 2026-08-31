'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="max-w-4xl mx-auto px-6 py-16 text-center text-gray-500">Loading...</div>
  }

  if (!session) return null

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {session.user.name}!</h1>
      <p className="text-gray-500 mb-6">{session.user.email}</p>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <p className="text-gray-600">
          You're logged in! This is your seller dashboard — soon you'll be able to post listings, manage your inventory, and see messages from buyers here.
        </p>
      </div>
    </div>
  )
}