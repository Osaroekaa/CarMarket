'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        CarMarket
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/listings" className="text-gray-600 hover:text-blue-600 font-medium">
          Browse Cars
        </Link>

        {status === 'loading' ? null : session ? (
          <>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <span className="text-sm text-gray-500 hidden sm:inline">
              Hi, {session.user.name?.split(' ')[0]}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-red-600 border border-red-600 px-4 py-2 rounded-lg hover:bg-red-50 font-medium"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
              Sign Up
            </Link>
            <Link href="/post-listing" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium">
              + Post Car
            </Link>
            <Link href="/auth/login" className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}