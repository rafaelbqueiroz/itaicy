import { useState } from 'react'
import { useLanguage } from '@/hooks/use-language'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Loader2 } from 'lucide-react'

interface ContactFormProps {
  className?: string
}

interface FormData {
  name: string
  email: string
  message: string
}

const translations = {
  'pt-BR': {
    title: 'Envie uma mensagem',
    name: 'Nome',
    email: 'E-mail',
    message: 'Mensagem',
    send: 'Enviar mensagem',
    sending: 'Enviando...',
    success: 'Mensagem enviada com sucesso!',
    error: 'Ocorreu um erro. Tente novamente.',
  },
  'en-US': {
    title: 'Send a message',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send message',
    sending: 'Sending...',
    success: 'Message sent successfully!',
    error: 'An error occurred. Please try again.',
  },
  'es-ES': {
    title: 'Envía un mensaje',
    name: 'Nombre',
    email: 'Correo',
    message: 'Mensaje',
    send: 'Enviar mensaje',
    sending: 'Enviando...',
    success: '¡Mensaje enviado con éxito!',
    error: 'Ocurrió un error. Inténtalo de nuevo.',
  }
}

export function ContactForm({ className }: ContactFormProps) {
  const { language } = useLanguage()
  const content = translations[language] || translations['pt-BR']
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      setStatus('sending')
      
      // Simula envio - Substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Form data:', data)
      setStatus('success')
      reset()
      
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
    >
      <h2 className="font-playfair text-2xl font-semibold text-pantanal-green-900">
        {content.title}
      </h2>

      <div className="space-y-4">
        <Input
          {...register('name', { required: true })}
          placeholder={content.name}
          error={errors.name}
        />
        
        <Input
          {...register('email', {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          })}
          type="email"
          placeholder={content.email}
          error={errors.email}
        />
        
        <Textarea
          {...register('message', { required: true })}
          placeholder={content.message}
          rows={5}
          error={errors.message}
        />
      </div>

      <Button
        type="submit"
        disabled={status === 'sending'}
        className="w-full"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {content.sending}
          </>
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            {content.send}
          </>
        )}
      </Button>

      {status === 'success' && (
        <p className="text-sm text-green-600">{content.success}</p>
      )}
      
      {status === 'error' && (
        <p className="text-sm text-red-600">{content.error}</p>
      )}
    </form>
  )
}
