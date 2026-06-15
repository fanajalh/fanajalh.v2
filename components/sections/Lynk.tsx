import { Instagram, MapPin, Link2, MonitorPlay } from "lucide-react"

export default function Lynk() {
  const links = [
    {
      title: "Instagram Portfolio",
      desc: "@fan_ajalah",
      url: "https://instagram.com/fan_ajalah",
      icon: Instagram,
      primary: true,
    },
    {
      title: "Tiktok",
      desc: "@fan_ajalahh",
      url: "https://tiktok.com/@fan_ajalahh",
      icon: MonitorPlay,
      primary: false,
    },
    {
      title: "Lokasi Studio",
      desc: "Purwokerto, Jawa Tengah",
      url: "https://maps.google.com/?q=Purwokerto",
      icon: MapPin,
      primary: false,
    },
    {
      title: "Official Lynk.id",
      desc: "Semua tautan kami",
      url: "https://lynk.id/fan_ajalah",
      icon: Link2,
      primary: false,
    },
  ]

  return (
    <section className="relative py-24 lg:py-32 bg-white dark:bg-black overflow-hidden selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black border-t border-gray-200 dark:border-white/10">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">

        {/* Profile Card */}
        <div className="text-center mb-16 space-y-6">
          <div className="relative inline-block group">
            {/* Minimalist Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 dark:bg-white/5 border-2 border-black dark:border-white flex items-center justify-center overflow-hidden mx-auto">
              <img
                src="https://ui-avatars.com/api/?name=AllFanajalh&background=ffffff&color=000000&size=150"
                alt="AllFanajalh"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            {/* Status Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-black border border-gray-200 dark:border-white/20 shadow-sm whitespace-nowrap">
              <span className="w-2 h-2 bg-black dark:bg-white animate-pulse" />
              <span className="text-[9px] font-bold text-black dark:text-white uppercase tracking-widest">Available</span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-black dark:text-white mb-2">AllFanajalh</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto">
              Jasa joki desain poster Purwokerto & SaaS Business Ecosystem. Hubungi kami melalui tautan resmi di bawah ini.
            </p>
          </div>
        </div>

        {/* Links List - Brutalist Grid Style */}
        <div className="space-y-0 border-l border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.05)]">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-5 p-6 sm:p-8 transition-all duration-300 border-b border-r border-gray-200 dark:border-white/10 ${link.primary
                  ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100"
                  : "bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
            >
              <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${link.primary ? "bg-white/10 dark:bg-black/10" : "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                }`}>
                <link.icon className={`w-5 h-5 ${link.primary ? "text-white dark:text-black" : "text-black dark:text-white"}`} />
              </div>

              <div className="flex-1">
                <h3 className={`font-bold text-lg mb-1 ${link.primary ? "text-white dark:text-black" : "text-black dark:text-white"}`}>
                  {link.title}
                </h3>
                <p className={`text-sm font-medium ${link.primary ? "text-gray-400 dark:text-gray-600" : "text-gray-500 dark:text-gray-400"}`}>
                  {link.desc}
                </p>
              </div>

              <div className={`w-10 h-10 border flex items-center justify-center transition-all ${link.primary
                  ? "border-white/20 dark:border-black/20 text-white dark:text-black group-hover:bg-white dark:group-hover:bg-black group-hover:text-black dark:group-hover:text-white"
                  : "border-gray-200 dark:border-white/10 text-black dark:text-white group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black"
                }`}>
                <Link2 className="w-4 h-4 -rotate-45" />
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}