// ==================== TYPES ====================
export interface Order {
  id: number
  order_number: string
  name: string
  email: string
  phone: string
  company: string
  service: string
  package: string
  title: string
  description: string
  dimensions: string
  colors: string
  deadline: string
  additional_info: string
  total_price: number
  status: "pending" | "in_progress" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

export interface Analytics {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
  recentOrders: Order[]
  monthlyRevenue: { month: string; revenue: number }[]
}

export interface WebsiteSettings {
  siteName: string
  tagline: string
  whatsapp: string
  email: string
  instagram: string
  primaryColor: string
  emptyStateMessage?: string
  services: { id: string; name: string; price: number; active: boolean; customStatus?: string }[]
}

export interface Suggestion {
  id: number
  nama: string
  user_email: string
  category: string
  saran: string
  response: string | null
  status: string
  type: string
  author: string
  upvotes: number
  created_at: string
  updated_at: string
}

// ==================== CONSTANTS ====================
export const GRADIENT_ORANGE = "bg-gradient-to-r from-orange-500 to-[#FF7A00]"

export const DEFAULT_SETTINGS: WebsiteSettings = {
  siteName: "FanajALH Design",
  tagline: "Jasa Desain Premium",
  whatsapp: "6285728150223",
  email: "fanajalh@joki.com",
  instagram: "@fanajalh",
  primaryColor: "#FF7A00",
  emptyStateMessage: "Maaf, layanan kami sedang dalam mode libur/tutup sementara.",
  services: [
    // === Halaman Layanan: Poster & Banner ===
    { id: "poster-promosi-bisnis", name: "Poster Promosi Bisnis", price: 15000, active: true },
    { id: "infografis-edukasi", name: "Infografis & Edukasi", price: 20000, active: true },
    { id: "poster-event-konser", name: "Poster Event / Konser", price: 15000, active: true },
    // === Halaman Layanan: Social Media ===
    { id: "instagram-post-feed", name: "Instagram Post (Feed)", price: 25000, active: true },
    { id: "social-media-story", name: "Social Media Story", price: 10000, active: true },
    { id: "cover-banner-web", name: "Cover / Banner Web", price: 20000, active: true },
    // === Halaman Layanan: Cetak Digital ===
    { id: "spanduk-outdoor", name: "Spanduk (Outdoor)", price: 20000, active: true },
    { id: "flyer-brosur", name: "Flyer & Brosur", price: 15000, active: true },
    // === Halaman Paket Harga ===
    { id: "basic", name: "Basic", price: 15000, active: true },
    { id: "professional", name: "Professional", price: 25000, active: true },
    { id: "enterprise", name: "Enterprise", price: 50000, active: true },
    // === Home: Produk Populer ===
    { id: "desain-poster", name: "Desain Poster", price: 15000, active: true },
    { id: "desain-bisnis", name: "Desain Bisnis", price: 25000, active: true },
  ],
}

// ==================== HELPERS ====================
export const formatCurrency = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price)

export const statusColor = (status: string) => {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600 border-amber-200",
    in_progress: "bg-blue-50 text-blue-600 border-blue-200",
    completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
  }
  return map[status] || "bg-gray-50 text-gray-600 border-gray-200"
}

export const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  }
  return map[status] || status
}
