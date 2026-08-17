import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        CarMarket
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/listings" className="text-gray-600 hover:text-blue-600 font-medium">Browse Cars</Link>
        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
        <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">Sign Up</Link>
        <Link href="/login" className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium">Login</Link>
      </div>
    </nav>
  )
}