export interface AlertOptions {
  icon?: "success" | "error" | "warning" | "info" | "question"
  title?: string
  text?: string
  html?: string
  showCancelButton?: boolean
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonColor?: string
  cancelButtonColor?: string
  timer?: number
  showConfirmButton?: boolean
  allowOutsideClick?: boolean
}

export interface AlertResult {
  isConfirmed: boolean
  isDismissed?: boolean
}

const Swal = {
  fire(options: AlertOptions | string): Promise<AlertResult> {
    return new Promise((resolve) => {
      let opts: AlertOptions = {}
      if (typeof options === "string") {
        opts.text = options
      } else {
        opts = options
      }

      const icon = opts.icon || "info"
      const title = opts.title || ""
      const content = opts.html || opts.text || ""
      const showCancel = opts.showCancelButton || false
      const confirmText = opts.confirmButtonText || "OK"
      const cancelText = opts.cancelButtonText || "Batal"
      const showConfirm = opts.showConfirmButton !== false

      // Create container
      const container = document.createElement("div")
      container.className = "fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 opacity-0 select-none font-sans"
      
      // Icon selection
      let iconHtml = ""
      if (icon === "success") {
        iconHtml = `
          <div class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border-2 border-emerald-100 shadow-sm shrink-0">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        `
      } else if (icon === "error") {
        iconHtml = `
          <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center border-2 border-red-100 shadow-sm shrink-0">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        `
      } else if (icon === "warning") {
        iconHtml = `
          <div class="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center border-2 border-amber-100 shadow-sm shrink-0">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        `
      } else {
        // Info or other
        iconHtml = `
          <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center border-2 border-blue-100 shadow-sm shrink-0">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        `
      }

      // Check layout theme
      const isMobileEcosystem = window.location.pathname.startsWith("/ecosystem") || window.location.pathname.startsWith("/home")
      const primaryBtnClass = isMobileEcosystem
        ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-[0_4px_12px_rgba(249,115,22,0.3)] active:scale-95 transition-all text-xs font-black uppercase tracking-widest px-6 py-3 cursor-pointer"
        : "bg-black hover:bg-zinc-800 text-white border-2 border-black font-black uppercase tracking-widest text-[11px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all px-6 py-3 cursor-pointer"

      const cancelBtnClass = isMobileEcosystem
        ? "bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full active:scale-95 transition-all text-xs font-black uppercase tracking-widest px-6 py-3 cursor-pointer"
        : "bg-white hover:bg-slate-50 text-black border-2 border-black font-black uppercase tracking-widest text-[11px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all px-6 py-3 cursor-pointer"

      const cardClass = isMobileEcosystem
        ? "bg-white rounded-[2rem] p-6 shadow-2xl w-full max-w-[340px] flex flex-col items-center text-center border border-slate-100 transform translate-y-10 transition-transform duration-300 ease-out"
        : "bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-[420px] flex flex-col items-center text-center transform translate-y-10 transition-transform duration-300 ease-out"

      const titleClass = isMobileEcosystem
        ? "text-slate-800 text-[16px] font-black tracking-tight mt-4 leading-snug"
        : "text-black text-xl font-black uppercase tracking-wider mt-5"

      const contentClass = isMobileEcosystem
        ? "text-slate-500 text-xs font-semibold mt-2 leading-relaxed"
        : "text-gray-600 text-xs font-bold uppercase tracking-wider mt-3 leading-relaxed"

      // Build inner HTML
      container.innerHTML = `
        <div class="${cardClass}" id="custom-alert-card">
          ${iconHtml}
          ${title ? `<h3 class="${titleClass}">${title}</h3>` : ""}
          <div class="${contentClass}">${content}</div>
          <div class="flex gap-2.5 w-full mt-6 justify-center">
            ${showCancel ? `<button id="custom-alert-cancel-btn" class="${cancelBtnClass}">${cancelText}</button>` : ""}
            ${showConfirm ? `<button id="custom-alert-confirm-btn" class="${primaryBtnClass}">${confirmText}</button>` : ""}
          </div>
        </div>
      `

      // Append to body
      document.body.appendChild(container)

      // Trigger animation
      setTimeout(() => {
        container.classList.remove("opacity-0")
        container.classList.add("opacity-100")
        const card = document.getElementById("custom-alert-card")
        if (card) {
          card.classList.remove("translate-y-10")
          card.classList.add("translate-y-0")
        }
      }, 10)

      // Clean up helper
      const closeAlert = (confirmed: boolean) => {
        container.classList.remove("opacity-100")
        container.classList.add("opacity-0")
        const card = document.getElementById("custom-alert-card")
        if (card) {
          card.classList.remove("translate-y-0")
          card.classList.add("translate-y-10")
        }
        setTimeout(() => {
          if (document.body.contains(container)) {
            document.body.removeChild(container)
          }
          resolve({ isConfirmed: confirmed })
        }, 300)
      }

      // Add listeners
      if (showConfirm) {
        const confirmBtn = document.getElementById("custom-alert-confirm-btn")
        if (confirmBtn) {
          confirmBtn.addEventListener("click", () => closeAlert(true))
        }
      }

      if (showCancel) {
        const cancelBtn = document.getElementById("custom-alert-cancel-btn")
        if (cancelBtn) {
          cancelBtn.addEventListener("click", () => closeAlert(false))
        }
      }

      // Outside click listener
      if (opts.allowOutsideClick !== false) {
        container.addEventListener("click", (e) => {
          if (e.target === container) {
            closeAlert(false)
          }
        })
      }

      // Timer close
      if (opts.timer) {
        setTimeout(() => {
          closeAlert(false)
        }, opts.timer)
      }
    })
  }
}

export default Swal
