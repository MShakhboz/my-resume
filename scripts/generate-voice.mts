// Generates the chat robot's spoken greeting (public/voice/greeting-<locale>.m4a) with Gemini's
// text-to-speech, once, so every visitor hears the same male voice. Run with
// `pnpm voice:generate [locale…]` (GEMINI_API_KEY from .env.local). Needs macOS for `afconvert`.
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'

const MODEL = 'gemini-3.8-flash-tts'
/** A friendly male Gemini voice. */
const VOICE = process.env.VOICE ?? 'Achird'

const GREETINGS: Record<string, string> = {
  en: 'Hello! Feel free to ask my artificial intelligence assistant about me.',
  ru: 'Здравствуйте! Вы можете задать вопросы обо мне моему помощнику с искусственным интеллектом.',
  uz: 'Assalomu alaykum! Men haqimda sunʼiy intellekt yordamchimdan soʻrashingiz mumkin.',
}

// const STYLE: Record<string, string> = {
//   en: 'Say warmly and politely, in a calm, friendly voice:',
//   ru: 'Скажи тепло и вежливо, спокойным дружелюбным голосом:',
//   uz: 'Iliq va xushmuomala, sokin va samimiy ovozda oʻzbek tilida ayting:',
// }

const key = process.env.GEMINI_API_KEY
if (!key) {
  console.error('Set GEMINI_API_KEY in .env.local first.')
  process.exit(1)
}

/** 16-bit mono PCM → WAV, so afconvert can read it. */
function wav(pcm: Buffer, rate: number) {
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + pcm.length, 4)
  header.write('WAVEfmt ', 8)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20) // PCM
  header.writeUInt16LE(1, 22) // mono
  header.writeUInt32LE(rate, 24)
  header.writeUInt32LE(rate * 2, 28)
  header.writeUInt16LE(2, 32)
  header.writeUInt16LE(16, 34)
  header.write('data', 36)
  header.writeUInt32LE(pcm.length, 40)
  return Buffer.concat([header, pcm])
}

const locales = process.argv.slice(2).length
  ? process.argv.slice(2)
  : Object.keys(GREETINGS)
mkdirSync('public/voice', { recursive: true })

for (const locale of locales) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: 'POST',
      headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: GREETINGS[locale] }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } },
          },
        },
      }),
    },
  )
  const json = await response.json()
  const audio = json.candidates?.[0]?.content?.parts?.find(
    (p: { inlineData?: unknown }) => p.inlineData,
  )?.inlineData
  if (!response.ok || !audio) {
    console.error(
      `${locale}: failed (${response.status})`,
      JSON.stringify(json.error ?? json).slice(0, 300),
    )
    process.exitCode = 1
    continue
  }
  // Gemini returns either a finished WAV file or raw 16-bit PCM ("audio/L16;rate=24000").
  const bytes = Buffer.from(audio.data, 'base64')
  const isWav = bytes.subarray(0, 4).toString('ascii') === 'RIFF'
  const rate = Number(/rate=(\d+)/.exec(audio.mimeType)?.[1] ?? 24000)
  const tmp = `public/voice/.greeting-${locale}.wav`
  writeFileSync(tmp, isWav ? bytes : wav(bytes, rate))
  const out = `public/voice/greeting-${locale}.m4a`
  execFileSync('afconvert', [
    '-f',
    'm4af',
    '-d',
    'aac',
    '-b',
    '64000',
    tmp,
    out,
  ])
  rmSync(tmp)
  console.log(`${locale}: ${out} (${audio.mimeType})`)
}
