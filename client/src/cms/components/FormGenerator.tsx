import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Save, X } from 'lucide-react';
import { getBlockSchema, getBlockFormConfig, type BlockType } from '../schemas';

interface FormGeneratorProps {
  blockType: BlockType;
  initialData: Record<string, any>;
  onSave: (data: Record<string, any>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function FormGenerator({ blockType, initialData, onSave, onCancel, isLoading }: FormGeneratorProps) {
  const schema = getBlockSchema(blockType);
  const config = getBlockFormConfig(blockType);
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData
  });

  const renderField = (fieldName: string, fieldConfig: any) => {
    const error = form.formState.errors[fieldName];
    
    switch (fieldConfig.type) {
      case 'text':
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName}>{fieldConfig.label}</Label>
            <Input
              id={fieldName}
              placeholder={fieldConfig.placeholder}
              {...form.register(fieldName)}
              className={error ? 'border-red-500' : ''}
            />
            {fieldConfig.description && (
              <p className="text-sm text-gray-500">{fieldConfig.description}</p>
            )}
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        );
        
      case 'textarea':
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName}>{fieldConfig.label}</Label>
            <Textarea
              id={fieldName}
              placeholder={fieldConfig.placeholder}
              rows={3}
              {...form.register(fieldName)}
              className={error ? 'border-red-500' : ''}
            />
            {fieldConfig.description && (
              <p className="text-sm text-gray-500">{fieldConfig.description}</p>
            )}
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        );
        
      case 'select':
        return (
          <div key={fieldName} className="space-y-2">
            <Label>{fieldConfig.label}</Label>
            <Select
              value={form.watch(fieldName)}
              onValueChange={(value) => form.setValue(fieldName, value)}
            >
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {fieldConfig.options?.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldConfig.description && (
              <p className="text-sm text-gray-500">{fieldConfig.description}</p>
            )}
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        );
        
      case 'array':
        const arrayValue = form.watch(fieldName) || [];
        return (
          <div key={fieldName} className="space-y-2">
            <Label>{fieldConfig.label}</Label>
            {fieldConfig.description && (
              <p className="text-sm text-gray-500">{fieldConfig.description}</p>
            )}
            <div className="space-y-2">
              {arrayValue.map((item: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newArray = [...arrayValue];
                      newArray[index] = e.target.value;
                      form.setValue(fieldName, newArray);
                    }}
                    placeholder={fieldConfig.placeholder}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newArray = arrayValue.filter((_: any, i: number) => i !== index);
                      form.setValue(fieldName, newArray);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  form.setValue(fieldName, [...arrayValue, '']);
                }}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar item
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  const onSubmit = (data: any) => {
    onSave(data);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              Editando: {blockType}
            </CardTitle>
            <Badge variant="secondary" className="mt-1">
              {form.formState.isValid ? 'Válido' : 'Requer correção'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {Object.entries(config).map(([fieldName, fieldConfig]) =>
            renderField(fieldName, fieldConfig)
          )}
          
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isValid}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}