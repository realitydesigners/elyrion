export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 text-white/60">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">© {new Date().getFullYear()} Elyrion</div>
        <nav className="flex items-center gap-4 text-sm">
          <a href="/terms" className="hover:text-white">
            Terms
          </a>
          <a href="/privacy" className="hover:text-white">
            Privacy
          </a>
          <a href="/contact" className="hover:text-white">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
