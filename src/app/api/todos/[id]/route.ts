import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import prisma from '@/lib/prisma'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const todo = await prisma.todo.update({
    where: { id: params.id },
    data: { completed: true },
  })
  return NextResponse.json(todo)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.todo.delete({
    where: { id: params.id },
  })
  return new NextResponse(null, { status: 204 })
}