import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Home from "@/pages/home";
import Experiencias from "@/pages/experiencias";
import Lodge from "@/pages/lodge";
import PescaEsportiva from "@/pages/pesca-esportiva";
import Acomodacoes from "@/pages/acomodacoes";
import Gastronomia from "@/pages/gastronomia";
import Sustentabilidade from "@/pages/sustentabilidade";
import SobreNos from "@/pages/sobre-nos";
import Galeria from "@/pages/galeria";
import Blog from "@/pages/blog";
import Contato from "@/pages/contato";
import CMS from "@/pages/cms";

import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/lodge" component={Lodge} />
          <Route path="/experiencias" component={Experiencias} />
          <Route path="/experiencias/pesca" component={PescaEsportiva} />
          <Route path="/acomodacoes" component={Acomodacoes} />
          <Route path="/gastronomia" component={Gastronomia} />
          <Route path="/sustentabilidade" component={Sustentabilidade} />
          <Route path="/sobre-nos" component={SobreNos} />
          <Route path="/galeria" component={Galeria} />
          <Route path="/blog" component={Blog} />
          <Route path="/contato" component={Contato} />
          <Route path="/cms" component={CMS} />

          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
