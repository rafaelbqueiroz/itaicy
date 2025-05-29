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
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-itaicy-primary rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 text-white">
              <h3 className="playfair text-3xl font-bold mb-4">
                {t('newsletter.title')}
              </h3>
              <p className="text-lg opacity-90 mb-8">
                {t('newsletter.description')}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder={t('newsletter.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-itaicy-charcoal focus:ring-2 focus:ring-itaicy-secondary focus:outline-none"
                />
                <Button 
                  type="submit"
                  disabled={subscriptionMutation.isPending}
                  className="w-full bg-itaicy-secondary hover:bg-itaicy-secondary/90 text-white py-3 font-semibold"
                >
                  {subscriptionMutation.isPending ? 'Inscrevendo...' : t('newsletter.subscribe')}
                </Button>
              </form>
            </div>
            
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Paisagem do Pantanal ao entardecer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
