import type { WritingChartType, WritingQuestionType, WritingTask } from './writingPhrases'

/** Original practice answers to genuine Cambridge IELTS questions. */
export type CopySentence = readonly [text: string, alternative: string, grammar: string]

export interface CopyEssay {
  id: string
  task: WritingTask
  category: WritingChartType | WritingQuestionType
  title: string
  prompt: string
  book: number
  test: number
  questionImage: string
  questionSource: string
  imageCredit: string
  paragraphs: CopySentence[][]
}

export const writingCopyEssays: CopyEssay[] = [
  {
    id: 'cam16-test3-task2',
    task: 'task2',
    category: 'opinion',
    book: 16,
    test: 3,
    title: 'Should sugary products cost more?',
    prompt: 'Cambridge IELTS 16 Academic, Test 3, Writing Task 2: whether sugary food and drink should be made more expensive to reduce consumption.',
    questionImage: 'https://media.zim.vn/64c7625c817a9de33533eee0/cam-16-test-3-writing-task-2.jpg?q=75&w=1920',
    questionSource: 'https://zim.vn/cam-16-test-3-writing-task-2',
    imageCredit: 'ZIM Academy · 真题文字配图（非书页扫描）',
    paragraphs: [
      [
        ['Many packaged foods and drinks contain large amounts of added sugar, and there are growing concerns about their effects on health.', 'High levels of added sugar in processed products have become a major public health concern.', 'and 连接两个完整分句；effects on health 是自然搭配。'],
        ['I agree that raising the prices of particularly sugary products could reduce consumption, although education and clear labelling would also be necessary.', 'I support higher prices for high-sugar products, provided that they are combined with better consumer information.', 'I agree that ... 明确立场；although 引入限定，不改变总体态度。'],
      ],
      [
        ['The main advantage of higher prices is that they can discourage frequent purchases of sweet drinks and snacks.', 'Higher prices may lead consumers to buy sugary products less often.', 'The main advantage ... is that ... 直接引出论点。'],
        ['When a sugary drink costs more than a healthier alternative, some shoppers are likely to choose the cheaper option.', 'A price difference can encourage consumers to select products containing less sugar.', 'When + 从句说明政策起作用的条件；be likely to 表示倾向。'],
        ['For instance, a student who buys a soft drink every afternoon may switch to water if the price difference becomes significant.', 'A higher soft-drink price could persuade habitual buyers to choose water instead.', 'who buys ... 修饰 student；switch to 是固定动词搭配。'],
        ['Even a small change in daily habits could reduce the amount of sugar people consume over several years.', 'Modest but consistent changes in consumption may have a meaningful cumulative effect.', 'the amount of sugar 是不可数名词的数量表达。'],
        ['Higher prices might also encourage manufacturers to reformulate products so that they contain less added sugar.', 'Food companies may lower sugar content to keep their products attractive to customers.', 'so that 引导目的从句；encourage somebody to do 是固定结构。'],
      ],
      [
        ['However, price increases alone would not solve the problem because consumers do not always understand what their food contains.', 'Nevertheless, pricing policies are insufficient if buyers cannot identify high-sugar products.', 'because 后接原因；alone 用于强调单一措施的局限。'],
        ['Some products marketed as healthy still contain considerable amounts of sugar, which may not be obvious from the packaging.', 'Even apparently healthy foods can be high in sugar, making labels important.', 'which 引导非限定性定语从句，对前面情况作补充。'],
        ['Governments should therefore require straightforward nutritional labels and teach children how to compare products.', 'Clearer labels and school lessons could help people understand what they purchase.', 'therefore 连接问题与对策；how to compare 是不定式结构。'],
        ['Such measures would help consumers make informed decisions instead of simply paying more for the same unhealthy food.', 'Consumers should have the information needed to change their diets, not merely face higher prices.', 'instead of + 动名词表达替代做法。'],
        ['A further concern is that higher food prices affect households on low incomes more severely, so any tax should be carefully targeted.', 'Because poorer households are more sensitive to prices, a tax needs careful design.', 'more severely 是副词比较级；so 引出政策含义。'],
      ],
      [
        ['In conclusion, I support increasing the cost of products with excessive added sugar as a way to discourage overconsumption.', 'Overall, higher prices are a reasonable tool for limiting excessive sugar intake.', 'as a way to + 动词原形表达手段或目的。'],
        ['Nevertheless, the policy would be more effective and fairer if it were combined with education, transparent labels and support for healthier choices.', 'Pricing works best alongside education and accessible alternatives.', 'if it were combined ... 是假设条件；more effective and fairer 是并列比较级。'],
      ],
    ],
  },
  {
    id: 'cam16-test4-task2',
    task: 'task2',
    category: 'advantages',
    book: 16,
    test: 4,
    title: 'Driverless cars, buses and trucks',
    prompt: 'Cambridge IELTS 16 Academic, Test 4, Writing Task 2: whether the advantages of a future with driverless vehicles outweigh the disadvantages.',
    questionImage: 'https://media.zim.vn/64bf8e37207fcfab1e53d3fc/cam-16-test-4-writing-task-2.jpg',
    questionSource: 'https://zim.vn/cam-16-test-4-writing-task-2',
    imageCredit: 'ZIM Academy · 真题文字配图（非书页扫描）',
    paragraphs: [
      [
        ['Cars, buses and trucks may eventually operate without drivers, leaving everyone inside them as a passenger.', 'In the future, road vehicles could transport passengers without a human driver.', 'leaving ... 作结果状语；may eventually 表示未来的可能性。'],
        ['Although this change could disrupt employment and raise safety concerns, I believe its long-term advantages would be greater.', 'Despite the risks to jobs and public trust, autonomous transport could bring greater overall benefits.', 'Although ... I believe ... 是先承认缺点再表态的结构。'],
      ],
      [
        ['One important disadvantage is the effect of automation on people who earn a living by driving.', 'A major drawback is the potential loss of professional driving jobs.', 'the effect of A on B 是固定搭配。'],
        ['Taxi drivers, delivery workers and bus drivers could face unemployment if companies replaced their fleets with autonomous vehicles.', 'Transport firms adopting driverless vehicles might reduce their need for human drivers.', 'if + 一般过去时表示假设；replace A with B。'],
        ['For example, a driver with years of experience may struggle to move into a different occupation without further training.', 'An experienced driver might find it difficult to change careers without retraining.', 'struggle to do / find it difficult to do 都可以表达困难。'],
        ['Another risk is that technical failures or poorly designed systems could cause accidents, especially in unusual road conditions.', 'Unexpected situations could expose weaknesses in automated driving technology.', 'Another risk is that ... 引入第二个缺点；could 避免绝对化。'],
        ['These concerns mean that governments would need strict testing standards and plans to support affected workers.', 'Authorities would have to regulate the technology and help displaced employees.', 'mean that 后接完整从句；affected 是过去分词作定语。'],
      ],
      [
        ['Nevertheless, driverless technology has the potential to make transport safer by reducing errors caused by human fatigue and distraction.', 'Autonomous vehicles could lower accident risks by avoiding some common human mistakes.', 'by + 动名词说明途径；caused by ... 修饰 errors。'],
        ['Unlike people, a well-designed automated system does not become tired after driving for several hours.', 'An automated vehicle can remain attentive during long journeys.', 'Unlike + 名词引入对比；well-designed 是复合形容词。'],
        ['If vehicles can communicate with one another, they may also maintain more consistent speeds and reduce unnecessary braking.', 'Connected vehicles could travel more smoothly and reduce stop-start traffic.', 'If + 现在时，主句 may 表示合理推测。'],
        ['This could improve journey times and make public transport more reliable for commuters.', 'Smoother traffic flow could shorten trips and improve the dependability of buses.', 'make + 宾语 + 形容词 是常见结果结构。'],
        ['In addition, people who cannot drive because of age or disability could gain greater independence.', 'Autonomous transport could make daily travel more accessible to people unable to drive.', 'who cannot drive ... 是定语从句，限定受益群体。'],
        ['For instance, an older person might be able to visit friends or attend appointments without depending on a relative for transport.', 'Older passengers could travel independently rather than relying on family members.', 'without + 动名词；depend on 是固定搭配。'],
      ],
      [
        ['In conclusion, job losses and technical risks are serious challenges that must be managed.', 'Overall, autonomous vehicles bring employment and safety concerns that require safeguards.', 'that must be managed 修饰 challenges。'],
        ['However, greater road safety, smoother travel and improved mobility make the advantages of driverless transport more significant overall.', 'On balance, the potential benefits for safety and accessibility outweigh these disadvantages.', 'on balance 表示经过权衡后的结论。'],
      ],
    ],
  },
  {
    id: 'cam19-test1-task2',
    task: 'task2',
    category: 'discussion',
    book: 19,
    test: 1,
    title: 'Competition versus cooperation',
    prompt: 'Cambridge IELTS 19 Academic, Test 1, Writing Task 2: discuss the benefits of competition and cooperation and give your opinion.',
    questionImage: 'https://langgo.edu.vn/storage/images/2025/08/20/cam-19-test-1-writing-task-2.webp',
    questionSource: 'https://langgo.edu.vn/cam-19-test-1-writing-task-2',
    imageCredit: 'IELTS LangGo · 真题文字配图（完整作答要求见来源）',
    paragraphs: [
      [
        ['Some people see competition as a useful source of motivation, while others believe that cooperation deserves greater emphasis in everyday life.', 'People disagree about whether competing or working together brings better results.', 'while 在同一句中对比两种观点。'],
        ['In my opinion, competition can encourage achievement, but cooperation is usually more valuable when people face complex shared goals.', 'Although rivalry can stimulate effort, I generally favour cooperation for collective tasks.', 'In my opinion 后清晰表态；but 引入自己的权衡。'],
      ],
      [
        ['Those who favour competition argue that it pushes individuals to improve their performance.', 'Supporters of competition say that rivalry encourages people to work harder.', 'Those who favour ... 是客观介绍一方观点的常见主语。'],
        ['At school, for example, a student may study more carefully when trying to earn a scholarship or achieve a high examination score.', 'The prospect of a scholarship can motivate students to prepare more thoroughly for examinations.', 'when trying to ... 是省略主语的时间状语。'],
        ['In the workplace, businesses that compete for customers often try to provide better services or develop new products.', 'Market competition can encourage companies to innovate and improve customer service.', 'that compete ... 修饰 businesses；try to 后接原形动词。'],
        ['Healthy competition may also help people recognise their strengths and set more demanding personal goals.', 'Fair rivalry can reveal individual abilities and encourage ambition.', 'help somebody do 与 help somebody to do 均正确。'],
        ['For these reasons, it would be unrealistic to suggest that competition has no value in education or business.', 'Competition clearly has a role in motivating learners and firms.', 'it would be unrealistic to ... 是表达谨慎判断的结构。'],
      ],
      [
        ['However, cooperation allows people to combine skills and deal with problems that are difficult to solve alone.', 'Working together brings different abilities into one team and supports complex problem-solving.', 'that are difficult ... 修饰 problems。'],
        ['A group project may require research, planning and communication, and no single participant is likely to excel at every task.', 'Team projects benefit from different strengths because one person rarely has every required skill.', 'no single ... 强调个人能力的局限。'],
        ['For example, engineers designing a safe bridge must share information and check one another’s work rather than compete for individual credit.', 'Bridge construction depends on collaboration and careful cross-checking between specialists.', 'rather than + 动词原形，在并列结构中表示替代行动。'],
        ['Cooperation can also build trust, which makes it easier for classmates and colleagues to ask for help when they need it.', 'A cooperative environment encourages people to seek assistance and share ideas.', 'which 引入补充结果；make it easier for ... to do。'],
        ['By contrast, excessive rivalry may cause people to hide mistakes or withhold useful knowledge.', 'Too much competition can discourage the open exchange of information.', 'By contrast 用于引出负面的对比效果。'],
        ['I therefore believe collaboration should be the default, with competition used selectively to encourage improvement.', 'In my view, teamwork should come first, while fair competition can still provide motivation.', 'with + 名词 + 过去分词表达附加条件。'],
      ],
      [
        ['In conclusion, competition can motivate individuals and businesses to achieve higher standards.', 'Overall, rivalry has a positive role in encouraging effort.', '结论先总结第一种观点。'],
        ['Nevertheless, I consider cooperation more important because it enables people to share knowledge, build trust and solve problems together.', 'Even so, collaboration is the stronger foundation for most shared achievements.', 'because 后并列三个动词短语支撑立场。'],
      ],
    ],
  },
  {
    id: 'cam16-test1-task2',
    task: 'task2',
    category: 'report',
    book: 16,
    test: 1,
    title: 'Why research the history of a home?',
    prompt: 'Cambridge IELTS 16 Academic, Test 1, Writing Task 2: why people research the history of the house or building they live in, and how they can do so.',
    questionImage: 'https://website-assets.studocu.com/img/document_thumbnails/3aa0bd5b8358e02899303c588e70c6ec/thumb_1200_1698.png',
    questionSource: 'https://www.studocu.vn/vn/document/truong-dai-hoc-kinh-te-thanh-pho-ho-chi-minh/tai-lieu-ielts/test-1-writing-task-2-history-of-homes-cam-16/139499500',
    imageCredit: 'Studocu · 剑桥原题书页预览图',
    paragraphs: [
      [
        ['In some places, residents are becoming increasingly curious about the history of the buildings in which they live.', 'More homeowners and tenants now want to discover the past of their homes.', 'in which they live 是较正式的定语从句。'],
        ['This interest often comes from practical concerns and a sense of personal connection, and it can be explored through documents and local knowledge.', 'People investigate their homes for safety or personal reasons, using records and community sources.', 'comes from + 名词解释原因；it 指代 this interest。'],
      ],
      [
        ['One reason for researching a property is to understand whether it has been altered or repaired over time.', 'Residents may want to know which changes previous owners made to the building.', 'One reason for ... is to ... 直接回答原因题。'],
        ['Knowing when an extension was built, for instance, may help an owner decide whether further work requires special attention.', 'Information about earlier building work can guide future renovations.', 'Knowing ... 是动名词短语作主语；when 引导宾语从句。'],
        ['Another motivation is the desire to feel connected to a neighbourhood and the people who lived there previously.', 'People may research a home to develop a sense of belonging to their community.', 'the desire to do 是解释动机的自然搭配。'],
        ['A family living in an old house might be interested in discovering who occupied it during an important period of local history.', 'Residents of historic properties may be curious about former occupants.', 'who occupied ... 是嵌入的间接疑问句，使用陈述语序。'],
        ['Such discoveries can turn an ordinary address into a place with personal meaning.', 'Learning the history of a building can make it feel more significant to its occupants.', 'turn A into B 表示使某物转变成某种状态。'],
      ],
      [
        ['There are several practical ways to investigate the history of a home.', 'Residents can use a range of reliable sources to research their property.', 'There are ... ways to do ... 是引出方法段的句型。'],
        ['The most direct method is to examine official records, including building permits, land registers and old maps held by local authorities.', 'Planning documents and property registers can reveal earlier changes and ownership.', 'including + 名词列举具体资料；held by ... 修饰 maps。'],
        ['These records may show when a property was constructed and whether its layout has changed.', 'Public documents can reveal both the age and earlier design of a building.', 'when ... and whether ... 是并列宾语从句。'],
        ['For example, comparing a current floor plan with an older one could reveal that an extra room was added decades ago.', 'Historical and recent plans can help residents identify extensions to a house.', 'comparing ... 是动名词短语作主语；could 表示潜在结果。'],
        ['Residents can also visit local museums or speak to long-term neighbours, who may remember details missing from formal documents.', 'Libraries and older neighbours may provide information that official records do not contain.', 'who ... 是非限定性定语从句；missing from ... 作后置定语。'],
        ['Finally, historical photographs and newspapers can offer a useful picture of how the surrounding area has developed.', 'Old photographs and newspapers can show changes in a neighbourhood over time.', 'how ... has developed 是宾语从句，含现在完成时。'],
      ],
      [
        ['In conclusion, people investigate their homes for both practical knowledge and a stronger connection to the past.', 'Overall, safety, curiosity and a sense of belonging all motivate this research.', 'for both ... and ... 并列两种原因。'],
        ['Official archives, old plans and conversations with local residents provide sensible ways to find the information they seek.', 'Records and local memories offer several effective research methods.', 'they seek 是省略 that 的定语从句，修饰 information。'],
      ],
    ],
  },
  {
    id: 'cam18-test2-task1',
    task: 'task1',
    category: 'bar',
    book: 18,
    test: 2,
    title: 'Household incomes in the USA',
    prompt: 'Cambridge IELTS 18 Academic, Test 2, Writing Task 1: number of US households by annual income in 2007, 2011 and 2015.',
    questionImage: 'https://engnovate.com/wp-content/uploads/2023/08/cambridge-ielts-18-academic-writing-test-2-1.webp',
    questionSource: 'https://engnovate.com/ielts-writing-tests/cambridge-ielts-18-academic-writing-test-2-task-1/',
    imageCredit: 'Engnovate · 剑桥真题原始柱状图',
    paragraphs: [
      [
        ['The bar chart compares the numbers of US households in five annual income groups in 2007, 2011 and 2015.', 'The chart shows how American households were distributed across five income bands in three years.', 'compares the numbers of ... 用于比较绝对数量。'],
      ],
      [
        ['Overall, the highest-income group grew considerably by the end of the period, while the two middle-income groups changed relatively little.', 'The most striking change was growth among households earning at least $100,000.', 'Overall 先概括最明显的变化，避免罗列所有数字。'],
        ['Households earning between $25,000 and $49,999 also remained one of the largest groups throughout.', 'The second-lowest income band consistently included a large number of households.', 'earning ... 是现在分词短语，修饰 households。'],
      ],
      [
        ['In 2007, roughly 29 million households earned $100,000 or more, compared with about 27 million in the $25,000–$49,999 category.', 'The top income band stood at about 29 million, slightly above the next-largest group.', 'compared with 是数据比较搭配；roughly 表示近似数。'],
        ['Around 25 million earned under $25,000, whereas the $50,000–$74,999 and $75,000–$99,999 groups contained approximately 21 million and 14 million respectively.', 'The lowest income band was larger than either of the two middle bands.', 'whereas 用于类别比较；respectively 使数值对应明确。'],
        ['By 2011, the two lowest bands had both increased, to approximately 29 million and 30 million households.', 'The two lower-income categories reached about 29 million and 30 million by 2011.', 'had increased to 表示到指定过去时间的变化终值。'],
      ],
      [
        ['In 2015, the number earning at least $100,000 climbed to around 33 million, the highest figure on the chart.', 'The top income band reached approximately 33 million in the final year.', 'the highest figure 是同位语，突出极值。'],
        ['By contrast, the corresponding figures for the two middle bands were still close to 21 million and 15 million.', 'The middle income groups saw comparatively small changes.', 'By contrast 用于突出不同变化幅度。'],
        ['The lowest band stood at about 28 million, while the $25,000–$49,999 group accounted for approximately 29 million.', 'Both lower-income bands finished at just under 30 million households.', 'stood at / accounted for 可替换描述数值。'],
      ],
    ],
  },
  {
    id: 'cam20-test1-task1',
    task: 'task1',
    category: 'table',
    book: 20,
    test: 1,
    title: 'Population of New York City',
    prompt: 'Cambridge IELTS 20 Academic, Test 1, Writing Task 1: three tables showing New York City population and the shares of Manhattan and the other districts in 1800, 1900 and 2000.',
    questionImage: 'https://engnovate.com/wp-content/uploads/2025/07/Cambridge-IELTS-20-Academic-Writing-Test-1-1.png',
    questionSource: 'https://engnovate.com/ielts-writing-tests/cambridge-ielts-20-academic-writing-test-1-task-1/',
    imageCredit: 'Engnovate · 剑桥真题原始表格',
    paragraphs: [
      [
        ['The tables show changes in New York City’s population between 1800 and 2000, including the figures for Manhattan and the other four districts.', 'The three tables compare total population and the distribution of residents across New York City over two centuries.', 'including 后列举图表所包含的内容。'],
      ],
      [
        ['Overall, the city grew enormously, but Manhattan’s share of its population fell steadily as the other districts became more dominant.', 'New York expanded dramatically, while a growing proportion of its residents lived outside Manhattan.', 'Overall 同时概括总量变化与结构变化。'],
        ['The combined population of Brooklyn, the Bronx, Queens and Staten Island eventually represented more than four fifths of the total.', 'By 2000, the outer districts accounted for over 80% of city residents.', 'more than four fifths 与 over 80% 等价。'],
      ],
      [
        ['In 1800, New York City had just 79,216 residents, of whom 60,515 lived in Manhattan.', 'Most of the city’s 79,216 residents lived in Manhattan in the earliest year.', 'of whom 用于补充说明总体中的一部分。'],
        ['This meant that Manhattan accounted for 76% of the total, compared with 24% in the remaining districts.', 'Manhattan represented just over three quarters of the population in 1800.', 'accounted for + 百分比是占比类核心搭配。'],
        ['By 1900, the total had risen sharply to approximately 3.44 million people.', 'The city’s population reached around 3.4 million in 1900.', 'had risen to 表示截止过去某时的增长。'],
        ['Manhattan still held the larger share at 54%, although the other districts together already contained nearly 1.59 million people.', 'Manhattan narrowly retained a majority in 1900.', 'although 引导让步从句，兼顾两组数字。'],
      ],
      [
        ['In 2000, the city’s population reached just over eight million.', 'By the final year, New York had more than eight million residents.', 'reached 后直接接数量，不用 to。'],
        ['Manhattan had about 1.54 million residents, representing only 19% of the total despite a much larger city population.', 'The share living in Manhattan declined to less than one fifth.', 'representing ... 是分词短语，说明占比。'],
        ['The other districts, meanwhile, contained roughly 6.47 million people and accounted for the remaining 81%.', 'Outside Manhattan, the population increased to approximately 6.5 million.', 'meanwhile 用于切换到另一组同时期数据。'],
      ],
    ],
  },
  {
    id: 'cam19-test1-task1',
    task: 'task1',
    category: 'line',
    book: 19,
    test: 1,
    title: 'Participation at a Melbourne social centre',
    prompt: 'Cambridge IELTS 19 Academic, Test 1, Writing Task 1: number of participants in five activities at a Melbourne social centre between 2000 and 2020.',
    questionImage: 'https://engnovate.com/wp-content/uploads/2024/10/cambridge-ielts-19-academic-writing-test-1–1.png',
    questionSource: 'https://engnovate.com/ielts-writing-tests/cambridge-ielts-19-academic-writing-test-1-task-1/',
    imageCredit: 'Engnovate · 剑桥真题原始曲线图',
    paragraphs: [
      [
        ['The line graph shows how participation in five activities at a social centre in Melbourne changed between 2000 and 2020.', 'The graph compares attendance at five social-centre activities over a twenty-year period.', 'how ... changed 是宾语从句，描述变化主题。'],
      ],
      [
        ['Overall, the film club attracted the most people throughout the period, whereas table tennis experienced the strongest growth.', 'Film screenings stayed the most popular activity, while table tennis rose the fastest.', 'whereas 连接两个主要特点，适合 Overview。'],
        ['Amateur dramatics declined markedly, but musical performances gained participants after an initially inactive period.', 'Drama attendance fell, whereas musical performances became increasingly popular.', 'declined markedly 是较正式的下降表达。'],
      ],
      [
        ['The film club began with approximately 64 participants and remained close to that level, finishing at about 66 in 2020.', 'Film-club attendance fluctuated only slightly around the mid-sixties.', 'remained close to 表示基本稳定；finishing ... 表示终值。'],
        ['Martial arts also changed relatively little, moving between roughly 32 and 38 participants across the five years shown.', 'Participation in martial arts stayed within a narrow range of about 30 to 40.', 'between A and B 表示范围，避免误写增长趋势。'],
        ['By contrast, the figure for amateur dramatics fell from around 26 in 2000 to only six in 2020.', 'Drama participation dropped by approximately twenty people.', 'fell from ... to ... 描述起点终点。'],
      ],
      [
        ['Table tennis began with about 16 participants and stayed at 20 in both 2005 and 2010.', 'Table-tennis attendance was initially low and remained stable for several years.', 'stayed at 后接数值，表示保持不变。'],
        ['It then rose sharply to roughly 35 in 2015 before reaching more than 50 by the final year.', 'Participation climbed rapidly after 2010, ending at around 54.', 'before + 动名词可连接时间先后。'],
        ['Musical performances attracted no participants in 2000 or 2005, but attendance increased to approximately 12 in 2010 and 18 in 2020.', 'Music performances developed from zero attendance to almost twenty people.', 'no participants 是零值表达；but 引出变化。'],
        ['By 2020, table tennis had become the second most popular activity, behind only the film club.', 'Table tennis ranked second at the end of the period.', 'had become 是过去完成时，强调截至 2020 的变化结果。'],
      ],
    ],
  },
  {
    id: 'cam14-test1-task1',
    task: 'task1',
    category: 'pie',
    book: 14,
    test: 1,
    title: 'Nutrients in typical US meals',
    prompt: 'Cambridge IELTS 14 Academic, Test 1, Writing Task 1: three pie charts showing the shares of sodium, saturated fat and added sugar consumed at different meals in the USA.',
    questionImage: 'https://engnovate.com/wp-content/uploads/2023/08/cambridge-ielts-14-academic-writing-test-1-1.jpg',
    questionSource: 'https://engnovate.com/ielts-writing-tests/cambridge-ielts-14-academic-writing-test-1-task-1/',
    imageCredit: 'Engnovate · 剑桥真题原始饼状图',
    paragraphs: [
      [
        ['The three pie charts compare the proportions of sodium, saturated fat and added sugar consumed at four different eating occasions in the USA.', 'The charts show how three nutrients are distributed across breakfast, lunch, dinner and snacks.', 'proportions of ... consumed 是描述占比的自然表达。'],
      ],
      [
        ['Overall, dinner accounts for the greatest shares of sodium and saturated fat, while snacks contribute the most added sugar.', 'Dinner dominates sodium and fat consumption, whereas snacks lead in added sugar.', 'Overview 选最显著的构成特征。'],
        ['Breakfast is the smallest contributor to all three nutrients, either alone or jointly with another meal.', 'The breakfast shares are consistently low across the three charts.', 'either ... or ... 用于描述两种可能情况。'],
      ],
      [
        ['For sodium, dinner represents 43% of the total and lunch a further 29%.', 'Dinner and lunch together account for 72% of sodium intake.', 'represents + 百分比表示占比，省略重复动词是允许的。'],
        ['Breakfast and snacks each account for just 14%, making them the smallest categories in this chart.', 'The remaining sodium is divided equally between breakfast and snacks.', 'making ... 表示结果；each 表示两项分别。'],
        ['A similar pattern appears for saturated fat, with dinner responsible for 37% and lunch for 26%.', 'Dinner also contributes the largest share of saturated fat, followed by lunch.', 'with + 名词短语可以引出补充的数据。'],
        ['Snacks account for 21% of saturated fat, compared with 16% at breakfast.', 'The fat share from snacks exceeds that from breakfast by five percentage points.', '两个百分比的差应使用 percentage points。'],
      ],
      [
        ['The distribution of added sugar is noticeably different, as snacks make up 42% of the total.', 'In contrast, snacking accounts for the largest share of added sugar.', 'as 引导原因或解释；make up 是占比的常用表达。'],
        ['Dinner contributes 23%, while lunch represents 19% and breakfast the remaining 16%.', 'The other meals account for smaller proportions, ranging from 16% to 23%.', 'while 连接不同数值；the remaining 指剩余份额。'],
        ['Thus, snacks contribute almost twice as much added sugar as dinner, despite accounting for a smaller share of the other two nutrients.', 'Snacks contain nearly double dinner’s share of added sugar.', 'twice as much ... as 是倍数比较结构。'],
      ],
    ],
  },
  {
    id: 'cam17-test2-task1',
    task: 'task1',
    category: 'mixed',
    book: 17,
    test: 2,
    title: 'Police funding and expenditure',
    prompt: 'Cambridge IELTS 17 Academic, Test 2, Writing Task 1: a table and two pie charts showing the police budget in a British area in 2017 and 2018.',
    questionImage: 'https://engnovate.com/wp-content/uploads/2023/08/cambridge-ielts-17-academic-writing-test-2-1.png',
    questionSource: 'https://engnovate.com/ielts-writing-tests/cambridge-ielts-17-academic-writing-test-2-task-1/',
    imageCredit: 'Engnovate · 剑桥真题原始表格与饼图',
    paragraphs: [
      [
        ['The table and pie charts show how a police budget in one British area was funded and spent in 2017 and 2018.', 'The figures compare police funding sources and expenditure in a British region over two years.', 'how ... was funded and spent 是并列的被动结构。'],
      ],
      [
        ['Overall, the total budget increased, with national government remaining the main source of revenue.', 'The police received more funding in 2018, mostly from the national government.', 'with + 名词 + 现在分词可补充总体趋势。'],
        ['Salaries accounted for the largest share of spending in both years, although their proportion fell as technology received a greater allocation.', 'Staff costs dominated expenditure, while the technology share rose.', 'although 引出对比变化，避免把占比和总额混淆。'],
      ],
      [
        ['The total police budget rose from £304.7 million in 2017 to £318.6 million in 2018.', 'Police funding increased by £13.9 million over the period.', 'rose from ... to ... 描述起点终值；rose by ... 描述增量。'],
        ['National government contributed £175.5 million in 2017 and £177.8 million the following year.', 'Government funding increased slightly by £2.3 million.', 'contributed 后直接接金额；the following year 避免重复年份。'],
        ['Local taxes provided the largest increase, climbing from £91.2 million to £102.3 million.', 'Revenue from local taxes grew by £11.1 million, more than any other source.', 'provided the largest increase 描述增长幅度，而非收入排名。'],
        ['Money from other sources was comparatively stable at £38 million and £38.5 million respectively.', 'Grants and other income changed very little between the two years.', 'comparatively stable at 表示相对稳定。'],
      ],
      [
        ['Looking at expenditure, salaries took 75% of the budget in 2017 but only 69% in 2018.', 'The share allocated to staff pay decreased by six percentage points.', '这里下降的是份额，因此单位应为百分点。'],
        ['By contrast, technology rose from 8% to 14%, matching the six-point reduction in the salary share.', 'Technology gained six percentage points over the same period.', 'By contrast 对比不同支出项目的比例变化。'],
        ['The proportion allocated to buildings and transport remained unchanged at 17% in both years.', 'Buildings and transport continued to receive 17% of police spending.', 'remained unchanged at + 数值 是稳定类表达。'],
        ['Therefore, the budget grew overall even though its distribution shifted towards technology.', 'In short, the police had more money to spend, with a greater share directed to technology.', 'even though 让步说明总体增长与内部结构变化同时发生。'],
      ],
    ],
  },
  {
    id: 'cam19-test2-task1',
    task: 'task1',
    category: 'map',
    book: 19,
    test: 2,
    title: 'Redevelopment of Porth Harbour',
    prompt: 'Cambridge IELTS 19 Academic, Test 2, Writing Task 1: maps comparing Porth Harbour in 2000 and today.',
    questionImage: 'https://engnovate.com/wp-content/uploads/2024/10/cambridge-ielts-19-academic-writing-test-2–1.png',
    questionSource: 'https://engnovate.com/ielts-writing-tests/cambridge-ielts-19-academic-writing-test-2-task-1/',
    imageCredit: 'Engnovate · 剑桥真题原始地图',
    paragraphs: [
      [
        ['The two maps illustrate the changes that have taken place at Porth Harbour since 2000.', 'The plans compare the layout and facilities of Porth Harbour in 2000 and at present.', 'have taken place since 2000 使用现在完成时表示延续至今的变化。'],
      ],
      [
        ['Overall, the harbour has developed more facilities for visitors, including shops, a hotel and improved amenities.', 'Porth Harbour has become more tourist-oriented through several new facilities.', 'Overall 概括整体用途变化，而非逐项罗列。'],
        ['The fishing boats and private marina have exchanged locations, while the main road and ferry facilities have largely remained in place.', 'The two boat areas swapped positions, but several transport features were preserved.', 'have exchanged locations 是地图题描述位置交换的核心表达。'],
      ],
      [
        ['In 2000, the marina for private yachts occupied the north-western waterfront, with the fishing boats located farther south.', 'The yacht marina was originally north of the fishing-boat area.', 'occupied the ... waterfront 用于表示某设施所处的位置。'],
        ['Today, these two facilities have swapped places, and additional showers and toilets have been installed near the southern car park.', 'Fishing boats now use the northern berth, while the marina occupies the southern one.', 'have been installed 是现在完成时被动语态。'],
        ['The original showers, toilets and car park in the northern part of the harbour remain in their previous positions.', 'The northern parking area and washrooms have not moved.', 'remain in their previous positions 表示没有变化。'],
        ['The dock and passenger ferry service towards the north-east are also still shown on the new map.', 'The main dock and ferry facilities have been retained.', 'towards the north-east 是规范方位表达。'],
      ],
      [
        ['The most noticeable additions appear along the southern side of the harbour.', 'Most new tourist facilities are concentrated in the south.', 'the most noticeable ... 突出重点变化。'],
        ['A row of cafes and shops has been built beside the road, to the west of the lifeboat station.', 'New retail facilities now stand near the lifeboat station.', 'has been built 是现在完成时被动；beside 表示相邻。'],
        ['The disused castle at the south-eastern end has been converted into a hotel.', 'The former castle now serves as accommodation for visitors.', 'has been converted into 是地图题常用改造搭配。'],
        ['Consequently, the adjacent beach is now designated as a private beach for hotel guests, whereas the public beach in the north remains unchanged.', 'The southern beach has become private, but the northern public beach is still available.', 'whereas 对比已经变化与仍然保留的区域。'],
      ],
    ],
  },
  {
    id: 'cam16-test2-task1',
    task: 'task1',
    category: 'process',
    book: 16,
    test: 2,
    title: 'Manufacturing sugar from sugar cane',
    prompt: 'Cambridge IELTS 16 Academic, Test 2, Writing Task 1: the process of making sugar from sugar cane.',
    questionImage: 'https://engnovate.com/wp-content/uploads/2023/08/cambridge-ielts-16-academic-writing-test-2-1.png',
    questionSource: 'https://engnovate.com/ielts-writing-tests/cambridge-ielts-16-academic-writing-test-2-task-1/',
    imageCredit: 'Engnovate · 剑桥真题原始流程图',
    paragraphs: [
      [
        ['The diagram illustrates the seven main stages involved in producing sugar from sugar cane.', 'The process diagram shows how sugar cane is transformed into finished sugar.', 'involved in + 动名词；be transformed into 是被动搭配。'],
      ],
      [
        ['Overall, sugar production is a linear process that starts with growing the crop and ends with drying and cooling the sugar crystals.', 'Sugar making begins with cultivation and finishes when the crystals are dried and cooled.', 'Overall 总结起点、终点及是否循环。'],
        ['The crop takes between twelve and eighteen months to mature before it can be harvested.', 'Sugar cane must grow for roughly one to one and a half years before harvesting.', 'takes + 时间 + to do 用于描述耗时。'],
      ],
      [
        ['First, the mature sugar cane is harvested either mechanically, using a machine, or by workers cutting the stalks by hand.', 'Harvesting may be carried out by agricultural machinery or manually.', 'either ... or ... 表达两种可选方法。'],
        ['The harvested stalks are then fed into a crusher, which extracts the juice from the cane.', 'Next, crushing machines press the stalks to release their juice.', 'which 引导非限定性定语从句，说明机器作用。'],
        ['After crushing, the liquid passes through a limestone filter to remove unwanted material.', 'The extracted juice is filtered through limestone to eliminate impurities.', 'to remove ... 是目的状语；passes through 是固定搭配。'],
      ],
      [
        ['The purified juice is subsequently heated in an evaporator until it becomes a thicker syrup.', 'Heat is applied to the juice in an evaporator, producing syrup.', 'until 引导时间从句；subsequently 说明顺序。'],
        ['Next, the syrup enters a centrifuge, where the sugar crystals are separated from the remaining liquid.', 'A centrifuge spins the syrup so that the crystals can be extracted.', 'where 引导定语从句，解释设备内发生的过程。'],
        ['Finally, the crystals are dried and cooled, resulting in sugar ready for use.', 'The final stage involves drying and cooling the separated sugar.', 'resulting in 表示最终结果；are dried and cooled 是被动结构。'],
        ['No further processing stage is shown after the sugar has been cooled.', 'The diagram ends once the finished sugar is cooled.', 'after + 完整从句，避免编造图中不存在的包装步骤。'],
      ],
    ],
  },
]

export function essaySentences(essay: CopyEssay): CopySentence[] {
  return essay.paragraphs.flat()
}

export function essayText(essay: CopyEssay): string {
  return essay.paragraphs.map(paragraph => paragraph.map(sentence => sentence[0]).join(' ')).join('\n\n')
}

export function essayWordCount(essay: CopyEssay): number {
  return essayText(essay).trim().split(/\s+/).length
}
