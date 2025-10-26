export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} chases.dev</p>
          <div className="flex gap-6">
            <a href="https://github.com/chasesdev" className="text-gray-400 hover:text-white">
              github
            </a>
            <a href="mailto:me@chases.dev" target="_blank" className="text-gray-400 hover:text-white">
              me@chases.dev
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
