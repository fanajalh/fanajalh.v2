export default function Marquee() {
  const words = [
    "FANZ TECH STUDIO",
    "UI/UX DESIGN",
    "POSTER DESIGN",
    "BRANDING",
    "SOCIAL MEDIA",
    "WEB DEVELOPMENT",
    "CREATIVE AGENCY",
  ]

  // Duplicate words to make it seamless
  const extendedWords = [...words, ...words, ...words]

  return (
    <div className="relative py-24 overflow-hidden bg-transparent flex flex-col items-center justify-center">
      
      {/* First Ribbon - Moving Left */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 rotate-3 bg-black dark:bg-white text-white dark:text-black border-y border-white/10 dark:border-black/10 flex items-center py-4 z-10 scale-110 shadow-xl shadow-black/5 dark:shadow-white/5">
        <div className="flex w-[200%] animate-marquee whitespace-nowrap">
          {extendedWords.map((word, i) => (
            <div key={`left-${i}`} className="flex items-center mx-4 text-3xl font-black uppercase tracking-widest">
              <span>{word}</span>
              <span className="mx-8 text-orange-500 text-4xl opacity-50">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Second Ribbon - Moving Right */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 -rotate-3 bg-orange-500 text-black border-y border-orange-600 flex items-center py-4 z-0 scale-110 shadow-xl shadow-black/5">
        <div className="flex w-[200%] animate-marquee-reverse whitespace-nowrap">
          {extendedWords.map((word, i) => (
            <div key={`right-${i}`} className="flex items-center mx-4 text-3xl font-black uppercase tracking-widest">
              <span>{word}</span>
              <span className="mx-8 text-black text-4xl opacity-50">•</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
