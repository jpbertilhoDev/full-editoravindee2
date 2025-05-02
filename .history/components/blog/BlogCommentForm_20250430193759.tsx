"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from '@/components/ui/use-toast'

// Firebase imports
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface BlogCommentFormProps {
  postId: string
  postSlug: string
}

export default function BlogCommentForm({ postId, postSlug }: BlogCommentFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!name.trim() || !email.trim() || !content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos para enviar seu comentário.",
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Adicionar comentário ao Firestore
      await addDoc(collection(db, 'blogComments'), {
        name,
        email,
        content,
        postId,
        postSlug,
        date: new Date().toISOString().split('T')[0],
        approved: false // Comentários precisam ser aprovados por um administrador
      })
      
      // Limpar formulário
      setName('')
      setEmail('')
      setContent('')
      
      // Mostrar mensagem de sucesso
      toast({
        title: "Comentário enviado",
        description: "Seu comentário foi enviado com sucesso e será revisado antes de ser publicado.",
        variant: "default"
      })
    } catch (error) {
      console.error('Erro ao enviar comentário:', error)
      toast({
        title: "Erro ao enviar comentário",
        description: "Ocorreu um erro ao enviar seu comentário. Por favor, tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Deixe seu comentário</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Para comentar neste post, por favor preencha o formulário abaixo.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <label htmlFor="content" className="text-sm font-medium">
            Comentário
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="relative"
        >
          {isSubmitting && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </span>
          )}
          <span className={isSubmitting ? "opacity-0" : ""}>
            Enviar comentário
          </span>
        </Button>
        
        <p className="text-xs text-muted-foreground mt-2">
          * Seu comentário será revisado antes de ser publicado.
        </p>
      </form>
    </div>
  )
} 