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

// Narrative templates enriched with examples and entertainment counterparts
const narrativeTemplates = {
  Extraversion: {
    high: {
      text: "You are sociable, assertive, talkative, and active (extraverted and enthusiastic).",
      example: "You organized a lively group discussion and effortlessly engaged everyone.",
      character: "Tony Stark (Iron Man)"
    },
    moderatelyHigh: {
      text: "You are generally sociable and energetic, though sometimes reserved.",
      example: "You join parties and chat, but occasionally take a step back to observe.",
      character: "Peter Quill (Star-Lord)"
    },
    moderatelyLow: {
      text: "You show some sociability but often prefer quieter activities.",
      example: "You enjoy small gatherings and one-on-one conversations over big crowds.",
      character: "Bilbo Baggins"
    },
    low: {
      text: "You tend to be reserved, quiet, and introspective.",
      example: "You often stay silent at social events, preferring to listen and reflect.",
      character: "Bruce Wayne (Batman)"
    }
  },
  Agreeableness: {
    high: {
      text: "You are trusting, generous, sympathetic, and cooperative (sympathetic and warm).",
      example: "You volunteered to help a friend move without hesitation.",
      character: "Samwise Gamgee"
    },
    moderatelyHigh: {
      text: "You’re mostly warm and cooperative, but can critically appraise when needed.",
      example: "You offer support but speak up if you notice a mistake in the plan.",
      character: "Hermione Granger"
    },
    moderatelyLow: {
      text: "You balance kindness with a tendency to point out faults.",
      example: "You help colleagues but don’t shy away from constructive feedback.",
      character: "Tyrion Lannister"
    },
    low: {
      text: "You may be critical, quarrelsome, and competitive.",
      example: "You frequently challenge others’ ideas during debates.",
      character: "Dr. Gregory House"
    }
  },
  Conscientiousness: {
    high: {
      text: "You are organized, hardworking, responsible, and self-disciplined (dependable).",
      example: "You created a detailed schedule and followed it meticulously.",
      character: "Hermione Granger"
    },
    moderatelyHigh: {
      text: "You’re usually reliable and organized, with occasional spontaneity.",
      example: "You prepare for deadlines but sometimes take breaks to improvise.",
      character: "Indiana Jones"
    },
    moderatelyLow: {
      text: "You plan ahead but sometimes act more impulsively or carelessly.",
      example: "You set goals but occasionally rush tasks at the last minute.",
      character: "Jack Sparrow"
    },
    low: {
      text: "You may be disorganized, careless, and impulsive.",
      example: "You often miss appointments and leave tasks unfinished.",
      character: "Deadpool"
    }
  },
  "Emotional Stability": {
    high: {
      text: "You are relaxed, confident, and emotionally stable (calm).",
      example: "You remained composed during a crisis, making clear decisions.",
      character: "Superman"
    },
    moderatelyHigh: {
      text: "You tend to stay calm and confident but may occasionally feel stressed.",
      example: "You handled a tight deadline well, with only brief moments of worry.",
      character: "Katniss Everdeen"
    },
    moderatelyLow: {
      text: "You manage stress fairly well but sometimes feel anxious or moody.",
      example: "You completed most tasks under pressure but had moments of doubt.",
      character: "Frodo Baggins"
    },
    low: {
      text: "You may be anxious, moody, and easily upset.",
      example: "You often react strongly to criticism and withdraw when upset.",
      character: "Sheldon Cooper"
    }
  },
  Openness: {
    high: {
      text: "You are curious, imaginative, reflective, and creative (open to new experiences).",
      example: "You designed an original art project exploring abstract ideas.",
      character: "Doctor Strange"
    },
    moderatelyHigh: {
      text: "You enjoy new ideas and creativity, though you also value routine.",
      example: "You try new recipes but still stick to your favorite meals regularly.",
      character: "Alice (Alice in Wonderland)"
    },
    moderatelyLow: {
      text: "You’re open to some new experiences but also prefer familiar approaches.",
      example: "You read diverse genres but often return to your favorite authors.",
      character: "Jim Halpert"
    },
    low: {
      text: "You prefer conventional approaches and familiar experiences.",
      example: "You follow established routines and avoid experimental ideas.",
      character: "Darth Vader"
    }
  }
};

export default function BFI10App() {
  const [responses, setResponses] = useState(Array(10).fill(4));
  const [results, setResults] = useState(null);

  const handleChange = (index, value) => {
    const updated = [...responses];
    updated[index] = value;
    setResponses(updated);
  };

  const handleSubmit = () => {
    // Aggregate scores by trait
    const traitScores = questions.reduce((acc, { trait }) => {
      acc[trait] = [];
      return acc;
    }, {});
    questions.forEach(({ trait, reversed }, idx) => {
      const raw = responses[idx];
      const score = reversed ? reverseScore(raw) : raw;
      traitScores[trait].push(score);
    });

    // Compute mean scores
    const finalScores = {};
    Object.entries(traitScores).forEach(([trait, vals]) => {
      finalScores[trait] = vals.reduce((sum, v) => sum + v, 0) / vals.length;
    });

    // Define thresholds
    const lowThreshold = 4.0;
    const highThreshold = 5.5;
    const midThreshold = (lowThreshold + highThreshold) / 2;

    // Generate narrative based on thresholds
    const narrative = {};
    Object.entries(finalScores).forEach(([trait, score]) => {
      let category;
      if (score > highThreshold) category = 'high';
      else if (score > midThreshold) category = 'moderatelyHigh';
      else if (score >= lowThreshold) category = 'moderatelyLow';
      else category = 'low';
      narrative[trait] = narrativeTemplates[trait][category];
    });

    setResults({ scores: finalScores, narrative });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Ten-item Big Five Personality Test (TIPI)</h1>
      <div className="space-y-4">
        {questions.map(({ text }, i) => (
          <div key={i} className="flex items-center">
            <span className="mr-4 w-1/3">{i+1}. I see myself as: {text}</span>
            {[1,2,3,4,5,6,7].map(val => (
              <label key={val} className="mx-2">
                <input
                  type="radio"
                  name={`q${i}`}
                  value={val}
                  checked={responses[i] === val}
                  onChange={() => handleChange(i, val)}
                  className="accent-blue-400"
                />
                <span className="ml-1">{val}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button onClick={handleSubmit} className="bg-blue-500 px-6 py-3 rounded text-white">
          Compute Scores & Narrative
        </button>
      </div>

      {results && (
        <div className="mt-8 space-y-8">
          <h2 className="text-2xl font-semibold">Results</h2>
          {Object.entries(results.scores).map(([trait, score]) => (
            <div key={trait} className="bg-neutral-800 p-4 rounded">
              <h3 className="text-xl mb-2">{trait}: {score.toFixed(2)}</h3>
              <p>{results.narrative[trait].text}</p>
              <p className="mt-1"><strong>Example:</strong> {results.narrative[trait].example}</p>
              <p className="mt-1"><strong>Counterpart:</strong> {results.narrative[trait].character}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
