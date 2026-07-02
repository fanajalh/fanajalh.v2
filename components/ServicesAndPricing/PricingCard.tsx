import Link from "next/link";
import { CheckCircle2, X, Sparkles, ArrowRight } from "lucide-react";

// (Opsional) Menambahkan interface agar TypeScript lebih rapi
interface PlanProps {
  name: string;
  description: string;
  popular?: boolean;
  icon: any;
  monthlyPrice: number;
  features: string[];
  notIncluded: string[];
  buttonText: string;
}

interface PricingCardProps {
  plan: PlanProps;
  matchedPlan?: { price: number; active: boolean };
}

export default function PricingCard({ plan, matchedPlan }: PricingCardProps) {
  const displayPrice = matchedPlan ? matchedPlan.price : plan.monthlyPrice;
  const isActive = matchedPlan ? matchedPlan.active : true;

  if (!isActive) return null;

  return (
    <div
      className={`relative flex flex-col bg-white dark:bg-slate-900 p-8 border rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 ${
        plan.popular
          ? "border-orange-500 dark:border-orange-400 shadow-2xl shadow-orange-500/10 scale-[1.02] z-10"
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl"
      }`}
    >
      {/* Badge Popular */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles size={14} className="animate-pulse" />
          Paling Laris
        </div>
      )}

      {/* Header Info */}
      <div className="flex justify-between items-start mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {plan.name}
          </h3>
          <p className="text-sm text-slate-500 mt-2 line-clamp-2">
            {plan.description}
          </p>
        </div>
        <div
          className={`p-3 rounded-2xl shrink-0 ${
            plan.popular
              ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          <plan.icon size={26} strokeWidth={2.5} />
        </div>
      </div>

      {/* Price Display */}
      <div className="mb-8 flex items-baseline">
        <span className="text-lg font-bold text-slate-500 mr-1">Rp</span>
        <span className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {new Intl.NumberFormat("id-ID").format(displayPrice)}
        </span>
      </div>

      {/* Features List */}
      <div className="flex-1 space-y-5 mb-8">
        <div className="space-y-4">
          {plan.features.map((feature: string, idx: number) => (
            <div key={idx} className="flex items-start gap-3 group">
              <CheckCircle2
                size={20}
                className="shrink-0 text-orange-500 dark:text-orange-400 transition-colors"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Not Included List */}
        {plan.notIncluded && plan.notIncluded.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            {plan.notIncluded.map((feature: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 opacity-60">
                <X size={20} className="text-slate-400 shrink-0" />
                <span className="text-sm font-medium text-slate-500">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action Button */}
      <Link
        href={`/payment?package=${plan.name.split(" ")[0].toLowerCase()}`}
        className={`group w-full py-4 rounded-[2rem] font-bold text-center flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 ${
          plan.popular
            ? "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25 dark:bg-orange-600 dark:hover:bg-orange-700"
            : "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
        }`}
      >
        {plan.buttonText}
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}