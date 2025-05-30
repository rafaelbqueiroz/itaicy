import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MobileBookingBar } from '@/components/sections/mobile-booking-bar';
import { useLanguage } from '@/hooks/use-language';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  interests: z.array(z.string()).min(1, 'Selecione pelo menos um interesse'),
  preferredDates: z.string().optional(),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contato() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      interests: [],
    },
  });

  const watchedInterests = watch('interests');

  const contactMutation = useMutation({
    mutationFn: (data: ContactFormData) =>
      apiRequest('POST', '/api/contact', data),
    onSuccess: () => {
      toast({
        title: 'Mensagem enviada!',
        description: 'Entraremos em contato em breve.',
      });
      reset();
      setStep(1);
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao enviar',
        description: error.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const interestOptions = [
    { id: 'pesca', label: 'Pesca Esportiva' },
    { id: 'ecoturismo', label: 'Ecoturismo' },
    { id: 'birdwatching', label: 'Birdwatching' },
    { id: 'gastronomia', label: 'Experiências Gastronômicas' },
    { id: 'day-use', label: 'Day Use' },
    { id: 'eventos', label: 'Eventos Corporativos' },
  ];

  const handleInterestChange = (interestId: string, checked: boolean) => {
    const currentInterests = watchedInterests || [];
    if (checked) {
      setValue('interests', [...currentInterests, interestId]);
    } else {
      setValue('interests', currentInterests.filter(id => id !== interestId));
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-sand-beige-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-river-slate-800 mb-4 sm:mb-6 leading-tight">
              Fale Conosco
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-river-slate-600 max-w-3xl mx-auto leading-relaxed">
              Estamos prontos para criar a experiência perfeita no Pantanal para você
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            {/* Contact Form */}
            <div>
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h2 className="playfair text-3xl font-bold mb-6 text-itaicy-charcoal">
                    Planeje Sua Experiência
                  </h2>
                  
                  {/* Progress Indicator */}
                  <div className="flex items-center mb-8">
                    {[1, 2, 3, 4].map((stepNumber) => (
                      <div key={stepNumber} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          step >= stepNumber 
                            ? 'bg-itaicy-primary text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {stepNumber}
                        </div>
                        {stepNumber < 4 && (
                          <div className={`h-1 w-12 mx-2 ${
                            step > stepNumber ? 'bg-itaicy-primary' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-itaicy-charcoal mb-4">
                          Informações Pessoais
                        </h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo *</Label>
                          <Input
                            id="name"
                            {...register('name')}
                            className="focus:ring-2 focus:ring-itaicy-primary focus:border-transparent"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail *</Label>
                          <Input
                            id="email"
                            type="email"
                            {...register('email')}
                            className="focus:ring-2 focus:ring-itaicy-primary focus:border-transparent"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                          <Input
                            id="phone"
                            type="tel"
                            {...register('phone')}
                            placeholder="(00) 00000-0000"
                            className="focus:ring-2 focus:ring-itaicy-primary focus:border-transparent"
                          />
                        </div>

                        <Button 
                          type="button" 
                          onClick={nextStep}
                          className="w-full bg-itaicy-primary hover:bg-itaicy-primary/90 text-white"
                        >
                          Próximo
                        </Button>
                      </div>
                    )}

                    {/* Step 2: Interests */}
                    {step === 2 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-itaicy-charcoal mb-4">
                          Interesses
                        </h3>
                        
                        <div className="space-y-4">
                          <Label>Quais experiências te interessam? *</Label>
                          {interestOptions.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={option.id}
                                checked={(watchedInterests || []).includes(option.id)}
                                onCheckedChange={(checked) => 
                                  handleInterestChange(option.id, checked as boolean)
                                }
                              />
                              <Label htmlFor={option.id} className="text-gray-700">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                          {errors.interests && (
                            <p className="text-red-500 text-sm">{errors.interests.message}</p>
                          )}
                        </div>

                        <div className="flex gap-4">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={prevStep}
                            className="flex-1 border-itaicy-primary text-itaicy-primary hover:bg-itaicy-primary hover:text-white"
                          >
                            Anterior
                          </Button>
                          <Button 
                            type="button" 
                            onClick={nextStep}
                            className="flex-1 bg-itaicy-primary hover:bg-itaicy-primary/90 text-white"
                          >
                            Próximo
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Dates */}
                    {step === 3 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-itaicy-charcoal mb-4">
                          Datas Preferidas
                        </h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="preferredDates">Quando gostaria de visitar?</Label>
                          <Input
                            id="preferredDates"
                            {...register('preferredDates')}
                            placeholder="Ex: Janeiro 2024, férias de julho, flexível..."
                            className="focus:ring-2 focus:ring-itaicy-primary focus:border-transparent"
                          />
                          <p className="text-gray-500 text-sm">
                            Informe suas datas preferidas ou período de interesse
                          </p>
                        </div>

                        <div className="flex gap-4">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={prevStep}
                            className="flex-1 border-itaicy-primary text-itaicy-primary hover:bg-itaicy-primary hover:text-white"
                          >
                            Anterior
                          </Button>
                          <Button 
                            type="button" 
                            onClick={nextStep}
                            className="flex-1 bg-itaicy-primary hover:bg-itaicy-primary/90 text-white"
                          >
                            Próximo
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Message */}
                    {step === 4 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-itaicy-charcoal mb-4">
                          Mensagem
                        </h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">Conte-nos mais sobre sua viagem ideal *</Label>
                          <Textarea
                            id="message"
                            {...register('message')}
                            rows={6}
                            placeholder="Descreva suas expectativas, número de pessoas, necessidades especiais ou qualquer outra informação importante..."
                            className="focus:ring-2 focus:ring-itaicy-primary focus:border-transparent"
                          />
                          {errors.message && (
                            <p className="text-red-500 text-sm">{errors.message.message}</p>
                          )}
                        </div>

                        <div className="flex gap-4">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={prevStep}
                            className="flex-1 border-itaicy-primary text-itaicy-primary hover:bg-itaicy-primary hover:text-white"
                          >
                            Anterior
                          </Button>
                          <Button 
                            type="submit"
                            disabled={contactMutation.isPending}
                            className="flex-1 bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white"
                          >
                            {contactMutation.isPending ? 'Enviando...' : 'Enviar Mensagem'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-lg border-0">
                <CardContent className="p-8">
                  <h3 className="playfair text-2xl font-bold mb-6 text-itaicy-charcoal">
                    Informações de Contato
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Phone className="w-6 h-6 text-itaicy-primary mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-itaicy-charcoal mb-1">Telefone</h4>
                        <p className="text-gray-600">+55 (65) 3000-0000</p>
                        <p className="text-gray-600">WhatsApp: +55 (65) 99999-0000</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="w-6 h-6 text-itaicy-primary mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-itaicy-charcoal mb-1">E-mail</h4>
                        <p className="text-gray-600">contato@itaicy.com.br</p>
                        <p className="text-gray-600">reservas@itaicy.com.br</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="w-6 h-6 text-itaicy-primary mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-itaicy-charcoal mb-1">Endereço</h4>
                        <p className="text-gray-600">
                          Estrada do Itaicy, s/n<br />
                          Pantanal, MT - Brasil<br />
                          CEP: 78000-000
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="w-6 h-6 text-itaicy-primary mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-itaicy-charcoal mb-1">Horário de Atendimento</h4>
                        <p className="text-gray-600">
                          Segunda a Sábado: 8h às 18h<br />
                          Domingo: 8h às 12h<br />
                          <span className="text-itaicy-primary font-medium">WhatsApp 24h</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-8">
                  <h3 className="playfair text-2xl font-bold mb-6 text-itaicy-charcoal">
                    Como Chegar
                  </h3>
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">
                    Oferecemos transfer do Aeroporto de Cuiabá até o lodge. 
                    O trajeto dura aproximadamente 2 horas pela estrada do Itaicy.
                  </p>
                  <Button className="w-full bg-itaicy-primary hover:bg-itaicy-primary/90 text-white">
                    Ver Mapa no Google Maps
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-itaicy-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="playfair text-4xl font-bold text-itaicy-charcoal mb-6">
              Perguntas Frequentes
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-itaicy-charcoal mb-3">
                  Qual o tempo de resposta?
                </h3>
                <p className="text-gray-600 text-sm">
                  Respondemos todas as mensagens em até 4 horas durante horário comercial.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-itaicy-charcoal mb-3">
                  Fazem orçamentos personalizados?
                </h3>
                <p className="text-gray-600 text-sm">
                  Sim! Criamos pacotes sob medida para cada grupo e necessidade específica.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-itaicy-charcoal mb-3">
                  Posso agendar uma visita?
                </h3>
                <p className="text-gray-600 text-sm">
                  Claro! Oferecemos day-use para conhecer nossas instalações antes da reserva.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-itaicy-charcoal mb-3">
                  Têm desconto para grupos?
                </h3>
                <p className="text-gray-600 text-sm">
                  Sim! Oferecemos condições especiais para grupos acima de 8 pessoas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
