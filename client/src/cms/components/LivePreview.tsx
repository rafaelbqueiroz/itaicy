import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LivePreviewProps {
  pageSlug: string;
  previewToken?: string;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const viewportSizes = {
  desktop: { width: '100%', height: '100%', icon: Monitor },
  tablet: { width: '768px', height: '1024px', icon: Tablet },
  mobile: { width: '375px', height: '667px', icon: Smartphone }
};

export function LivePreview({ pageSlug, previewToken }: LivePreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Gerar token de preview único se não fornecido
  const token = previewToken || `preview_${Date.now()}`;
  
  // URL do preview com token
  const previewUrl = `/${pageSlug === 'home' ? '' : pageSlug}?preview=${token}`;

  // Subscrever ao canal de mudanças em tempo real
  useEffect(() => {
    if (!pageSlug) return;

    console.log(`🔴 Subscrevendo ao canal de preview para ${pageSlug}`);

    const channel = supabase
      .channel(`preview_${pageSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blocks',
          filter: `page_id=eq.${pageSlug}`
        },
        (payload) => {
          console.log('🔄 Mudança detectada no bloco:', payload);
          
          // Recarregar iframe quando houver mudanças
          if (iframeRef.current) {
            setRefreshKey(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      console.log(`🔴 Desinscrevendo do canal de preview para ${pageSlug}`);
      supabase.removeChannel(channel);
    };
  }, [pageSlug]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleOpenInNewTab = () => {
    window.open(previewUrl, '_blank');
  };

  const currentViewport = viewportSizes[viewport];
  const IconComponent = currentViewport.icon;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Preview ao Vivo</CardTitle>
          
          <div className="flex items-center gap-2">
            {/* Viewport Selector */}
            <div className="flex rounded-md border">
              {Object.entries(viewportSizes).map(([size, config]) => {
                const Icon = config.icon;
                return (
                  <Button
                    key={size}
                    variant={viewport === size ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewport(size as ViewportSize)}
                    className="rounded-none first:rounded-l-md last:rounded-r-md"
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
            
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          {previewUrl}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <div className="h-full bg-gray-100 flex items-center justify-center">
          <div 
            className={cn(
              "bg-white shadow-lg transition-all duration-300",
              viewport === 'desktop' ? 'w-full h-full' : 'rounded-lg overflow-hidden'
            )}
            style={{
              width: currentViewport.width,
              height: currentViewport.height,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            <iframe
              key={`${pageSlug}-${refreshKey}`}
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0"
              title={`Preview da página ${pageSlug}`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-links"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook para gerenciar estado do preview
export function usePreviewMode() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewToken, setPreviewToken] = useState<string>();

  const enablePreview = () => {
    const token = `preview_${Date.now()}`;
    setPreviewToken(token);
    setIsPreviewMode(true);
    return token;
  };

  const disablePreview = () => {
    setIsPreviewMode(false);
    setPreviewToken(undefined);
  };

  return {
    isPreviewMode,
    previewToken,
    enablePreview,
    disablePreview
  };
}