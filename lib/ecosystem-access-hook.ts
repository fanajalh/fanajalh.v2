import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Swal from "@/lib/custom-alert"
import React from "react"
import EcosystemGuestSelector from "../components/sections/EcosystemGuestSelector"
import EcosystemGuestSelectorMobile from "../components/sections/EcosystemGuestSelectorMobile"

const FEATURE_NAMES: Record<string, string> = {
  lead_finder: "Lead Finder",
  crm: "CRM",
  blast: "Blast Email",
  keyword: "Keyword Suggestion",
  seo: "SEO Tools",
  geo: "AI Optimization",
  site_audit: "Website Audit",
  tracking: "Tracking & Analytics"
}

export function useEcosystemAccess(feature: string) {
  const router = useRouter()

  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cache = sessionStorage.getItem("ecosystem_progression")
        if (cache) {
          const parsed = JSON.parse(cache)
          if (parsed.success) {
            const isAllowed = parsed.status[feature] || (parsed.role === "guest" && parsed.hasChosen === false)
            if (isAllowed) return false
          }
        }
      } catch {}
    }
    return true
  })

  const [allowed, setAllowed] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cache = sessionStorage.getItem("ecosystem_progression")
        if (cache) {
          const parsed = JSON.parse(cache)
          if (parsed.success) {
            return parsed.status[feature] || (parsed.role === "guest" && parsed.hasChosen === false)
          }
        }
      } catch {}
    }
    return false
  })

  const [showSelector, setShowSelector] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cache = sessionStorage.getItem("ecosystem_progression")
        if (cache) {
          const parsed = JSON.parse(cache)
          if (parsed.success) {
            return parsed.role === "guest" && parsed.hasChosen === false
          }
        }
      } catch {}
    }
    return false
  })

  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await fetch("/api/ecosystem/progression")
        const data = await res.json()
        if (data.success) {
          // Update sessionStorage cache
          sessionStorage.setItem("ecosystem_progression", JSON.stringify(data))

          const isMobile = window.location.pathname.startsWith("/ecosystem")

          // If guest has not chosen a feature yet, show selector
          if (data.role === "guest" && data.hasChosen === false) {
            setShowSelector(true)
            setAllowed(true)
            setLoading(false)
            return
          }

          setShowSelector(false)
          const isAllowed = data.status[feature]
          if (isAllowed) {
            setAllowed(true)
            setLoading(false)
            // Log the visit to database to unlock next step ONLY if user is logged in
            if (data.role && data.role !== "guest") {
              const postRes = await fetch("/api/ecosystem/progression", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ feature })
              })
              if (postRes.ok) {
                // Fetch updated progression to refresh cache immediately for the next tabs
                const updatedRes = await fetch("/api/ecosystem/progression")
                const updatedData = await updatedRes.json()
                if (updatedData.success) {
                  sessionStorage.setItem("ecosystem_progression", JSON.stringify(updatedData))
                }
              }
            }
          } else {
            setAllowed(false)
            const featurePathMap: Record<string, string> = {
              lead_finder: isMobile ? "/ecosystem/lead-finder" : "/lead-finder",
              crm: isMobile ? "/ecosystem/crm" : "/crm",
              blast: isMobile ? "/ecosystem/blast" : "/blast",
              keyword: isMobile ? "/ecosystem/keyword" : "/keyword",
              seo: isMobile ? "/ecosystem/seo-tools" : "/seo-tools",
              tracking: isMobile ? "/ecosystem/tracking" : "/tracking"
            }

            // Find unlocked feature if any
            const unlockedFeature = Object.keys(data.status).find(key => data.status[key] === true)
            let redirectPath = isMobile ? "/ecosystem/lead-finder" : "/lead-finder"
            let alertText = ""

            if (data.role === "guest") {
              if (unlockedFeature && featurePathMap[unlockedFeature]) {
                redirectPath = featurePathMap[unlockedFeature]
                const formattedName = FEATURE_NAMES[unlockedFeature] || unlockedFeature.toUpperCase()
                alertText = `Sebagai tamu, Anda terkunci pada fitur "${formattedName}". Silakan masuk/daftar akun gratis untuk membuka semua fitur lainnya!`
              } else {
                alertText = "Akses ditolak. Silakan login atau daftar untuk mencoba fitur ekosistem."
              }
            } else {
              const REDIRECTS: Record<string, string> = {
                crm: isMobile ? "/ecosystem/lead-finder" : "/lead-finder",
                blast: isMobile ? "/ecosystem/crm" : "/crm",
                keyword: isMobile ? "/ecosystem/crm" : "/crm",
                seo: isMobile ? "/ecosystem/keyword" : "/keyword",
                tracking: isMobile ? "/ecosystem/blast" : "/blast"
              }
              redirectPath = REDIRECTS[feature] || (isMobile ? "/ecosystem/lead-finder" : "/lead-finder")
              const name = FEATURE_NAMES[feature] || feature.toUpperCase()
              alertText = `Langkah "${name}" terkunci. Silakan ikuti ekosistem secara berurutan dan selesaikan langkah sebelumnya terlebih dahulu!`
            }

            setLoading(false)
            Swal.fire({
              icon: "error",
              title: "Akses Terkunci 🔒",
              text: alertText,
              confirmButtonText: "Buka Fitur Aktif",
              confirmButtonColor: "#e04f16", // Super-app orange color
              allowOutsideClick: false
            }).then(() => {
              router.push(redirectPath)
            })
          }
        }
      } catch (err) {
        console.error("Progression check failed", err)
        setLoading(false)
      }
    }
    
    checkAccess()
  }, [feature, router])

  const isMobile = typeof window !== "undefined" && window.location.pathname.startsWith("/ecosystem")

  return { 
    loading, 
    allowed, 
    showSelector, 
    SelectorModal: showSelector 
      ? React.createElement(isMobile ? EcosystemGuestSelectorMobile : EcosystemGuestSelector) 
      : null 
  }
}
