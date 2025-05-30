import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  PanelLeft, 
  Eye, 
  Undo2, 
  Save, 
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CMSLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  onPreview: () => void;
  onUndo: () => void;
  onPublish: () => void;
  canUndo?: boolean;
  isPublishing?: boolean;
  selectedPageName?: string;
}

export function CMSLayout({ 
  children, 
  sidebar, 
  onPreview, 
  onUndo, 
  onPublish,
  canUndo = false,
  isPublishing = false,
  selectedPageName = 'Nenhuma página selecionada'
}: CMSLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <PanelLeft className="w-4 h-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-gray-900">CMS</h1>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-600">{selectedPageName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreview}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo2 className="w-4 h-4 mr-2" />
            Desfazer
          </Button>
          
          <Button
            size="sm"
            onClick={onPublish}
            disabled={isPublishing}
          >
            <Save className="w-4 h-4 mr-2" />
            {isPublishing ? 'Publicando...' : 'Publicar'}
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('/', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Site
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={cn(
            "bg-white border-r border-gray-200 transition-all duration-200",
            sidebarCollapsed ? "w-12" : "w-80"
          )}
        >
          {!sidebarCollapsed && (
            <div className="p-4 h-full overflow-y-auto">
              {sidebar}
            </div>
          )}
          
          {sidebarCollapsed && (
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(false)}
                className="w-full"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

// Componente para o Sidebar Tree
interface SidebarTreeProps {
  pages: Array<{
    id: string;
    name: string;
    slug: string;
    hasChanges?: boolean;
  }>;
  selectedPageId?: string;
  onPageSelect: (pageId: string) => void;
}

export function SidebarTree({ pages, selectedPageId, onPageSelect }: SidebarTreeProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Páginas</h3>
        <Badge variant="secondary" className="text-xs">
          {pages.length}
        </Badge>
      </div>
      
      <div className="space-y-1">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => onPageSelect(page.id)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
              "hover:bg-gray-100",
              selectedPageId === page.id 
                ? "bg-blue-100 text-blue-900 border border-blue-200" 
                : "text-gray-700"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{page.name}</span>
              {page.hasChanges && (
                <Badge variant="secondary" className="text-xs">
                  ● draft
                </Badge>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              /{page.slug === 'home' ? '' : page.slug}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}