import fs from 'fs';
import readline from 'readline';

const filePath = './borges.txt';

const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
});

async function readLines(filePath) {
  for await (const line of rl) {
    console.log(line);
  }
}

readLines(filePath).catch(console.error);
