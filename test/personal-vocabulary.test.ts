import { describe, expect, it } from 'vitest'
import { mergeEntries, parsePersonalImport } from '../src/lib/personalVocabulary'

describe('personal vocabulary import', () => {
  it('imports phrases from Saladict tab export with context and note', () => {
    expect(parsePersonalImport('by contrast\t相比之下\tBy contrast, electricity use fell.\t作文')).toEqual([
      { word: 'by contrast', meaning: '相比之下', example: 'By contrast, electricity use fell.', note: '作文' },
    ])
  })

  it('imports the backtick-separated Saladict Anki format', () => {
    expect(parsePersonalImport('peak of`上下文`达到峰值`备注')).toEqual([
      { word: 'peak of', meaning: '达到峰值', example: '上下文', note: '备注' },
    ])
  })

  it('supports CSV headers and quoted commas', () => {
    expect(parsePersonalImport('word,meaning,example,note\n"by contrast","相比之下","First, second","写作"', 'saladict.csv')[0]).toMatchObject({
      word: 'by contrast', example: 'First, second', note: '写作',
    })
  })

  it('supports JSON and a phrase per line', () => {
    expect(parsePersonalImport('[{"text":"means of electricity generation","trans":"发电方式"}]', 'terms.json')[0].meaning).toBe('发电方式')
    expect(parsePersonalImport('by contrast\nover a period of').map(w => w.word)).toEqual(['by contrast', 'over a period of'])
  })

  it('updates duplicates without losing existing context', () => {
    const original = [{ word: 'By Contrast', meaning: '旧释义', example: 'example', note: 'memo' }]
    expect(mergeEntries(original, [{ word: 'by contrast', meaning: '相比之下' }])).toEqual([
      { word: 'by contrast', meaning: '相比之下', example: 'example', note: 'memo' },
    ])
  })
})
