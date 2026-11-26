import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Confess Your Worst Moment: one line, at most 200 characters.
// The program validates the confession and writes it to /output/entry.txt,
// where the sealed scorer reads it. Printing to stdout alone scores Valid 0.

function loadLine(): string {
  const text = readFileSync(new URL("./one-line.txt", import.meta.url), "utf8");
  return text.endsWith("\n") ? text.slice(0, -1) : text;
}

function problems(line: string): string[] {
  const found: string[] = [];
  const chars = [...line];
  if (chars.length < 1) found.push("the confession is empty");
  if (chars.length > 200) found.push(`the confession is ${chars.length} characters, over the 200 limit`);
  if (line.trim() !== line) found.push("the line has leading or trailing whitespace");
  if (line.includes("\n") || line.includes("\r")) found.push("the confession must be exactly one line");
  if (/\s\s/.test(line)) found.push("the line has a double space");
  if (/[^\x20-\x7E]/.test(line)) found.push("the line has a non-printable character");
  if (!/[.!?]$/.test(line)) found.push("the confession must end with . ! or ?");
  if (!line.includes(" ")) found.push("the confession is a single word");
  const quoteCount = line.split('"').length - 1;
  if (quoteCount % 2 !== 0) found.push("the confession has an unbalanced double quote");
  return found;
}

const line = loadLine();
const bad = problems(line);
if (bad.length > 0) {
  for (const p of bad) console.error("invalid entry: " + p);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), line + "\n");
console.log(line);
console.log(`confession written: ${[...line].length}/200 characters`);
