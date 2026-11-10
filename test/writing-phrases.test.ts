import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WritingPhraseBook from '../src/components/WritingPhraseBook.vue'
import WritingPage from '../src/pages/writing/index.vue'
import { WRITING_PHRASES_KEY, allStarterPhrases, loadWritingPhrases, mergeWritingBackup, parseWritingBackup, starterPhrases, writingCategories, writingChartTypes, writingQuestionTypes, writingTopics } from '../src/lib/writingPhrases'

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
    expect(loadWritingPhrases().phrases).toHaveLength(allStarterPhrases.length)
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
    await wrapper.get('input[type="search"]').setValue('working from home outweigh')
    expect(wrapper.findAll('article')).toHaveLength(1)
    wrapper.unmount()
  })

  it('supports JSON backups and merging without duplicates', () => {
    const saved = loadWritingPhrases()
    const parsed = parseWritingBackup(JSON.stringify(saved))
    expect(mergeWritingBackup(saved, parsed).phrases).toHaveLength(allStarterPhrases.length)
    expect(() => parseWritingBackup('{"phrases":[{"text":"bad"}],"favorites":[]}')).toThrow('备份格式错误')
    localStorage.setItem(WRITING_PHRASES_KEY, '{broken')
    expect(loadWritingPhrases().phrases).toHaveLength(allStarterPhrases.length)
  })

  it('supports all chart types, topics and question-type filters', async () => {
    expect(writingChartTypes.map(item => item.label)).toEqual(['柱状图', '表格', '曲线图', '饼状图', '混合图', '地图', '流程图'])
    expect(writingTopics).toHaveLength(9)
    expect(writingQuestionTypes.map(item => item.label)).toEqual(['同意与否题', '利弊比较题', '双边讨论题', '报告类'])

    for (const chart of writingChartTypes)
      expect(allStarterPhrases.some(item => item.chartTypes?.includes(chart.id))).toBe(true)
    for (const topic of writingTopics)
      expect(allStarterPhrases.some(item => item.topics?.includes(topic.id))).toBe(true)
    for (const question of writingQuestionTypes)
      expect(allStarterPhrases.some(item => item.questionTypes?.includes(question.id))).toBe(true)

    const wrapper = mount(WritingPhraseBook)
    await button(wrapper, '曲线图').trigger('click')
    expect(wrapper.text()).toContain('with the former having the largest number throughout the period')
    await button(wrapper, '地图').trigger('click')
    expect(wrapper.text()).toContain('A new ... was constructed to the north of ...')
    expect(wrapper.text()).not.toContain('with the former having the largest number throughout the period')

    await button(wrapper, 'Task 2 · 大作文').trigger('click')
    await button(wrapper, '环境类').trigger('click')
    expect(wrapper.text()).toContain('reduce greenhouse gas emissions')
    await button(wrapper, '利弊比较题').trigger('click')
    expect(wrapper.text()).toContain('advantages of ... outweigh its disadvantages')
    expect(wrapper.text()).not.toContain('The bar chart compares')
    wrapper.unmount()
  })

  it('tags user-created phrases with the selected chart or topic and question type', async () => {
    const wrapper = mount(WritingPhraseBook)
    await button(wrapper, '添加短语').trigger('click')
    await wrapper.get('input[placeholder="accounted for the largest proportion of ..."]').setValue('a new pie expression')
    await wrapper.get('select[aria-label="短语图表题型"]').setValue('pie')
    await wrapper.get('form').trigger('submit')
    expect(loadWritingPhrases().phrases.find(item => item.text === 'a new pie expression')?.chartTypes).toEqual(['pie'])

    await button(wrapper, 'Task 2 · 大作文').trigger('click')
    await button(wrapper, '添加短语').trigger('click')
    await wrapper.get('input[placeholder="accounted for the largest proportion of ..."]').setValue('a topic sentence')
    await wrapper.get('select[aria-label="短语话题"]').setValue('education')
    await wrapper.get('select[aria-label="短语问题题型"]').setValue('opinion')
    await wrapper.get('form').trigger('submit')
    const newPhrase = loadWritingPhrases().phrases.find(item => item.text === 'a topic sentence')
    expect(newPhrase?.topics).toEqual(['education'])
    expect(newPhrase?.questionTypes).toEqual(['opinion'])
    wrapper.unmount()
  })

  it('preserves V1 edits and deletions and imports only newly released expressions', () => {
    const legacy = {
      phrases: starterPhrases
        .filter(item => item.id !== 'starter-2')
        .map(item => item.id === 'starter-1' ? { ...item, meaning: '已手动修改的含义' } : item),
      favorites: ['starter-1'],
    }
    localStorage.setItem(WRITING_PHRASES_KEY, JSON.stringify(legacy))
    const upgraded = loadWritingPhrases()
    expect(upgraded.phrases.find(item => item.id === 'starter-1')?.meaning).toBe('已手动修改的含义')
    expect(upgraded.phrases.some(item => item.id === 'starter-2')).toBe(false)
    expect(upgraded.phrases.some(item => item.id === 'reference-1')).toBe(true)
    expect(upgraded.favorites).toEqual(['starter-1'])
    expect(loadWritingPhrases().phrases.some(item => item.id === 'reference-1')).toBe(true)

    localStorage.setItem(WRITING_PHRASES_KEY, JSON.stringify({
      ...upgraded,
      phrases: upgraded.phrases.filter(item => item.id !== 'reference-1'),
    }))
    expect(loadWritingPhrases().phrases.some(item => item.id === 'reference-1')).toBe(false)
  })

  it('keeps the original 100-sentence practice accessible', async () => {
    const wrapper = mount(WritingPage)
    expect(wrapper.text()).toContain('写作短语库')
    await button(wrapper, '100 句翻译练习').trigger('click')
    expect(wrapper.text()).toContain('经常做运动会提高人的自信')
    wrapper.unmount()
  })
})
