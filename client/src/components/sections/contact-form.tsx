import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  description?: string;
  fields?: {
    nameField?: {
      enabled?: boolean;
      required?: boolean;
      label?: string;
      placeholder?: string;
    };
    emailField?: {
      enabled?: boolean;
      required?: boolean;
      label?: string;
      placeholder?: string;
    };
    phoneField?: {
      enabled?: boolean;
      required?: boolean;
      label?: string;
      placeholder?: string;
    };
    subjectField?: {
      enabled?: boolean;
      required?: boolean;
      label?: string;
      placeholder?: string;
      options?: {
        label: string;
        value: string;
      }[];
    };
    messageField?: {
      enabled?: boolean;
      required?: boolean;
      label?: string;
      placeholder?: string;
    };
  };
  submitButton?: {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  successMessage?: string;
  errorMessage?: string;
  settings?: {
    layout?: 'default' | 'image-left' | 'image-right' | 'image-background';
    image?: {
      url: string;
      alt?: string;
    };
    backgroundColor?: 'white' | 'light' | 'primary' | 'secondary';
    recipients?: {
      email: string;
      name?: string;
    }[];
    recaptcha?: boolean;
  };
}

const ContactForm: React.FC<ContactFormProps> = ({
  title,
  subtitle,
  description,
  fields = {},
  submitButton = { label: 'Enviar' },
  successMessage = 'Sua mensagem foi enviada com sucesso. Entraremos em contato em breve!',
  errorMessage = 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.',
  settings = {},
}) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const {
    nameField = { enabled: true, required: true, label: 'Nome' },
    emailField = { enabled: true, required: true, label: 'Email' },
    phoneField = { enabled: true, required: false, label: 'Telefone' },
    subjectField = { enabled: true, required: true, label: 'Assunto' },
    messageField = { enabled: true, required: true, label: 'Mensagem' },
  } = fields;
  
  const {
    layout = 'default',
    image,
    backgroundColor = 'white',
  } = settings;
  
  // Classes para o container principal baseado nas configurações
  const containerClasses = cn(
    "w-full py-12",
    backgroundColor === 'white' && "bg-white",
    backgroundColor === 'light' && "bg-gray-50",
    backgroundColor === 'primary' && "bg-primary text-primary-foreground",
    backgroundColor === 'secondary' && "bg-secondary text-secondary-foreground"
  );
  
  // Classes para o layout do formulário
  const layoutClasses = cn(
    "container mx-auto px-4",
    layout === 'default' && "max-w-2xl mx-auto",
    (layout === 'image-left' || layout === 'image-right') && "flex flex-col md:flex-row gap-8",
    layout === 'image-right' && "md:flex-row-reverse",
    layout === 'image-background' && "relative rounded-lg overflow-hidden"
  );
  
  // Validação do formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (nameField.enabled && nameField.required && !formState.name) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (emailField.enabled && emailField.required && !formState.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (emailField.enabled && formState.email && !/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (phoneField.enabled && phoneField.required && !formState.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    }
    
    if (subjectField.enabled && subjectField.required && !formState.subject) {
      newErrors.subject = 'Assunto é obrigatório';
    }
    
    if (messageField.enabled && messageField.required && !formState.message) {
      newErrors.message = 'Mensagem é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Manipulador de envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setFormStatus('submitting');
    
    try {
      // Simulação de envio de formulário
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Em um cenário real, aqui faria a chamada para a API
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formState,
      //     recipients: settings.recipients,
      //   }),
      // });
      
      // if (!response.ok) throw new Error('Falha ao enviar formulário');
      
      setFormStatus('success');
      setFormState({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setFormStatus('error');
    }
  };
  
  // Manipulador de alteração de campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Manipulador de alteração de select
  const handleSelectChange = (value: string) => {
    setFormState(prev => ({ ...prev, subject: value }));
    
    // Limpar erro quando o usuário seleciona um valor
    if (errors.subject) {
      setErrors(prev => ({ ...prev, subject: '' }));
    }
  };
  
  return (
    <section className={containerClasses}>
      {/* Imagem de fundo (se for layout de background) */}
      {layout === 'image-background' && image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={image.url}
            alt={image.alt || ''}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      
      <div className={layoutClasses}>
        {/* Imagem (se existir e não for background) */}
        {image && (layout === 'image-left' || layout === 'image-right') && (
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
              <Image
                src={image.url}
                alt={image.alt || ''}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
        
        {/* Formulário */}
        <div className={cn(
          (layout === 'image-left' || layout === 'image-right') ? "md:w-1/2" : "w-full",
          layout === 'image-background' && "relative z-10 bg-white/90 dark:bg-black/80 p-8 rounded-lg"
        )}>
          {/* Título e descrição */}
          {(title || subtitle || description) && (
            <div className="mb-8 text-center">
              {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
              {subtitle && <p className="text-xl mb-2">{subtitle}</p>}
              {description && <p className="text-gray-600">{description}</p>}
            </div>
          )}
          
          {/* Mensagens de status */}
          {formStatus === 'success' && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Sucesso!</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          
          {formStatus === 'error' && (
            <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          {/* Formulário */}
          {formStatus !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              {nameField.enabled && (
                <div>
                  <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>
                    {nameField.label || 'Nome'}
                    {nameField.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={nameField.placeholder}
                    value={formState.name}
                    onChange={handleChange}
                    className={errors.name ? "border-red-500" : ""}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
              )}
              
              {/* Email */}
              {emailField.enabled && (
                <div>
                  <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>
                    {emailField.label || 'Email'}
                    {emailField.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={emailField.placeholder}
                    value={formState.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              )}
              
              {/* Telefone */}
              {phoneField.enabled && (
                <div>
                  <Label htmlFor="phone" className={errors.phone ? "text-red-500" : ""}>
                    {phoneField.label || 'Telefone'}
                    {phoneField.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder={phoneField.placeholder}
                    value={formState.phone}
                    onChange={handleChange}
                    className={errors.phone ? "border-red-500" : ""}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
              )}
              
              {/* Assunto */}
              {subjectField.enabled && (
                <div>
                  <Label htmlFor="subject" className={errors.subject ? "text-red-500" : ""}>
                    {subjectField.label || 'Assunto'}
                    {subjectField.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  
                  {subjectField.options && subjectField.options.length > 0 ? (
                    <Select
                      value={formState.subject}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className={errors.subject ? "border-red-500" : ""}>
                        <SelectValue placeholder={subjectField.placeholder || "Selecione um assunto"} />
                      </SelectTrigger>
                      <SelectContent>
                        {subjectField.options.map((option, index) => (
                          <SelectItem key={`option-${index}`} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="subject"
                      name="subject"
                      placeholder={subjectField.placeholder}
                      value={formState.subject}
                      onChange={handleChange}
                      className={errors.subject ? "border-red-500" : ""}
                      aria-invalid={!!errors.subject}
                    />
                  )}
                  
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                  )}
                </div>
              )}
              
              {/* Mensagem */}
              {messageField.enabled && (
                <div>
                  <Label htmlFor="message" className={errors.message ? "text-red-500" : ""}>
                    {messageField.label || 'Mensagem'}
                    {messageField.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={messageField.placeholder}
                    value={formState.message}
                    onChange={handleChange}
                    className={cn(
                      errors.message ? "border-red-500" : "",
                      "min-h-32"
                    )}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>
              )}
              
              {/* Botão de envio */}
              <Button
                type="submit"
                variant={submitButton.variant || 'primary'}
                className="w-full"
                disabled={formStatus === 'submitting'}
              >
                {formStatus === 'submitting' ? 'Enviando...' : submitButton.label}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactForm; 