export function Header() {
  return (
    <header className="w-full bg-pantanal-green-900 text-cloud-white-0 py-4">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <a href="/" className="text-xl font-playfair">
            Itaicy
          </a>
          <div className="flex items-center gap-6">
            <a href="/lodge" className="nav-link">Lodge</a>
            <a href="/experiences" className="nav-link">Experiências</a>
            <a href="/gallery" className="nav-link">Galeria</a>
            <a href="/contact" className="nav-link">Contato</a>
          </div>
        </nav>
      </div>
    </header>
  )
}
