import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { supabase, CMSService, MediaItem } from '@/lib/supabase';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  AlertCircle, 
  Upload, 
  Search, 
  Image as ImageIcon, 
  FileVideo, 
  File, 
  X, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Filter, 
  Grid3x3, 
  List, 
  ChevronLeft 
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Schema para edição de metadados da mídia
const mediaEditSchema = z.object({
  alt: z.string().optional(),
  caption: z.string().optional(),
});

type MediaEditFormValues = z.infer<typeof mediaEditSchema>;

// Componente para exibir o tipo de arquivo
const FileTypeIcon: React.FC<{ mimeType: string }> = ({ mimeType }) => {
  if (mimeType.startsWith('image/')) {
    return <ImageIcon className="h-5 w-5 text-blue-500" />;
  } else if (mimeType.startsWith('video/')) {
    return <FileVideo className="h-5 w-5 text-red-500" />;
  } else {
    return <File className="h-5 w-5 text-gray-500" />;
  }
};

// Componente para exibir o tamanho do arquivo formatado
const FileSize: React.FC<{ bytes: number }> = ({ bytes }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
  };

  return <span>{formatFileSize(bytes)}</span>;
};

// Componente principal da página de mídia
const CMSMedia: React.FC = () => {
  // Estados
  const [, navigate] = useLocation();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [user, setUser] = useState<any>(null);
  
  // Configuração do formulário de edição
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<MediaEditFormValues>({
    resolver: zodResolver(mediaEditSchema),
  });

  // Verifica autenticação
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/cms/login');
        return;
      }
      
      // Verifica se o usuário tem role de admin
      const { data: userRoleData, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (error || !userRoleData || userRoleData.role !== 'admin') {
        toast({
          title: 'Acesso negado',
          description: 'Você não tem permissão para acessar o CMS',
          variant: 'destructive'
        });
        await supabase.auth.signOut();
        navigate('/cms/login');
        return;
      }
      
      setUser(session.user);
    };
    
    checkAuth();
  }, [navigate]);

  // Carrega a biblioteca de mídia
  const loadMediaLibrary = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await CMSService.getMediaLibrary();
      setMediaItems(items);
      setFilteredItems(items);
    } catch (error) {
      console.error('Erro ao carregar biblioteca de mídia:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a biblioteca de mídia',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carrega a biblioteca na montagem do componente
  useEffect(() => {
    loadMediaLibrary();
  }, [loadMediaLibrary]);

  // Filtra itens quando o termo de busca ou filtro de tipo mudar
  useEffect(() => {
    let filtered = [...mediaItems];
    
    // Aplica filtro de tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => {
        const mimeType = item.mime_type || '';
        if (typeFilter === 'image') return mimeType.startsWith('image/');
        if (typeFilter === 'video') return mimeType.startsWith('video/');
        if (typeFilter === 'document') {
          return !mimeType.startsWith('image/') && !mimeType.startsWith('video/');
        }
        return true;
      });
    }
    
    // Aplica termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        (item.alt && item.alt.toLowerCase().includes(term)) || 
        item.path.toLowerCase().includes(term)
      );
    }
    
    setFilteredItems(filtered);
  }, [mediaItems, searchTerm, typeFilter]);

  // Configuração do dropzone para upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    const newProgress: Record<string, number> = {};
    acceptedFiles.forEach(file => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(newProgress);
    
    try {
      // Upload de cada arquivo
      for (const file of acceptedFiles) {
        try {
          await CMSService.uploadMedia(file);
          
          // Atualiza progresso
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: 100
          }));
        } catch (error) {
          console.error(`Erro ao fazer upload de ${file.name}:`, error);
          toast({
            title: 'Erro de upload',
            description: `Não foi possível fazer upload de ${file.name}`,
            variant: 'destructive'
          });
        }
      }
      
      // Recarrega a biblioteca após uploads
      await loadMediaLibrary();
      
      toast({
        title: 'Upload concluído',
        description: `${acceptedFiles.length} arquivo(s) enviado(s) com sucesso`,
      });
    } catch (error) {
      console.error('Erro durante upload:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro durante o upload',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  }, [loadMediaLibrary]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
    },
    disabled: isUploading
  });

  // Edição de metadados
  const handleEdit = (item: MediaItem) => {
    setSelectedItem(item);
    reset({ alt: item.alt || '', caption: item.caption || '' });
    setIsEditDialogOpen(true);
  };

  const onEditSubmit = async (data: MediaEditFormValues) => {
    if (!selectedItem) return;
    
    try {
      // Atualiza metadados no Supabase
      const { error } = await supabase
        .from('media_library')
        .update({
          alt: data.alt,
          caption: data.caption
        })
        .eq('id', selectedItem.id);
      
      if (error) throw error;
      
      // Atualiza estado local
      setMediaItems(prev => prev.map(item => {
        if (item.id === selectedItem.id) {
          return { ...item, alt: data.alt || null, caption: data.caption || null };
        }
        return item;
      }));
      
      toast({
        title: 'Sucesso',
        description: 'Metadados atualizados com sucesso',
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar metadados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar os metadados',
        variant: 'destructive'
      });
    }
  };

  // Exclusão de arquivo
  const handleDelete = (item: MediaItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    
    try {
      // Remove arquivo do storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([selectedItem.path]);
      
      if (storageError) throw storageError;
      
      // Remove registro da biblioteca
      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', selectedItem.id);
      
      if (dbError) throw dbError;
      
      // Atualiza estado local
      setMediaItems(prev => prev.filter(item => item.id !== selectedItem.id));
      
      toast({
        title: 'Sucesso',
        description: 'Arquivo excluído com sucesso',
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o arquivo',
        variant: 'destructive'
      });
    }
  };

  // Renderiza a lista de itens em modo grid
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredItems.map(item => {
          const publicUrl = CMSService.getPublicUrl(item.path);
          const isImage = (item.mime_type || '').startsWith('image/');
          const isVideo = (item.mime_type || '').startsWith('video/');
          
          return (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {isImage ? (
                  <img 
                    src={publicUrl} 
                    alt={item.alt || 'Media item'} 
                    className="w-full h-full object-cover"
                  />
                ) : isVideo ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <FileVideo className="h-12 w-12 text-gray-400" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <File className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 flex items-center justify-center gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate" title={item.alt || item.path}>
                  {item.alt || item.path.split('/').pop()}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <FileTypeIcon mimeType={item.mime_type || ''} />
                    <span className="ml-1">
                      {(item.mime_type || '').split('/')[1]?.toUpperCase() || 'FILE'}
                    </span>
                  </div>
                  {item.size && (
                    <span className="text-xs text-muted-foreground">
                      <FileSize bytes={item.size} />
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Renderiza a lista de itens em modo lista
  const renderListView = () => {
    return (
      <div className="space-y-2">
        {filteredItems.map(item => {
          const publicUrl = CMSService.getPublicUrl(item.path);
          const isImage = (item.mime_type || '').startsWith('image/');
          
          return (
            <div 
              key={item.id} 
              className="flex items-center p-2 hover:bg-gray-50 rounded-md border"
            >
              <div className="w-12 h-12 mr-3 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                {isImage ? (
                  <img 
                    src={publicUrl} 
                    alt={item.alt || 'Media item'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileTypeIcon mimeType={item.mime_type || ''} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" title={item.alt || item.path}>
                  {item.alt || item.path.split('/').pop()}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="mr-2">
                    {(item.mime_type || '').split('/')[1]?.toUpperCase() || 'FILE'}
                  </span>
                  {item.size && (
                    <span>
                      <FileSize bytes={item.size} />
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50" 
                  onClick={() => handleDelete(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/cms/home')}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <h1 className="text-xl font-bold">Biblioteca de Mídia</h1>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Upload area */}
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
            } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              {isDragActive ? (
                <p className="text-lg font-medium">Solte os arquivos aqui...</p>
              ) : (
                <>
                  <p className="text-lg font-medium">Arraste e solte arquivos aqui, ou clique para selecionar</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Suporta imagens, vídeos e documentos (até 50MB)
                  </p>
                </>
              )}
            </div>
          </div>
          
          {/* Upload progress */}
          {isUploading && Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4 p-4 border rounded-lg bg-white">
              <h3 className="text-sm font-medium mb-2">Fazendo upload...</h3>
              <div className="space-y-3">
                {Object.entries(uploadProgress).map(([filename, progress]) => (
                  <div key={filename} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="truncate max-w-md">{filename}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Filters and search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 mb-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou alt text"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="image">Imagens</SelectItem>
                  <SelectItem value="video">Vídeos</SelectItem>
                  <SelectItem value="document">Documentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={loadMediaLibrary}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Atualizar'
                )}
              </Button>
            </div>
          </div>
          
          {/* Media items count */}
          <div className="text-sm text-muted-foreground mb-4">
            {filteredItems.length} item(s) encontrado(s)
            {searchTerm && ` para "${searchTerm}"`}
            {typeFilter !== 'all' && ` do tipo ${typeFilter}`}
          </div>
          
          {/* Media items grid/list */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-40 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-white">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum item encontrado</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm || typeFilter !== 'all' ? (
                  'Tente ajustar seus filtros ou termos de busca'
                ) : (
                  'Faça upload de arquivos para começar a usar a biblioteca de mídia'
                )}
              </p>
            </div>
          ) : (
            <div className="bg-white border rounded-lg p-4">
              {viewMode === 'grid' ? renderGridView() : renderListView()}
            </div>
          )}
        </div>
      </main>
      
      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar metadados</DialogTitle>
            <DialogDescription>
              Atualize as informações deste arquivo
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <form onSubmit={handleSubmit(onEditSubmit)}>
              <div className="space-y-4 py-2">
                {/* Preview */}
                <div className="flex justify-center mb-4">
                  {(selectedItem.mime_type || '').startsWith('image/') ? (
                    <img 
                      src={CMSService.getPublicUrl(selectedItem.path)} 
                      alt={selectedItem.alt || 'Preview'} 
                      className="max-h-40 rounded-md"
                    />
                  ) : (selectedItem.mime_type || '').startsWith('video/') ? (
                    <video 
                      src={CMSService.getPublicUrl(selectedItem.path)} 
                      controls 
                      className="max-h-40 rounded-md"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-40 w-40 bg-gray-100 rounded-md">
                      <FileTypeIcon mimeType={selectedItem.mime_type || ''} />
                    </div>
                  )}
                </div>
                
                {/* File info */}
                <div className="text-sm text-muted-foreground">
                  <p>Nome do arquivo: {selectedItem.path.split('/').pop()}</p>
                  <p>Tipo: {selectedItem.mime_type || 'Desconhecido'}</p>
                  {selectedItem.size && (
                    <p>Tamanho: <FileSize bytes={selectedItem.size} /></p>
                  )}
                </div>
                
                <Separator />
                
                {/* Form fields */}
                <div className="space-y-2">
                  <Label htmlFor="alt">Texto alternativo (alt)</Label>
                  <Input
                    id="alt"
                    placeholder="Descreva a imagem para acessibilidade"
                    {...register('alt')}
                    className={errors.alt ? 'border-red-500' : ''}
                  />
                  {errors.alt && (
                    <p className="text-red-500 text-xs mt-1">{errors.alt.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="caption">Legenda</Label>
                  <Input
                    id="caption"
                    placeholder="Legenda opcional para o arquivo"
                    {...register('caption')}
                    className={errors.caption ? 'border-red-500' : ''}
                  />
                  {errors.caption && (
                    <p className="text-red-500 text-xs mt-1">{errors.caption.message}</p>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!isDirty}
                >
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O arquivo será permanentemente removido.
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <>
              <div className="py-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Você está prestes a excluir: <strong>{selectedItem.alt || selectedItem.path.split('/').pop()}</strong>
                  </AlertDescription>
                </Alert>
                
                <p className="mt-4 text-sm text-muted-foreground">
                  Se este arquivo estiver sendo usado em algum lugar do site, os links serão quebrados.
                </p>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                >
                  Excluir permanentemente
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CMSMedia;
