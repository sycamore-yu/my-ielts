<script setup lang="ts">
import { PERSONAL_CHAPTER, personalEntries } from '../../lib/personalVocabulary'
import { TYPING_FAMILIAR_KEY, addFamiliarWord, clearFamiliarChapter, isFamiliarWord, loadFamiliarWords } from '../../lib/typingFamiliar'
import { LISTENING_CHAPTER, STUDY_CHAPTERS, checkSpelling, getStudyWords } from '../../lib/typingSources'
import type { FamiliarWords } from '../../lib/typingFamiliar'
import type { TypingWord } from '../../lib/typingSources'
import vocabulary from './vocabulary'

const CHAPTER_KEY = 'vocabulary_typing_chapter'
const MODE_KEY = 'vocabulary_typing_mode'
const chapters = [...Object.keys(vocabulary), ...STUDY_CHAPTERS, PERSONAL_CHAPTER]
const savedChapter = localStorage.getItem(CHAPTER_KEY)
const selectedChapter = ref(savedChapter && chapters.includes(savedChapter) ? savedChapter : chapters[0])
const mode = ref<'typing' | 'dictation'>(localStorage.getItem(MODE_KEY) === 'dictation' ? 'dictation' : 'typing')

const currentWordIndex = ref(0)
const userInput = ref('')
const spellingResult = ref<'correct' | 'incorrect' | null>(null)
const checkedCount = ref(0)
const correctCount = ref(0)
const startTime = ref<number | null>(null)
const wpm = ref(0)
const accuracy = ref(100)
const isFinished = ref(false)
const typingInput = ref<HTMLInputElement | null>(null)
const familiarWords = ref<FamiliarWords>(loadFamiliarWords())

const chapterWords = computed<TypingWord[]>(() => {
  if (selectedChapter.value === PERSONAL_CHAPTER)
    return personalEntries.value.map(entry => ({ word: [entry.word], meaning: entry.meaning, example: entry.example, pos: '' }))
  const studyWords = getStudyWords(selectedChapter.value)
  if (studyWords)
    return studyWords
  const chapter = (vocabulary as Record<string, { words: TypingWord[][] }>)[selectedChapter.value]
  return chapter?.words.flat() || []
})

const words = computed(() => chapterWords.value.filter(
  entry => !isFamiliarWord(familiarWords.value, selectedChapter.value, entry.word[0]),
))
const familiarCount = computed(() => chapterWords.value.length - words.value.length)
const currentWordData = computed(() => words.value[currentWordIndex.value])
const currentWord = computed(() => currentWordData.value?.word[0] || '')

watch(selectedChapter, (newVal) => {
  localStorage.setItem(CHAPTER_KEY, newVal)
  reset()
})
watch(mode, (newVal) => {
  localStorage.setItem(MODE_KEY, newVal)
  reset()
})

let advanceTimer: number | null = null
function clearAdvanceTimer() {
  if (advanceTimer !== null) {
    clearTimeout(advanceTimer)
    advanceTimer = null
  }
}

function reset() {
  clearAdvanceTimer()
  currentWordIndex.value = 0
  userInput.value = ''
  spellingResult.value = null
  checkedCount.value = 0
  correctCount.value = 0
  startTime.value = null
  wpm.value = 0
  accuracy.value = 100
  isFinished.value = false
  playAudio()
}

function saveFamiliarWords(updated: FamiliarWords) {
  familiarWords.value = updated
  localStorage.setItem(TYPING_FAMILIAR_KEY, JSON.stringify(updated))
}

function markCurrentFamiliar() {
  if (!currentWord.value || isFinished.value)
    return
  clearAdvanceTimer()
  const updated = addFamiliarWord(familiarWords.value, selectedChapter.value, currentWord.value)
  const removedBefore = words.value.slice(0, currentWordIndex.value).filter(
    entry => isFamiliarWord(updated, selectedChapter.value, entry.word[0]),
  ).length
  saveFamiliarWords(updated)
  // Filtering can also remove an earlier duplicate of the current word.
  currentWordIndex.value -= removedBefore
  userInput.value = ''
  spellingResult.value = null
  startTime.value = null
  if (currentWordIndex.value >= words.value.length)
    isFinished.value = true
  else
    playAudio()
  nextTick(() => typingInput.value?.focus())
}

function restoreChapter() {
  saveFamiliarWords(clearFamiliarChapter(familiarWords.value, selectedChapter.value))
  reset()
  nextTick(() => typingInput.value?.focus())
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.isComposing) {
    event.preventDefault()
    if (mode.value === 'dictation' && event.ctrlKey)
      checkCurrentSpelling()
    else
      markCurrentFamiliar()
  }
}

let audio = null as HTMLAudioElement | null
function stopAudio() {
  if (audio) {
    audio.pause()
    audio.currentTime = 0
    audio = null
  }
  window.speechSynthesis?.cancel()
}

function playAudio() {
  const category = selectedChapter.value
  const word = currentWord.value
  stopAudio()
  if (!word)
    return
  if (category === PERSONAL_CHAPTER || (STUDY_CHAPTERS.includes(category) && category !== LISTENING_CHAPTER)) {
    if ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-GB'
      window.speechSynthesis.speak(utterance)
    }
    return
  }
  const audioPath = category === LISTENING_CHAPTER
    ? `179_audios/${encodeURIComponent(word)}.mp3`
    : `vocabulary/audio/${category}/${word}.mp3`
  audio = document.createElement('audio')
  audio.src = audioPath
  audio.play().catch(() => {})
}

function checkCurrentSpelling() {
  if (mode.value !== 'dictation' || spellingResult.value || !userInput.value.trim() || isFinished.value)
    return
  const correct = checkSpelling(userInput.value, currentWord.value)
  spellingResult.value = correct ? 'correct' : 'incorrect'
  checkedCount.value++
  if (correct)
    correctCount.value++
}

// Normalize whitespace: replace non-breaking spaces and other unicode spaces with regular space
function normalizeInput(s: string) {
  return s.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, ' ')
}

function handleInput(e: Event) {
  if (!startTime.value)
    startTime.value = Date.now()

  const rawInput = (e.target as HTMLInputElement).value
  const input = normalizeInput(rawInput)
  userInput.value = input
  // Sync normalized value back to DOM input
  if (rawInput !== input)
    (e.target as HTMLInputElement).value = input

  // Calculate Accuracy
  let correctChars = 0
  for (let i = 0; i < input.length; i++) {
    if (input[i] === currentWord.value[i])
      correctChars++
  }
  accuracy.value = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100

  // Calculate WPM (Words Per Minute)
  // Standard: 1 word = 5 characters
  const timeElapsed = (Date.now() - startTime.value) / 1000 / 60 // in minutes
  if (timeElapsed > 0)
    wpm.value = Math.round((input.length / 5) / timeElapsed)

  // Check if finished
  if (mode.value === 'typing' && input === currentWord.value && !advanceTimer) {
    advanceTimer = window.setTimeout(() => {
      advanceTimer = null
      nextWord()
    }, 200)
  }
}

function nextWord() {
  clearAdvanceTimer()
  spellingResult.value = null
  if (currentWordIndex.value < words.value.length - 1) {
    currentWordIndex.value++
    userInput.value = ''
    startTime.value = null
    playAudio()
    nextTick(() => typingInput.value?.focus())
  }
  else {
    isFinished.value = true
  }
}

onMounted(reset)
onUnmounted(() => {
  clearAdvanceTimer()
  stopAudio()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">单词打字练习</h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">跟打练速度，默写练拼写；阅读和听力考点词均可使用</p>
        </div>
        <select
          v-model="selectedChapter"
          aria-label="选择单词词库"
          class="block w-56 border border-gray-300 rounded-lg bg-white p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500"
        >
          <option
            v-for="c in chapters"
            :key="c"
            :value="c"
          >{{ c }}</option>
        </select>
      </div>

      <div class="mb-6 flex flex-wrap items-center gap-3">
        <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">练习模式：</span>
        <button
          type="button"
          :aria-pressed="mode === 'typing'"
          class="rounded-lg border px-4 py-2 text-sm font-medium"
          :class="mode === 'typing' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'"
          @click="mode = 'typing'"
        >
          跟打
        </button>
        <button
          type="button"
          :aria-pressed="mode === 'dictation'"
          class="rounded-lg border px-4 py-2 text-sm font-medium"
          :class="mode === 'dictation' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'"
          @click="mode = 'dictation'"
        >
          默写
        </button>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ mode === 'dictation' ? '隐藏英文，根据词义或发音拼写；答案检查后显示' : '显示英文，正确输入后自动进入下一词' }}
        </span>
      </div>

      <div v-if="selectedChapter === PERSONAL_CHAPTER" class="mb-5 text-sm text-blue-600">
        <router-link to="/vocabulary/my" class="underline">管理我的词库（{{ personalEntries.length }} 条）</router-link>
      </div>

      <div v-if="!chapterWords.length" class="mb-5 rounded border border-dashed p-6 text-center">
        当前词库为空。<router-link to="/vocabulary/my" class="text-blue-600 underline">添加或导入词汇</router-link>
      </div>
      <div v-else-if="!words.length" class="mb-5 rounded border border-dashed p-6 text-center">
        本章单词均已标记熟悉。可以使用下方的“恢复本章”重新练习。
      </div>
      <div v-if="chapterWords.length" class="mb-5 flex items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
        <span>已熟悉 {{ familiarCount }} 个，剩余 {{ words.length }} 个</span>
        <button v-if="familiarCount" class="text-blue-600 dark:text-blue-400 underline" @click="restoreChapter">
          恢复本章
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">准确率</div>
          <div
            class="text-2xl font-bold"
            :class="mode === 'typing' && accuracy < 90 || mode === 'dictation' && checkedCount && correctCount < checkedCount ? 'text-red-500' : 'text-green-500'"
          >{{ mode === 'typing' ? `${accuracy}%` : checkedCount ? `${Math.round(correctCount / checkedCount * 100)}%` : '—' }}</div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">{{ mode === 'typing' ? 'WPM (速度)' : '本轮正确 / 已检查' }}</div>
          <div class="text-2xl font-bold text-blue-500">{{ mode === 'typing' ? wpm : `${correctCount} / ${checkedCount}` }}</div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">进度</div>
          <div class="text-2xl font-bold dark:text-white">{{ words.length ? (isFinished ? words.length : currentWordIndex + 1) : 0 }} / {{ words.length }}</div>
        </div>
      </div>

      <!-- Typing Area -->
      <div
        class="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-80 flex flex-col items-center justify-center overflow-hidden"
      >
        <!-- Container for aligned layers -->
        <div v-if="mode === 'typing'" class="font-mono text-2xl sm:text-4xl font-black text-center break-words whitespace-pre-wrap mb-8 leading-relaxed">
          <span v-for="(char, index) in currentWord" :key="index" :class="{
            'text-green-500': userInput.charAt(index) === char,
            'text-red-500': userInput.charAt(index) !== '' && userInput.charAt(index) !== char,
            'text-gray-300 dark:text-gray-600': userInput.charAt(index) === '',
          }">{{ char }}</span>
        </div>

        <!-- Invisible Input covering the whole area -->
        <input
          v-if="mode === 'typing'"
          ref="typingInput"
          type="text"
          class="absolute inset-0 opacity-0 w-full h-full cursor-default caret-transparent"
          autofocus
          autocapitalize="off"
          autocorrect="off"
          autocomplete="off"
          spellcheck="false"
          v-model="userInput"
          @input="handleInput"
          @keydown="handleKeydown"
          :disabled="isFinished || !words.length"
        />
        <div v-else class="w-full max-w-md text-center mb-6">
          <div class="mb-3 text-sm text-gray-400 dark:text-gray-500">英文已隐藏</div>
          <input
            ref="typingInput"
            v-model="userInput"
            type="text"
            aria-label="默写英文单词"
            class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center font-mono text-xl font-semibold text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="根据词义或发音输入英文"
            autofocus
            autocapitalize="off"
            autocorrect="off"
            autocomplete="off"
            spellcheck="false"
            :disabled="isFinished || !words.length || spellingResult !== null"
            @input="handleInput"
            @keydown="handleKeydown"
          >
          <div v-if="spellingResult" role="status" class="mt-3 rounded-lg p-3 text-sm font-medium" :class="spellingResult === 'correct' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'">
            {{ spellingResult === 'correct' ? '拼写正确' : `拼写错误，正确答案：${currentWord}` }}
          </div>
        </div>

        <!-- Meaning & Example (Hint) -->
        <div class="w-full text-center border-t border-gray-100 dark:border-gray-700 pt-6">
          <div class="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
            <span
              style="font-style: italic; font-family: times;"
              class="text-sm font-normal text-gray-400 mr-2 tracking-wide">
              {{ currentWordData?.pos }}
            </span>
            {{ currentWordData?.meaning }}
          </div>
          <p v-if="mode === 'typing' || spellingResult !== null" class="text-gray-500 dark:text-gray-400 italic text-sm sm:text-base max-w-xl mx-auto">
            {{ currentWordData?.example }}
          </p>
        </div>

        <!-- Audio trigger hint -->
        <div class="absolute top-4 right-4">
          <button
            type="button"
            title="重播发音"
            aria-label="重播发音"
            @click="playAudio"
            class="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <i class="i-ph-speaker-high-bold text-xl block"></i>
          </button>
        </div>
      </div>

      <div v-if="mode === 'dictation' && words.length && !isFinished" class="mt-4 flex flex-wrap justify-center gap-3">
        <button
          v-if="spellingResult === null"
          type="button"
          class="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-40"
          :disabled="!userInput.trim()"
          @click="checkCurrentSpelling"
        >
          检查拼写（Ctrl + Enter）
        </button>
        <button
          v-else
          type="button"
          class="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white"
          @click="nextWord"
        >
          下一词
        </button>
      </div>

      <div class="mt-4 text-center">
        <button
          class="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-40"
          :disabled="isFinished || !words.length"
          @click="markCurrentFamiliar"
        >
          标记熟悉并跳过（Enter）
        </button>
      </div>

      <!-- Finish Overlay -->
      <div
        v-if="isFinished"
        class="mt-8 bg-blue-600 text-white p-6 rounded-2xl text-center shadow-xl animate-bounce"
      >
        <h2 class="text-2xl font-bold mb-2">太棒了！恭喜完成本章练习 🎉</h2>
        <button
          @click="reset"
          class="mt-4 bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition-colors"
        >
          再练一次
        </button>
      </div>

      <!-- Instructions -->
      <div class="mt-8 text-center text-gray-400 text-sm">
        {{ mode === 'typing'
          ? '提示：直接开始输入，正确后自动进入下一词；按 Enter 将当前词标记熟悉。'
          : '提示：根据中文释义或发音默写，按 Ctrl + Enter 检查；按 Enter 标记熟悉。检查时忽略大小写，但不忽略拼写与连字符。' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure the input always has focus or can be focused easily */
.relative:focus-within {
  @apply ring-4 ring-blue-500/20 border-blue-500;
}
</style>
