import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WritingPhraseBook from '../src/components/WritingPhraseBook.vue'
import WritingPage from '../src/pages/writing/index.vue'
import { WRITING_PHRASES_KEY, WRITING_STARTER_IDS_KEY, allStarterPhrases, loadWritingPhrases, mergeWritingBackup, parseWritingBackup, starterPhrases, writingCategories, writingChartTypes, writingQuestionTypes, writingTopics } from '../src/lib/writingPhrases'

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

  it('includes all requested trend expressions without duplicating By contrast', () => {
    const requested = [
      ['despite some fluctuations', '尽管存在一些波动', 't1-stable'],
      ['remained dominant thereafter', '此后一直占据主导地位', 't1-overview'],
      ['followed similar patterns', '呈现相似的变化趋势', 't1-compare'],
      ['experienced a more modest rise', '增幅相对较小', 't1-trend'],
      ['before surging to a peak of', '随后猛增至峰值', 't1-extremes'],
      ['It subsequently fell to...', '随后下降至……', 't1-trend'],
      ['After a slight decline...', '小幅下降之后……', 't1-trend'],
      ['By contrast, ...', '相比之下，……', 't1-compare'],
    ]
    expect(allStarterPhrases).toHaveLength(171)
    for (const [text, meaning, category] of requested) {
      const matches = allStarterPhrases.filter(entry => entry.text === text)
      expect(matches).toHaveLength(1)
      expect(matches[0]).toMatchObject({ task: 'task1', meaning, category })
      expect(matches[0].example.length).toBeGreaterThan(25)
    }
  })

  it('upgrades the earlier 141-phrase bank without resetting favorites or deletions', () => {
    const previous = allStarterPhrases.filter(item => !item.id.startsWith('reference-') || Number(item.id.slice(10)) <= 90)
    expect(previous).toHaveLength(141)
    const old = {
      phrases: previous.filter(item => item.id !== 'reference-2')
        .map(item => item.id === 'starter-29' ? { ...item, meaning: '我的个性化释义' } : item),
      favorites: ['starter-29'],
    }
    localStorage.setItem(WRITING_PHRASES_KEY, JSON.stringify(old))
    localStorage.setItem(WRITING_STARTER_IDS_KEY, JSON.stringify(previous.map(item => item.id)))

    const updated = loadWritingPhrases()
    expect(updated.phrases).toHaveLength(170)
    expect(updated.phrases.some(item => item.id === 'reference-91')).toBe(true)
    expect(updated.phrases.some(item => item.id === 'reference-97')).toBe(true)
    expect(updated.phrases.some(item => item.id === 'reference-120')).toBe(true)
    expect(updated.phrases.some(item => item.id === 'reference-2')).toBe(false)
    expect(updated.phrases.find(item => item.id === 'starter-29')?.meaning).toBe('我的个性化释义')
    expect(updated.favorites).toEqual(['starter-29'])
    expect(loadWritingPhrases().phrases).toHaveLength(170)
    expect(localStorage.getItem(WRITING_STARTER_IDS_KEY)).toContain('reference-97')
  })

  it('distils time sequencing, peak/low values and cross-category rankings', () => {
    const requested = [
      ['..., before climbing to ...', 't1-trend', 'before + doing'],
      ['..., after which it climbed to ...', 't1-trend', '完整的主语和谓语'],
      ['subsequently', 't1-trend', '副词'],
      ['This was followed by + noun phrase', 't1-trend', '名词短语'],
      ['... reached a peak of ...', 't1-extremes', '最高点'],
      ['... reached its highest level of ...', 't1-extremes', '最高点'],
      ['... hit a high of ...', 't1-extremes', '时间峰值'],
      ['... reached a period high of ...', 't1-extremes', '图示时期'],
      ['... recorded the highest figure.', 't1-size', '比较类别'],
      ['... remained the largest category.', 't1-size', '整个所述时段'],
      ['... ranked first in ...', 't1-size', '排名'],
      ['... dominated ...', 't1-size', '显著领先'],
      ['... exceeded the other two modes.', 't1-size', '同一指标'],
      ['... reached a low of ...', 't1-extremes', '最低值'],
      ['... hit a low of ...', 't1-extremes', '时间上的低点'],
      ['... fell to its lowest level ...', 't1-extremes', '此前下降'],
      ['... bottomed out at ...', 't1-extremes', '回升'],
      ['... reached a minimum of ...', 't1-extremes', '最小值'],
      ['... recorded the lowest figure.', 't1-size', '绝对运输量'],
      ['... remained the smallest category.', 't1-size', '整个观察期'],
      ['... ranked last in ...', 't1-size', '类别排名'],
      ['... accounted for the smallest share of ...', 't1-share', '构成比例'],
      ['... remained below the other two ...', 't1-size', '同一指标'],
    ] as const
    for (const [text, category, usage] of requested) {
      const matches = allStarterPhrases.filter(item => item.text === text)
      expect(matches).toHaveLength(1)
      expect(matches[0]).toMatchObject({ task: 'task1', category })
      expect(matches[0].example.length).toBeGreaterThan(35)
      expect(matches[0].note).toContain(usage)
    }
    expect(allStarterPhrases.filter(item => item.text === '... peaked at ... in ...')).toHaveLength(1)
  })

  it('imports new entries for an existing 148-phrase library and keeps manual changes and deletions', () => {
    const old = allStarterPhrases.filter(item => !item.id.startsWith('reference-') || Number(item.id.slice(10)) <= 97)
    expect(old).toHaveLength(148)
    const state = {
      phrases: old.filter(item => item.id !== 'starter-2')
        .map(item => item.id === 'reference-97' ? { ...item, note: '我自己补充的备注' } : item),
      favorites: ['reference-97'],
    }
    localStorage.setItem(WRITING_PHRASES_KEY, JSON.stringify(state))
    localStorage.setItem(WRITING_STARTER_IDS_KEY, JSON.stringify(old.map(item => item.id)))

    const upgraded = loadWritingPhrases()
    expect(upgraded.phrases).toHaveLength(170)
    expect(upgraded.phrases.find(item => item.id === 'reference-97')?.note).toBe('我自己补充的备注')
    expect(upgraded.phrases.some(item => item.id === 'starter-2')).toBe(false)
    expect(upgraded.favorites).toEqual(['reference-97'])
    expect(upgraded.phrases.some(item => item.id === 'reference-98')).toBe(true)
    expect(upgraded.phrases.some(item => item.id === 'reference-120')).toBe(true)
    expect(loadWritingPhrases().phrases).toHaveLength(170)
    expect(localStorage.getItem(WRITING_STARTER_IDS_KEY)).toContain('reference-120')
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
