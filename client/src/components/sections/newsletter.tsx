import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/use-language';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function Newsletter() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const subscriptionMutation = useMutation({
    mutationFn: (email: string) => 
      apiRequest('POST', '/api/newsletter/subscribe', { email }),
    onSuccess: () => {
      toast({
        title: 'Sucesso!',
        description: 'Você foi inscrito em nossa newsletter.',
      });
      setEmail('');
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao se inscrever.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira um e-mail válido.',
        variant: 'destructive',
      });
      return;
    }

    subscriptionMutation.mutate(email);
  };

  return (
    <section className="py-20 bg-[#064737]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h3 className="playfair text-3xl font-bold mb-4">
            Receba Novidades do Pantanal
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Fique por dentro das melhores épocas para visitar, novidades do lodge e dicas exclusivas de nossos guias especializados.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#C8860D] focus:outline-none"
              />
              <Button 
                type="submit"
                disabled={subscriptionMutation.isPending}
                className="bg-[#C8860D] hover:bg-[#C8860D]/90 text-white px-6 py-3 font-semibold rounded-lg"
              >
                {subscriptionMutation.isPending ? 'Enviando...' : 'Inscrever'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
