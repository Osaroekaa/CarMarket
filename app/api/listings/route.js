import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const mine = searchParams.get('mine') === 'true'

    if (mine) {
      const session = await getServerSession(authOptions)

      if (!session?.user?.id) {
        return NextResponse.json({ message: 'You must be logged in' }, { status: 401 })
      }

      const listings = await prisma.listing.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ listings })
    }

    const listings = await prisma.listing.findMany({
      where: { status: 'active' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ listings })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Unable to load listings' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'You must be logged in' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, price, make, model, year, mileage, location, condition, image } = body

    const numericPrice = Number(price)
    const numericYear = Number(year)
    const numericMileage = Number(mileage || 0)

    if (!title?.trim() || !description?.trim() || !make?.trim() || !model?.trim() || !location?.trim() || !condition) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    if (
      !Number.isFinite(numericPrice) || numericPrice <= 0 ||
      !Number.isInteger(numericYear) || numericYear < 1900 || numericYear > 2100 ||
      !Number.isFinite(numericMileage) || numericMileage < 0
    ) {
      return NextResponse.json({ message: 'Enter a valid price, year, and mileage' }, { status: 400 })
    }

    const listing = await prisma.listing.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        price: numericPrice,
        make: make.trim(),
        model: model.trim(),
        year: numericYear,
        mileage: numericMileage,
        location: location.trim(),
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