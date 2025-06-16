import React, { useState } from "react";

const questions = [
  { text: "Extraverted, enthusiastic", trait: "Extraversion", reversed: false },
  { text: "Critical, quarrelsome", trait: "Agreeableness", reversed: true },
  { text: "Dependable, self-disciplined", trait: "Conscientiousness", reversed: false },
  { text: "Anxious, easily upset", trait: "Emotional Stability", reversed: true },
  { text: "Open to new experiences, complex", trait: "Openness", reversed: false },
  { text: "Reserved, quiet", trait: "Extraversion", reversed: true },
  { text: "Sympathetic, warm", trait: "Agreeableness", reversed: false },
  { text: "Disorganized, careless", trait: "Conscientiousness", reversed: true },
  { text: "Calm, emotionally stable", trait: "Emotional Stability", reversed: false },
  { text: "Conventional, uncreative", trait: "Openness", reversed: true }
];

const reverseScore = (val) => 8 - val;

const narrativeTemplates = {
  Extraversion: {
    high: {
      text: "You are highly expressive, outgoing, and energized by social interaction. You seek stimulation through group activities and lively conversations, and you feel comfortable taking the lead or being the center of attention. You process ideas out loud, and your communication style is animated and fast-paced. In conversation, you're likely to jump in quickly, use humor, share anecdotes, and show enthusiasm.",
      example: "You organize gatherings, initiate small talk with strangers, and prefer brainstorming sessions over solitary work."
    },
    moderatelyHigh: {
      text: "You enjoy interacting with others and tend to bring energy to social situations, though you also value periods of quiet or reflection. You might feel most balanced when alternating between lively engagement and solo recharging. You’re comfortable with casual conversations, and your tone often leans upbeat and positive, especially in one-on-one or small-group settings.",
      example: "You attend events and contribute to discussions, but you also schedule alone time to reset."
    },
    moderatelyLow: {
      text: "You prefer smaller, calmer settings and often listen more than speak. While not withdrawn, you are selective about social engagement. You might find extended social settings draining and tend to avoid overly stimulating environments. Your tone is measured, and you respond thoughtfully rather than impulsively.",
      example: "You enjoy quiet dinners over loud parties and are most talkative around close friends."
    },
    low: {
      text: "You are introspective, soft-spoken, and cautious in social contexts. You may avoid small talk, feel overwhelmed in large gatherings, and prefer to observe rather than participate actively. You are thoughtful, private, and focused inward. In conversation, your tone is reserved, with longer pauses and minimal emotional expression unless prompted.",
      example: "You frequently opt out of social invitations and prefer solo hobbies like reading or journaling."
    }
  },

  Agreeableness: {
    high: {
      text: "You are genuinely empathetic, cooperative, and considerate of others’ feelings. You often place group harmony above personal gain and avoid conflict unless absolutely necessary. Your tone is warm, and your responses aim to validate, reassure, and build rapport.",
      example: "You volunteer to help others and express gratitude regularly."
    },
    moderatelyHigh: {
      text: "You are kind and tactful, with a balanced approach to social dynamics. While generally warm and supportive, you are also willing to assert yourself when needed. Your tone blends empathy with clarity, often diffusing tension.",
      example: "You offer help but also express your own needs calmly."
    },
    moderatelyLow: {
      text: "You are direct and may prioritize honesty over diplomacy. While you are not unfriendly, you might seem critical or skeptical. You value truth and logic, and your tone is often blunt but well-intended.",
      example: "You challenge ideas during discussions to improve outcomes."
    },
    low: {
      text: "You are assertive, pragmatic, and not easily swayed by emotional appeals. You may be perceived as competitive or confrontational, and you do not hesitate to question others. Your tone is often firm, logical, and focused on results rather than emotional nuance.",
      example: "You rarely offer emotional support and prefer to 'get to the point.'"
    }
  },

  Conscientiousness: {
    high: {
      text: "You are diligent, goal-oriented, and highly organized. You set detailed plans and follow through, valuing discipline and dependability. Your speech often reflects order, structure, and forward-thinking. You may avoid improvisation in favor of control.",
      example: "You create schedules and stick to deadlines rigorously."
    },
    moderatelyHigh: {
      text: "You are reasonably reliable and tend to plan ahead, but you allow for some flexibility. You aim for efficiency while tolerating occasional detours. Your tone suggests intention and focus, with openness to change when needed.",
      example: "You keep to-do lists but adjust them on the fly."
    },
    moderatelyLow: {
      text: "You may intend to stay organized but often find yourself distracted. While capable of discipline, it requires more effort and motivation. You tend to be adaptable but can forget details or procrastinate.",
      example: "You plan loosely but struggle with consistency."
    },
    low: {
      text: "You are spontaneous and operate without strict routines. Planning ahead feels restrictive, and long-term commitments may be overwhelming. Your tone is relaxed and informal, reflecting an in-the-moment approach.",
      example: "You often start projects impulsively and finish few."
    }
  },

  "Emotional Stability": {
    high: {
      text: "You are calm, resilient, and rarely overwhelmed by negative emotions. You manage stress well and think clearly under pressure. Your communication reflects emotional control, optimism, and steadiness.",
      example: "You keep your cool in tense situations and rarely lash out."
    },
    moderatelyHigh: {
      text: "You are generally composed and stable, though you may feel occasional worry or tension. You bounce back from difficulties and typically present a balanced emotional tone.",
      example: "You get nervous sometimes but recover quickly."
    },
    moderatelyLow: {
      text: "You experience emotional highs and lows, often feeling anxious or unsettled. Stress affects your communication, sometimes making you sound uncertain or defensive.",
      example: "You ruminate on negative feedback and seek reassurance."
    },
    low: {
      text: "You are emotionally reactive, sensitive to criticism, and prone to anxiety. Stress may dominate your thoughts and affect your ability to function. Your tone may fluctuate rapidly, revealing internal conflict.",
      example: "You become easily overwhelmed and retreat under pressure."
    }
  },

  Openness: {
    high: {
      text: "You are intellectually curious, creative, and drawn to complexity. You embrace ambiguity and new experiences. Your ideas are often abstract, and your tone reflects exploration, metaphor, and nuance.",
      example: "You discuss philosophical questions and love unfamiliar topics."
    },
    moderatelyHigh: {
      text: "You enjoy learning and experimenting with new things, but you also value structure. Your thinking blends novelty and tradition, and your communication mixes original insights with grounded reasoning.",
      example: "You read diverse books but revisit favorites regularly."
    },
    moderatelyLow: {
      text: "You are more practical than abstract and tend to prefer the familiar. You show mild curiosity but are slow to adopt new views. Your tone is straightforward and cautious toward change.",
      example: "You try new things only when necessary or safe."
    },
    low: {
      text: "You are conventional, literal, and grounded in tradition. You value facts over imagination and rarely question norms. Your tone is simple, clear, and rooted in everyday logic.",
      example: "You avoid trends and stick to proven methods."
    }
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
2 = Disagree moderately
3 = Disagree a little
4 = Neither agree nor disagree
5 = Agree a little
6 = Agree moderately
7 = Agree strongly

User responses:
${questions.map((q, i) => `${i+1}. I see myself as: ${q.text} — Answer: ${responses[i]}`).join('\n')}

Final trait scores:
${Object.entries(finalScores).map(([t, s]) => `${t}: ${s.toFixed(2)}`).join('\n')}

Trait interpretations:
${Object.entries(narrative).map(([t, n]) => `${t}:
Description: ${n.text}
Example: ${n.example}`).join('\n\n')}

Please simulate this user's personality in future interactions.`;

    setPromptText(prompt);
  };

  return (
    <div className="p-8 bg-white text-black font-serif max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ten-Item Personality Inventory (TIPI)</h1>
      <p className="mb-6">Please indicate the extent to which each pair of traits applies to you, even if one characteristic applies more strongly than the other.</p>

      <table className="w-full border text-sm mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">#</th>
            <th className="p-2 border text-left">I see myself as:</th>
            {[1,2,3,4,5,6,7].map(v => (
              <th key={v} className="p-2 border text-center">
                <div className="text-xs font-semibold">{v}</div>
                <div className="text-[10px] leading-tight mt-1">
                  {{
                    1: "Disagree strongly",
                    2: "Disagree moderately",
                    3: "Disagree a little",
                    4: "Neither agree nor disagree",
                    5: "Agree a little",
                    6: "Agree moderately",
                    7: "Agree strongly"
                  }[v]}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => (
            <tr key={i} className="border-t">
              <td className="p-2 border text-center align-top">{i+1}</td>
              <td className="p-2 border align-top">{q.text}</td>
              {[1,2,3,4,5,6,7].map(v => (
                <td key={v} className="text-center p-2 border">
                  <input
                    type="radio"
                    name={`q${i}`}
                    checked={responses[i] === v}
                    onChange={() => handleChange(i, v)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Compute & Generate Prompt</button>

      {results && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Trait Scores & Narratives</h2>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Trait</th>
                <th className="p-2 border">Score</th>
                <th className="p-2 border">Narrative</th>
                <th className="p-2 border">Example</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results.finalScores).map(([trait, score]) => (
                <tr key={trait}>
                  <td className="p-2 border font-semibold">{trait}</td>
                  <td className="p-2 border text-center">{score.toFixed(2)}</td>
                  <td className="p-2 border">{results.narrative[trait].text}</td>
                  <td className="p-2 border">{results.narrative[trait].example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {promptText && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Generated Prompt</h2>
          <textarea
            readOnly
            value={promptText}
            className="w-full h-96 border p-2 text-sm bg-gray-100"
          />
        </div>
      )}
    </div>
  );
}
