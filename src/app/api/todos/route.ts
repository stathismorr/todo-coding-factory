import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import prisma from '@/lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
  })
  return NextResponse.json(todos)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title } = await request.json()
  const todo = await prisma.todo.create({
    data: {
      title,
      userId: session.user.id,
    },
  })
  return NextResponse.json(todo)
}