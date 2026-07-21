import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { quiz } from "../data/quiz";

export default function QuizPanel() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="h-full overflow-y-auto px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Quiz de révision
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          5 questions générées à partir de vos documents.
        </p>

        <div className="space-y-5">
          {quiz.map((q, index) => (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
            >
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                Question {index + 1}
              </h3>
              <p className="text-base text-gray-900 mb-4">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={"q-" + q.id}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">
                      {String.fromCharCode(65 + i)}. {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={() => setSubmitted(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors shadow-sm"
          >
            Vérifier
          </button>

          {submitted && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-5 py-3">
              <CheckCircle2 size={20} />
              <span className="font-medium">Score : 4 / 5</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
