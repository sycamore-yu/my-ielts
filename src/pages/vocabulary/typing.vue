<script setup lang="ts">
import { PERSONAL_CHAPTER, personalEntries } from '../../lib/personalVocabulary'
import vocabulary from './vocabulary'

const CHAPTER_KEY = 'vocabulary_typing_chapter'
const chapters = [...Object.keys(vocabulary), PERSONAL_CHAPTER]
const selectedChapter = ref(localStorage.getItem(CHAPTER_KEY) || chapters[0])

const currentWordIndex = ref(0)
const userInput = ref('')
const startTime = ref<number | null>(null)
const wpm = ref(0)
const accuracy = ref(100)
const isFinished = ref(false)

const words = computed(() => {
  if (selectedChapter.value === PERSONAL_CHAPTER)
    return personalEntries.value.map(entry => ({ word: [entry.word], meaning: entry.meaning, example: entry.example, pos: '' }))
  const chapter = (vocabulary as any)[selectedChapter.value]
  return chapter?.words.flat() || []
})

const currentWordData = computed(() => words.value[currentWordIndex.value])
const currentWord = computed(() => currentWordData.value?.word[0] || '')

watch(selectedChapter, (newVal) => {
  localStorage.setItem(CHAPTER_KEY, newVal)
  reset()
})

let advanceTimer: number | null = null
function reset() {
  if (advanceTimer !== null) {
    clearTimeout(advanceTimer)
    advanceTimer = null
  }
  currentWordIndex.value = 0
  userInput.value = ''
  startTime.value = null
  wpm.value = 0
  accuracy.value = 100
  isFinished.value = false
  playAudio()
}

let audio = null as HTMLAudioElement | null
function playAudio() {
  const category = selectedChapter.value
  const word = currentWord.value
  if (!word)
    return
  if (category === PERSONAL_CHAPTER) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-GB'
      window.speechSynthesis.speak(utterance)
    }
    return
  }
  const audioPath = `vocabulary/audio/${category}/${word}.mp3`
  if (audio) {
    audio.pause()
    audio.currentTime = 0
  }
  audio = document.createElement('audio')
  audio.src = audioPath
  audio.play().catch(() => {})
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
  if (input === currentWord.value && !advanceTimer) {
    advanceTimer = window.setTimeout(() => {
      advanceTimer = null
      nextWord()
    }, 200)
  }
}

function nextWord() {
  if (currentWordIndex.value < words.value.length - 1) {
    currentWordIndex.value++
    userInput.value = ''
    startTime.value = null
    playAudio()
  }
  else {
    isFinished.value = true
  }
}

onMounted(reset)
onUnmounted(() => {
  if (advanceTimer !== null)
    clearTimeout(advanceTimer)
  window.speechSynthesis?.cancel()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">单词打字练习</h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">照着背景单词输入，提升你的速度</p>
        </div>
        <select
          v-model="selectedChapter"
          class="block w-48 border border-gray-300 rounded-lg bg-white p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500"
        >
          <option
            v-for="c in chapters"
            :key="c"
            :value="c"
          >{{ c }}</option>
        </select>
      </div>

      <div v-if="selectedChapter === PERSONAL_CHAPTER" class="mb-5 text-sm text-blue-600">
        <router-link to="/vocabulary/my" class="underline">管理我的词库（{{ personalEntries.length }} 条）</router-link>
      </div>

      <div v-if="!words.length" class="mb-5 rounded border border-dashed p-6 text-center">
        当前词库为空。<router-link to="/vocabulary/my" class="text-blue-600 underline">添加或导入词汇</router-link>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">准确率</div>
          <div
            class="text-2xl font-bold"
            :class="accuracy < 90 ? 'text-red-500' : 'text-green-500'"
          >{{ accuracy }}%</div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">WPM (速度)</div>
          <div class="text-2xl font-bold text-blue-500">{{ wpm }}</div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">进度</div>
          <div class="text-2xl font-bold dark:text-white">{{ words.length ? currentWordIndex + 1 : 0 }} / {{ words.length }}</div>
        </div>
      </div>

      <!-- Typing Area -->
      <div
        class="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-80 flex flex-col items-center justify-center overflow-hidden"
      >
        <!-- Container for aligned layers -->
        <div class="font-mono text-2xl sm:text-4xl font-black text-center break-words whitespace-pre-wrap mb-8 leading-relaxed">
          <span v-for="(char, index) in currentWord" :key="index" :class="{
            'text-green-500': userInput.charAt(index) === char,
            'text-red-500': userInput.charAt(index) !== '' && userInput.charAt(index) !== char,
            'text-gray-300 dark:text-gray-600': userInput.charAt(index) === '',
          }">{{ char }}</span>
        </div>

        <!-- Invisible Input covering the whole area -->
        <input
          type="text"
          class="absolute inset-0 opacity-0 w-full h-full cursor-default caret-transparent"
          autofocus
          autocapitalize="off"
          autocorrect="off"
          autocomplete="off"
          spellcheck="false"
          v-model="userInput"
          @input="handleInput"
          :disabled="isFinished || !words.length"
        />

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
          <p class="text-gray-500 dark:text-gray-400 italic text-sm sm:text-base max-w-xl mx-auto">
            {{ currentWordData?.example }}
          </p>
        </div>

        <!-- Audio trigger hint -->
        <div class="absolute top-4 right-4">
          <button
            @click="playAudio"
            class="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <i class="i-ph-speaker-high-bold text-xl block"></i>
          </button>
        </div>
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
        提示：直接开始输入即可，输入正确后会自动进入下一个单词。
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
