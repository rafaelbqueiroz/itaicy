import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus } from 'lucide-react';

interface BlockFormProps {
  block: any;
  onSave: (data: Record<string, any>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function BlockForm({ block, onSave, onCancel, isLoading }: BlockFormProps) {
  const [formData, setFormData] = useState(block.payload || {});

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  const addArrayItem = (path: string, defaultItem: any) => {
    const current = path.split('.').reduce((obj, key) => obj?.[key], formData) || [];
    updateField(path, [...current, defaultItem]);
  };

  const removeArrayItem = (path: string, index: number) => {
    const current = path.split('.').reduce((obj, key) => obj?.[key], formData) || [];
    updateField(path, current.filter((_: any, i: number) => i !== index));
  };

  const renderHeroVideoForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Título Principal</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Ex: Viva o Pantanal Autêntico"
        />
      </div>
      
      <div>
        <Label htmlFor="subtitle">Subtítulo</Label>
        <Textarea
          id="subtitle"
          value={formData.subtitle || ''}
          onChange={(e) => updateField('subtitle', e.target.value)}
          placeholder="Descrição do que oferecemos..."
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="videoUrl">URL do Vídeo</Label>
        <Input
          id="videoUrl"
          value={formData.videoUrl || ''}
          onChange={(e) => updateField('videoUrl', e.target.value)}
          placeholder="/hero/video.mp4"
        />
      </div>
      
      <Separator />
      
      <div>
        <Label>Botão Principal</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Input
            value={formData.ctaPrimary?.text || ''}
            onChange={(e) => updateField('ctaPrimary.text', e.target.value)}
            placeholder="Texto do botão"
          />
          <Input
            value={formData.ctaPrimary?.url || ''}
            onChange={(e) => updateField('ctaPrimary.url', e.target.value)}
            placeholder="/contato"
          />
        </div>
      </div>
    </div>
  );

  const renderSplitBlockForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image">Imagem</Label>
        <Input
          id="image"
          value={formData.image || ''}
          onChange={(e) => updateField('image', e.target.value)}
          placeholder="/path/to/image.jpg"
        />
      </div>
      
      <div>
        <Label htmlFor="label">Etiqueta</Label>
        <Input
          id="label"
          value={formData.label || ''}
          onChange={(e) => updateField('label', e.target.value)}
          placeholder="Ex: Lodge"
        />
      </div>
      
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Título da seção"
        />
      </div>
      
      <div>
        <Label>Pontos Destacados</Label>
        <div className="space-y-2">
          {(formData.bullets || []).map((bullet: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={bullet}
                onChange={(e) => {
                  const newBullets = [...(formData.bullets || [])];
                  newBullets[index] = e.target.value;
                  updateField('bullets', newBullets);
                }}
                placeholder="Ponto destacado"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeArrayItem('bullets', index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('bullets', '')}
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Ponto
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <Label>Call-to-Action</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Input
            value={formData.cta?.text || ''}
            onChange={(e) => updateField('cta.text', e.target.value)}
            placeholder="Texto do botão"
          />
          <Input
            value={formData.cta?.url || ''}
            onChange={(e) => updateField('cta.url', e.target.value)}
            placeholder="/link"
          />
        </div>
      </div>
    </div>
  );

  const renderStatsGridForm = () => (
    <div className="space-y-4">
      <Label>Estatísticas</Label>
      <div className="space-y-3">
        {(formData.stats || []).map((stat: any, index: number) => (
          <div key={index} className="grid grid-cols-3 gap-2 p-3 border rounded">
            <Input
              value={stat.value || ''}
              onChange={(e) => {
                const newStats = [...(formData.stats || [])];
                newStats[index] = { ...stat, value: e.target.value };
                updateField('stats', newStats);
              }}
              placeholder="4.700+"
            />
            <Input
              value={stat.label || ''}
              onChange={(e) => {
                const newStats = [...(formData.stats || [])];
                newStats[index] = { ...stat, label: e.target.value };
                updateField('stats', newStats);
              }}
              placeholder="Descrição"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeArrayItem('stats', index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addArrayItem('stats', { value: '', label: '' })}
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar Estatística
        </Button>
      </div>
    </div>
  );

  const renderGenericForm = () => (
    <div>
      <Label>Dados do Bloco (JSON)</Label>
      <Textarea
        value={JSON.stringify(formData, null, 2)}
        onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            setFormData(parsed);
          } catch (error) {
            // Ignora erros de parsing durante a edição
          }
        }}
        rows={10}
        className="font-mono text-sm"
      />
    </div>
  );

  const renderFormContent = () => {
    switch (block.type) {
      case 'hero-video':
        return renderHeroVideoForm();
      case 'split-block':
        return renderSplitBlockForm();
      case 'stats-grid':
        return renderStatsGridForm();
      default:
        return renderGenericForm();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{block.type}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">Posição {block.position}</Badge>
              <Badge variant={block.published ? 'default' : 'secondary'}>
                {block.published ? 'Publicado' : 'Rascunho'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {renderFormContent()}
        
        <div className="flex gap-2 pt-4">
          <Button onClick={() => onSave(formData)} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}