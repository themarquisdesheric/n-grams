import fs from 'fs';
import readline from 'readline';

const filePath = './borges.txt';

const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
});

// moving window to hold each bi-gram (two-word seqeuence)
const biGram = [];
// map to hold each word and the words that follow it
const biGrams = {};

async function createBiGram(filePath) {
  for await (const line of rl) {
    const words = line.split(' ');

    words.forEach((word) => {
      // strip punctuation and convert to lowercase
      const cleanWord = word.toLowerCase().replace(/[.;,\-_—:!?()"'`‘’“”]/g, '');
      // skip empty punctuation-only "words"
      if (cleanWord.length === 0) return;

      biGram.push(cleanWord);

      if (biGram.length === 2) {
        if (!biGrams[biGram[0]]) {
          biGrams[biGram[0]] = [biGram[1]];
        } else {
          biGrams[biGram[0]].push(biGram[1]);
        }
        // remove first word to maintain bi-gram window size
        biGram.shift();
      }
    });
  }

  return biGrams;
}

const getNextWord = (word) => {
  const nextWords = biGrams[word];
  // since we didn't dedupe the values, this tends to return the most probable next word
  const index = Math.floor(Math.random() * nextWords.length);
  return nextWords[index];
};

const generateSequence = (word, length = 25) => {
  if (!biGrams[word]) {
    console.log(`\nThe word "${word}" is not in the text. Please try another word.`);
    return;
  }

  console.log(`\nYou chose "${word}"`);

  const sequence = [word];

  for (let i = 0; i < length; i++) {
    const nextWord = getNextWord(word);

    sequence.push(nextWord);
    word = nextWord;
  }

  console.log(`\n${sequence.join(' ')}\n`);
}

const rlPrompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
  try {
    const biGrams = await createBiGram(filePath);

    rlPrompt.question('Choose a single word to begin generating Borgesian text: ', (answer) => {  
      const userWord = answer.trim().toLowerCase();

      if (!biGrams[userWord]) {
        console.log(`\nThe word "${userWord}" is not in the text. Please try another word.\n`);
        return;
      }
    
      generateSequence(userWord);

      rlPrompt.close();
    });
  } catch (err) {
    console.error(err);
  }
})();
