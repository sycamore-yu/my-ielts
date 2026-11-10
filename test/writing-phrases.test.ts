import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WritingPhraseBook from '../src/components/WritingPhraseBook.vue'
import WritingPage from '../src/pages/writing/index.vue'
import { WRITING_PHRASES_KEY, loadWritingPhrases, mergeWritingBackup, parseWritingBackup, starterPhrases, writingCategories } from '../src/lib/writingPhrases'

function button(wrapper: ReturnType<typeof mount>, label: string) {
  const match = wrapper.findAll('button').find(item => item.text().includes(label))
  if (!match)
    throw new Error(`Missing button: ${label}`)
  return match
}

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('IELTS writing phrase library', () => {
  it('ships Task 1 and Task 2 examples grouped by writing function', () => {
    expect(starterPhrases.length).toBeGreaterThanOrEqual(40)
    expect(writingCategories.map(item => item.label)).toContain('Overview')
    expect(writingCategories.map(item => item.label)).toContain('大小·相等·超过')
    expect(starterPhrases.some(item => item.task === 'task2' && item.category === 't2-conclusion')).toBe(true)
    expect(loadWritingPhrases().phrases).toHaveLength(starterPhrases.length)
  })

  it('saves custom phrases, category edits, and favorites across remounts', async () => {
    const wrapper = mount(WritingPhraseBook)
    expect(wrapper.text()).toContain('Overall, ...')
    await button(wrapper, '添加短语').trigger('click')
    await wrapper.get('input[placeholder="accounted for the largest proportion of ..."]').setValue('surpassed the figure for ...')
    await wrapper.get('input[placeholder="占……的最大比例"]').setValue('超过……的数值')
    await wrapper.findAll('select')[1].setValue('t1-size')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('surpassed the figure for ...')
    const stored = loadWritingPhrases()
    const added = stored.phrases.find(item => item.text === 'surpassed the figure for ...')
    expect(added?.category).toBe('t1-size')
    expect(added?.meaning).toBe('超过……的数值')

    const card = wrapper.findAll('article').find(item => item.text().includes('surpassed the figure for ...'))
    expect(card).toBeDefined()
    await card!.get('button[aria-label="收藏短语"]').trigger('click')
    expect(loadWritingPhrases().favorites).toEqual([added!.id])
    wrapper.unmount()

    const reopened = mount(WritingPhraseBook)
    await button(reopened, '大小·相等·超过').trigger('click')
    expect(reopened.text()).toContain('surpassed the figure for ...')
    expect(reopened.text()).toContain('已收藏')
    reopened.unmount()
  })

  it('rejects duplicates in one category without deleting existing content', async () => {
    const wrapper = mount(WritingPhraseBook)
    const originalCount = loadWritingPhrases().phrases.length
    await button(wrapper, '添加短语').trigger('click')
    await wrapper.get('input[placeholder="accounted for the largest proportion of ..."]').setValue('  THE LINE GRAPH ILLUSTRATES ...  ')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.text()).toContain('此分类已有相同表达')
    expect(loadWritingPhrases().phrases).toHaveLength(originalCount)
    wrapper.unmount()
  })

  it('can edit and delete a phrase without restoring it on reload', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const wrapper = mount(WritingPhraseBook)
    const original = wrapper.findAll('article').find(item => item.text().includes('The line graph illustrates ...'))
    expect(original).toBeDefined()
    await original!.findAll('button').find(item => item.text() === '编辑')!.trigger('click')
    await wrapper.get('input[placeholder="占……的最大比例"]').setValue('用于引言改写')
    await wrapper.get('form').trigger('submit')
    expect(loadWritingPhrases().phrases.find(item => item.id === 'starter-1')?.meaning).toBe('用于引言改写')

    const updated = wrapper.findAll('article').find(item => item.text().includes('The line graph illustrates ...'))
    await updated!.findAll('button').find(item => item.text() === '删除')!.trigger('click')
    expect(loadWritingPhrases().phrases.some(item => item.id === 'starter-1')).toBe(false)
    wrapper.unmount()

    const reopened = mount(WritingPhraseBook)
    expect(reopened.text()).not.toContain('The line graph illustrates ...')
    reopened.unmount()
  })

  it('filters Task 2 conclusions and searches within the chosen task', async () => {
    const wrapper = mount(WritingPhraseBook)
    await button(wrapper, 'Task 2 · 大作文').trigger('click')
    await button(wrapper, 'Conclusion').trigger('click')
    expect(wrapper.text()).toContain('In conclusion, I believe that ...')
    expect(wrapper.text()).not.toContain('The bar chart compares ...')
    await wrapper.get('input[type="search"]').setValue('On balance')
    expect(wrapper.findAll('article')).toHaveLength(1)
    wrapper.unmount()
  })

  it('supports JSON backups and merging without duplicates', () => {
    const saved = loadWritingPhrases()
    const parsed = parseWritingBackup(JSON.stringify(saved))
    expect(mergeWritingBackup(saved, parsed).phrases).toHaveLength(starterPhrases.length)
    expect(() => parseWritingBackup('{"phrases":[{"text":"bad"}],"favorites":[]}')).toThrow('备份格式错误')
    localStorage.setItem(WRITING_PHRASES_KEY, '{broken')
    expect(loadWritingPhrases().phrases).toHaveLength(starterPhrases.length)
  })

  it('keeps the original 100-sentence practice accessible', async () => {
    const wrapper = mount(WritingPage)
    expect(wrapper.text()).toContain('写作短语库')
    await button(wrapper, '100 句翻译练习').trigger('click')
    expect(wrapper.text()).toContain('经常做运动会提高人的自信')
    wrapper.unmount()
  })
})
