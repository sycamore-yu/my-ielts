import { extendedStarterPhrases } from './writingPhraseExamples'

export const WRITING_PHRASES_KEY = 'my-ielts-writing-phrases-v1'
export const WRITING_STARTER_IDS_KEY = 'my-ielts-writing-seen-starters-v2'

export type WritingTask = 'task1' | 'task2'

export const writingChartTypes = [
  { id: 'bar', label: '柱状图', description: '对比类别高低；有年份时再描述变化。' },
  { id: 'table', label: '表格', description: '选取最大、最小值与显著差距，不逐格罗列。' },
  { id: 'line', label: '曲线图', description: '优先概括整体趋势，再写起点、终点与交叉点。' },
  { id: 'pie', label: '饼状图', description: '说明构成比例；多年份饼图才比较份额变化。' },
  { id: 'mixed', label: '混合图', description: '分别识别图表指标和单位，概括两图之间的联系。' },
  { id: 'map', label: '地图', description: '概括主要用途变化，再按方位描述改建与保留部分。' },
  { id: 'process', label: '流程图', description: 'Overview 说明起点、终点和总体阶段；细节按步骤写。' },
] as const

export const writingTopics = [
  { id: 'education', label: '教育类', description: '课程、教学方法、教育公平。' },
  { id: 'technology', label: '科技类', description: '技术应用、自动化、个人数据。' },
  { id: 'culture', label: '传统与文化类', description: '文化遗产、传统、跨文化理解。' },
  { id: 'urban', label: '城市化与全球化', description: '城市扩张、交通、国际联系。' },
  { id: 'government', label: '政府类', description: '公共支出、公共服务、政策取舍。' },
  { id: 'environment', label: '环境类', description: '能源、排放、生物多样性。' },
  { id: 'media', label: '媒体类', description: '社交媒体、广告、信息质量。' },
  { id: 'society', label: '社会生活类', description: '家庭、人际关系、就业、健康。' },
  { id: 'abstract', label: '抽象类', description: '幸福、自由、成功、个人责任。' },
] as const

export const writingQuestionTypes = [
  { id: 'opinion', label: '同意与否题', description: '明确立场并解释原因。' },
  { id: 'advantages', label: '利弊比较题', description: '区分列举利弊与判断哪方更重要。' },
  { id: 'discussion', label: '双边讨论题', description: '公平解释双方观点；题目要求时表达自己的观点。' },
  { id: 'report', label: '报告类', description: '常见原因、问题、解决方案或两问；按实际题干回答。' },
] as const

export type WritingChartType = typeof writingChartTypes[number]['id']
export type WritingTopic = typeof writingTopics[number]['id']
export type WritingQuestionType = typeof writingQuestionTypes[number]['id']

export interface WritingCategory {
  id: string
  task: WritingTask
  label: string
  description: string
}

export interface WritingPhrase {
  id: string
  task: WritingTask
  category: string
  text: string
  meaning: string
  example: string
  note: string
  /** Empty or omitted tags mean the expression is generally applicable. */
  chartTypes?: WritingChartType[]
  topics?: WritingTopic[]
  questionTypes?: WritingQuestionType[]
}

export interface WritingPhraseState {
  phrases: WritingPhrase[]
  favorites: string[]
}

export const writingCategories: WritingCategory[] = [
  { id: 't1-intro', task: 'task1', label: 'Introduction', description: '改写题目、说明图表' },
  { id: 't1-overview', task: 'task1', label: 'Overview', description: '总结最主要的趋势' },
  { id: 't1-size', task: 'task1', label: '大小·相等·超过', description: '高于、低于、接近、反超' },
  { id: 't1-share', task: 'task1', label: '占比·倍数', description: '百分比、差距、倍数' },
  { id: 't1-trend', task: 'task1', label: '上升·下降', description: '增长和减少的幅度' },
  { id: 't1-stable', task: 'task1', label: '稳定·波动', description: '基本不变、上下波动' },
  { id: 't1-extremes', task: 'task1', label: '峰值·时间', description: '起点、终点、最高和最低' },
  { id: 't1-compare', task: 'task1', label: '比较·衔接', description: '对照与转折' },
  { id: 't1-process', task: 'task1', label: '流程·地图', description: '流程图和地图题' },
  { id: 't2-intro', task: 'task2', label: 'Introduction', description: '背景、争议、立场' },
  { id: 't2-body', task: 'task2', label: 'Body · 论点', description: '段落主题句' },
  { id: 't2-reason', task: 'task2', label: '原因·解释', description: '说明原因与机制' },
  { id: 't2-example', task: 'task2', label: '举例·论证', description: '举例、支持论据' },
  { id: 't2-contrast', task: 'task2', label: '对比·让步', description: '回应不同观点' },
  { id: 't2-conclusion', task: 'task2', label: 'Conclusion', description: '总结、重申立场' },
]

// Original, reusable IELTS writing templates, not quotations from model essays.
// Fields: category, expression, meaning, example, usage note (optional).
const starterRows: Array<[string, string, string, string, string?]> = [
  ['t1-intro', 'The line graph illustrates ...', '折线图展示……', 'The line graph illustrates the percentage of workers employed in five industries.', '用 illustrates + 名词短语说明图表内容。'],
  ['t1-intro', 'The bar chart compares ... in terms of ...', '柱状图从……方面比较……', 'The bar chart compares four countries in terms of household spending.'],
  ['t1-intro', 'The table provides information about ...', '表格提供有关……的信息', 'The table provides information about energy consumption in three regions.'],
  ['t1-overview', 'Overall, ... accounted for the largest share throughout the period.', '总体而言，……在整个时期占比最高', 'Overall, services accounted for the largest share throughout the period.'],
  ['t1-overview', 'Overall, ... increased, whereas ... declined.', '总体而言，……上升，而……下降', 'Overall, employment in services increased, whereas manufacturing declined.'],
  ['t1-overview', 'The most noticeable feature is that ...', '最显著的特点是……', 'The most noticeable feature is that the gap widened over time.'],
  ['t1-overview', 'By the end of the period, ... had overtaken ...', '到期末，……已经超过……', 'By the end of the period, online sales had overtaken in-store sales.', '只在数据确实发生反超时使用。'],
  ['t1-size', '... was higher than ...', '……高于……', 'The figure for retail was higher than that for manufacturing.'],
  ['t1-size', '... was lower than ...', '……低于……', 'The proportion of workers in mining was lower than that in construction.'],
  ['t1-size', '... was almost equal to ...', '……与……几乎相等', 'The figure for construction was almost equal to that for manufacturing.'],
  ['t1-size', '... exceeded ... by ... percentage points.', '……比……高……个百分点', 'The share of services exceeded manufacturing by 27 percentage points.', '两个百分比相减是百分点，不是百分比。'],
  ['t1-size', '... overtook ... in ...', '……在……年反超……', 'The proportion of commuters using buses overtook that using trains in 2000.'],
  ['t1-share', '... accounted for approximately ...% of ...', '……约占……的……%', 'Services accounted for approximately 52% of the workforce.'],
  ['t1-share', 'The proportion of ... rose from ...% to ...%.', '……的比例从……%上升到……%', 'The proportion of service workers rose from 52% to 78%.'],
  ['t1-share', 'The figure for ... was roughly twice that for ...', '……的数据约为……的两倍', 'The figure for services was roughly twice that for manufacturing.'],
  ['t1-share', '... represented only a small fraction of ...', '……仅占……的一小部分', 'Mining represented only a small fraction of total employment.'],
  ['t1-trend', '... rose steadily from ... to ...', '……从……稳定上升至……', 'The share of services rose steadily from 52% to 78%.'],
  ['t1-trend', '... declined gradually over the period.', '……在此期间逐渐下降', 'The proportion employed in manufacturing declined gradually over the period.'],
  ['t1-trend', '... increased sharply between ... and ...', '……在……至……之间快速上升', 'The figure increased sharply between 1982 and 1992.'],
  ['t1-trend', '... fell by ... percentage points.', '……下降了……个百分点', 'Agriculture fell by around ten percentage points.', '适用于百分比数据的绝对差值。'],
  ['t1-stable', '... remained relatively stable at around ...', '……维持在约……', 'Employment in construction remained relatively stable at around 8%.'],
  ['t1-stable', '... fluctuated between ... and ...', '……在……与……之间波动', 'The proportion fluctuated between 7% and 10%.'],
  ['t1-stable', '... showed little change over the period.', '……在此期间几乎没有变化', 'The share of mining showed little change over the period.'],
  ['t1-stable', '... experienced a slight dip in ...', '……在……年小幅下降', 'The figure experienced a slight dip in 2002.'],
  ['t1-extremes', '... peaked at ... in ...', '……在……年达到……峰值', 'Employment in retail peaked at 35% in 2002.'],
  ['t1-extremes', '... reached its lowest point in ...', '……在……年达到最低点', 'The share of agriculture reached its lowest point in 2012.'],
  ['t1-extremes', '... started at ... and ended at ...', '……起始为……，结束时为……', 'The figure started at 25% and ended at around 10%.'],
  ['t1-compare', 'By contrast, ...', '相比之下，……', 'By contrast, agriculture experienced a steady decline.'],
  ['t1-compare', 'Meanwhile, ...', '与此同时，……', 'Meanwhile, the share of mining remained almost unchanged.'],
  ['t1-compare', 'The gap between ... and ... widened.', '……与……之间的差距扩大', 'The gap between services and manufacturing widened.'],
  ['t1-process', 'The process begins with ... and ends with ...', '该过程始于……，终于……', 'The process begins with collecting raw materials and ends with packaging.'],
  ['t1-process', '... is then transported to ...', '……随后被运往……', 'The material is then transported to a processing plant.'],
  ['t1-process', '... was converted into ...', '……被改造成……', 'The former industrial area was converted into a residential district.'],
  ['t2-intro', 'It is often argued that ...', '人们经常认为……', 'It is often argued that universities should focus on practical skills.'],
  ['t2-intro', 'While some people believe ..., others argue that ...', '一些人认为……，另一些人则认为……', 'While some people believe technology improves education, others argue that it reduces interaction.'],
  ['t2-intro', 'I believe that ... because ...', '我认为……，因为……', 'I believe that public transport deserves more funding because it benefits more residents.'],
  ['t2-body', 'One major advantage of ... is that ...', '……的一项主要优点是……', 'One major advantage of online learning is that students can study flexibly.'],
  ['t2-body', 'A further consideration is that ...', '另一个需要考虑的因素是……', 'A further consideration is that public libraries support lifelong learning.'],
  ['t2-body', 'The main drawback of ... is ...', '……的主要缺点是……', 'The main drawback of relying on cars is traffic congestion.'],
  ['t2-reason', 'This is largely because ...', '这主要是因为……', 'This is largely because many families cannot afford private education.'],
  ['t2-reason', 'One possible explanation is that ...', '一种可能的解释是……', 'One possible explanation is that young people prefer flexible working hours.'],
  ['t2-reason', 'As a result, ...', '因此，……', 'As a result, fewer people rely on private cars.'],
  ['t2-example', 'For example, ...', '例如，……', 'For example, employers may offer training to new graduates.'],
  ['t2-example', 'This can be illustrated by ...', '……可以说明这一点', 'This can be illustrated by the growth of community recycling programmes.'],
  ['t2-example', 'A case in point is ...', '一个典型例子是……', 'A case in point is the introduction of bike-sharing schemes in major cities.'],
  ['t2-contrast', 'However, this argument overlooks ...', '然而，这一观点忽略了……', 'However, this argument overlooks the needs of rural communities.'],
  ['t2-contrast', 'Although ... , ...', '尽管……，但是……', 'Although remote work saves commuting time, it can reduce face-to-face communication.'],
  ['t2-contrast', 'On the other hand, ...', '另一方面，……', 'On the other hand, stricter rules may increase costs.'],
  ['t2-conclusion', 'In conclusion, I believe that ...', '总之，我认为……', 'In conclusion, I believe that governments should prioritise public transport.'],
  ['t2-conclusion', 'On balance, ...', '权衡利弊后，……', 'On balance, the benefits of working from home outweigh the drawbacks.'],
  ['t2-conclusion', 'For these reasons, ...', '基于上述原因，……', 'For these reasons, schools should provide both academic and practical courses.'],
]

export const starterPhrases: WritingPhrase[] = starterRows.map(([category, text, meaning, example, note], index) => ({
  id: `starter-${index + 1}`,
  task: category.startsWith('t1-') ? 'task1' : 'task2',
  category,
  text,
  meaning,
  example,
  note: note || '',
}))

export const allStarterPhrases = [...starterPhrases, ...extendedStarterPhrases]

function validTags(tags: unknown, valid: readonly string[]) {
  return tags === undefined || (Array.isArray(tags) && tags.every(tag => typeof tag === 'string' && valid.includes(tag)))
}

function isPhrase(value: unknown): value is WritingPhrase {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return false
  const phrase = value as Record<string, unknown>
  const category = writingCategories.find(item => item.id === phrase.category)
  return typeof phrase.id === 'string' && !!phrase.id
    && typeof phrase.text === 'string' && !!phrase.text.trim()
    && typeof phrase.meaning === 'string'
    && typeof phrase.example === 'string'
    && typeof phrase.note === 'string'
    && validTags(phrase.chartTypes, writingChartTypes.map(item => item.id))
    && validTags(phrase.topics, writingTopics.map(item => item.id))
    && validTags(phrase.questionTypes, writingQuestionTypes.map(item => item.id))
    && !!category && category.task === phrase.task
}

export function parseWritingBackup(json: string): WritingPhraseState {
  const parsed: unknown = JSON.parse(json)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
    throw new Error('备份应包含 phrases 和 favorites')
  const data = parsed as Record<string, unknown>
  if (!Array.isArray(data.phrases) || !data.phrases.every(isPhrase)
    || !Array.isArray(data.favorites) || !data.favorites.every(id => typeof id === 'string'))
    throw new Error('备份格式错误，请选择从本页导出的 JSON 文件')
  return {
    phrases: data.phrases.map(phrase => ({ ...phrase })),
    favorites: [...new Set(data.favorites as string[])],
  }
}

export function loadWritingPhrases(storage: Pick<Storage, 'getItem' | 'setItem'> = localStorage): WritingPhraseState {
  let result: WritingPhraseState
  try {
    const saved = storage.getItem(WRITING_PHRASES_KEY)
    if (saved === null) {
      result = { phrases: allStarterPhrases.map(item => ({ ...item })), favorites: [] }
    }
    else {
      result = parseWritingBackup(saved)
      const previousSeen = storage.getItem(WRITING_STARTER_IDS_KEY)
      // V1 contained only starter-1 through starter-51. Treat their IDs as
      // already seen so user-deleted or edited entries remain untouched.
      const legacyIds = starterPhrases.map(item => item.id)
      let seen = legacyIds
      if (previousSeen !== null) {
        try {
          const parsed: unknown = JSON.parse(previousSeen)
          if (Array.isArray(parsed) && parsed.every(id => typeof id === 'string'))
            seen = parsed
        }
        catch {
          // Keep the V1 seen IDs if the optional migration marker is malformed.
        }
      }
      const known = new Set(seen)
      const existing = new Set(result.phrases.map(item => item.id))
      const additions = allStarterPhrases.filter(item => !known.has(item.id) && !existing.has(item.id))
      if (additions.length) {
        result = { ...result, phrases: [...result.phrases, ...additions.map(item => ({ ...item }))] }
        try {
          // Persist additions before marking them as seen. Otherwise a second
          // page load would omit them without any user action.
          storage.setItem(WRITING_PHRASES_KEY, JSON.stringify(result))
        }
        catch {
          return result
        }
      }
    }
  }
  catch {
    result = { phrases: allStarterPhrases.map(item => ({ ...item })), favorites: [] }
  }
  // A separate marker prevents restored starter entries after users delete them.
  // Do not discard loaded user data if their browser rejects a storage write.
  try {
    storage.setItem(WRITING_STARTER_IDS_KEY, JSON.stringify(allStarterPhrases.map(item => item.id)))
  }
  catch {}
  return result
}

export function mergeWritingBackup(current: WritingPhraseState, incoming: WritingPhraseState): WritingPhraseState {
  const byId = new Map(current.phrases.map(item => [item.id, item]))
  for (const phrase of incoming.phrases)
    byId.set(phrase.id, phrase)
  const phrases = [...byId.values()]
  const existingIds = new Set(phrases.map(item => item.id))
  return {
    phrases,
    favorites: [...new Set([...current.favorites, ...incoming.favorites])].filter(id => existingIds.has(id)),
  }
}
