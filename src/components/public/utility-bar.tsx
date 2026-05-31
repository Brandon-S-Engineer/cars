export default function UtilityBar() {
  return (
    <div className="bg-azul-900 text-azul-100 text-[13px]">
      <div className="max-w-[1200px] mx-auto px-5 h-9 flex items-center justify-between">
        <span className="hidden sm:inline">
          Te atiendo en persona · sin bots, sin intermediarios
        </span>
        <span className="flex items-center gap-4">
          <span className="hidden md:inline">Atención personal de lunes a sábado, 9:00–19:00</span>
          <a href="tel:+525581631195" className="text-white font-semibold hover:text-wa transition-colors">
            55 8163 1195
          </a>
        </span>
      </div>
    </div>
  )
}
