import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, Plus, Trash2, Upload, Save, Eye } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { CMSService, MediaItem } from '@/lib/supabase';

// Importa schemas dos blocos
import { getSchemaForBlockType } from '@/cms/schemas';

// Interface para o componente BlockForm
interface BlockFormProps {
  block: {
    id: string;
    type: string;
    payload: Record<string, any>;
    published: Record<string, any> | null;
  };
  onSave: (payload: Record<string, any>) => void;
  onPublish: () => void;
}

// Componente para seleção de mídia
const MediaSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega a biblioteca de mídia
  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const items = await CMSService.getMediaLibrary();
      setMedia(items);
    } catch (error) {
      console.error('Error loading media:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a biblioteca de mídia',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega a mídia quando o seletor é aberto
  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <div className="flex items-center space-x-2">
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="URL da mídia ou selecione da biblioteca"
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Selecionar
        </Button>
      </div>
      
      {value && (
        <div className="mt-2 rounded-md overflow-hidden border">
          {value.toLowerCase().endsWith('.mp4') || value.toLowerCase().endsWith('.webm') ? (
            <video src={value} controls className="max-w-full h-auto" />
          ) : (
            <img src={value} alt="Preview" className="max-w-full h-auto" />
          )}
        </div>
      )}
      
      {isOpen && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Biblioteca de Mídia</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {media.map((item) => (
                  <div 
                    key={item.id}
                    className={`cursor-pointer border rounded-md overflow-hidden transition-all ${
                      value === CMSService.getPublicUrl(item.path) ? 'ring-2 ring-primary' : 'hover:opacity-80'
                    }`}
                    onClick={() => {
                      onChange(CMSService.getPublicUrl(item.path));
                      setIsOpen(false);
                    }}
                  >
                    <img 
                      src={CMSService.getPublicUrl(item.path)} 
                      alt={item.alt || 'Media item'} 
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
                
                {media.length === 0 && (
                  <div className="col-span-3 p-8 text-center text-muted-foreground">
                    Nenhum item na biblioteca de mídia
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => window.open('/cms/media', '_blank')}>
              Gerenciar Biblioteca
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

// Componente para arrays de itens (features, testimonials, etc.)
const ArrayField: React.FC<{
  fields: any[];
  name: string;
  control: any;
  label: string;
  schema: z.ZodType<any>;
}> = ({ fields, name, control, label, schema }) => {
  const { append, remove, move } = useFieldArray({
    control,
    name
  });

  // Extrai o schema do item do array
  const getItemSchema = () => {
    // Assume que o schema é um ZodArray e extrai o tipo do item
    if (schema instanceof z.ZodArray) {
      const itemSchema = schema._def.type;
      if (itemSchema instanceof z.ZodObject) {
        return itemSchema;
      }
    }
    // Fallback para um objeto vazio
    return z.object({});
  };

  const itemSchema = getItemSchema();
  const shape = itemSchema.shape || {};

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const defaultValues = {};
            Object.keys(shape).forEach(key => {
              defaultValues[key] = '';
            });
            append(defaultValues);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
      
      {fields.length === 0 ? (
        <div className="text-center p-4 border rounded-md text-muted-foreground">
          Nenhum item adicionado
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Item {index + 1}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(shape).map(([key, fieldSchema]) => {
                  const fieldType = getFieldType(fieldSchema);
                  return (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`${name}.${index}.${key}`}>
                        {formatFieldName(key)}
                      </Label>
                      
                      {renderField({
                        fieldType,
                        name: `${name}.${index}.${key}`,
                        control,
                        schema: fieldSchema
                      })}
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter>
                <div className="flex space-x-2">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => move(index, index - 1)}
                    >
                      Mover para cima
                    </Button>
                  )}
                  {index < fields.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => move(index, index + 1)}
                    >
                      Mover para baixo
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Função para determinar o tipo de campo com base no schema Zod
const getFieldType = (schema: z.ZodTypeAny): string => {
  if (schema instanceof z.ZodString) {
    if (schema._def.checks) {
      const hasMinLength = schema._def.checks.some(check => check.kind === 'min' && check.value > 100);
      if (hasMinLength) return 'textarea';
    }
    return 'text';
  }
  if (schema instanceof z.ZodNumber) return 'number';
  if (schema instanceof z.ZodBoolean) return 'checkbox';
  if (schema instanceof z.ZodEnum) return 'select';
  if (schema instanceof z.ZodArray) return 'array';
  if (schema instanceof z.ZodObject) return 'object';
  return 'text'; // Fallback
};

// Função para formatar nomes de campos
const formatFieldName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, ' $1') // Insere espaço antes de cada letra maiúscula
    .replace(/^./, str => str.toUpperCase()) // Primeira letra maiúscula
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Espaço entre camelCase
    .replace(/_/g, ' ') // Substitui underscores por espaços
    .trim();
};

// Função para renderizar o campo apropriado com base no tipo
const renderField = ({ fieldType, name, control, schema }: { 
  fieldType: string, 
  name: string, 
  control: any, 
  schema: z.ZodTypeAny 
}) => {
  switch (fieldType) {
    case 'text':
      return (
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Input
                {...field}
                value={field.value || ''}
                className={fieldState.error ? 'border-red-500' : ''}
              />
              {fieldState.error && (
                <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      );
      
    case 'textarea':
      return (
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Textarea
                {...field}
                value={field.value || ''}
                className={fieldState.error ? 'border-red-500' : ''}
                rows={5}
              />
              {fieldState.error && (
                <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      );
      
    case 'number':
      return (
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Input
                {...field}
                type="number"
                value={field.value === undefined ? '' : field.value}
                onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                className={fieldState.error ? 'border-red-500' : ''}
              />
              {fieldState.error && (
                <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      );
      
    case 'checkbox':
      return (
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id={name}
              />
              {fieldState.error && (
                <p className="text-red-500 text-xs">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      );
      
    case 'select':
      if (schema instanceof z.ZodEnum) {
        const options = schema._def.values;
        return (
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={fieldState.error ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {formatFieldName(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        );
      }
      return null;
      
    case 'array':
      return (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <ArrayField
              fields={field.value || []}
              name={name}
              control={control}
              label={formatFieldName(name)}
              schema={schema}
            />
          )}
        />
      );
      
    // Casos especiais para campos de mídia
    case 'imageSrc':
    case 'videoSrc':
    case 'backgroundImage':
    case 'coverImage':
      return (
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <MediaSelector
                value={field.value || ''}
                onChange={field.onChange}
                label={formatFieldName(name)}
              />
              {fieldState.error && (
                <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      );
      
    default:
      return (
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Input
                {...field}
                value={field.value || ''}
                className={fieldState.error ? 'border-red-500' : ''}
              />
              {fieldState.error && (
                <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      );
  }
};

// Componente principal BlockForm
export const BlockForm: React.FC<BlockFormProps> = ({ block, onSave, onPublish }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  
  // Obtém o schema para o tipo de bloco
  const schema = getSchemaForBlockType(block.type);
  
  // Configura o formulário com react-hook-form
  const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: block.payload || {},
  });
  
  // Reseta o formulário quando o bloco muda
  useEffect(() => {
    reset(block.payload || {});
  }, [block.id, reset, block.payload]);
  
  // Manipula o envio do formulário
  const onSubmit = async (data: Record<string, any>) => {
    setIsLoading(true);
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving block:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manipula a publicação do bloco
  const handlePublish = async () => {
    setIsLoading(true);
    try {
      await onPublish();
    } catch (error) {
      console.error('Error publishing block:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível publicar o bloco',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Se não houver schema para o tipo de bloco
  if (!schema) {
    return (
      <div className="p-4 border rounded-md bg-amber-50 text-amber-800">
        <p>Não foi possível encontrar um schema para o tipo de bloco: <strong>{block.type}</strong></p>
        <p className="text-sm mt-2">Entre em contato com o administrador do sistema.</p>
      </div>
    );
  }

  // Organiza os campos em abas
  const contentFields: string[] = [];
  const styleFields: string[] = [];
  const seoFields: string[] = [];
  
  // Categoriza os campos
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    
    Object.keys(shape).forEach(key => {
      if (key.includes('color') || key.includes('style') || key.includes('align') || key.includes('size') || key.includes('padding') || key.includes('margin') || key.includes('background')) {
        styleFields.push(key);
      } else if (key.includes('meta') || key.includes('seo') || key.includes('title') || key.includes('description') || key.includes('keywords')) {
        seoFields.push(key);
      } else {
        contentFields.push(key);
      }
    });
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          {styleFields.length > 0 && (
            <TabsTrigger value="style">Estilo</TabsTrigger>
          )}
          {seoFields.length > 0 && (
            <TabsTrigger value="seo">SEO</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="content" className="space-y-6 pt-4">
          {contentFields.map(fieldName => {
            const fieldSchema = schema.shape[fieldName];
            const fieldType = fieldName.includes('image') || fieldName.includes('video') || fieldName === 'src' 
              ? fieldName.includes('video') ? 'videoSrc' : 'imageSrc'
              : getFieldType(fieldSchema);
            
            return (
              <div key={fieldName} className="space-y-2">
                <Label htmlFor={fieldName}>{formatFieldName(fieldName)}</Label>
                {renderField({
                  fieldType,
                  name: fieldName,
                  control,
                  schema: fieldSchema
                })}
              </div>
            );
          })}
        </TabsContent>
        
        {styleFields.length > 0 && (
          <TabsContent value="style" className="space-y-6 pt-4">
            {styleFields.map(fieldName => {
              const fieldSchema = schema.shape[fieldName];
              const fieldType = getFieldType(fieldSchema);
              
              return (
                <div key={fieldName} className="space-y-2">
                  <Label htmlFor={fieldName}>{formatFieldName(fieldName)}</Label>
                  {renderField({
                    fieldType,
                    name: fieldName,
                    control,
                    schema: fieldSchema
                  })}
                </div>
              );
            })}
          </TabsContent>
        )}
        
        {seoFields.length > 0 && (
          <TabsContent value="seo" className="space-y-6 pt-4">
            {seoFields.map(fieldName => {
              const fieldSchema = schema.shape[fieldName];
              const fieldType = getFieldType(fieldSchema);
              
              return (
                <div key={fieldName} className="space-y-2">
                  <Label htmlFor={fieldName}>{formatFieldName(fieldName)}</Label>
                  {renderField({
                    fieldType,
                    name: fieldName,
                    control,
                    schema: fieldSchema
                  })}
                </div>
              );
            })}
          </TabsContent>
        )}
      </Tabs>
      
      <div className="flex justify-end space-x-2 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset(block.payload || {})}
          disabled={!isDirty || isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!isDirty || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handlePublish}
          disabled={isLoading}
        >
          <Eye className="mr-2 h-4 w-4" />
          Publicar
        </Button>
      </div>
    </form>
  );
};
