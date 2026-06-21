import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─────────────────────────────────────────────────────────────
// Japanese text normalization
// ─────────────────────────────────────────────────────────────

/**
 * JLPT N5-level kanji → hiragana replacement map.
 *
 * Why not wanakana? wanakana.toHiragana() converts katakana/romaji → hiragana
 * but has NO kanji dictionary — kanji pass through unchanged.
 * Why not kuroshiro/kuromoji? Requires a 20 MB Node.js dictionary, not viable
 * in a client-side Next.js page.
 *
 * This map covers every kanji Chrome Speech Recognition (ja-JP) realistically
 * returns for PeraPeraGo's jikoshoukai content, plus common N5 words. Entries are
 * ordered longest-match first so compound words resolve before single kanji.
 *
 * To extend for future lessons: add entries in longest-first order.
 */
const KANJI_MAP: [RegExp, string][] = [
  // ── Compounds first (longest match) ──────────────────────
  [/初めまして/g,   'はじめまして'],
  [/宜しく/g,       'よろしく'],
  [/高校生/g,       'こうこうせい'],
  [/中学生/g,       'ちゅうがくせい'],
  [/大学生/g,       'だいがくせい'],
  [/学生/g,         'がくせい'],
  [/先生/g,         'せんせい'],
  [/将来/g,         'しょうらい'],
  [/趣味/g,         'しゅみ'],
  [/音楽/g,         'おんがく'],
  [/食べ物/g,       'たべもの'],
  [/好き/g,         'すき'],
  [/名前/g,         'なまえ'],
  [/出身/g,         'しゅっしん'],
  [/日本語/g,       'にほんご'],
  [/日本/g,         'にほん'],
  [/韓国/g,         'かんこく'],
  [/中国/g,         'ちゅうごく'],
  [/学校/g,         'がっこう'],
  [/勉強/g,         'べんきょう'],
  [/友達/g,         'ともだち'],
  [/家族/g,         'かぞく'],
  [/仕事/g,         'しごと'],
  [/会社/g,         'かいしゃ'],
  [/電車/g,         'でんしゃ'],
  [/自転車/g,       'じてんしゃ'],
  [/映画/g,         'えいが'],
  [/読書/g,         'どくしょ'],
  [/料理/g,         'りょうり'],
  [/買い物/g,       'かいもの'],
  [/旅行/g,         'りょこう'],
  [/運動/g,         'うんどう'],
  // ── Single kanji ─────────────────────────────────────────
  [/私/g,   'わたし'],
  [/僕/g,   'ぼく'],
  [/俺/g,   'おれ'],
  [/彼/g,   'かれ'],
  [/彼女/g, 'かのじょ'],
  [/人/g,   'ひと'],
  [/今/g,   'いま'],
  [/何/g,   'なに'],
  [/時/g,   'とき'],
  [/年/g,   'とし'],
  [/歳/g,   'さい'],
  [/才/g,   'さい'],
  [/月/g,   'つき'],
  [/日/g,   'ひ'],
  [/来/g,   'き'],
  [/行/g,   'い'],
  [/聞/g,   'き'],
  [/見/g,   'み'],
  [/食/g,   'た'],
  [/飲/g,   'の'],
  [/書/g,   'か'],
  [/読/g,   'よ'],
  [/言/g,   'い'],
  [/話/g,   'はな'],
  [/思/g,   'おも'],
  [/知/g,   'し'],
  [/好/g,   'す'],
  [/大/g,   'おお'],
  [/小/g,   'ちい'],
  [/高/g,   'たか'],
  [/新/g,   'あたら'],
  [/古/g,   'ふる'],
]

/**
 * Converts kanji in a string to hiragana using the N5 replacement map.
 * Processes longest matches first to handle compound words correctly.
 */
export function kanjiToHiragana(str: string): string {
  let s = str
  for (const [pattern, reading] of KANJI_MAP) {
    s = s.replace(pattern, reading)
  }
  return s
}

/**
 * Converts full-width katakana to hiragana.
 * Katakana U+30A1–U+30F6 → Hiragana U+3041–U+3096 (offset -0x60)
 */
export function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  )
}

/**
 * Full normalization pipeline for Japanese speech recognition output.
 *
 * Steps:
 * 1. Convert kanji → hiragana (N5 map — handles "私は学生です" → "わたしはがくせいです")
 * 2. Convert remaining katakana → hiragana (handles "ワタシハ" → "わたしは")
 * 3. Remove punctuation / noise characters
 * 4. Collapse whitespace
 * 5. Trim
 *
 * Any kanji NOT in the map passes through as-is rather than being stripped,
 * so partial recognition still contributes to the similarity score.
 */
export function normalizeJapanese(str: string): string {
  let s = str
  s = kanjiToHiragana(s)
  s = katakanaToHiragana(s)
  s = s.replace(/[。、！？!?.…～〜「」『』【】()（）\s]+/g, ' ')
  s = s.trim()
  return s
}

// ─────────────────────────────────────────────────────────────
// Similarity scoring
// ─────────────────────────────────────────────────────────────

/**
 * Builds a bigram frequency map from a string.
 * Bigrams capture adjacent-character context, making the score
 * much more accurate than simple character-in-target matching.
 */
function buildBigrams(str: string): Map<string, number> {
  const map = new Map<string, number>()
  const s = str.replace(/\s/g, '')          // remove spaces for bigram building
  for (let i = 0; i < s.length - 1; i++) {
    const bigram = s[i] + s[i + 1]
    map.set(bigram, (map.get(bigram) ?? 0) + 1)
  }
  return map
}

/**
 * Sørensen–Dice coefficient on bigrams, scaled 0–100.
 * Falls back to single-character overlap for very short strings.
 */
function diceCoefficient(a: string, b: string): number {
  const aClean = a.replace(/\s/g, '')
  const bClean = b.replace(/\s/g, '')

  // Too short for bigrams — use character overlap
  if (aClean.length < 2 || bClean.length < 2) {
    const aChars = new Set(aClean.split(''))
    let hits = 0
    for (const ch of bClean) if (aChars.has(ch)) hits++
    return Math.round((hits / Math.max(aClean.length, bClean.length)) * 100)
  }

  const aBigrams = buildBigrams(a)
  const bBigrams = buildBigrams(b)

  let intersection = 0
  for (const [bigram, count] of aBigrams) {
    intersection += Math.min(count, bBigrams.get(bigram) ?? 0)
  }

  const total = (aClean.length - 1) + (bClean.length - 1)
  if (total === 0) return 100

  return Math.round((2 * intersection / total) * 100)
}

/**
 * Calculates beginner-friendly speaking similarity score (0–100).
 *
 * Both inputs are normalized before comparison:
 * - katakana → hiragana
 * - kanji stripped
 * - punctuation removed
 * - spaces collapsed
 *
 * A leniency boost (+15%) rewards partial matches and tolerates
 * browser speech recognition inconsistencies.
 */
export function calculateSimilarity(spoken: string, target: string): number {
  const norm = (s: string) => normalizeJapanese(s).toLowerCase()
  const spokenNorm = norm(spoken)
  const targetNorm = norm(target)

  if (spokenNorm === targetNorm) return 100
  if (spokenNorm.length === 0) return 0

  const base = diceCoefficient(spokenNorm, targetNorm)

  // Leniency boost: +15 points, capped at 100
  // Rationale: beginner learners and browser SR errors should not be penalised harshly
  const boosted = Math.min(100, base + 15)
  return boosted
}

/**
 * Speaking feedback label for display.
 */
export function getSpeakingFeedback(score: number): { text: string; color: string } {
  if (score >= 90) return { text: 'Excellent! 🎉',   color: 'text-green-600' }
  if (score >= 75) return { text: 'Good job! 👍',    color: 'text-blue-600' }
  if (score >= 60) return { text: 'Nice try! 😊',    color: 'text-yellow-600' }
  return             { text: 'Yuk coba lagi! 💪', color: 'text-orange-600' }
}
