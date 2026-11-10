<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { WRITING_NOTES_KEY, WRITING_REVIEW_KEY, errorCategories, loadReviewRecords, loadWritingNotes, markReview, mergeWritingNotes, noteSearchText, noteTags, parseWritingArchive, phraseTags } from '../lib/writingNotebook'
import type { ErrorCategory, ErrorNote, IdeaNote, WritingNote } from '../lib/writingNotebook'
import { WRITING_PHRASES_KEY, loadWritingPhrases, mergeWritingBackup, writingCategories, writingChartTypes, writingQuestionTypes, writingTopics } from '../lib/writingPhrases'
import type { WritingChartType, WritingPhrase, WritingQuestionType, WritingTask, WritingTopic } from '../lib/writingPhrases'
import WritingPhraseBook from './WritingPhraseBook.vue'

type Section = 'phrases' | 'ideas' | 'errors' | 'all' | 'review'
type DisplayItem = { kind: 'phrase'; phrase: WritingPhrase } | { kind: 'note'; note: WritingNote }

const section = ref<Section>('phrases')
const search = ref('')
const selectedTag = ref('all')
const message = ref('')
const phraseState = ref(loadWritingPhrases())
const notes = ref(loadWritingNotes())
const reviews = ref(loadReviewRecords())
const editingId = ref('')
const formOpen = ref(false)
const backupInput = ref<HTMLInputElement | null>(null)
const form = reactive({
  kind: 'idea' as 'idea' | 'error',
  task: 'task2' as WritingTask,
  topic: 'all' as WritingTopic | 'all',
  questionType: 'all' as WritingQuestionType | 'all',
  chartType: 'all' as WritingChartType | 'all',
  category: 'grammar' as ErrorCategory,
  title: '',
  question: '',
  point: '',
  reasoning: '',
  example: '',
  expressions: '',
  original: '',
  corrected: '',
  rule: '',
})

const sections: Array<{ id: Section; title: string; description: string }> = [
  { id: 'phrases', title: '表达库', description: '句式、搭配与用法' },
  { id: 'ideas', title: '观点库', description: '论点、解释与例子' },
  { id: 'errors', title: '错误库', description: '原句、修改与规则' },
  { id: 'all', title: '全部笔记', description: '跨类别统一搜索' },
  { id: 'review', title: '复习', description: '收藏清单与复习记录' },
]

const tags = [
  { id: 'all', label: '全部标签' },
  { id: 'task:task1', label: 'Task 1 小作文' },
  { id: 'task:task2', label: 'Task 2 大作文' },
  ...writingCategories.map(item => ({ id: `category:${item.id}`, label: `表达 · ${item.label}` })),
  ...writingChartTypes.map(item => ({ id: `chart:${item.id}`, label: `图表 · ${item.label}` })),
  ...writingTopics.map(item => ({ id: `topic:${item.id}`, label: `话题 · ${item.label}` })),
  ...writingQuestionTypes.map(item => ({ id: `question:${item.id}`, label: `题型 · ${item.label}` })),
  ...errorCategories.map(item => ({ id: `error:${item.id}`, label: `错误 · ${item.label}` })),
]

function matches(item: DisplayItem) {
  const term = search.value.trim().toLocaleLowerCase()
  const labelList = item.kind === 'phrase' ? phraseTags(item.phrase) : noteTags(item.note)
  if (selectedTag.value !== 'all' && !labelList.includes(selectedTag.value))
    return false
  const body = item.kind === 'phrase'
    ? [item.phrase.text, item.phrase.meaning, item.phrase.example, item.phrase.note].join(' ')
    : noteSearchText(item.note)
  return !term || body.toLocaleLowerCase().includes(term)
}

const displayItems = computed<DisplayItem[]>(() => {
  const phraseItems: DisplayItem[] = phraseState.value.phrases.map(phrase => ({ kind: 'phrase', phrase }))
  const noteItems: DisplayItem[] = notes.value.map(note => ({ kind: 'note', note }))
  let items = [...noteItems, ...phraseItems]
  if (section.value === 'ideas') {
    items = noteItems.filter(item => item.kind === 'note' && item.note.kind === 'idea')
  }
  else if (section.value === 'errors') {
    items = noteItems.filter(item => item.kind === 'note' && item.note.kind === 'error')
  }
  else if (section.value === 'review') {
    items = items.filter(item => item.kind === 'phrase'
      ? phraseState.value.favorites.includes(item.phrase.id)
      : item.note.favorite)
  }
  return items.filter(matches)
})

const favoriteCount = computed(() => phraseState.value.favorites.length + notes.value.filter(note => note.favorite).length)
const counts = computed(() => ({
  phrases: phraseState.value.phrases.length,
  ideas: notes.value.filter(note => note.kind === 'idea').length,
  errors: notes.value.filter(note => note.kind === 'error').length,
  all: phraseState.value.phrases.length + notes.value.length,
  review: favoriteCount.value,
}))

function saveNotes(updated: WritingNote[]) {
  localStorage.setItem(WRITING_NOTES_KEY, JSON.stringify(updated))
  notes.value = updated
}

function resetForm(kind: 'idea' | 'error') {
  editingId.value = ''
  form.kind = kind
  form.task = kind === 'idea' ? 'task2' : 'task1'
  form.topic = 'all'
  form.questionType = 'all'
  form.chartType = 'all'
  form.category = 'grammar'
  form.title = ''
  form.question = ''
  form.point = ''
  form.reasoning = ''
  form.example = ''
  form.expressions = ''
  form.original = ''
  form.corrected = ''
  form.rule = ''
}

function addNote(kind: 'idea' | 'error') {
  resetForm(kind)
  section.value = kind === 'idea' ? 'ideas' : 'errors'
  selectedTag.value = 'all'
  search.value = ''
  message.value = ''
  formOpen.value = true
}

function editNote(note: WritingNote) {
  resetForm(note.kind)
  editingId.value = note.id
  form.kind = note.kind
  form.task = note.task
  form.topic = note.topic || 'all'
  form.questionType = note.questionType || 'all'
  form.chartType = note.chartType || 'all'
  if (note.kind === 'idea') {
    form.title = note.title
    form.question = note.question
    form.point = note.point
    form.reasoning = note.reasoning
    form.example = note.example
    form.expressions = note.expressions
  }
  else {
    form.category = note.category
    form.original = note.original
    form.corrected = note.corrected
    form.rule = note.rule
  }
  formOpen.value = true
  section.value = note.kind === 'idea' ? 'ideas' : 'errors'
  selectedTag.value = 'all'
  search.value = ''
  message.value = ''
}

function saveNote() {
  if (form.kind === 'idea' && (!form.title.trim() || !form.point.trim())) {
    message.value = '请填写观点标题和论点'
    return
  }
  if (form.kind === 'error' && (!form.original.trim() || !form.corrected.trim())) {
    message.value = '请填写原句和正确表达'
    return
  }
  const existing = notes.value.find(item => item.id === editingId.value)
  const common = {
    id: editingId.value || `user-${form.kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    favorite: existing?.favorite || false,
    topic: form.task === 'task2' && form.topic !== 'all' ? form.topic : undefined,
    questionType: form.task === 'task2' && form.questionType !== 'all' ? form.questionType : undefined,
    chartType: form.task === 'task1' && form.chartType !== 'all' ? form.chartType : undefined,
  }
  const entry: WritingNote = form.kind === 'idea'
    ? {
      ...common,
      kind: 'idea',
      task: 'task2',
      title: form.title.trim(),
      question: form.question.trim(),
      point: form.point.trim(),
      reasoning: form.reasoning.trim(),
      example: form.example.trim(),
      expressions: form.expressions.trim(),
    } satisfies IdeaNote
    : {
      ...common,
      kind: 'error',
      task: form.task,
      category: form.category,
      original: form.original.trim(),
      corrected: form.corrected.trim(),
      rule: form.rule.trim(),
    } satisfies ErrorNote
  const updated = editingId.value
    ? notes.value.map(note => note.id === editingId.value ? entry : note)
    : [entry, ...notes.value]
  saveNotes(updated)
  formOpen.value = false
  message.value = '笔记已保存'
}

function deleteNote(note: WritingNote) {
  if (!window.confirm('确定删除这条笔记？'))
    return
  saveNotes(notes.value.filter(item => item.id !== note.id))
  message.value = '笔记已删除'
}

function toggleFavorite(item: DisplayItem) {
  if (item.kind === 'note') {
    saveNotes(notes.value.map(note => note.id === item.note.id ? { ...note, favorite: !note.favorite } : note))
  }
  else {
    const existing = phraseState.value.favorites
    const favorites = existing.includes(item.phrase.id)
      ? existing.filter(id => id !== item.phrase.id)
      : [...existing, item.phrase.id]
    const next = { ...phraseState.value, favorites }
    localStorage.setItem(WRITING_PHRASES_KEY, JSON.stringify(next))
    phraseState.value = next
  }
}

function isFavorite(item: DisplayItem) {
  return item.kind === 'phrase'
    ? phraseState.value.favorites.includes(item.phrase.id)
    : item.note.favorite
}

function itemKey(item: DisplayItem) {
  return item.kind === 'phrase' ? `phrase:${item.phrase.id}` : `${item.note.kind}:${item.note.id}`
}

function finishReview(item: DisplayItem) {
  const updated = markReview(reviews.value, itemKey(item), new Date().toISOString())
  localStorage.setItem(WRITING_REVIEW_KEY, JSON.stringify(updated))
  reviews.value = updated
  message.value = '已记录本次复习'
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    message.value = '已复制'
  }
  catch {
    message.value = '复制失败，请手动选中文本'
  }
}

function exportAll() {
  const archive = JSON.stringify({
    version: 1,
    phrases: phraseState.value.phrases,
    favorites: phraseState.value.favorites,
    notes: notes.value,
    reviews: reviews.value,
  }, null, 2)
  const url = URL.createObjectURL(new Blob([archive], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'my-ielts-writing-notebook.json'
  link.click()
  URL.revokeObjectURL(url)
}

async function importAll(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file)
    return
  try {
    // Parse and validate everything before mutating persistent state.
    const archive = parseWritingArchive(await file.text())
    const mergedPhrases = mergeWritingBackup(phraseState.value, archive.phrases)
    const mergedNotes = archive.notes ? mergeWritingNotes(notes.value, archive.notes) : notes.value
    const mergedReviews = archive.reviews ? { ...reviews.value, ...archive.reviews } : reviews.value
    localStorage.setItem(WRITING_PHRASES_KEY, JSON.stringify(mergedPhrases))
    localStorage.setItem(WRITING_NOTES_KEY, JSON.stringify(mergedNotes))
    localStorage.setItem(WRITING_REVIEW_KEY, JSON.stringify(mergedReviews))
    phraseState.value = mergedPhrases
    notes.value = mergedNotes
    reviews.value = mergedReviews
    message.value = '备份已合并，原有笔记与收藏已保留'
  }
  catch (error) {
    message.value = error instanceof Error ? `导入失败：${error.message}` : '导入失败'
  }
  input.value = ''
}
</script>

<template>
  <section class="text-gray-900 dark:text-gray-100">
    <div class="mb-5">
      <h2 class="mb-1 text-2xl font-bold">Writing Notes</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">分开积累表达、观点和错误，通过标签关联，用收藏清单复习。</p>
    </div>

    <nav aria-label="笔记类型" class="mb-5 grid gap-2 sm:grid-cols-5">
      <button
        v-for="tab in sections"
        :key="tab.id"
        type="button"
        class="rounded-lg border p-3 text-left"
        :class="section === tab.id ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-700'"
        @click="section = tab.id; formOpen = false"
      >
        <span class="block text-sm font-semibold">{{ tab.title }} <span class="text-xs opacity-70">({{ counts[tab.id] }})</span></span>
        <span class="mt-1 block text-xs text-gray-500 dark:text-gray-400">{{ tab.description }}</span>
      </button>
    </nav>

    <div class="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(190px,240px)]">
      <input
        v-model="search"
        type="search"
        aria-label="统一搜索写作笔记"
        placeholder="搜索表达、观点、解释、例句和错误"
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
      <select v-model="selectedTag" aria-label="统一标签筛选" class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
        <option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.label }}</option>
      </select>
    </div>
    <div class="mb-5 flex flex-wrap items-center justify-between gap-2">
      <span class="text-sm text-gray-500 dark:text-gray-400">搜索跨类型时请选择“全部笔记”；“复习”展示所有已收藏内容。</span>
      <div class="flex flex-wrap gap-2">
        <button v-if="section !== 'all'" type="button" class="rounded-lg border px-3 py-2 text-sm" @click="section = 'all'; formOpen = false">查看全部笔记</button>
        <button v-if="section === 'ideas' || section === 'all'" type="button" class="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white" @click="addNote('idea')">+ 添加观点</button>
        <button v-if="section === 'errors' || section === 'all'" type="button" class="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white" @click="addNote('error')">+ 记录错误</button>
      </div>
    </div>

    <p v-if="message" role="status" class="mb-5 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">{{ message }}</p>

    <form v-if="formOpen" class="mb-6 grid gap-3 rounded-xl border border-blue-200 bg-blue-50/30 p-5 dark:border-blue-900 dark:bg-gray-800 sm:grid-cols-2" @submit.prevent="saveNote">
      <div class="flex items-center justify-between sm:col-span-2">
        <h3 class="text-lg font-semibold">{{ editingId ? '编辑' : '添加' }}{{ form.kind === 'idea' ? '观点' : '错误' }}笔记</h3>
        <button type="button" class="text-sm underline" @click="formOpen = false">取消</button>
      </div>
      <label v-if="form.kind === 'error'" class="flex flex-col gap-1 text-sm">
        作文类型
        <select v-model="form.task" class="rounded border p-2 text-gray-900">
          <option value="task1">Task 1 小作文</option>
          <option value="task2">Task 2 大作文</option>
        </select>
      </label>
      <label v-if="form.kind === 'error'" class="flex flex-col gap-1 text-sm">
        错误类型
        <select v-model="form.category" class="rounded border p-2 text-gray-900">
          <option v-for="category in errorCategories" :key="category.id" :value="category.id">{{ category.label }}</option>
        </select>
      </label>
      <label v-if="form.task === 'task2'" class="flex flex-col gap-1 text-sm">
        话题
        <select v-model="form.topic" class="rounded border p-2 text-gray-900">
          <option value="all">不限话题</option>
          <option v-for="topic in writingTopics" :key="topic.id" :value="topic.id">{{ topic.label }}</option>
        </select>
      </label>
      <label v-if="form.task === 'task2'" class="flex flex-col gap-1 text-sm">
        题型
        <select v-model="form.questionType" class="rounded border p-2 text-gray-900">
          <option value="all">不限题型</option>
          <option v-for="question in writingQuestionTypes" :key="question.id" :value="question.id">{{ question.label }}</option>
        </select>
      </label>
      <label v-if="form.task === 'task1'" class="flex flex-col gap-1 text-sm">
        图表题型
        <select v-model="form.chartType" class="rounded border p-2 text-gray-900">
          <option value="all">通用</option>
          <option v-for="chart in writingChartTypes" :key="chart.id" :value="chart.id">{{ chart.label }}</option>
        </select>
      </label>

      <template v-if="form.kind === 'idea'">
        <label class="flex flex-col gap-1 text-sm sm:col-span-2">观点标题 *<input v-model="form.title" required aria-label="观点标题" class="rounded border p-2 text-gray-900" placeholder="Practical skills in education"></label>
        <label class="flex flex-col gap-1 text-sm sm:col-span-2">对应题目（选填）<textarea v-model="form.question" rows="2" class="rounded border p-2 text-gray-900" /></label>
        <label class="flex flex-col gap-1 text-sm sm:col-span-2">观点 Idea *<textarea v-model="form.point" required rows="2" aria-label="观点内容" class="rounded border p-2 text-gray-900" /></label>
        <label class="flex flex-col gap-1 text-sm sm:col-span-2">解释 Reasoning<textarea v-model="form.reasoning" rows="2" class="rounded border p-2 text-gray-900" /></label>
        <label class="flex flex-col gap-1 text-sm sm:col-span-2">例子 Example<textarea v-model="form.example" rows="2" class="rounded border p-2 text-gray-900" /></label>
        <label class="flex flex-col gap-1 text-sm sm:col-span-2">相关表达（可用分号分隔）<textarea v-model="form.expressions" rows="2" class="rounded border p-2 text-gray-900" /></label>
      </template>
      <template v-else>
        <label class="flex flex-col gap-1 text-sm sm:col-span-2">原句 *<textarea v-model="form.original" required rows="2" aria-label="错误原句" class="rounded border p-2 text-gray-900" /></label>
        <label class="flex flex-col gap-1 text-sm sm:col-span-2">正确表达 *<textarea v-model="form.corrected" required rows="2" aria-label="错误修改" class="rounded border p-2 text-gray-900" /></label>
        <label class="flex flex-col gap-1 text-sm sm:col-span-2">规则 / 为什么<textarea v-model="form.rule" rows="2" class="rounded border p-2 text-gray-900" /></label>
      </template>
      <div class="flex gap-2 sm:col-span-2">
        <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">保存笔记</button>
        <button type="button" class="rounded-lg border px-4 py-2 text-sm" @click="formOpen = false">取消</button>
      </div>
    </form>

    <WritingPhraseBook
      v-if="section === 'phrases'"
      :external-search="search"
      :external-tag="selectedTag"
      embedded
      @change="phraseState = $event"
    />
    <template v-else>
      <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">当前显示 {{ displayItems.length }} 条笔记</p>
      <p v-if="!displayItems.length" class="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500 dark:border-gray-700">
        {{ section === 'review' ? '尚无匹配的收藏。请先在表达库、观点库或错误库点击收藏。' : '暂无匹配的笔记，可以调整搜索或新增笔记。' }}
      </p>
      <div v-else class="grid gap-4 lg:grid-cols-2">
        <article v-for="item in displayItems" :key="itemKey(item)" class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {{ item.kind === 'phrase' ? '表达库' : item.note.kind === 'idea' ? '观点库' : '错误库' }}
              <span v-if="item.kind === 'note' && item.note.id.includes('-sample-')"> · 示例</span>
            </span>
            <button type="button" class="text-sm" :aria-label="isFavorite(item) ? '取消收藏' : '收藏笔记'" @click="toggleFavorite(item)">
              {{ isFavorite(item) ? '★ 已收藏' : '☆ 收藏' }}
            </button>
          </div>
          <template v-if="item.kind === 'phrase'">
            <p class="mb-2 text-lg font-semibold leading-relaxed">{{ item.phrase.text }}</p>
            <p class="mb-2 text-sm text-gray-600 dark:text-gray-300">{{ item.phrase.meaning }}</p>
            <p v-if="item.phrase.example" class="mb-2 text-sm italic text-gray-500">{{ item.phrase.example }}</p>
          </template>
          <template v-else-if="item.note.kind === 'idea'">
            <h3 class="mb-2 text-lg font-semibold">{{ item.note.title }}</h3>
            <p v-if="item.note.question" class="mb-2 text-sm text-gray-500">题目：{{ item.note.question }}</p>
            <p class="mb-2 text-sm"><strong>观点：</strong>{{ item.note.point }}</p>
            <p v-if="item.note.reasoning" class="mb-2 text-sm"><strong>解释：</strong>{{ item.note.reasoning }}</p>
            <p v-if="item.note.example" class="mb-2 text-sm"><strong>例子：</strong>{{ item.note.example }}</p>
            <p v-if="item.note.expressions" class="mb-2 text-sm text-gray-500"><strong>表达：</strong>{{ item.note.expressions }}</p>
          </template>
          <template v-else>
            <p class="mb-2 text-sm text-red-600 dark:text-red-400"><strong>原句：</strong>{{ item.note.original }}</p>
            <p class="mb-2 text-sm text-green-700 dark:text-green-400"><strong>修改：</strong>{{ item.note.corrected }}</p>
            <p v-if="item.note.rule" class="mb-2 text-sm"><strong>规则：</strong>{{ item.note.rule }}</p>
          </template>
          <div class="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
            <span v-for="tag in (item.kind === 'phrase' ? phraseTags(item.phrase) : noteTags(item.note))" :key="tag" class="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">
              {{ tags.find(option => option.id === tag)?.label || tag }}
            </span>
          </div>
          <div v-if="section === 'review'" class="mt-3 text-xs text-gray-500">
            已复习 {{ reviews[itemKey(item)]?.count || 0 }} 次
            <span v-if="reviews[itemKey(item)]?.lastReviewed"> · 最近：{{ reviews[itemKey(item)].lastReviewed.slice(0, 10) }}</span>
          </div>
          <div class="mt-4 flex flex-wrap gap-4 border-t border-gray-100 pt-3 text-sm dark:border-gray-700">
            <button type="button" class="text-blue-600" @click="copyText(item.kind === 'phrase' ? item.phrase.text : item.note.kind === 'idea' ? item.note.point : item.note.corrected)">复制</button>
            <button v-if="item.kind === 'note'" type="button" class="text-blue-600" @click="editNote(item.note)">编辑</button>
            <button v-if="item.kind === 'note'" type="button" class="text-red-600" @click="deleteNote(item.note)">删除</button>
            <button v-if="section === 'review'" type="button" class="font-semibold text-blue-600" @click="finishReview(item)">完成本次复习</button>
          </div>
        </article>
      </div>
    </template>

    <div class="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
      <p class="text-sm text-gray-500 dark:text-gray-400">表达、观点、错误和复习记录均保存在当前浏览器，不会自动跨设备同步。</p>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="rounded border px-3 py-2 text-sm" @click="exportAll">备份全部笔记 JSON</button>
        <button type="button" class="rounded border px-3 py-2 text-sm" @click="backupInput?.click()">导入并合并备份</button>
        <input ref="backupInput" type="file" accept=".json,application/json" class="hidden" @change="importAll">
      </div>
    </div>
  </section>
</template>
