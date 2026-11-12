<p><br></p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/salvation_lies_within_IELTS_dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="public/salvation_lies_within_IELTS_light.svg">
  <img alt="Slogan: Salvation lies within IELTS" src="public/salvation_lies_within_IELTS_light.svg">
</picture>

<p><br></p>
<p><br></p>
<h1 align='center'>
  My <span>IELTS™</span>
</h1>

<h2>在线地址 <a href="https://hefengxian.github.io/my-ielts/#/">https://hefengxian.github.io/my-ielts/</a></h2>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/screenshot/screenshot-home-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="public/screenshot/screenshot-home-light.png">
  <img alt="Home" src="public/screenshot/screenshot-home-light.png">
</picture>



## 我的单词（Fork 新增功能）

在 [`/vocabulary/my`](https://sycamore-yu.github.io/my-ielts/#/vocabulary/my) 添加、编辑、删除单词和**短语**，或导入沙拉查词生词本。然后进入 [打字练习](https://sycamore-yu.github.io/my-ielts/#/vocabulary/typing)，在下拉列表中选择 **「我的单词」**。原有章节的词汇和音频不变；个人词条使用浏览器英语语音合成（如果可用）。

沙拉查词：打开生词本 → 导出文本 → 使用下列自定义模板（字段之间是 Tab 制表符，可在网站点击“复制导出模板”）→ 选择换行替换为空格 → 将导出文本粘贴或上传到“我的单词”。

```text
%text%    %trans%    %context%    %note%
```

以上展示时为空格，**实际分隔符必须使用 Tab**。网站也兼容沙拉查词官方 Anki 反引号格式（Word、Context、Translation、Note）、CSV、TSV、JSON 与每行一个词条的纯文本。导入按英文去重，可随时编辑释义和上下文。

词库保存在**当前浏览器的 localStorage**，不同设备不会自动同步。页面提供 **JSON 备份 / 导入**；清除浏览器站点数据前应先备份。截图里的短语可由 ChatGPT 转写成文本或 JSON 后导入，不依赖第三方 OCR 服务。

仓库中的第一批短语来自用户提供的 IELTS Writing Task 1 截图；被字幕遮挡的行没有录入。以后更新内置短语时，已有用户会自动收到新增词条，同时尊重用户此前删除的旧词条。

## 阅读、听力考点词拼写练习

[单词打字与拼写练习](https://sycamore-yu.github.io/my-ielts/#/vocabulary/typing) 现在可选择原有主题词库、“我的单词”、**阅读 3 类考点词（20 + 100 + 256 = 376 条）**和**听力 179 考点词**。阅读、听力词表页也提供“拼写练习”入口，点击后默认进入对应词库的默写模式。

两个模式共用同一词库和熟悉标记：

- **跟打**：展示英文，输入正确后自动切换到下一词，沿用原来的 WPM 和字符准确率。
- **默写**：隐藏英文和同义替换，仅展示词性及中文释义。通过“检查拼写”或 Ctrl + Enter 检查；拼错时显示正确答案，点击“下一词”继续。检查忽略大小写和词首尾多余空格，但保留词内字符与连字符的要求。按 Enter 仍然标记当前词为熟悉，避免和既有快捷键冲突。

阅读考点词采用浏览器英语语音合成，听力 179 考点词使用项目自带 MP3。默写完成后可查看原始同义替换作为参考。熟悉词按词库独立保存于浏览器 localStorage，并支持“恢复本章”；切换练习模式不会清空已熟悉记录。词库名称沿用现有文件名 `reading538words.js`，但实际可用词条总数是 376，故页面以真实数量为准。

## 写作短语库（Fork 新增功能）

[Writing 写作短语库](https://sycamore-yu.github.io/my-ielts/#/writing) 按 Task 1（Introduction、Overview、大小/相等/超过、占比/倍数、趋势、波动、峰谷、对比、地图/流程）和 Task 2（Introduction、Body、原因、举例、让步、Conclusion）整理示例表达。支持搜索、收藏、添加、编辑、删除、复制英文表达，以及 JSON 备份与合并导入。

Writing 页面现提供三个独立笔记入口和两个辅助视图：

- **表达库**：内置 172 条 Task 1 / Task 2 句式，保留原有收藏、编辑、删除记录，按表达功能与题型/话题筛选。新增时间衔接（before doing / after which / subsequently）、时间峰谷及跨类别高低比较表达，并分别注明使用条件。
- **观点库**：按 Task 2 话题与问题题型整理「观点 → 解释 → 例子 → 相关表达」，可自由增删改。
- **错误库**：按语法、搭配、数据准确性和结构论证记录「原句 → 正确表达 → 规则」，支持 Task 1 图表及 Task 2 话题标签。
- **全部笔记**：在三类笔记中统一搜索，可按 Task、图表题型、话题、表达功能和错误类型筛选；同一条笔记只存储一次。
- **复习**：汇总三类笔记中已收藏的内容，点击「完成本次复习」记录次数与最近复习日期。

笔记附带少量**示例**用于说明用法，不会冒充用户保存的个人笔记。表达、观点、错误和复习记录分开使用 localStorage 键；页面顶部提供包含四者的统一 JSON 备份与合并导入，也支持导入旧版仅含短语的备份。

此外，Task 1 增加柱状图、表格、曲线图、饼状图、混合图、地图和流程图筛选。Task 2 增加教育、科技、传统与文化、城市化与全球化、政府、环境、媒体、社会生活、抽象主题筛选，以及同意与否、利弊比较、双边讨论、报告类题型筛选。这些标签可以与原有「表达功能」分类组合使用，添加和编辑词条时也可指定相关标签。「报告类」只是学习筛选标签，作答仍须以题目实际要求为准。

参考 [IELTS Simon 官方课堂](https://ieltssimon.substack.com/about)、[Simon Task 1 主题索引（第三方）](https://ielts-simon.study/ielts-writing-task-1-academic/) 和 [IELTS 官方 Task 2 题型说明](https://ielts.org/news-and-insights/ielts-writing-task-2-how-to-understand-ielts-question-prompts)。新增英文短语和例句为独立整理，不是直接转载 Simon 的范文。

所有修改和收藏保存在当前浏览器的 `localStorage`，与“我的单词”分开存储，不会自动跨设备同步。原有“100 句翻译练习”仍可通过页面顶部的标签进入。

### 范文抄写

[Writing → 范文抄写](https://sycamore-yu.github.io/my-ielts/#/writing) 包含 11 篇针对真实 Cambridge IELTS Academic Writing 题目的**原创范文**：Task 2 的同意与否（剑 16 Test 3）、利弊比较（剑 16 Test 4）、双边讨论（剑 19 Test 1）、报告类（剑 16 Test 1）；Academic Task 1 的柱状图（剑 18 Test 2）、表格（剑 20 Test 1）、曲线图（剑 19 Test 1）、饼状图（剑 14 Test 1）、混合图（剑 17 Test 2）、地图（剑 19 Test 2）和流程图（剑 16 Test 2）。原创范文并非剑桥官方范文或经考官评分的范文。

左侧按段落显示完整灰色范文，已正确输入的句子标绿，当前句逐字符提示错误。右侧逐句跟打，完全匹配后自动切换，并显示对应的同义替换和语法/搭配提示。各篇的句子进度和当前输入独立保存在浏览器 `localStorage`，支持切换题型后继续和重新练习；不会修改原有写作笔记。

题目区展示**真实剑桥题图**，不再显示模拟题的文字描述。Task 1 的图表、地图、流程图引用 [Engnovate](https://engnovate.com/) 公布的原题图；Task 2 的题目图引用 ZIM Academy、IELTS LangGo 的真题配图，以及 Studocu 的原题页面预览图。这些资源均为外部图像链接，未将未经授权的剑桥书页扫描文件加入本仓库。第三方制作的配图并非剑桥书页原版截图，有的未包含完整作答要求。每篇均标注剑桥册数、Test、图片来源，并提供“查看完整原题”链接；图像失效时显示来源链接，而不展示不匹配的模拟图。所有抄写范文已按对应真题的观点或图表数据重新撰写。

旧版词库在首次打开时自动补入新示例，原有编辑、收藏与删除记录保留。以后新增内置短语时也不会恢复已删除的旧词条。

## 概述

雅思备考资料，包含词汇、语法、听说读写最出名的一些内容

- [x] 词汇练习模式

## 规划栏目

### 词汇

> 2026-03 增加打字练习模式，感谢 [@Tommy1109255](https://github.com/Tommy1109255)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/screenshot/typing-vocabulary-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="public/screenshot/typing-vocabulary-light.png">
  <img alt="Vocabulary" src="public/screenshot/typing-vocabulary-light.png">
</picture>

雅思词汇真经（刘洪波橙色的那本）

- 雅思核心词汇
- 逻辑词群记忆法
- 原书音频

词列表

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/screenshot/screenshot-vocabulary-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="public/screenshot/screenshot-vocabulary-light.png">
  <img alt="Vocabulary" src="public/screenshot/screenshot-vocabulary-light.png">
</picture>

练习模式

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/screenshot/screenshot-vocabulary-training-mode-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="public/screenshot/screenshot-vocabulary-training-mode-light.png">
  <img alt="Vocabulary Training Mode" src="public/screenshot/screenshot-vocabulary-training-mode-light.png">
</picture>

### 语法

新东方雅思语法

- 视频
- 讲义
- 思维导图

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/screenshot/screenshot-grammar-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="public/screenshot/screenshot-grammar-light.png">
  <img alt="Grammar" src="public/screenshot/screenshot-grammar-light.png">
</picture>

### 听力

了解雅思听力，以及考试中的一些基本原则、技巧

- 基本概念和应试技巧
- 听力 179 考点词
- [WIP] 雅思听力王语料库

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/screenshot/screenshot-listening-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="public/screenshot/screenshot-listening-light.png">
  <img alt="Listening" src="public/screenshot/screenshot-listening-light.png">
</picture>

### 口语

TODO

### 阅读

- 538 考点词同义替换

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/screenshot/screenshot-reading-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="public/screenshot/screenshot-reading-light.png">
  <img alt="Reading" src="public/screenshot/screenshot-reading-light.png">
</picture>


### 写作

写作相关内容，从基础开始

- 顾家北手把手教你雅思写作 V6.0 —— 100 句翻译练习

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/screenshot/screenshot-writing-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="public/screenshot/screenshot-writing-light.png">
  <img alt="Writing" src="public/screenshot/screenshot-writing-light.png">
</picture>

## 开发

本项目使用

- [Vitesse Lite](https://github.com/antfu/vitesse-lite) 作为模板开发
- 样式部分参照了 [Flowbite](https://github.com/themesberg/flowbite) & [Flowbite Admin Dashboard](https://flowbite-admin-dashboard.vercel.app)

所以需要对 Vue3、TailWindCSS 有一定的了解才能二次开发

```bash
# 安装依赖
pnpm i

# 开发模式
pnpm run dev

# 构建
pnpm run build
```

## 禁止将本项目用于任何商业目的！！！
