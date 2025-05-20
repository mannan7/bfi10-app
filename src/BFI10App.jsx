import React, { useState } from "react";

const questions = [
  "… is reserved",
  "… is generally trusting",
  "… tends to be lazy",
  "… is relaxed, handles stress well",
  "… has few artistic interests",
  "… is outgoing, sociable",
  "… tends to find fault with others",
  "… does a thorough job",
  "… gets nervous easily",
  "… has an active imagination",
];

const reverseScore = (val) => 6 - val;

const scoringMap = {
  Extraversion: [[1, true], [6, false]],
  Agreeableness: [[2, false], [7, true]],
  Conscientiousness: [[3, true], [8, false]],
  Neuroticism: [[4, true], [9, false]],
  Openness: [[5, true], [10, false]],
};

export default function BFI10App() {
  const [responses, setResponses] = useState(Array(10).fill(3));
  const [scores, setScores] = useState(null);
  const [prompt, setPrompt] = useState("");

  const handleChange = (questionIndex, value) => {
    const updated = [...responses];
    updated[questionIndex] = value;
    setResponses(updated);
  };

  const handleSubmit = () => {
    const traitScores = {};
    for (const [trait, items] of Object.entries(scoringMap)) {
      const values = items.map(([qIndex, isReversed]) => {
        const raw = responses[qIndex - 1];
        return isReversed ? reverseScore(raw) : raw;
      });
      traitScores[trait] = (values[0] + values[1]) / 2;
    }

    setScores(traitScores);

    const promptText = `A user has completed the BFI-10 personality test. Here are their responses:\n\n` +
      responses.map((val, i) => `${i + 1}. ${questions[i]} – ${val}`).join("\n") +
      `\n\nFinal trait scores (out of 5):\n` +
      Object.entries(traitScores).map(([trait, score]) => `- ${trait}: ${score.toFixed(1)}`).join("\n") +
      `\n\nMimic this user's personality in all future responses.`;

    setPrompt(promptText);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 text-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">Mini Big-5 Personality Test</h1>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-base border-collapse">
          <thead className="bg-neutral-900 text-neutral-100">
            <tr className="border-b border-gray-700">
              <th className="text-left px-4 py-3">I see myself as someone who…</th>
              {[1, 2, 3, 4, 5].map((val) => (
                <th key={val} className="px-4 py-3 text-center font-bold text-neutral-200">{val}</th>
              ))}
            </tr>
            <tr className="text-sm text-neutral-100 bg-neutral-800 border-t border-neutral-700">
              <td></td>
              <td className="text-center">Disagree strongly</td>
              <td className="text-center">Disagree a little</td>
              <td className="text-center">Neither</td>
              <td className="text-center">Agree a little</td>
              <td className="text-center">Agree strongly</td>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, i) => (
              <tr key={i} className="border-b border-neutral-700 hover:bg-neutral-800">
                <td className="px-4 py-4">
                {i + 1}. <span className="text-neutral-400">I see myself as someone who</span> {q}
                </td>
                {[1, 2, 3, 4, 5].map((val) => (
                  <td key={val} className="text-center px-4 py-4">
                    <input
                    type="radio"
                    name={`q${i}`}
                    value={val}
                    checked={responses[i] === val}
                    onChange={() => handleChange(i, val)}
                    className="accent-blue-400 w-5 h-5"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg"
        >
          Submit & Generate Prompt
        </button>
      </div>

      {scores && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-2">Trait Scores</h2>
          <ul className="list-disc list-inside text-lg">
            {Object.entries(scores).map(([trait, val]) => (
              <li key={trait}>{trait}: {val.toFixed(1)}</li>
            ))}
          </ul>
        </div>
      )}

      {prompt && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-2">Generated Prompt</h2>
          <textarea
            readOnly
            value={prompt}
            className="w-full h-80 bg-gray-800 border border-gray-600 p-4 rounded-lg text-white font-mono"
          />
        </div>
      )}
    </div>
  );
}
