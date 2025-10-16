import { Injectable } from '@nestjs/common'

// Optional: later you can call external LLMs; this is a safe local baseline.
@Injectable()
export class OrchestratorService {
  makeEasier(text: string) {
    const s = text.replace(/\(([^)]+)\)/g, ' $1 ').replace(/[,;:]/g, '.').replace(/\s+/g, ' ')
    const sentences = s.split('.').map(x => x.trim()).filter(Boolean)
    return sentences.map(x => (x.length > 120 ? this.splitLong(x) : x)).join('. ') + '.'
  }
  addELLGlossary(text: string) {
    const keyTerms = Array.from(new Set((text.match(/\b[A-Za-z]{8,}\b/g) ?? []).slice(0, 6)))
    const gloss = keyTerms.map(t => `- ${t}: (simple meaning here)`).join('\n')
    return `${text}\n\n---\nGlossary (ELL):\n${gloss}`
  }
  private splitLong(s: string) {
    const idx = s.indexOf(' ', Math.floor(s.length / 2))
    return idx > 0 ? `${s.slice(0, idx)}. ${s.slice(idx + 1)}` : s
  }
}
