import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WritingNotebook from '../src/components/WritingNotebook.vue'
import { WRITING_NOTES_KEY, WRITING_REVIEW_KEY, loadReviewRecords, loadWritingNotes, markReview, mergeWritingNotes, parseWritingArchive, parseWritingNotes, phraseTags, starterNotes } from '../src/lib/writingNotebook'
import { WRITING_PHRASES_KEY, allStarterPhrases, loadWritingPhrases } from '../src/lib/writingPhrases'

function findButton(wrapper: ReturnType<typeof mount>, label: string) {
  const result = wrapper.findAll('button').find(button => button.text().includes(label))
  if (!result)
    throw new Error(`Button not found: ${label}`)
  return result
}

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('Writing notebook', () => {
  it('keeps the existing expressions and initializes separate sample idea and error cards', async () => {
    const wrapper = mount(WritingNotebook)
    expect(loadWritingPhrases().phrases).toHaveLength(allStarterPhrases.length)
    expect(loadWritingNotes()).toHaveLength(starterNotes.length)
    await findButton(wrapper, '观点库').trigger('click')
    expect(wrapper.text()).toContain('Practical skills in education')
    expect(wrapper.text()).toContain('观点：')
    await findButton(wrapper, '错误库').trigger('click')
    expect(wrapper.text()).toContain('a slowly upward trend')
    expect(wrapper.text()).toContain('a slight upward trend')
    wrapper.unmount()
  })

  it('saves an idea with topic and question type, and can edit it across reloads', async () => {
    const wrapper = mount(WritingNotebook)
    await findButton(wrapper, '观点库').trigger('click')
    await findButton(wrapper, '添加观点').trigger('click')
    await wrapper.get('input[aria-label="观点标题"]').setValue('Access to education')
    await wrapper.get('textarea[aria-label="观点内容"]').setValue('Everyone deserves equal access to education.')
    await wrapper.get('form').findAll('select')[0].setValue('education')
    await wrapper.get('form').findAll('select')[1].setValue('discussion')
    await wrapper.get('form').trigger('submit')
    const stored = loadWritingNotes().find(note => note.kind === 'idea' && note.title === 'Access to education')
    expect(stored).toMatchObject({ kind: 'idea', topic: 'education', questionType: 'discussion' })
    wrapper.unmount()

    const reopened = mount(WritingNotebook)
    await findButton(reopened, '观点库').trigger('click')
    expect(reopened.text()).toContain('Access to education')
    const card = reopened.findAll('article').find(card => card.text().includes('Access to education'))
    await card!.findAll('button').find(button => button.text() === '编辑')!.trigger('click')
    await reopened.get('textarea[aria-label="观点内容"]').setValue('High-quality education should be accessible to all.')
    await reopened.get('form').trigger('submit')
    const updated = loadWritingNotes().find(note => note.id === stored?.id)
    expect(updated).toMatchObject({ kind: 'idea', point: 'High-quality education should be accessible to all.' })
    reopened.unmount()
  })

  it('saves an error correction, keeps deletion after reloading, and does not affect expressions', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const wrapper = mount(WritingNotebook)
    await findButton(wrapper, '错误库').trigger('click')
    await findButton(wrapper, '记录错误').trigger('click')
    await wrapper.get('textarea[aria-label="错误原句"]').setValue('at a decade interval')
    await wrapper.get('textarea[aria-label="错误修改"]').setValue('at ten-year intervals')
    await wrapper.get('form').trigger('submit')
    expect(loadWritingNotes().some(note => note.kind === 'error' && note.corrected === 'at ten-year intervals')).toBe(true)
    const card = wrapper.findAll('article').find(item => item.text().includes('at a decade interval'))
    await card!.findAll('button').find(button => button.text() === '删除')!.trigger('click')
    wrapper.unmount()

    expect(loadWritingNotes().some(note => note.kind === 'error' && note.original === 'at a decade interval')).toBe(false)
    expect(loadWritingPhrases().phrases).toHaveLength(allStarterPhrases.length)
    expect(loadWritingNotes()).toHaveLength(starterNotes.length)
  })

  it('searches across the three note kinds and filters by shared tags', async () => {
    const wrapper = mount(WritingNotebook)
    await findButton(wrapper, '全部笔记').trigger('click')
    await wrapper.get('input[aria-label="统一搜索写作笔记"]').setValue('slowly upward')
    expect(wrapper.findAll('article')).toHaveLength(1)
    expect(wrapper.text()).toContain('a slight upward trend')

    await wrapper.get('input[aria-label="统一搜索写作笔记"]').setValue('Practical skills in education')
    expect(wrapper.findAll('article')).toHaveLength(1)
    await wrapper.get('input[aria-label="统一搜索写作笔记"]').setValue('The line graph illustrates ...')
    expect(wrapper.text()).toContain('折线图展示')
    expect(wrapper.findAll('article')).toHaveLength(1)

    await wrapper.get('input[aria-label="统一搜索写作笔记"]').setValue('')
    await wrapper.get('select[aria-label="统一标签筛选"]').setValue('topic:education')
    expect(wrapper.text()).toContain('Practical skills in education')
    expect(wrapper.text()).not.toContain('a slowly upward trend')
    wrapper.unmount()
  })

  it('combines existing expression favorites and note favorites in one review list', async () => {
    const oldState = loadWritingPhrases()
    localStorage.setItem(WRITING_PHRASES_KEY, JSON.stringify({ ...oldState, favorites: ['starter-1'] }))
    const wrapper = mount(WritingNotebook)
    await findButton(wrapper, '观点库').trigger('click')
    const idea = wrapper.findAll('article').find(card => card.text().includes('Practical skills in education'))
    await idea!.get('button[aria-label="收藏笔记"]').trigger('click')
    await findButton(wrapper, '复习').trigger('click')
    expect(wrapper.text()).toContain('The line graph illustrates ...')
    expect(wrapper.text()).toContain('Practical skills in education')
    const reviewCard = wrapper.findAll('article').find(card => card.text().includes('Practical skills in education'))
    await reviewCard!.findAll('button').find(button => button.text().includes('完成本次复习'))!.trigger('click')
    expect(loadReviewRecords()[`idea:${starterNotes[0].id}`]?.count).toBe(1)
    wrapper.unmount()

    const reopened = mount(WritingNotebook)
    await findButton(reopened, '复习').trigger('click')
    expect(reopened.text()).toContain('已复习 1 次')
    expect(reopened.findAll('article')).toHaveLength(2)
    reopened.unmount()
  })

  it('updates the shared review list when a phrase is newly favorited inside the expression bank', async () => {
    const wrapper = mount(WritingNotebook)
    const first = wrapper.findAll('article').find(card => card.text().includes('The line graph illustrates ...'))
    expect(first).toBeDefined()
    await first!.get('button[aria-label="收藏短语"]').trigger('click')
    await findButton(wrapper, '复习').trigger('click')
    expect(wrapper.text()).toContain('The line graph illustrates ...')
    expect(wrapper.findAll('article')).toHaveLength(1)
    wrapper.unmount()
  })

  it('validates backups and merges old-style phrase backups without losing other notes', () => {
    const old = loadWritingPhrases()
    const parsed = parseWritingArchive(JSON.stringify(old))
    expect(parsed.phrases.phrases).toHaveLength(allStarterPhrases.length)
    expect(parsed.notes).toBeUndefined()
    expect(() => parseWritingArchive('{"phrases":[],"favorites":[],"notes":[{"id":"bad"}]}')).toThrow()
    expect(() => parseWritingNotes('[{"kind":"error","original":"wrong"}]')).toThrow()
    expect(markReview({}, 'phrase:starter-1', '2026-11-10')['phrase:starter-1'].count).toBe(1)
    expect(phraseTags(old.phrases[0])).toContain('category:t1-intro')

    const merged = mergeWritingNotes(loadWritingNotes(), [{ ...starterNotes[0], favorite: true }])
    expect(merged).toHaveLength(starterNotes.length)
    expect(merged.find(note => note.id === starterNotes[0].id)?.favorite).toBe(true)
    localStorage.setItem(WRITING_NOTES_KEY, JSON.stringify([]))
    localStorage.setItem(WRITING_REVIEW_KEY, JSON.stringify({ 'phrase:starter-1': { count: 3, lastReviewed: '2026-11-10' } }))
    expect(loadWritingNotes()).toEqual([])
    expect(loadReviewRecords()['phrase:starter-1'].count).toBe(3)
  })
})
