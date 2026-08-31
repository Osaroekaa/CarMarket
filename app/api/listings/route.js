import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'You must be logged in' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, description, price, make, model, year, mileage, location, condition, image } = body

    if (!title || !price || !make || !model || !year || !location) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: Number(price),
        make,
        model,
        year: Number(year),
        mileage: Number(mileage) || 0,
        location,
        condition,
        images: image ? [image] : [],
        userId: session.user.id
      }
    })

    return NextResponse.json({ message: 'Listing created', listing }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}