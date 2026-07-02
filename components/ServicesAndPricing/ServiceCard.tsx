import Image from "next/image";
import Link from "next/link";

// Opsional: Interface agar struktur data lebih jelas
interface ServiceProps {
  title: string;
  image: string;
  priceOriginal: number;
  priceDiscount: number;
}

export default function ServiceCard({
  service,
}: {
  service: ServiceProps; // Ganti 'any' dengan interface
}) {
  const slug = service.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // Kalkulasi persentase diskon otomatis
  const hasDiscount = service.priceOriginal > service.priceDiscount;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((service.priceOriginal - service.priceDiscount) / service.priceOriginal) * 100
      )
    : 0;

  return (
    <Link
      href={`/product/${slug}`}
      className="group block relative bg-white dark:bg-slate-900 p-4 transition-all duration-500 border border-slate-100 dark:border-slate-800/80 rounded-3xl hover:border-orange-500/50 dark:hover:border-orange-500/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 w-full text-left"
    >
      {/* Container Gambar */}
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-inner bg-slate-50 dark:bg-black mb-4">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Overlay tipis di bawah agar logo lebih terbaca jika background gambar terang */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent z-0"></div>

        {/* Badge Diskon (Kiri Atas) */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
            Hemat {discountPercentage}%
          </div>
        )}

        {/* Ikon Canva (Kanan Bawah) dengan efek Glassmorphism */}
        <div className="absolute bottom-2 right-2 z-10 flex items-center justify-center w-9 h-9 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm border border-white/50 dark:border-slate-700/50 group-hover:scale-110 transition-transform duration-300">
          <Image
            src="/images/canva-logo.png"
            alt="Canva"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
      </div>

      {/* Detail Teks */}
      <div className="flex flex-col space-y-1.5 px-1">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
          {service.title}
        </h3>
        
        <div className="flex flex-col mt-1">
          {/* Harga Asli (Coret) */}
          {hasDiscount && (
            <span className="text-xs font-medium text-slate-450 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-650">
              Rp {new Intl.NumberFormat("id-ID").format(service.priceOriginal)}
            </span>
          )}
          {/* Harga Diskon / Harga Akhir */}
          <span className="text-lg font-bold text-orange-500 dark:text-orange-400">
            Rp {new Intl.NumberFormat("id-ID").format(service.priceDiscount)}
          </span>
        </div>
      </div>
    </Link>
  );
}