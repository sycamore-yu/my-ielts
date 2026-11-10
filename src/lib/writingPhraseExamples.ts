import type { WritingChartType, WritingPhrase, WritingQuestionType, WritingTopic } from './writingPhrases'

// New expressions and example sentences are original teaching examples.
// Simon's publicly available approach informs the categorisation and usage
// notes; none of these are presented as quotations from his model essays.
type Scope = `chart:${WritingChartType}` | `topic:${WritingTopic}` | `question:${WritingQuestionType}` | 'general:task1'
type Row = [Scope, string, string, string, string, string?]

const examples: Row[] = [
  // Task 1 — bar charts
  ['chart:bar', 't1-intro', 'The bar chart compares ... across ...', '柱状图比较不同……的……', 'The bar chart compares the average incomes of workers across six occupations.'],
  ['chart:bar', 't1-overview', 'Overall, ... recorded the highest figure, while ... had the lowest.', '总体而言，……最高，而……最低', 'Overall, transport recorded the highest figure, while clothing had the lowest.', '适用于没有时间轴的分类比较。'],
  ['chart:bar', 't1-size', 'The figure for ... was marginally higher than that for ...', '……的数据略高于……', 'The figure for France was marginally higher than that for Germany.'],
  ['chart:bar', 't1-size', '... and ... stood at comparable levels.', '……与……处于相近水平', 'Spending on books and games stood at comparable levels.'],
  ['chart:bar', 't1-compare', 'In comparison with ..., ... recorded ...', '与……相比，……达到……', 'In comparison with rural households, urban households recorded higher expenditure.'],
  ['chart:bar', 't1-share', '... represented approximately one-third of the total.', '……约占总量的三分之一', 'Food expenditure represented approximately one-third of the total.'],
  ['chart:bar', 't1-extremes', '... had the highest value among the categories shown.', '……在所示类别中数值最高', 'Housing had the highest value among the categories shown.'],

  // Task 1 — tables
  ['chart:table', 't1-intro', 'The table summarises figures for ... in ...', '表格汇总……在……的数值', 'The table summarises figures for household spending in four countries.'],
  ['chart:table', 't1-overview', 'Overall, ... consistently had the highest values.', '总体而言，……始终最高', 'Overall, Country A consistently had the highest values.', '仅在多个对比维度均支持此结论时使用。'],
  ['chart:table', 't1-size', '... was nearly three times as high as ...', '……几乎是……的 3 倍', 'The figure for transport was nearly three times as high as that for leisure.'],
  ['chart:table', 't1-share', '... accounted for just under a quarter of ...', '……占……的略低于四分之一', 'Education accounted for just under a quarter of total spending.'],
  ['chart:table', 't1-compare', 'The largest difference was observed between ... and ...', '最大差距出现在……与……之间', 'The largest difference was observed between the youngest and oldest groups.'],
  ['chart:table', 't1-compare', 'The corresponding figure for ... was ...', '……的对应数值为……', 'The corresponding figure for women was 42%.'],

  // Task 1 — line graphs and the former / latter example from the supplied screenshot
  ['chart:line', 't1-intro', 'The line graph shows how ... changed over time.', '折线图展示……随时间如何变化', 'The line graph shows how participation in five activities changed over time.'],
  ['chart:line', 't1-overview', '... and ... remained relatively stable, with the former having the largest number throughout the period.', '……与……总体稳定，其中前者在整个时期人数最多', 'The film club and martial arts remained relatively stable, with the former having the largest number throughout the period.', 'former 指前一个项目；latter 指后一个项目。人数用 number，不用 percentage。'],
  ['chart:line', 't1-compare', 'The former increased, whereas the latter declined.', '前者上升，而后者下降', 'Table tennis gained participants, whereas musical performances declined.', '示例中用具体项目更明确；former/latter 必须有清晰的两个先行项。'],
  ['chart:line', 't1-trend', '... rose gradually before levelling off.', '……逐渐上升，随后趋于稳定', 'The proportion rose gradually before levelling off at around 40%.'],
  ['chart:line', 't1-stable', '... stayed broadly unchanged despite minor fluctuations.', '……虽有轻微波动，但总体保持不变', 'Participation in martial arts stayed broadly unchanged despite minor fluctuations.'],
  ['chart:line', 't1-size', '... overtook ... towards the end of the period.', '……在接近期末时超过……', 'The figure for table tennis overtook that for music towards the end of the period.'],
  ['chart:line', 't1-extremes', '... reached a peak of ... before falling to ...', '……达到……的峰值，随后降至……', 'The proportion reached a peak of 35% before falling to 27%.'],
  ['chart:line', 't1-trend', '... increased by ... percentage points over the period.', '……在此期间上升了……个百分点', 'The employment share increased by 12 percentage points over the period.', '由 20% 到 32% 为 12 个百分点，不是增长 12%。'],

  // Task 1 — pie charts
  ['chart:pie', 't1-intro', 'The pie charts illustrate the composition of ...', '饼图展示……的构成', 'The pie charts illustrate the composition of household expenditure in two years.'],
  ['chart:pie', 't1-overview', 'Overall, ... made up the largest share of ...', '总体而言，……占……最大份额', 'Overall, housing made up the largest share of household expenditure.'],
  ['chart:pie', 't1-share', '... represented slightly more than a fifth of ...', '……占……的略多于五分之一', 'Transport represented slightly more than a fifth of total spending.'],
  ['chart:pie', 't1-share', 'Taken together, ... and ... accounted for ...', '……与……合计占……', 'Taken together, food and housing accounted for over half of all expenditure.'],
  ['chart:pie', 't1-size', 'The share of ... was roughly twice that of ...', '……的份额约为……的两倍', 'The share of transport was roughly twice that of entertainment.'],
  ['chart:pie', 't1-compare', '... gained a larger share at the expense of ...', '……的占比扩大，而……的占比缩小', 'Renewables gained a larger share at the expense of coal.', '适用于两个年份的饼图；不直接断言因果。'],

  // Task 1 — mixed charts
  ['chart:mixed', 't1-intro', 'The chart and table present information about ...', '图表与表格共同展示……的信息', 'The chart and table present information about tourism and visitor spending.'],
  ['chart:mixed', 't1-intro', 'The two graphics compare ... from different perspectives.', '两张图从不同角度比较……', 'The two graphics compare electricity production and consumption from different perspectives.'],
  ['chart:mixed', 't1-overview', 'Overall, both graphics suggest that ...', '总体而言，两张图都反映……', 'Overall, both graphics suggest that public transport became more widely used.'],
  ['chart:mixed', 't1-overview', 'While one chart shows ..., the other highlights ...', '一张图显示……，另一张图突出……', 'While one chart shows passenger numbers, the other highlights ticket prices.'],
  ['chart:mixed', 't1-compare', 'According to the table, ..., whereas the chart indicates ...', '表格显示……，而图表显示……', 'According to the table, costs rose, whereas the chart indicates that usage fell.', '单位不同的指标不能直接进行数值大小比较。'],
  ['chart:mixed', 't1-share', '... accounted for the largest proportion in both sets of data.', '……在两组数据中都占比最高', 'Domestic travel accounted for the largest proportion in both sets of data.'],

  // Task 1 — maps and comparison diagrams
  ['chart:map', 't1-intro', 'The maps illustrate how ... changed between ... and ...', '地图展示……在两年间的变化', 'The maps illustrate how a coastal town changed between 1990 and 2020.'],
  ['chart:map', 't1-overview', 'Overall, the area became more residential and better connected.', '总体而言，该地区住宅更多，交通更便捷', 'Overall, the area became more residential and better connected.', '仅在住宅建设和道路变化均明显时使用。'],
  ['chart:map', 't1-process', '... was replaced by ...', '……被……取代', 'The old warehouse was replaced by a public park.'],
  ['chart:map', 't1-process', 'A new ... was constructed to the north of ...', '……北面新建了……', 'A new bridge was constructed to the north of the railway station.'],
  ['chart:map', 't1-process', '... was converted into ...', '……被改造成……', 'The former factory was converted into a shopping centre.'],
  ['chart:map', 't1-stable', '... remained unchanged in its original location.', '……仍位于原址，未发生变化', 'The hospital remained unchanged in its original location.'],
  ['chart:map', 't1-compare', '... was expanded, while ... was removed.', '……得到扩建，而……被拆除', 'The car park was expanded, while the old sports field was removed.'],

  // Task 1 — process diagrams
  ['chart:process', 't1-intro', 'The diagram outlines the stages involved in ...', '流程图概述……的各个阶段', 'The diagram outlines the stages involved in producing recycled paper.'],
  ['chart:process', 't1-overview', 'Overall, the process consists of ... main stages.', '总体而言，该流程由……个主要阶段构成', 'Overall, the process consists of five main stages.'],
  ['chart:process', 't1-overview', 'The process begins with ... and ends with ...', '该流程始于……，终于……', 'The process begins with collection and ends with packaging.'],
  ['chart:process', 't1-process', '... is passed through ...', '……经过……处理', 'The mixture is passed through a filter.'],
  ['chart:process', 't1-process', 'Once ... has been ..., it is ...', '……完成后，再对其进行……', 'Once the water has been heated, it is transferred to a storage tank.'],
  ['chart:process', 't1-process', '... is subsequently converted into ...', '……随后转化为……', 'The raw material is subsequently converted into small pellets.'],
  ['chart:process', 't1-process', 'Finally, ... is packaged and transported.', '最后，……被包装并运走', 'Finally, the finished product is packaged and transported.', '描述制造过程通常使用一般现在时及被动语态。'],

  // Task 2 — education
  ['topic:education', 't2-body', 'equal access to quality education', '平等获得优质教育的机会', 'Public funding can help ensure equal access to quality education.'],
  ['topic:education', 't2-reason', 'develop critical thinking and problem-solving skills', '培养批判性思维与解决问题的能力', 'Schools should help students develop critical thinking and problem-solving skills.'],
  ['topic:education', 't2-example', 'provide practical training alongside academic subjects', '在学术课程之外提供实践训练', 'Colleges could provide practical training alongside academic subjects.'],

  // Task 2 — technology
  ['topic:technology', 't2-body', 'automate repetitive tasks', '自动化处理重复性任务', 'Artificial intelligence can automate repetitive tasks and increase productivity.'],
  ['topic:technology', 't2-reason', 'the growing digital divide', '不断扩大的数字鸿沟', 'The growing digital divide can leave low-income households at a disadvantage.'],
  ['topic:technology', 't2-contrast', 'protect personal data without restricting innovation', '保护个人数据，同时避免限制创新', 'Governments should protect personal data without restricting innovation.'],

  // Task 2 — traditions and culture
  ['topic:culture', 't2-body', 'preserve cultural heritage for future generations', '为后代保护文化遗产', 'Museums help preserve cultural heritage for future generations.'],
  ['topic:culture', 't2-reason', 'pass down traditional skills and customs', '传承传统技艺与习俗', 'Community programmes can pass down traditional skills and customs.'],
  ['topic:culture', 't2-contrast', 'promote cross-cultural understanding', '促进跨文化理解', 'Cultural exchanges can promote cross-cultural understanding.'],

  // Task 2 — urbanisation and globalisation
  ['topic:urban', 't2-body', 'put pressure on urban infrastructure', '给城市基础设施带来压力', 'Rapid population growth can put pressure on urban infrastructure.'],
  ['topic:urban', 't2-reason', 'reduce traffic congestion through better public transport', '通过改善公共交通缓解拥堵', 'Cities can reduce traffic congestion through better public transport.'],
  ['topic:urban', 't2-example', 'create opportunities for international trade', '创造国际贸易机会', 'Global supply chains can create opportunities for international trade.'],

  // Task 2 — government
  ['topic:government', 't2-body', 'allocate public funds to essential services', '将公共资金用于基本公共服务', 'Governments should allocate public funds to essential services.'],
  ['topic:government', 't2-reason', 'balance public spending with long-term priorities', '平衡公共支出与长期政策重点', 'Policy makers must balance public spending with long-term priorities.'],
  ['topic:government', 't2-contrast', 'regulate harmful activities without imposing unnecessary restrictions', '规范有害行为，同时避免不必要的限制', 'Authorities can regulate harmful activities without imposing unnecessary restrictions.'],

  // Task 2 — environment
  ['topic:environment', 't2-body', 'reduce greenhouse gas emissions', '减少温室气体排放', 'Investment in clean transport can reduce greenhouse gas emissions.'],
  ['topic:environment', 't2-reason', 'protect biodiversity and natural habitats', '保护生物多样性与自然栖息地', 'Conservation programmes protect biodiversity and natural habitats.'],
  ['topic:environment', 't2-example', 'shift towards renewable energy sources', '转向可再生能源', 'Many cities are beginning to shift towards renewable energy sources.'],

  // Task 2 — media
  ['topic:media', 't2-body', 'shape public opinion and consumer behaviour', '影响公众观点和消费行为', 'Advertising can shape public opinion and consumer behaviour.'],
  ['topic:media', 't2-reason', 'the rapid spread of misleading information', '误导性信息的快速传播', 'The rapid spread of misleading information makes media literacy essential.'],
  ['topic:media', 't2-example', 'teach students to evaluate online sources critically', '教学生批判性地判断网络信息来源', 'Schools can teach students to evaluate online sources critically.'],

  // Task 2 — social life
  ['topic:society', 't2-body', 'maintain meaningful face-to-face relationships', '维持有意义的面对面关系', 'Regular family gatherings help people maintain meaningful face-to-face relationships.'],
  ['topic:society', 't2-reason', 'improve work-life balance', '改善工作与生活的平衡', 'Flexible schedules can improve work-life balance.'],
  ['topic:society', 't2-example', 'meet the needs of an ageing population', '满足老龄化人口的需求', 'Local authorities need to meet the needs of an ageing population.'],

  // Task 2 — abstract topics
  ['topic:abstract', 't2-body', 'a sense of personal fulfilment', '个人成就感与满足感', 'Meaningful work can provide a sense of personal fulfilment.'],
  ['topic:abstract', 't2-reason', 'long-term well-being rather than short-term pleasure', '长期幸福感，而非短期快乐', 'People may benefit from focusing on long-term well-being rather than short-term pleasure.'],
  ['topic:abstract', 't2-contrast', 'strike a balance between freedom and responsibility', '在自由与责任之间取得平衡', 'Societies need to strike a balance between freedom and responsibility.'],

  // Task 2 — task instructions; categories are study aids, not rigid formulas.
  ['question:opinion', 't2-intro', 'I largely agree with the view that ..., although ...', '我基本同意……，但也承认……', 'I largely agree with the view that universities should offer practical courses, although theory remains important.'],
  ['question:opinion', 't2-body', 'The main reason for my position is that ...', '支持我这一立场的主要原因是……', 'The main reason for my position is that access to education benefits society as a whole.'],
  ['question:opinion', 't2-contrast', 'This does not mean that ... should be ignored.', '但这并不意味着应忽视……', 'This does not mean that traditional teaching methods should be ignored.'],
  ['question:opinion', 't2-conclusion', 'For these reasons, I support ...', '基于上述原因，我支持……', 'For these reasons, I support greater investment in public education.'],
  ['question:advantages', 't2-body', 'An important benefit of ... is ...', '……的一项重要好处是……', 'An important benefit of remote work is reduced commuting time.'],
  ['question:advantages', 't2-body', 'The principal drawback is that ...', '主要缺点是……', 'The principal drawback is that some workers become socially isolated.'],
  ['question:advantages', 't2-contrast', 'Despite these drawbacks, the benefits may be greater because ...', '尽管有这些缺点，优点仍可能更大，因为……', 'Despite these drawbacks, the benefits may be greater because flexible work improves access to jobs.'],
  ['question:advantages', 't2-conclusion', 'On balance, the advantages of ... outweigh its disadvantages.', '综合来看，……的优点大于缺点', 'On balance, the advantages of remote work outweigh its disadvantages.', '只适用于题目要求比较哪方更大且你的论证支持该判断。'],
  ['question:discussion', 't2-intro', 'Some argue that ..., while others favour ...', '一些人主张……，另一些人则赞成……', 'Some argue that schools should teach practical skills, while others favour academic subjects.'],
  ['question:discussion', 't2-body', 'Supporters of the first view argue that ...', '第一种观点的支持者认为……', 'Supporters of the first view argue that vocational skills improve employability.'],
  ['question:discussion', 't2-contrast', 'Those who favour the alternative view point out that ...', '另一种观点的支持者指出……', 'Those who favour the alternative view point out that academic knowledge builds a broad foundation.'],
  ['question:discussion', 't2-conclusion', 'Having considered both views, I believe that ...', '考虑双方观点后，我认为……', 'Having considered both views, I believe that schools should offer both types of learning.'],
  ['question:report', 't2-body', 'One major cause of this problem is ...', '这一问题的主要原因之一是……', 'One major cause of this problem is the shortage of affordable housing.'],
  ['question:report', 't2-reason', 'This can lead to ...', '这可能导致……', 'This can lead to longer commutes and greater financial pressure.'],
  ['question:report', 't2-body', 'A practical way to address this issue would be to ...', '解决这一问题的一种可行方法是……', 'A practical way to address this issue would be to expand public transport.'],
  ['question:report', 't2-conclusion', 'The key causes are ..., and possible responses include ...', '主要原因是……，可采取的措施包括……', 'The key causes are rising housing costs and limited transport options, and possible responses include better urban planning.', '报告类还可能是两问，例如原因与影响；必须按题目实际问题回答。'],

  // Task 1 — generally reusable expressions from the user's practice notes.
  ['general:task1', 't1-stable', 'despite some fluctuations', '尽管存在一些波动', 'Despite some fluctuations, the figure remained close to 40% throughout the period.', 'despite 后接名词或动名词，不直接接完整从句。'],
  ['general:task1', 't1-overview', 'remained dominant thereafter', '此后一直占据主导地位', 'The service sector became the largest employer in 1990 and remained dominant thereafter.', '只有此后一直保持最高占比或领先地位时才使用。'],
  ['general:task1', 't1-compare', 'followed similar patterns', '呈现相似的变化趋势', 'Employment in retail and tourism followed similar patterns, with both figures rising steadily.', '表示变化轨迹相似，不代表数值相同。'],
  ['general:task1', 't1-trend', 'experienced a more modest rise', '增幅相对较小', 'By contrast, the share of cycling experienced a more modest rise, from 12% to 15%.', 'more modest 表示与另一组数据相比增幅更小。'],
  ['general:task1', 't1-extremes', 'before surging to a peak of', '随后猛增至峰值', 'The proportion increased gradually before surging to a peak of 42% in 2010.', 'surge 表示快速、显著上升；平缓增长时不要使用。'],
  ['general:task1', 't1-trend', 'It subsequently fell to...', '随后下降至……', 'The figure peaked at 35% in 2005. It subsequently fell to 28% by 2015.', 'It 必须清楚指代前句的数据；fell to 后接终点数值。'],
  ['general:task1', 't1-trend', 'After a slight decline...', '小幅下降之后……', 'After a slight decline in 2000, the figure recovered to 50%.', 'After a slight decline 作句首状语，后面通常加逗号。'],
]

export const extendedStarterPhrases: WritingPhrase[] = examples.map(([scope, category, text, meaning, example, note], index) => ({
  id: `reference-${index + 1}`,
  task: category.startsWith('t1-') ? 'task1' : 'task2',
  category,
  text,
  meaning,
  example,
  note: note || '',
  chartTypes: scope.startsWith('chart:') ? [scope.slice(6) as WritingChartType] : [],
  topics: scope.startsWith('topic:') ? [scope.slice(6) as WritingTopic] : [],
  questionTypes: scope.startsWith('question:') ? [scope.slice(9) as WritingQuestionType] : [],
}))
