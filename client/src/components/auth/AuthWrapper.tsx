import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [sendingLink, setSendingLink] = useState(false);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        toast({ title: 'Login realizado com sucesso!' });
        navigate('/cms');
      }
      
      if (event === 'SIGNED_OUT') {
        toast({ title: 'Logout realizado' });
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingLink(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/cms`
        }
      });

      if (error) throw error;

      toast({
        title: 'Link enviado!',
        description: 'Verifique seu email para acessar o CMS.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro no envio',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSendingLink(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Páginas que requerem autenticação
  const protectedRoutes = ['/cms'];
  const isProtectedRoute = protectedRoutes.some(route => location.startsWith(route));

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  // Se não está autenticado e está tentando acessar rota protegida
  if (!user && isProtectedRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Acesso ao CMS</CardTitle>
            <CardDescription>
              Faça login para gerenciar o conteúdo do Itaicy Pantanal Eco Lodge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMagicLink} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={sendingLink}
              >
                <Mail className="w-4 h-4 mr-2" />
                {sendingLink ? 'Enviando...' : 'Enviar Link de Acesso'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se está autenticado e em rota CMS, adicionar botão de logout
  if (user && isProtectedRoute) {
    return (
      <div className="min-h-screen">
        <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold">CMS - Itaicy Pantanal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sair
            </Button>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Renderizar normalmente para rotas públicas
  return <>{children}</>;
}