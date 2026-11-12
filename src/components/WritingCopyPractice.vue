<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { essaySentences, essayWordCount, writingCopyEssays } from '../lib/writingCopySamples'
import { writingChartTypes, writingQuestionTypes } from '../lib/writingPhrases'
import type { WritingTask } from '../lib/writingPhrases'

const STORAGE_KEY = 'my-ielts-writing-copy-progress-v1'
interface SavedProgress { index: number; input: string }

function loadProgress(): Record<string, SavedProgress> {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    if (!data || typeof data !== 'object' || Array.isArray(data))
      return {}
    const result: Record<string, SavedProgress> = {}
    for (const [id, value] of Object.entries(data)) {
      if (value && typeof value === 'object' && 'index' in value && 'input' in value
        && Number.isSafeInteger(value.index) && value.index >= 0 && typeof value.input === 'string')
        result[id] = { index: value.index, input: value.input }
    }
    return result
  }
  catch {
    return {}
  }
}

const task = ref<WritingTask>('task2')
const selectedEssayId = ref(writingCopyEssays[0].id)
const saved = ref(loadProgress())
const sentenceIndex = ref(0)
const typed = ref('')
const textInput = ref<HTMLTextAreaElement | null>(null)
const imageUnavailable = ref(false)

const essaysForTask = computed(() => writingCopyEssays.filter(item => item.task === task.value))
const essay = computed(() => writingCopyEssays.find(item => item.id === selectedEssayId.value) || writingCopyEssays[0])
const sentences = computed(() => essaySentences(essay.value))
const currentSentence = computed(() => sentences.value[sentenceIndex.value])
const finished = computed(() => sentenceIndex.value >= sentences.value.length)
const progressPercent = computed(() => sentences.value.length ? Math.round(sentenceIndex.value / sentences.value.length * 100) : 0)
const correctChars = computed(() => [...typed.value].filter((char, i) => char === currentSentence.value?.[0][i]).length)
const currentAccuracy = computed(() => typed.value.length ? Math.round(correctChars.value / typed.value.length * 100) : 100)
function categoryLabel(category: string) {
  return task.value === 'task2'
    ? writingQuestionTypes.find(item => item.id === category)?.label
    : writingChartTypes.find(item => item.id === category)?.label
}
const renderParagraphs = computed(() => {
  let index = 0
  return essay.value.paragraphs.map(paragraph => paragraph.map(([text]) => ({ text, index: index++ })))
})

let advanceTimer: number | null = null
function clearAdvanceTimer() {
  if (advanceTimer !== null) {
    clearTimeout(advanceTimer)
    advanceTimer = null
  }
}

function save() {
  saved.value[selectedEssayId.value] = { index: sentenceIndex.value, input: typed.value }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved.value))
}

function restore() {
  clearAdvanceTimer()
  const previous = saved.value[selectedEssayId.value]
  sentenceIndex.value = previous && previous.index <= sentences.value.length ? previous.index : 0
  typed.value = finished.value ? '' : previous?.input?.slice(0, 500) || ''
  nextTick(() => textInput.value?.focus())
}

function setTask(next: WritingTask) {
  if (task.value === next)
    return
  task.value = next
  selectedEssayId.value = essaysForTask.value[0].id
}

function advance() {
  clearAdvanceTimer()
  if (!currentSentence.value || typed.value !== currentSentence.value[0])
    return
  sentenceIndex.value++
  typed.value = ''
  save()
  nextTick(() => {
    document.querySelector<HTMLElement>('[data-copy-active]')?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' })
    textInput.value?.focus()
  })
}

function resetPractice() {
  clearAdvanceTimer()
  sentenceIndex.value = 0
  typed.value = ''
  save()
  nextTick(() => textInput.value?.focus())
}

watch(selectedEssayId, () => {
  imageUnavailable.value = false
  restore()
})
watch(typed, (value) => {
  save()
  if (!finished.value && value && value === currentSentence.value?.[0]) {
    if (advanceTimer === null)
      advanceTimer = window.setTimeout(advance, 350)
  }
  else {
    clearAdvanceTimer()
  }
})

onMounted(restore)
onUnmounted(clearAdvanceTimer)
</script>

<template>
  <section class="text-gray-900 dark:text-gray-100">
    <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold">
          范文抄写
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          使用剑桥雅思真题练习：左侧查看原题图示和原创范文，右侧逐句跟打，并学习同义替换与语法提示。
        </p>
      </div>
      <div class="flex flex-wrap gap-2" aria-label="选择作文任务">
        <button type="button" :aria-pressed="task === 'task2'" class="border rounded-lg px-4 py-2 text-sm font-medium" :class="task === 'task2' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'" @click="setTask('task2')">
          Task 2 大作文
        </button>
        <button type="button" :aria-pressed="task === 'task1'" class="border rounded-lg px-4 py-2 text-sm font-medium" :class="task === 'task1' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'" @click="setTask('task1')">
          Task 1 小作文
        </button>
      </div>
    </div>

    <div class="mb-5 flex flex-wrap items-center gap-3">
      <label for="copy-category" class="text-sm font-semibold">选择题型</label>
      <select id="copy-category" v-model="selectedEssayId" aria-label="选择范文题型" class="max-w-full min-w-44 border border-gray-300 rounded-lg bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700">
        <option v-for="item in essaysForTask" :key="item.id" :value="item.id">
          {{ categoryLabel(item.category) }} · {{ item.title }}
        </option>
      </select>
      <span class="text-sm text-gray-500 dark:text-gray-400">{{ essayWordCount(essay) }} 词 · {{ sentences.length }} 句</span>
    </div>

    <div class="mb-5 flex items-center gap-4">
      <div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700" role="progressbar" aria-label="抄写进度" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
        <div class="h-full rounded-full bg-blue-600 transition-all" :style="{ width: `${progressPercent}%` }" />
      </div>
      <span class="whitespace-nowrap text-sm font-medium">已完成 {{ sentenceIndex }} / {{ sentences.length }} 句</span>
      <button type="button" class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm dark:border-gray-600" @click="resetPractice">
        重新练习
      </button>
    </div>

    <div class="grid gap-5 lg:grid-cols-2">
      <div class="min-w-0 border border-gray-200 rounded-xl bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900 sm:p-5">
        <h3 class="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          题目截图
        </h3>
        <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Cambridge IELTS {{ essay.book }} · Test {{ essay.test }} · Writing {{ essay.task === 'task2' ? 'Task 2' : 'Task 1' }}
        </p>
        <a v-if="!imageUnavailable" :href="essay.questionImage" target="_blank" rel="noopener noreferrer" class="mb-2 block border border-gray-200 rounded-lg bg-white p-1 dark:border-gray-700" aria-label="打开题目大图">
          <img :src="essay.questionImage" :alt="essay.prompt" referrerpolicy="no-referrer" loading="lazy" class="h-auto w-full rounded" @error="imageUnavailable = true">
        </a>
        <p v-else class="mb-2 border border-amber-200 rounded-lg p-3 text-sm dark:border-amber-800" role="alert">
          外部题图暂时无法加载。请通过下方来源链接查看原题。
        </p>
        <p class="mb-4 text-xs text-gray-500 dark:text-gray-400">
          图片来源：<a :href="essay.questionSource" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline dark:text-blue-400">{{ essay.imageCredit }} · 查看原题来源</a>。第三方题图可能经过排版或裁剪；范文及提示为本站原创。
        </p>
        <h3 class="mb-3 border-t border-gray-200 pt-4 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200">
          范文全文（灰色为待输入）
        </h3>
        <div class="max-h-[600px] overflow-y-auto pr-2 text-base leading-8" aria-label="范文全文">
          <p v-for="(paragraph, p) in renderParagraphs" :key="p" class="mb-4 last:mb-0">
            <template v-for="(part, s) in paragraph" :key="part.index">
              <span v-if="part.index === sentenceIndex" data-copy-active class="rounded bg-blue-50/70 dark:bg-blue-900/20">
                <span v-for="(char, i) in part.text" :key="i" :class="typed[i] === char ? 'text-green-600 dark:text-green-400' : typed[i] ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'">{{ char }}</span>
              </span>
              <span v-else :class="part.index < sentenceIndex ? 'text-green-700 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'">{{ part.text }}</span><span v-if="s < paragraph.length - 1" />
            </template>
          </p>
        </div>
      </div>

      <div class="min-w-0 border border-gray-200 rounded-xl bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:p-5">
        <template v-if="!finished && currentSentence">
          <div class="mb-3 flex flex-wrap justify-between gap-2">
            <h3 class="font-semibold">
              跟打第 {{ sentenceIndex + 1 }} 句
            </h3>
            <span class="text-sm" :class="currentAccuracy < 90 ? 'text-red-600' : 'text-green-600'">当前准确率 {{ currentAccuracy }}%</span>
          </div>
          <label for="copy-sentence-input" class="mb-2 block text-sm text-gray-600 dark:text-gray-300">请对照左侧灰色句子输入。完全一致后自动进入下一句。</label>
          <textarea
            id="copy-sentence-input"
            ref="textInput"
            v-model="typed"
            aria-label="逐句抄写输入"
            rows="4"
            autocapitalize="off"
            autocorrect="off"
            autocomplete="off"
            spellcheck="false"
            class="w-full resize-y border border-gray-300 rounded-lg bg-white p-3 text-base leading-relaxed font-mono text-gray-900 outline-none dark:border-gray-600 focus:border-blue-500 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
            placeholder="从当前句子的第一个单词开始输入……"
            @keydown.enter.prevent
          />
          <div class="mt-2 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
            已输入 {{ typed.length }} / {{ currentSentence[0].length }} 个字符；红色字符表示位置不匹配。
          </div>
          <div class="mt-6 space-y-4" aria-live="polite">
            <div class="border border-blue-100 rounded-lg bg-blue-50 p-4 dark:border-blue-900 dark:bg-gray-900">
              <h4 class="mb-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                同义替换 · Paraphrase
              </h4>
              <p class="text-base leading-relaxed">
                {{ currentSentence[1] }}
              </p>
            </div>
            <div class="border border-amber-100 rounded-lg bg-amber-50 p-4 dark:border-amber-900 dark:bg-gray-900">
              <h4 class="mb-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
                语法与搭配 · Grammar
              </h4>
              <p class="text-sm leading-relaxed">
                {{ currentSentence[2] }}
              </p>
            </div>
          </div>
        </template>
        <div v-else class="min-h-64 flex flex-col items-center justify-center gap-4 text-center" role="status">
          <h3 class="text-xl font-bold text-green-700 dark:text-green-400">
            本篇范文抄写完成
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            已完成全部 {{ sentences.length }} 句。可以重练本篇或选择下一种题型。
          </p>
          <button type="button" class="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white" @click="resetPractice">
            再练一次
          </button>
        </div>
      </div>
    </div>
    <p class="mt-5 text-xs text-gray-500 dark:text-gray-400">
      每篇文章的完成句数和当前输入保存在本机浏览器中。切换题型不会清除其他文章的进度。
    </p>
  </section>
</template>
