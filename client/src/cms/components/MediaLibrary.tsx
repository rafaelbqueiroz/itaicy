import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Search, 
  Copy, 
  Trash2, 
  Image as ImageIcon, 
  Video, 
  File,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  path: string;
  alt: string;
  created_at: string;
}

interface MediaLibraryProps {
  onSelectMedia?: (url: string) => void;
  selectedUrl?: string;
}

export function MediaLibrary({ onSelectMedia, selectedUrl }: MediaLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar itens da biblioteca
  const { data: mediaItems = [], isLoading } = useQuery({
    queryKey: ['media-library', searchTerm, filter],
    queryFn: async () => {
      let query = supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('alt', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Upload de arquivo
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `media/${fileName}`;

      // Upload para Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Inserir registro na tabela
      const { data, error: insertError } = await supabase
        .from('media_library')
        .insert({
          path: publicUrl,
          alt: file.name.replace(/\.[^/.]+$/, '') // Remove extensão
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-library'] });
      toast({ title: 'Arquivo enviado com sucesso!' });
    },
    onError: (error) => {
      toast({
        title: 'Erro no upload',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Deletar item
  const deleteMutation = useMutation({
    mutationFn: async (item: MediaItem) => {
      // Extrair caminho do arquivo da URL
      const urlParts = item.path.split('/');
      const filePath = `media/${urlParts[urlParts.length - 1]}`;

      // Deletar do storage
      await supabase.storage.from('media').remove([filePath]);

      // Deletar do banco
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', item.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-library'] });
      toast({ title: 'Arquivo removido com sucesso!' });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
      event.target.value = '';
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast({ title: 'URL copiada!' });
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      toast({ title: 'Erro ao copiar URL', variant: 'destructive' });
    }
  };

  const getFileIcon = (path: string) => {
    if (path.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return ImageIcon;
    if (path.match(/\.(mp4|webm|ogg)$/i)) return Video;
    return File;
  };

  const filteredItems = mediaItems.filter(item => {
    if (filter === 'image') return item.path.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    if (filter === 'video') return item.path.match(/\.(mp4|webm|ogg)$/i);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Biblioteca de Mídia</h2>
        <Button onClick={() => fileInputRef.current?.click()}>
          <Upload className="w-4 h-4 mr-2" />
          Enviar Arquivo
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-1 border rounded-md">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'image', label: 'Imagens' },
            { key: 'video', label: 'Vídeos' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(key as typeof filter)}
              className="rounded-none first:rounded-l-md last:rounded-r-md"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid de Mídia */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-md animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredItems.map((item) => {
            const FileIcon = getFileIcon(item.path);
            const isSelected = selectedUrl === item.path;
            const isCopied = copiedUrl === item.path;
            
            return (
              <Card 
                key={item.id} 
                className={cn(
                  "group cursor-pointer transition-all hover:shadow-md",
                  isSelected && "ring-2 ring-blue-500"
                )}
                onClick={() => onSelectMedia?.(item.path)}
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-md">
                    {item.path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={item.path}
                        alt={item.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <FileIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Overlay com ações */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(item.path);
                        }}
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMutation.mutate(item);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-blue-500">
                          <Check className="w-3 h-3" />
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2">
                    <p className="text-xs text-gray-600 truncate" title={item.alt}>
                      {item.alt}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum arquivo encontrado</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
          >
            Enviar primeiro arquivo
          </Button>
        </div>
      )}

      {/* Input oculto para upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}