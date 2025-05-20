import React, { useState } from "react";

const questions = [
  "Is talkative",
  "Tends to find fault with others",
  "Does a thorough job",
  "Is depressed, blue",
  "Is original, comes up with new ideas",
  "Is reserved",
  "Is helpful and unselfish with others",
  "Can be somewhat careless",
  "Is relaxed, handles stress well",
  "Is curious about many different things",
  "Is full of energy",
  "Starts quarrels with others",
  "Is a reliable worker",
  "Can be tense",
  "Is ingenious, a deep thinker",
  "Generates a lot of enthusiasm",
  "Has a forgiving nature",
  "Tends to be disorganized",
  "Worries a lot",
  "Has an active imagination",
  "Tends to be quiet",
  "Is generally trusting",
  "Tends to be lazy",
  "Is emotionally stable, not easily upset",
  "Is inventive",
  "Has an assertive personality",
  "Can be cold and aloof",
  "Perseveres until the task is finished",
  "Can be moody",
  "Values artistic, aesthetic experiences",
  "Is sometimes shy, inhibited",
  "Is considerate and kind to almost everyone",
  "Does things efficiently",
  "Remains calm in tense situations",
  "Prefers work that is routine",
  "Is outgoing, sociable",
  "Is sometimes rude to others",
  "Makes plans and follows through with them",
  "Gets nervous easily",
  "Likes to reflect, play with ideas",
  "Has few artistic interests",
  "Likes to cooperate with others",
  "Is easily distracted",
  "Is sophisticated in art, music, or literature"
];

const reverseScore = (val) => 6 - val;

const scoringMap = {
  Extraversion: [
    [1, false], [6, true], [11, false], [16, false], [21, true], [26, false], [31, true], [36, false]
  ],
  Agreeableness: [
    [2, true], [7, false], [12, true], [17, false], [22, false], [27, true], [32, false], [37, true], [42, false]
  ],
  Conscientiousness: [
    [3, false], [8, true], [13, false], [18, true], [23, true], [28, false], [33, false], [38, false], [43, true]
  ],
  Neuroticism: [
    [4, false], [9, true], [14, false], [19, false], [24, true], [29, false], [34, true], [39, false]
  ],
  Openness: [
    [5, false], [10, false], [15, false], [20, false], [25, false], [30, false], [35, true], [40, false], [41, true], [44, false]
  ]
};


export default function BFI10App() {
  const [responses, setResponses] = useState(Array(44).fill(3));
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
        const raw = responses[qIndex - 1]; // index is 1-based
        return isReversed ? reverseScore(raw) : raw;
      });
      traitScores[trait] = values.reduce((a, b) => a + b, 0) / values.length;
    }
  
    setScores(traitScores);
  
    const promptText = `A user has completed the BFI-44 personality test.\n (Here's what each number mean: Disagree strongly- 1, Disagree a little- 2, Neither- 3, Agree a little- 4, Agree strongly- 5)\n Here are their responses:\n\n` +
      responses.map((val, i) => `${i + 1}. ${questions[i]} – ${val}`).join("\n") +
      `\n\nFinal trait scores (out of 5):\n` +
      Object.entries(traitScores).map(([trait, score]) => `- ${trait}: ${score.toFixed(2)}`).join("\n") +
      `\n\nMimic this user's personality in all future responses.`;
  
    setPrompt(promptText);
  };
  

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 text-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">44 item Big-5 Personality Test</h1>

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
                {i + 1}. <span className="text-neutral-400">I see myself as someone who...</span> {q}
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
