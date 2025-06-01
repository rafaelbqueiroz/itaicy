import { Route, Switch, useLocation } from 'wouter'
import { Suspense, lazy } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Loader } from '@/components/ui/loader'

// Páginas do site público
import HomePage from '@/pages/home'
import NotFoundPage from '@/pages/not-found'

// Lazy loading para páginas públicas
const AcomodacoesPage = lazy(() => import('@/pages/acomodacoes'))
const ExperienciasPage = lazy(() => import('@/pages/experiencias'))
const GaleriaPage = lazy(() => import('@/pages/galeria'))
const BlogPage = lazy(() => import('@/pages/blog'))
const ContatoPage = lazy(() => import('@/pages/contato'))
const SobreNosPage = lazy(() => import('@/pages/sobre-nos'))
const SustentabilidadePage = lazy(() => import('@/pages/sustentabilidade'))
const GastronomiaPage = lazy(() => import('@/pages/gastronomia'))
const PescaEsportivaPage = lazy(() => import('@/pages/pesca-esportiva'))
const LodgePage = lazy(() => import('@/pages/lodge'))

// Lazy loading para páginas do CMS
const CMSLogin = lazy(() => import('@/pages/cms/login'))
const CMSAdmin = lazy(() => import('@/pages/cms/admin'))
const CMSMedia = lazy(() => import('@/pages/cms/media'))
const PreviewPage = lazy(() => import('@/pages/preview'))

// Componente de loading para Suspense
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Loader className="w-8 h-8 text-pantanal-green-700" />
  </div>
)

// Layout para páginas públicas
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main className="flex-1">
      <Suspense fallback={<PageLoading />}>
        {children}
      </Suspense>
    </main>
    <Footer />
  </>
)

// Layout para páginas do CMS (sem header/footer)
const CMSLayout = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoading />}>
    {children}
  </Suspense>
)

export default function App() {
  const [location] = useLocation()
  
  // Determina qual layout usar com base na URL
  const isCMSRoute = location.startsWith('/cms')
  const isPreviewRoute = location.startsWith('/preview')
  
  // Não usa layout para CMS ou preview
  if (isCMSRoute || isPreviewRoute) {
    return (
      <div className="min-h-screen flex flex-col">
        <CMSLayout>
          <Switch>
            {/* Rotas do CMS */}
            <Route path="/cms/login" component={CMSLogin} />
            <Route path="/cms/media" component={CMSMedia} />
            <Route path="/cms/:slug?" component={CMSAdmin} />
            
            {/* Rota de Preview */}
            <Route path="/preview/:slug?" component={PreviewPage} />
            
            {/* Fallback */}
            <Route component={NotFoundPage} />
          </Switch>
        </CMSLayout>
      </div>
    )
  }
  
  // Layout padrão para páginas públicas
  return (
    <div className="min-h-screen flex flex-col">
      <PublicLayout>
        <Switch>
          {/* Rotas públicas */}
          <Route path="/" component={HomePage} />
          <Route path="/acomodacoes" component={AcomodacoesPage} />
          <Route path="/experiencias" component={ExperienciasPage} />
          <Route path="/galeria" component={GaleriaPage} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/contato" component={ContatoPage} />
          <Route path="/sobre-nos" component={SobreNosPage} />
          <Route path="/sustentabilidade" component={SustentabilidadePage} />
          <Route path="/gastronomia" component={GastronomiaPage} />
          <Route path="/pesca-esportiva" component={PescaEsportivaPage} />
          <Route path="/lodge" component={LodgePage} />
          
          {/* Página 404 */}
          <Route component={NotFoundPage} />
        </Switch>
      </PublicLayout>
    </div>
  )
}
