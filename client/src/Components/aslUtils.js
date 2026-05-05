const timeWords = ["today", "tomorrow", "yesterday", "now"];

const removeWords = ["is", "am", "are", "was", "were", "the", "a", "an", "to"];

const questionWords = ["what", "where", "why", "when", "how"];

const negations = ["not", "don't", "dont", "no"];

const verbMap = {
  "going": "go",
  "eating": "eat",
  "playing": "play",
  "studying": "study",
  "running": "run",
  "does": "",
  "did": "",
  "done": "",
};

export function convertToASL(input) {
  let words = input
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);

  const isQuestion = words.some(w => questionWords.includes(w));
  const qWord = words.find(w => questionWords.includes(w));

  const time = words.filter(w => timeWords.includes(w));

  let rest = words.filter(w => !timeWords.includes(w));

  rest = rest.filter(w => !removeWords.includes(w));

  rest = rest.map(w => verbMap[w] !== undefined ? verbMap[w] : w);

  let neg = rest.filter(w => negations.includes(w));
  rest = rest.filter(w => !negations.includes(w));

  rest = rest.filter(Boolean);


  let result = [];

  if (time.length) result.push(...time);

  result.push(...rest);
  if (neg.length) result.push(...neg);
  if (isQuestion && qWord) {
    result.push(qWord);
  }

  return result.join(" ").toUpperCase();
}