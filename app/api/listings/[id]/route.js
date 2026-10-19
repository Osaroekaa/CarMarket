import { prisma } from '../../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function GET(_req, { params }) {
  try {
    const { id } = await params
    const listing = await prisma.listing.findFirst({
      where: { id, status: 'active' },
      include: {
        user: {
          select: { id: true, name: true, email: true, createdAt: true }
        }
      }
    })

    if (!listing) {
      return NextResponse.json({ message: 'Listing not found' }, { status: 404 })
    }

    return NextResponse.json({ listing })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Unable to load this listing' }, { status: 500 })
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'You must be logged in' }, { status: 401 })
    }

    const { id } = await params
    const { status } = await req.json()

    if (!['active', 'sold'].includes(status)) {
      return NextResponse.json({ message: 'Invalid listing status' }, { status: 400 })
    }

    const result = await prisma.listing.updateMany({
      where: { id, userId: session.user.id },
      data: { status }
    })

    if (result.count === 0) {
      return NextResponse.json({ message: 'Listing not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Listing updated' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Unable to update this listing' }, { status: 500 })
  }
}

export async function DELETE(_req, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'You must be logged in' }, { status: 401 })
    }

    const { id } = await params
    const result = await prisma.listing.deleteMany({
      where: { id, userId: session.user.id }
    })

    if (result.count === 0) {
      return NextResponse.json({ message: 'Listing not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Listing deleted' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Unable to delete this listing' }, { status: 500 })
  }
}
