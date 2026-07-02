import { faqs } from "./data"
import { headersConfig } from "../sections/headersConfig"

export default function FAQSection() {
  return (
    <div className="mt-12 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 text-center">{headersConfig.faq.title}</h3>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">{faq.q}</h4>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}