import { summary } from "../data/summary";

export default function SummaryPanel() {
  return (
    <div className="h-full overflow-y-auto px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Fiche de révision
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          Généré à partir de vos documents sélectionnés.
        </p>

        <div className="grid grid-cols-2 gap-5">
          {summary.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-base font-semibold text-blue-600 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-700 flex gap-2 leading-relaxed"
                  >
                    <span className="text-blue-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
