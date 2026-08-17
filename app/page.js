import Link from 'next/link'
import Image from 'next/image'
import { carsData } from '../lib/carsData'

export default function Home() {
  const featured = [
    carsData.find(c => c.make === 'Toyota'),
    carsData.find(c => c.make === 'BMW'),
    carsData.find(c => c.make === 'Mercedes Benz'),
    carsData.find(c => c.make === 'Audi'),
    carsData.find(c => c.make === 'Lexus'),
    carsData.find(c => c.make === 'Honda' || c.make === 'Hyundai' || c.make === 'Kia'),
  ].filter(Boolean)

  return (
    <div>
      <div className="bg-blue-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Car in Nigeria</h1>
        <p className="text-blue-100 text-lg mb-8">Verified listings across Lagos, Abuja, Port Harcourt & more</p>
        <div className="max-w-2xl mx-auto flex gap-3 bg-white rounded-xl p-2">
          <input type="text" placeholder="Search by make, model, location..." className="flex-1 px-4 py-2 text-gray-700 outline-none rounded-lg"/>
          <Link href="/listings" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Search</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Listings</h2>
          <Link href="/listings" className="text-blue-600 hover:underline font-medium">View all ({carsData.length}) →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((car) => (
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
      </div>

      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          <div><div className="text-4xl font-bold mb-2">{carsData.length}+</div><div className="text-blue-100">Active listings</div></div>
          <div><div className="text-4xl font-bold mb-2">800+</div><div className="text-blue-100">Verified sellers</div></div>
          <div><div className="text-4xl font-bold mb-2">500+</div><div className="text-blue-100">Cars sold</div></div>
        </div>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-8 text-center">
        <p className="text-sm">© 2024 CarMarket Nigeria. All rights reserved.</p>
      </footer>
    </div>
  )
}