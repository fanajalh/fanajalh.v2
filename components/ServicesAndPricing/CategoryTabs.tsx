import { categories } from "./data"

export default function CategoryTabs({ activeCategory, setActiveCategory }: any) {
  return (
    <div className="flex overflow-x-auto hide-scrollbar justify-center gap-2 mb-8 px-2 w-full">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all duration-300 rounded-full border ${
            activeCategory === category.id
              ? "bg-orange-500 text-white border-orange-500 dark:bg-orange-600 dark:border-orange-600 shadow-md shadow-orange-500/10"
              : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
          }`}
        >
          <category.icon size={16} />
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  )
}