'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { PrismaClient } from "@prisma/client"
import Image from 'next/image'

// Define the Todo type based on Prisma's generated types
type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
}

export default function Home() {
  const { data: session } = useSession()
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")

  useEffect(() => {
    if (session) {
      fetchTodos()
    }
  }, [session])

  const fetchTodos = async () => {
    const res = await fetch("/api/todos")
    const data = await res.json()
    setTodos(data)
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo })
    })
    const createdTodo = await res.json()
    setTodos([...todos, createdTodo])
    setNewTodo("")
  }

  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" })
    setTodos(todos.filter(todo => todo.id !== id))
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <button
          onClick={() => signIn("google")}
          className="px-6 py-3 border border-brown-300 rounded-lg text-brown-300 hover:bg-brown-300 hover:text-gray-900 transition duration-300"
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-brown-300 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 py-4 px-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brown-300">TODO</h1>
        <div className="flex items-center space-x-4">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <span className="text-brown-300">{session.user?.name}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Sign out
        </button>
      </header>

      {/* Main content */}
      <main className="flex-grow flex justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <form onSubmit={addTodo} className="mb-6">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo"
              className="shadow appearance-none border rounded w-full py-3 px-4 bg-gray-800 text-brown-300 leading-tight focus:outline-none focus:ring-2 focus:ring-brown-300"
            />
          </form>
          <ul className="space-y-3">
            {todos.map(todo => (
              <li key={todo.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                <span className={todo.completed ? "line-through text-gray-500" : "text-brown-300"}>
                  {todo.title}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition duration-300"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}