'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [productId, setProductId] = useState<string>('')
  const router = useRouter()

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    if (productId.trim()) {
      router.push(`/dashboard/products/${productId}`)
    }
  }

  return (
    <div>
      
    </div>
  )
}