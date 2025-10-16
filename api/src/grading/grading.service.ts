import { Injectable } from '@nestjs/common'

@Injectable()
export class GradingService {
  previewCheck(answer: string, rubricKeywords: string[] = []){
    const missing = rubricKeywords.filter(k => !new RegExp(`\\b${escapeReg(k)}\\b`, 'i').test(answer))
    const hints: string[] = []
    if(answer.trim().length < 40) hints.push('Add one more sentence explaining your reasoning.')
    if(missing.length) hints.push(`Consider including: ${missing.slice(0,3).join(', ')}.`)
    return { ok: true, confidence: Math.max(0.3, 1 - missing.length * 0.15), hints: hints.slice(0,2) }
  }
}
function escapeReg(s:string){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
