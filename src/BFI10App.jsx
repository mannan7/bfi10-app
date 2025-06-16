import React, { useState } from "react";

// Ten-Item Personality Inventory (TIPI) items (Gosling et al., 2003)
const questions = [
  { text: "Extraverted, enthusiastic", trait: "Extraversion", reversed: false },
  { text: "Reserved, quiet", trait: "Extraversion", reversed: true },
  { text: "Sympathetic, warm", trait: "Agreeableness", reversed: false },
  { text: "Critical, quarrelsome", trait: "Agreeableness", reversed: true },
  { text: "Dependable, self-disciplined", trait: "Conscientiousness", reversed: false },
  { text: "Disorganized, careless", trait: "Conscientiousness", reversed: true },
  { text: "Anxious, easily upset", trait: "Emotional Stability", reversed: true },
  { text: "Calm, emotionally stable", trait: "Emotional Stability", reversed: false },
  { text: "Open to new experiences, complex", trait: "Openness", reversed: false },
  { text: "Conventional, uncreative", trait: "Openness", reversed: true }
];

const reverseScore = (val) => 8 - val;

const narrativeTemplates = { /* unchanged */ };

export default function BFI10App() {
  const [responses, setResponses] = useState(Array(10).fill(4));
  const [results, setResults] = useState(null);
  const [promptText, setPromptText] = useState("");

  const handleChange = (index, value) => {
    const updated = [...responses];
    updated[index] = value;
    setResponses(updated);
  };

  const handleSubmit = () => {
    const traitScores = {};
    questions.forEach(({ trait }) => { traitScores[trait] = []; });
    questions.forEach(({ trait, reversed }, idx) => {
      const raw = responses[idx];
      const score = reversed ? reverseScore(raw) : raw;
      traitScores[trait].push(score);
    });
    const finalScores = {};
    Object.entries(traitScores).forEach(([t, arr]) => {
      finalScores[t] = arr.reduce((a,b) => a+b, 0) / arr.length;
    });

    const lowT = 4.0, highT = 5.5, midT = (lowT + highT) / 2;
    const narrative = {};
    Object.entries(finalScores).forEach(([t, s]) => {
      let cat = s > highT ? 'high' : s > midT ? 'moderatelyHigh' : s >= lowT ? 'moderatelyLow' : 'low';
      narrative[t] = narrativeTemplates[t][cat];
    });

    setResults({ finalScores, narrative });

    const prompt = `The user has completed the Ten-Item Personality Inventory (TIPI) from Gosling et al. (2003).

Scale legend:
1 = Disagree strongly
2 = Disagree a little
3 = Neither agree nor disagree
4 = Agree a little
5 = Agree strongly
6 = Agree very much
7 = Agree absolutely

User responses to each item:
${questions.map((q, i) => `${i+1}. ${q.text} – Answer: ${responses[i]}`).join('\n')}

Final trait scores:
${Object.entries(finalScores).map(([t, s]) => `${t}: ${s.toFixed(2)}`).join('\n')}

Trait interpretations:
${Object.entries(narrative).map(([t, n]) => `${t}:
  Description: ${n.text}
  Example behavior: ${n.example}`).join('\n\n')}

Please adopt this user’s personality in your responses. Reflect their traits, use their tone, align with their tendencies, and illustrate with behaviors consistent with their examples.`;

    setPromptText(prompt);
  };

  return (
    <div className="p-6 bg-neutral-900 text-white">
      <h1 className="text-2xl mb-4">Ten‐Item TIPI (Gosling et al., 2003)</h1>
      <p className="mb-4">Scale: 1=Disagree strongly, 2=Disagree a little, 3=Neither, 4=Agree a little, 5=Agree strongly, 6=Agree very much, 7=Agree absolutely.</p>

      <table className="w-full text-left mb-6">
        <thead>
          <tr>
            <th className="pr-4">#</th>
            <th className="pr-4">Question</th>
            {[1,2,3,4,5,6,7].map(v => (
              <th key={v} className="text-center">{v}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => (
            <tr key={i} className="border-t border-gray-700">
              <td className="pr-4 align-top">{i+1}.</td>
              <td className="pr-4 align-top">{q.text}</td>
              {[1,2,3,4,5,6,7].map(v => (
                <td key={v} className="text-center">
                  <input
                    type="radio"
                    name={`q${i}`}
                    checked={responses[i] === v}
                    onChange={() => handleChange(i, v)}
                    className="accent-blue-400"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSubmit} className="p-2 bg-blue-600 rounded">Compute & Generate Prompt</button>

      {results && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl">Results</h2>
          <table className="w-full text-left">
            <thead>
              <tr><th>Trait</th><th>Score</th><th>Description</th><th>Example</th></tr>
            </thead>
            <tbody>
              {Object.entries(results.finalScores).map(([trait, score]) => (
                <tr key={trait} className="border-t border-gray-700">
                  <td className="pr-4 font-semibold">{trait}</td>
                  <td className="pr-4">{score.toFixed(2)}</td>
                  <td className="pr-4">{results.narrative[trait].text}</td>
                  <td>{results.narrative[trait].example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {promptText && (
        <div className="mt-6">
          <h2 className="text-xl">ChatGPT Prompt</h2>
          <textarea readOnly value={promptText} className="w-full h-96 bg-gray-800 p-2 text-sm" />
        </div>
      )}
    </div>
  );
}
