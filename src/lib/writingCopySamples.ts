import type { WritingChartType, WritingQuestionType, WritingTask } from './writingPhrases'

/** Each original model sentence has a paraphrase and one focused grammar note. */
export type CopySentence = readonly [text: string, alternative: string, grammar: string]

export interface CopyEssay {
  id: string
  task: WritingTask
  category: WritingChartType | WritingQuestionType
  title: string
  prompt: string
  /** Simulated task data, not an official IELTS chart. */
  sourceData?: string
  paragraphs: CopySentence[][]
}

export const writingCopyEssays: CopyEssay[] = [
  {
    id: 'task2-opinion-finance',
    task: 'task2',
    category: 'opinion',
    title: 'Should schools teach personal finance?',
    prompt: 'Some people believe that managing money should be a compulsory subject at school. To what extent do you agree or disagree?',
    paragraphs: [
      [
        ['Young people often leave school knowing how to solve equations but having little experience of managing money.', 'Many school leavers understand mathematics yet lack practical financial skills.', '用 knowing ... but having ... 平行连接两种情况。'],
        ['I strongly agree that personal finance should be taught to all students because it prepares them for everyday decisions and reduces inequalities in financial knowledge.', 'I believe financial education should be compulsory, as it builds practical skills and gives students a fairer start.', 'because 后连接两个并列的原因；I strongly agree 清楚表态。'],
      ],
      [
        ['The main benefit of financial education is that it helps teenagers make informed decisions when they become independent.', 'Above all, money-management lessons prepare teenagers to make sensible choices as adults.', 'The main benefit ... is that ... 是明确提出论点的结构。'],
        ['For example, students who understand interest rates can compare loans instead of choosing the option with the smallest monthly payment.', 'Students familiar with interest rates are better able to judge the true cost of borrowing.', 'who understand ... 是限定性定语从句，修饰 students。'],
        ['They can also learn how to set a realistic budget and build savings for unexpected expenses.', 'They could practise budgeting and putting money aside for emergencies.', 'how to + 动词原形可作 learn 的宾语。'],
        ['Classroom exercises could ask pupils to plan a month of spending, making the lessons practical rather than purely theoretical.', 'Students could practise creating a monthly budget instead of only memorising financial terms.', 'making ... 是结果状语；rather than 引出对比。'],
        ['Such skills are useful long before someone starts earning a high salary, since even small purchases can add up over time.', 'These habits matter at any income level because minor expenses can accumulate.', 'since 在这里表示原因；add up 是自然的动词短语。'],
      ],
      [
        ['A second reason is that compulsory lessons would give children from different backgrounds more equal access to financial knowledge.', 'Making these lessons compulsory would help close gaps in financial knowledge between families.', 'would 表示假设政策实施后的效果。'],
        ['Some parents discuss saving and spending at home, whereas others may not have the time or confidence to do so.', 'While some families teach budgeting at home, others cannot provide the same guidance.', 'whereas 对比两种情况；do so 避免重复 discuss saving and spending。'],
        ['If schools covered these topics, every pupil could practise basic financial decisions in a supportive environment.', 'School lessons would allow all pupils to develop these skills through guided practice.', 'If + 过去时，主句 could/would 表示假设。'],
        ['Admittedly, the timetable is already crowded, but financial concepts could be included in mathematics or citizenship lessons rather than taught as a separate course.', 'Although schools have limited time, they could integrate financial topics into existing subjects.', 'Admittedly ... but ... 承认反方顾虑后提出解决办法。'],
        ['This would make the proposal practical without removing other essential subjects.', 'Such an approach would preserve room for other important subjects.', 'without + 动名词；make + 宾语 + 形容词。'],
      ],
      [
        ['In conclusion, I believe that teaching personal finance at school should be compulsory.', 'Overall, financial education deserves a place in every school curriculum.', '结论重申立场，不引入新的论点。'],
        ['It would equip students with lifelong skills while ensuring that access to this knowledge does not depend entirely on their families.', 'It would prepare young people for adult life and make financial knowledge more accessible.', 'while 表示两个同时成立的积极结果；equip someone with something 是固定搭配。'],
      ],
    ],
  },
  {
    id: 'task2-advantages-tourism',
    task: 'task2',
    category: 'advantages',
    title: 'International tourism: benefits and costs',
    prompt: 'It is now easier for people to travel to other countries for holidays than in the past. Do the advantages of this development outweigh the disadvantages?',
    paragraphs: [
      [
        ['International travel has become increasingly accessible, allowing more people to spend their holidays abroad.', 'Travelling overseas is now more convenient and affordable for a wider range of people.', 'allowing ... 是现在分词短语，说明前句带来的结果。'],
        ['Although the growth of tourism can harm the environment, I believe its cultural and economic benefits outweigh this drawback.', 'Despite its environmental costs, international tourism brings greater overall benefits to visitors and host communities.', 'Although 后接完整从句；outweigh 用于比较利弊。'],
      ],
      [
        ['The main disadvantage of international tourism is the pressure it places on the environment.', 'The most serious drawback is the environmental damage associated with increased travel.', 'the pressure it places ... 包含省略 that 的定语从句。'],
        ['More flights generate additional emissions, while popular destinations often face problems with waste and overcrowding.', 'Air travel increases emissions, and crowded tourist sites can struggle with rubbish and congestion.', 'while 可以连接两个同时存在但不同的影响。'],
        ['For instance, an island that receives large numbers of visitors may struggle to protect its beaches and freshwater supplies.', 'Heavy tourist numbers can place significant pressure on an island’s natural resources.', 'that receives ... 修饰 island；may 表示可能性，不夸大事实。'],
        ['These problems are serious, particularly when local authorities lack the resources to manage growing visitor numbers.', 'Such impacts can be severe if destinations cannot manage rising tourist demand.', 'particularly when 引入问题更突出的条件。'],
        ['Governments therefore need to improve public transport and limit damage to fragile natural areas.', 'Authorities should invest in sustainable transport and protect sensitive environments.', 'therefore 表示由前面的环境问题推导出措施。'],
      ],
      [
        ['Nevertheless, international tourism creates opportunities for both travellers and the communities they visit.', 'Even so, overseas tourism provides important advantages to visitors and local residents.', 'Nevertheless 用于从缺点段转向优点段。'],
        ['Visitors encounter unfamiliar traditions, food and ways of life, which can challenge stereotypes and broaden their perspectives.', 'Travellers can develop a more open-minded view of the world by experiencing different cultures.', 'which 引导非限定性定语从句，说明文化接触的结果。'],
        ['For example, a visitor staying with a local family may understand everyday customs more clearly than someone who only reads about them.', 'Living with local people can offer deeper cultural insights than learning from books alone.', 'more clearly than 表示程度比较；someone who ... 提供比较对象。'],
        ['These exchanges can also encourage respect for unfamiliar customs and reduce misunderstandings between visitors and residents.', 'Cultural contact may promote mutual respect and prevent unnecessary misunderstandings.', 'encourage ... and reduce ... 是两个并列动词短语。'],
        ['Tourism also supports jobs in accommodation, restaurants and transport, bringing income to businesses that depend on visitors.', 'Tourist spending creates employment and revenue for hotels, restaurants and transport providers.', 'bringing ... 说明收入产生的结果；that depend ... 修饰 businesses。'],
        ['Unlike a short holiday, these employment opportunities can support households throughout the year in destinations with a steady flow of visitors.', 'In places with consistent demand, tourism-related work can provide families with regular income.', 'Unlike + 名词引入对比；throughout the year 表示持续时间。'],
        ['In my view, the lasting benefits of cultural exchange and local employment carry greater weight than the manageable costs of tourism.', 'I consider cultural understanding and long-term jobs more significant than tourism’s environmental disadvantages.', 'carry greater weight than 与 outweigh 意义接近，避免机械重复。'],
      ],
      [
        ['In conclusion, the environmental impact of tourism should not be ignored.', 'To conclude, overseas tourism has genuine environmental costs.', 'should not be ignored 是谨慎承认缺点的被动结构。'],
        ['However, its contribution to cultural understanding and local livelihoods makes it a positive development overall.', 'Even so, its cultural and economic advantages make it beneficial on balance.', 'make + 宾语 + 名词短语，完成最终权衡。'],
      ],
    ],
  },
  {
    id: 'task2-discussion-university',
    task: 'task2',
    category: 'discussion',
    title: 'University or work after school?',
    prompt: 'Some people think going to university is the best way to achieve career success, while others think it is better to start working after school. Discuss both views and give your own opinion.',
    paragraphs: [
      [
        ['People have different views about whether young adults should enter university or begin working as soon as they finish school.', 'There is disagreement over whether school leavers should pursue higher education or start their careers immediately.', 'whether ... or ... 用于介绍两种选择。'],
        ['Although early employment has clear advantages, I believe university is the better route for students whose chosen careers require advanced knowledge.', 'While entering the workforce early can be valuable, higher education is more suitable for many knowledge-based careers.', 'whose 引导定语从句，限定所讨论的职业范围。'],
      ],
      [
        ['Supporters of entering employment immediately argue that practical experience is more valuable than academic qualifications.', 'Those who favour early employment believe workplace skills matter more than formal degrees.', 'Supporters of ... 是客观呈现一方观点的开头。'],
        ['Young workers begin earning an income and can develop useful habits, such as communicating with customers and working in teams.', 'School leavers can earn money and learn teamwork and communication through real jobs.', 'such as 后接具体例子；begin + doing 表示开始做某事。'],
        ['They may also discover what they enjoy before committing several years to a degree.', 'Working first can help young people identify their interests before choosing a university course.', 'before + 动名词；commit ... to ... 是固定结构。'],
        ['For example, someone interested in becoming an electrician may gain more from a paid apprenticeship than from a general academic programme.', 'An aspiring electrician may benefit more from practical training than a university degree.', 'gain more from A than from B 表示比较收益。'],
        ['From this perspective, working after school is a sensible choice for people pursuing practical occupations.', 'Early employment therefore makes sense for students seeking hands-on careers.', 'pursuing ... 是现在分词短语，修饰 people。'],
      ],
      [
        ['On the other hand, university provides the specialised knowledge required for many professions.', 'However, numerous careers depend on the advanced training offered by universities.', 'required for ... 是过去分词短语，修饰 knowledge。'],
        ['Engineers and doctors, for instance, need structured study and supervised training that are difficult to obtain through ordinary employment alone.', 'Careers such as engineering and medicine require formal education as well as practical training.', 'that are difficult ... 修饰 study and training。'],
        ['Universities also give students opportunities to develop research, analysis and independent learning skills.', 'Higher education can strengthen students’ ability to research, analyse and learn independently.', 'give somebody opportunities to do ... 可迁移到教育类作文。'],
        ['These abilities help graduates adapt when technology changes or when their careers take unexpected directions.', 'Such transferable skills help graduates respond to changing professional demands.', 'when 引导时间或情境从句；adapt 是不及物动词。'],
        ['In addition, a degree remains a formal requirement for certain occupations, so skipping university may close off some options.', 'Some professions require degrees, meaning that avoiding university can restrict career choices.', 'so 引入结果；close off some options 表示减少选择。'],
        ['For students aiming for these careers, the long-term value of higher education is likely to exceed the short-term benefit of earning earlier.', 'For these students, future career opportunities may outweigh the income gained from working sooner.', 'is likely to 表示有依据但非绝对的判断。'],
      ],
      [
        ['In conclusion, starting work straight after school can be effective for practical careers and offers immediate experience.', 'Overall, entering work early is appropriate for some vocational paths.', '结论先概括第一种观点，保持客观。'],
        ['Nevertheless, I favour university for careers that depend on specialist qualifications and transferable academic skills.', 'However, I consider university the stronger choice for occupations requiring advanced study.', 'favour 在这里是动词，表示支持某种选择。'],
      ],
    ],
  },
  {
    id: 'task2-report-traffic',
    task: 'task2',
    category: 'report',
    title: 'Causes and solutions of urban congestion',
    prompt: 'Traffic congestion is becoming a serious problem in many cities. What are the main causes of this problem, and what measures can be taken to solve it?',
    paragraphs: [
      [
        ['Heavy traffic has become a familiar problem in many growing cities, causing delays and worsening air quality.', 'Congestion is increasingly common in expanding urban areas, with consequences for travel times and pollution.', 'causing ... 和 worsening ... 并列说明交通拥堵的后果。'],
        ['This essay will explain how dependence on private cars and inadequate public transport contribute to congestion, before discussing practical solutions.', 'The main causes are car dependence and poor transport alternatives, while better services and road management can help.', 'how ... contribute to ... 是宾语从句；contribute to 后接名词。'],
      ],
      [
        ['One major cause of congestion is that many commuters rely on private cars for daily journeys.', 'A key reason for traffic jams is the widespread use of private vehicles.', 'One major cause ... is that ... 直接提出原因。'],
        ['As housing spreads farther from city centres, residents often travel longer distances to reach offices, schools and shops.', 'Urban expansion means that more people must make long journeys for work and other activities.', 'As 在这里表示随着某种变化而发生另一种变化。'],
        ['If buses and trains are slow or unreliable, driving becomes the most convenient option for these residents.', 'When public transport is poor, commuters are more likely to choose cars.', 'If 引导条件句；becomes + 形容词最高级。'],
        ['For example, a commuter who cannot rely on a bus arriving on time may decide to drive every morning.', 'Unreliable bus services can push daily commuters towards private cars.', 'who cannot rely ... 修饰 commuter；rely on + 名词或动名词。'],
        ['However, when thousands of people make the same choice, roads can no longer carry traffic efficiently during peak hours.', 'This individual convenience creates collective delays when too many vehicles use the same roads.', 'when 引导解释拥堵发生的条件；peak hours 是固定搭配。'],
        ['The resulting queues waste time and make public buses even less reliable.', 'Traffic jams delay travellers and further reduce the reliability of bus services.', 'resulting 作为形容词修饰 queues，表示由前述原因造成。'],
      ],
      [
        ['Cities can address these causes by making alternatives to driving faster and more dependable.', 'Authorities should tackle congestion by improving the convenience of public transport.', 'by + 动名词说明采取措施的方式。'],
        ['For example, dedicated bus lanes allow buses to avoid much of the traffic that slows ordinary vehicles.', 'Separate bus lanes can keep public transport moving when other roads are crowded.', 'allow + 宾语 + to do；that slows ... 修饰 traffic。'],
        ['Frequent services and affordable fares would then make commuting without a car more attractive.', 'Regular departures and reasonable ticket prices could encourage residents to leave their cars at home.', 'make + 宾语 + 形容词；would 表示措施可能产生的效果。'],
        ['Local governments should also improve walking and cycling routes for short journeys, reducing pressure on busy roads.', 'Better paths for pedestrians and cyclists can remove some short car trips from the road network.', 'reducing ... 是结果状语；routes for ... 说明用途。'],
        ['Safe cycle lanes and convenient crossings would make these alternatives realistic for a wider range of residents.', 'Improved cycling and walking facilities could encourage more people to avoid short car trips.', 'would make + 宾语 + 形容词，说明措施带来的变化。'],
        ['Finally, charging higher parking fees in the busiest districts could discourage unnecessary car trips, provided that reliable alternatives are available.', 'Higher parking charges can reduce driving in central areas if suitable transport options exist.', 'provided that 表示有条件的政策建议，避免绝对化。'],
      ],
      [
        ['In conclusion, congestion is largely caused by car dependence and insufficient public transport.', 'Overall, heavy traffic stems mainly from too many private vehicles and weak transport networks.', 'is caused by 和 stems from 均可表示原因。'],
        ['Improving buses and trains, supporting short journeys on foot or by bicycle, and managing parking demand could help cities reduce it.', 'Cities can ease congestion through better transit, active travel infrastructure and parking policies.', '三个动名词短语并列作主语；could 表示建议的潜在效果。'],
      ],
    ],
  },
  {
    id: 'task1-bar-journeys',
    task: 'task1',
    category: 'bar',
    title: 'Public transport journeys in five cities',
    prompt: 'The bar chart compares the number of weekly bus and tram journeys in five cities in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    sourceData: '单位：千次 / 周\n城市 A：公交 60，电车 20\n城市 B：公交 40，电车 30\n城市 C：公交 30，电车 10\n城市 D：公交 50，电车 40\n城市 E：公交 20，电车 15',
    paragraphs: [
      [
        ['The bar chart compares weekly journeys made by bus and tram in five cities in 2024, with figures given in thousands.', 'The chart shows the numbers of bus and tram trips each week across five cities in 2024.', 'compares A and B in ...；with figures given ... 用于说明单位。'],
      ],
      [
        ['Overall, buses were used more frequently than trams in every city.', 'In all five cities, bus journeys outnumbered tram journeys.', 'Overall 应总结最主要的比较，不列举每个数字。'],
        ['City D recorded the highest combined number of journeys, whereas City E had the lowest total.', 'The overall figure was greatest in City D and smallest in City E.', 'whereas 用于并列比较两种相反情况。'],
      ],
      [
        ['City A had the largest number of bus journeys, at 60 thousand per week.', 'Bus use peaked in City A, with 60,000 weekly journeys.', 'at + 数值可简洁补充具体数据。'],
        ['The corresponding figures for Cities D and B were 50 thousand and 40 thousand respectively.', 'Cities D and B registered 50,000 and 40,000 bus trips, in that order.', 'respectively 用于按顺序对应两个地点和数字。'],
        ['Bus travel was less common in Cities C and E, which recorded 30 thousand and 20 thousand journeys.', 'Cities C and E had lower bus figures of 30,000 and 20,000.', 'which 引导补充说明的非限定性定语从句。'],
      ],
      [
        ['Turning to tram use, City D led the group with 40 thousand journeys each week.', 'As for trams, City D ranked first at 40,000 weekly trips.', 'Turning to ... 适用于在同一图表中切换指标。'],
        ['City B followed at 30 thousand, while City A registered 20 thousand.', 'Tram journeys reached 30,000 in City B, compared with 20,000 in City A.', 'while 可用于对比不同类别的数据。'],
        ['Only 15 thousand tram journeys were recorded in City E, and the figure was even lower in City C, at 10 thousand.', 'Cities E and C had the fewest tram trips, at 15,000 and 10,000 respectively.', 'were recorded 是被动语态；even lower 强调数据差异。'],
        ['Together, buses and trams accounted for 90 thousand journeys in City D but just 35 thousand in City E.', 'The combined totals were 90,000 in City D and only 35,000 in City E.', 'accounted for + 数量；but just 用于突出对比。'],
      ],
    ],
  },
  {
    id: 'task1-table-libraries',
    task: 'task1',
    category: 'table',
    title: 'Monthly visits to four libraries',
    prompt: 'The table gives the number of monthly visits to four public libraries in 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    sourceData: '单位：千人次 / 月\n分馆 | 2015 | 2025\nNorth | 12 | 20\nCentral | 18 | 30\nSouth | 9 | 15\nWest | 6 | 10',
    paragraphs: [
      [
        ['The table provides information about the number of visits made to four public libraries each month in 2015 and 2025.', 'The table compares monthly visitor numbers at four public libraries in two years.', 'provides information about ... 是 Task 1 的常用开头。'],
        ['All figures are expressed in thousands of visits.', 'The data are measured in thousands of visits per month.', 'are expressed in ... 用于说明计量单位。'],
      ],
      [
        ['Overall, every library attracted more visits in 2025 than in 2015, and the ranking of the branches remained unchanged.', 'Visits increased at all four libraries, while their relative positions stayed the same.', 'Overall 不必列全部数字，应概括共同趋势和排序。'],
        ['Central was consistently the busiest branch, whereas West received the fewest visitors in both years.', 'Central led the table throughout, while West recorded the lowest figures.', 'consistently 表示在所给时间点都保持这一特征。'],
      ],
      [
        ['In 2015, Central recorded 18 thousand visits per month, compared with 12 thousand at North.', 'Central received 18,000 visits in 2015, six thousand more than North.', 'compared with ... 直接比较两个类别。'],
        ['South attracted 9 thousand visits, and the figure for West was lower still, at just 6 thousand.', 'South and West had the smaller totals of 9,000 and 6,000 respectively.', 'the figure for ... 避免重复 visits。'],
        ['By 2025, Central had risen to 30 thousand monthly visits, an increase of 12 thousand.', 'Central grew by 12,000 visits to reach 30,000 per month in 2025.', 'rise by 表示增量，rise to 表示终值。'],
      ],
      [
        ['North also grew substantially, from 12 thousand to 20 thousand visits.', 'North experienced an increase of 8,000 monthly visits.', 'from ... to ... 描述起点与终点。'],
        ['The numbers for South and West reached 15 thousand and 10 thousand respectively.', 'South and West finished at 15,000 and 10,000 monthly visits, in that order.', 'respectively 保持数值对应关系。'],
        ['Taken together, the four libraries received 75 thousand visits per month in 2025, compared with 45 thousand in 2015.', 'Total monthly visits rose from 45,000 to 75,000 across the four branches.', 'Taken together 用于概括多项数据的合计。'],
      ],
    ],
  },
  {
    id: 'task1-line-cycling',
    task: 'task1',
    category: 'line',
    title: 'Students cycling to three campuses',
    prompt: 'The line graph shows the percentage of students cycling to university at campuses A, B and C in 2010, 2020 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    sourceData: '单位：学生百分比\n年份 | 2010 | 2020 | 2025\nCampus A | 10% | 20% | 35%\nCampus B | 30% | 28% | 22%\nCampus C | 15% | 25% | 25%',
    paragraphs: [
      [
        ['The line graph illustrates changes in the proportion of students who cycled to three university campuses between 2010 and 2025.', 'The graph shows how cycling rates varied across three campuses over a fifteen-year period.', 'the proportion of students who ... 后接定语从句。'],
      ],
      [
        ['Overall, cycling became more common at Campuses A and C, while the figure for Campus B declined.', 'The cycling share increased at two campuses but fell at Campus B.', 'while 对比上升和下降的趋势。'],
        ['Campus A experienced the most dramatic rise and had the highest rate by the end of the period.', 'Campus A saw the strongest growth, finishing with the largest cycling proportion.', 'by the end of the period 表示到期末。'],
      ],
      [
        ['In 2010, only 10% of students cycled to Campus A, the lowest proportion of the three locations.', 'Campus A started at 10%, below both other campuses.', '同位语 the lowest proportion 补充说明 10%。'],
        ['This figure doubled to 20% in 2020 before climbing further to 35% in 2025.', 'The share rose to 20% and then increased again to 35%.', 'doubled to 表示翻倍达到；before + 动名词连接变化。'],
        ['By contrast, Campus B started at 30%, which was the highest level in 2010.', 'Campus B led in the initial year, at 30%.', 'By contrast 引出反向变化；which 引导补充说明。'],
      ],
      [
        ['The share for Campus B slipped slightly to 28% in 2020 and then fell to 22% five years later.', 'Campus B declined from 30% to 28% and eventually reached 22%.', 'slipped slightly 是描述小幅下降的自然搭配。'],
        ['Campus C, meanwhile, rose from 15% to 25% in the first decade.', 'Meanwhile, cycling at Campus C increased by ten percentage points between 2010 and 2020.', '百分点是 percentage points，不是 percent。'],
        ['Its figure remained stable at 25% in 2025, leaving it between the other two campuses.', 'Campus C then held steady at 25%, ranking second in 2025.', 'remained stable at 后接数值；leaving ... 表示结果。'],
        ['The difference between Campuses A and B therefore changed from 20 percentage points in 2010 to 13 in 2025, with their positions reversed.', 'Campus A moved from trailing Campus B by twenty points to leading it by thirteen.', 'with + 名词 + 过去分词说明伴随结果。'],
      ],
    ],
  },
  {
    id: 'task1-pie-spending',
    task: 'task1',
    category: 'pie',
    title: 'Household expenditure in two years',
    prompt: 'The two pie charts show how an average household divided its spending among five categories in 2005 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    sourceData: '单位：家庭支出占比\n类别 | 2005 | 2025\nHousing | 30% | 40%\nFood | 25% | 20%\nTransport | 20% | 15%\nLeisure | 15% | 15%\nOther | 10% | 10%',
    paragraphs: [
      [
        ['The pie charts compare the distribution of average household spending across five categories in 2005 and 2025.', 'The charts show how the shares of household expenditure differed between 2005 and 2025.', 'distribution of ... across ... 用于描述支出结构。'],
      ],
      [
        ['Overall, housing accounted for the largest proportion in both years and became more dominant over time.', 'Housing was the biggest expense in both years, and its share increased.', 'accounted for the largest proportion 是占比类常见表达。'],
        ['By comparison, the shares spent on food and transport declined, while leisure and other items remained unchanged.', 'Food and transport took smaller shares in 2025, whereas the two remaining categories were stable.', 'while 用于连接下降与不变两类趋势。'],
      ],
      [
        ['In 2005, housing represented 30% of household expenditure, followed by food at 25%.', 'Housing made up 30% of the budget, with food accounting for another 25%.', 'followed by + 名词表示其后的排序。'],
        ['Transport was responsible for one fifth of the total, while leisure made up 15%.', 'Transport accounted for 20% and leisure for 15%.', 'one fifth 等于 20%；注意描述比例而非数量。'],
        ['The smallest share was allocated to other expenses, at 10%.', 'Other items constituted the smallest category at one tenth of spending.', 'was allocated to 是描述预算分配的被动语态。'],
      ],
      [
        ['Twenty years later, housing had risen by ten percentage points to 40% of the total.', 'The housing share increased from 30% to 40% in 2025.', 'by 10 percentage points 表示由 30% 到 40% 的变化。'],
        ['Food and transport fell to 20% and 15% respectively, a drop of five points for each category.', 'Food accounted for one fifth and transport for 15%, both five points lower than before.', 'respectively 把两个类别按顺序对应至两个数字。'],
        ['Leisure continued to account for 15%, and spending on other items stayed at 10%.', 'The proportions for leisure and other spending were unchanged at 15% and 10%.', 'continued to 和 stayed at 均可表示维持不变。'],
        ['Food remained the second-largest category in 2025, although its share was only half that of housing.', 'Despite its decline, food still ranked second, at 20% compared with 40% for housing.', 'although 引入让步；half that of 避免重复 share。'],
        ['As a result, housing alone represented twice the share allocated to food in 2025.', 'In the final year, the housing share was double that of food.', 'twice the share of ... 表示比例关系。'],
      ],
    ],
  },
  {
    id: 'task1-mixed-commuting',
    task: 'task1',
    category: 'mixed',
    title: 'Journey times and public transport use',
    prompt: 'A bar chart shows average commuting time in three cities in 2010 and 2025. A line graph shows the share of commuters using public transport in those cities. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    sourceData: '平均通勤时间（分钟）2010 → 2025：A 30 → 40；B 45 → 35；C 25 → 30\n公共交通通勤占比（%）2010 → 2025：A 40 → 55；B 35 → 50；C 50 → 60',
    paragraphs: [
      [
        ['The charts compare changes in average commuting times and public transport use in three cities between 2010 and 2025.', 'The two charts show journey duration and the proportion of public transport commuters in three cities.', '分别写清两个指标；不要混淆分钟和百分比。'],
      ],
      [
        ['Overall, the proportion of people using public transport increased in all three cities.', 'All three cities saw a rise in public transport use.', 'Overall 先概括最一致的趋势。'],
        ['However, average commuting times followed different patterns, rising in Cities A and C but falling in City B.', 'Travel times increased in two cities but decreased in City B.', 'rising ... but falling ... 是并列现在分词结构。'],
      ],
      [
        ['In 2010, City B had the longest commute at 45 minutes, compared with 30 minutes in City A and 25 in City C.', 'City B led in journey time in 2010, ahead of Cities A and C.', 'at + 时间数值；compared with 引入其他数据。'],
        ['By 2025, the average journey in City B had shortened to 35 minutes.', 'The commuting time in City B fell by ten minutes to 35.', 'shortened to 表示终值；fall by 表示减少幅度。'],
        ['Meanwhile, commuting times in Cities A and C climbed to 40 and 30 minutes respectively.', 'Cities A and C experienced increases to 40 and 30 minutes.', 'respectively 确保两个城市和数值一一对应。'],
      ],
      [
        ['Turning to public transport, City C had the highest share in both years, increasing from 50% to 60%.', 'City C remained the leader in public transport use, rising by ten percentage points.', 'Turning to 用于切换到第二张图的数据。'],
        ['The figures for Cities A and B rose from 40% to 55% and from 35% to 50%, respectively.', 'Public transport use increased by fifteen percentage points in both Cities A and B.', 'from ... to ... 可重复用于不同类别；单位为百分点。'],
        ['City B therefore combined a higher public transport share with a shorter average commute in 2025.', 'City B experienced both greater public transport use and reduced journey times.', 'combined A with B 描述两个指标同时变化，不推断因果。'],
        ['In contrast, City A recorded a rise in both measures over the same period.', 'Both commuting time and public transport use increased in City A.', 'in contrast 比较不同城市的模式。'],
      ],
    ],
  },
  {
    id: 'task1-map-park',
    task: 'task1',
    category: 'map',
    title: 'Changes to a town park',
    prompt: 'The maps show the layout of a town park in 2010 and after redevelopment in 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    sourceData: '2010：北侧为池塘，西侧为树林，东侧为停车场；中央小路通向南侧入口。\n2025：北侧池塘保留；西侧树林改为运动场；东侧停车场改为咖啡馆；停车场迁至西南角；中央小路延长并连通咖啡馆；南侧入口不变。',
    paragraphs: [
      [
        ['The two maps illustrate how the layout of a town park changed between 2010 and 2025.', 'The maps compare the design of a public park before and after redevelopment.', 'how ... changed 是宾语从句；地图题通常使用过去时。'],
      ],
      [
        ['Overall, the park became more focused on recreation and visitor facilities, while the pond and southern entrance were preserved.', 'The redevelopment added leisure facilities but retained the pond and main entrance.', 'Overall 概括主要用途变化和保留部分。'],
        ['The most significant alterations occurred in the western and eastern sections of the site.', 'The greatest changes took place on the two sides of the park.', 'occurred 和 took place 都可用于地图变化描述。'],
      ],
      [
        ['In 2010, a wooded area occupied the western side of the park, with a car park located to the east.', 'The original park had woodland in the west and parking facilities in the east.', 'occupied the western side 是方位描述；with + 名词 + 过去分词。'],
        ['A footpath ran through the centre from the entrance in the south, while a pond lay in the northern section.', 'A central path led northwards from the entrance towards a pond.', 'ran through 和 lay 用于描述原有布局。'],
        ['By 2025, the woodland had been replaced by a sports court, providing an additional place for physical activity.', 'The western trees gave way to a new sports facility.', 'had been replaced by 表示某处被改造成新的设施。'],
      ],
      [
        ['On the eastern side, the former car park was converted into a cafe.', 'The eastern parking area became a cafe.', 'was converted into 是地图题常用被动搭配。'],
        ['A new parking area was built in the south-west corner to accommodate visitors arriving by car.', 'Replacement parking was provided in the south-west of the park.', 'to accommodate 表示修建新设施的目的。'],
        ['The central footpath was also extended towards the cafe, making it easier to reach the new building.', 'An extension to the path connected the centre with the new cafe.', 'making ... 是结果状语，说明路径延长的效果。'],
        ['In contrast, the pond in the north and the entrance in the south remained in their original positions.', 'The northern pond and southern entrance were left unchanged.', 'In contrast 引出未变化的设施。'],
      ],
    ],
  },
  {
    id: 'task1-process-coffee',
    task: 'task1',
    category: 'process',
    title: 'Producing packaged ground coffee',
    prompt: 'The diagram illustrates the stages involved in producing packaged ground coffee from harvested coffee cherries. Summarise the information by selecting and reporting the main features.',
    sourceData: '流程：采摘咖啡果 → 筛选 → 去果皮 → 发酵（约 24 小时）→ 清洗 → 晾晒 → 烘焙 → 研磨 → 包装。整个流程为线性顺序，无循环。',
    paragraphs: [
      [
        ['The diagram shows how harvested coffee cherries are processed into packaged ground coffee.', 'The process diagram illustrates the production of ground coffee from freshly picked cherries.', 'how ... are processed 是宾语从句；流程题常用一般现在时被动语态。'],
      ],
      [
        ['Overall, this is a linear process that begins with harvesting and ends with packaging.', 'In general, coffee production follows a sequence from picking to packing.', 'Overall 概括起点、终点和流程特征。'],
        ['The main stages involve preparing the beans, removing moisture and turning the dried beans into a product ready for sale.', 'The procedure includes bean preparation, drying and final processing.', 'involve + 动名词；三个并列动名词短语概括阶段。'],
      ],
      [
        ['First, ripe coffee cherries are picked and sorted to remove unsuitable fruit.', 'The process starts when ripe cherries are harvested and selected.', 'are picked and sorted 是两个并列被动谓语。'],
        ['The outer skin is then removed, leaving the beans ready for fermentation.', 'Next, the cherries are pulped before the beans are fermented.', 'leaving ... 是现在分词结果状语。'],
        ['During this stage, the beans are left to ferment for approximately 24 hours.', 'The fermentation stage lasts for about one day.', 'are left to + 动词原形；for 后接时间长度。'],
        ['After fermentation, the beans are washed thoroughly to remove any remaining material.', 'Once fermentation is complete, the beans undergo washing.', 'After + 名词；once + 完整从句。'],
      ],
      [
        ['The cleaned beans are subsequently spread out to dry in the sun.', 'The beans are then sun-dried after being washed.', 'subsequently 是时间顺序副词；to dry 表示目的。'],
        ['This drying stage reduces the moisture in the beans before they move on to the next stage.', 'Sun-drying prepares the beans for roasting by removing moisture.', 'before 引导时间从句；move on to 是顺序转换表达。'],
        ['When enough moisture has been removed, the beans are roasted at a high temperature.', 'Once dry, the beans undergo roasting.', 'When 引导时间条件；现在完成时被动表示处理完成。'],
        ['Next, the roasted beans are ground into a fine powder suitable for making coffee.', 'The roasted beans are then crushed to produce ground coffee.', 'are ground into 是研磨成某种形态的固定表达。'],
        ['Finally, the ground coffee is packed into containers and prepared for distribution.', 'The final stage involves packaging the finished coffee for sale.', 'Finally 提示流程结束；is packed ... and prepared ... 为并列被动。'],
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
