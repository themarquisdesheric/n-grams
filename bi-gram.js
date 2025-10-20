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
const nextWords = {};

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
        if (!nextWords[biGram[0]]) {
          nextWords[biGram[0]] = [biGram[1]];
        } else {
          nextWords[biGram[0]].push(biGram[1]);
        }
        // remove first word to maintain bi-gram window size
        biGram.shift();
      }
    });
  }

  return nextWords;
}

(async () => {
  try {
    const biGrams = await createBiGram(filePath);
    console.log(biGrams);
  } catch (err) {
    console.error(err);
  }
})();
