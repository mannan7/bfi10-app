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

// Reverse-scoring function (scale 1-7)
const reverseScore = (val) => 8 - val;

// Narrative templates with examples only
const narrativeTemplates = {
  Extraversion: {
    high: { text: "You are sociable and active.", example: "You organized a lively group discussion and engaged everyone." },
    moderatelyHigh: { text: "You are generally sociable, though sometimes reserved.", example: "You join parties and chat, but occasionally step back to observe." },
    moderatelyLow: { text: "You enjoy smaller gatherings and quieter activities.", example: "You prefer one-on-one conversations over large crowds." },
    low: { text: "You tend to be introspective and reserved.", example: "You often stay silent at social events, preferring to listen." }
  },
  Agreeableness: {
    high: { text: "You are trusting and cooperative.", example: "You volunteered to help a friend move without hesitation." },
    moderatelyHigh: { text: "You’re warm but can critically appraise when needed.", example: "You offer support but speak up if you notice a mistake." },
    moderatelyLow: { text: "You balance kindness with pointing out faults.", example: "You help colleagues but offer constructive feedback." },
    low: { text: "You may challenge others and compete.", example: "You frequently debate ideas and play devil’s advocate." }
  },
  Conscientiousness: {
    high: { text: "You are organized and self-disciplined.", example: "You created a detailed schedule and followed it meticulously." },
    moderatelyHigh: { text: "You’re reliable, with occasional spontaneity.", example: "You prepare for deadlines but sometimes improvise." },
    moderatelyLow: { text: "You plan ahead but can be impulsive.", example: "You set goals but occasionally rush tasks at the last minute." },
    low: { text: "You may be careless and disorganized.", example: "You often miss appointments and leave tasks unfinished." }
  },
  "Emotional Stability": {
    high: { text: "You are calm and confident.", example: "You remained composed during a crisis, making clear decisions." },
    moderatelyHigh: { text: "You stay calm but may feel brief stress.", example: "You handled a tight deadline well with only moments of worry." },
    moderatelyLow: { text: "You manage stress but sometimes feel anxious.", example: "You completed tasks under pressure but had moments of doubt." },
    low: { text: "You may be moody and easily upset.", example: "You often react strongly to criticism and withdraw when upset." }
  },
  Openness: {
    high: { text: "You are imaginative and curious.", example: "You designed an art project exploring abstract ideas." },
    moderatelyHigh: { text: "You enjoy creativity but value routine.", example: "You try new recipes but also stick to favorites." },
    moderatelyLow: { text: "You are open to some new experiences.", example: "You read various genres but return to favorite authors." },
    low: { text: "You prefer familiar and conventional approaches.", example: "You follow established routines and avoid experimentation." }
  }
};

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
    // Calculate scores
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

    // Thresholds
    const lowT = 4.0, highT = 5.5, midT = (lowT + highT) / 2;
    const narrative = {};
    Object.entries(finalScores).forEach(([t, s]) => {
      let cat = s > highT ? 'high' : s > midT ? 'moderatelyHigh' : s >= lowT ? 'moderatelyLow' : 'low';
      narrative[t] = narrativeTemplates[t][cat];
    });

    setResults({ finalScores, narrative });

    // Build prompt
    const respLines = responses.map((v,i) => `${i+1}. ${questions[i].text}: ${v}`).join(' | ');
    const scoreLines = Object.entries(finalScores).map(([t,s]) => `${t}: ${s.toFixed(2)}`).join(' | ');
    const narrLines = Object.entries(narrative).map(([t,n]) => `${t} – ${n.text} Example: ${n.example}`).join('\n');
    const prompt =
      `Scale: 1=Disagree strongly, 2=Disagree a little, 3=Neither, 4=Agree a little, 5=Agree strongly, 6=Agree very much, 7=Agree absolutely.\n` +
      `Responses: ${respLines}\n` +
      `Scores: ${scoreLines}\nNarrative:\n${narrLines}\n\nAdopt this personality: reflect their language, mimic their examples.`;
    setPromptText(prompt);
  };

  return (
    <div className="p-6 bg-neutral-900 text-white">
      <h1 className="text-2xl mb-4">Ten‐Item TIPI (Gosling et al., 2003)</h1>
      <p className="mb-4">Scale: 1=Disagree strongly, 2=Disagree a little, 3=Neither, 4=Agree a little, 5=Agree strongly, 6=Agree very much, 7=Agree absolutely.</p>

      {questions.map((q,i) => (
        <div key={i} className="mb-2">
          <span>{i+1}. {q.text}</span>
          {[1,2,3,4,5,6,7].map(v => (
            <label key={v} className="ml-2">
              <input
                type="radio"
                name={`q${i}`}
                checked={responses[i]===v}
                onChange={()=>handleChange(i,v)}
              /> {v}
            </label>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit} className="mt-4 p-2 bg-blue-600 rounded">Compute & Generate Prompt</button>

      {results && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl">Results</h2>
          <ul className="list-disc list-inside">
            {responses.map((v,i) => <li key={i}>Q{i+1}: {v}</li>)}
          </ul>
          {Object.entries(results.narrative).map(([t,n]) => (
            <div key={t} className="pt-2 border-t border-gray-700">
              <h3 className="font-semibold">{t}: {results.finalScores[t].toFixed(2)}</h3>
              <p>{n.text}</p>
              <p className="italic">Example: {n.example}</p>
            </div>
          ))}
        </div>
      )}

      {promptText && (
        <div className="mt-6">
          <h2 className="text-xl">ChatGPT Prompt</h2>
          <textarea readOnly value={promptText} className="w-full h-40 bg-gray-800 p-2" />
        </div>
      )}
    </div>
  );
}
