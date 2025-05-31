import { Route, Switch } from 'wouter'
import { Header } from '@/components/layout/header'

function HomePage() {
  return (
    <div className="min-h-screen bg-cloud-white-50">
      <h1 className="text-4xl font-playfair text-pantanal-green-900 text-center pt-20">
        Itaicy Pantanal Eco Lodge
      </h1>
      <p className="text-center text-river-slate-600 mt-4">
        Uma experiência única no coração do Pantanal
      </p>
      <p className="text-center text-river-slate-500 mt-2 text-sm">
        Ambiente de desenvolvimento configurado com sucesso!
      </p>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route>
            <div className="flex items-center justify-center min-h-[50vh]">
              <p className="text-river-slate-600">Página em construção...</p>
            </div>
          </Route>
        </Switch>
      </main>
    </div>
  )
}
