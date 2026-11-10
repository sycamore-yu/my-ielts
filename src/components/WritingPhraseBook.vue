<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { WRITING_PHRASES_KEY, loadWritingPhrases, mergeWritingBackup, parseWritingBackup, writingCategories } from '../lib/writingPhrases'
import type { WritingPhrase, WritingPhraseState, WritingTask } from '../lib/writingPhrases'

const state = ref<WritingPhraseState>(loadWritingPhrases())
const selectedTask = ref<WritingTask>('task1')
const selectedCategory = ref('all')
const search = ref('')
const favoritesOnly = ref(false)
const message = ref('')
const showForm = ref(false)
const editingId = ref('')
const phraseInput = ref<HTMLInputElement | null>(null)
const backupInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  task: 'task1' as WritingTask,
  category: 't1-intro',
  text: '',
  meaning: '',
  example: '',
  note: '',
})

const categories = computed(() => writingCategories.filter(item => item.task === selectedTask.value))
const formCategories = computed(() => writingCategories.filter(item => item.task === form.task))
const currentPhrases = computed(() => state.value.phrases.filter(item => item.task === selectedTask.value))
const favoriteIds = computed(() => new Set(state.value.favorites))
const visiblePhrases = computed(() => {
  const term = search.value.trim().toLocaleLowerCase()
  return currentPhrases.value.filter((item) => {
    if (selectedCategory.value !== 'all' && item.category !== selectedCategory.value)
      return false
    if (favoritesOnly.value && !favoriteIds.value.has(item.id))
      return false
    return !term || [item.text, item.meaning, item.example, item.note]
      .some(value => value.toLocaleLowerCase().includes(term))
  })
})

watch(selectedTask, () => {
  selectedCategory.value = 'all'
  favoritesOnly.value = false
  search.value = ''
  showForm.value = false
})

watch(() => form.task, () => {
  if (!formCategories.value.some(item => item.id === form.category))
    form.category = formCategories.value[0].id
})

function saveState(updated: WritingPhraseState) {
  state.value = updated
  localStorage.setItem(WRITING_PHRASES_KEY, JSON.stringify(updated))
}

function resetForm(task: WritingTask = selectedTask.value) {
  editingId.value = ''
  form.task = task
  form.category = writingCategories.find(item => item.task === task)!.id
  form.text = ''
  form.meaning = ''
  form.example = ''
  form.note = ''
}

function addPhrase() {
  resetForm()
  showForm.value = true
  message.value = ''
  nextTick(() => phraseInput.value?.focus())
}

function editPhrase(item: WritingPhrase) {
  editingId.value = item.id
  form.task = item.task
  form.category = item.category
  form.text = item.text
  form.meaning = item.meaning
  form.example = item.example
  form.note = item.note
  showForm.value = true
  message.value = ''
  nextTick(() => phraseInput.value?.focus())
}

function savePhrase() {
  const text = form.text.trim().replace(/\s+/g, ' ')
  if (!text) {
    message.value = '请填写英文表达'
    return
  }
  const exists = state.value.phrases.some(item => item.id !== editingId.value
    && item.task === form.task
    && item.category === form.category
    && item.text.trim().replace(/\s+/g, ' ').toLocaleLowerCase() === text.toLocaleLowerCase())
  if (exists) {
    message.value = '此分类已有相同表达，请直接编辑原词条'
    return
  }

  const phrase: WritingPhrase = {
    id: editingId.value || `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    task: form.task,
    category: form.category,
    text,
    meaning: form.meaning.trim(),
    example: form.example.trim(),
    note: form.note.trim(),
  }
  const updated = editingId.value
    ? state.value.phrases.map(item => item.id === editingId.value ? phrase : item)
    : [phrase, ...state.value.phrases]
  saveState({ ...state.value, phrases: updated })
  selectedTask.value = phrase.task
  selectedCategory.value = phrase.category
  search.value = ''
  favoritesOnly.value = false
  showForm.value = false
  message.value = '已保存到浏览器，下次打开仍可查看'
  resetForm()
}

function removePhrase(item: WritingPhrase) {
  if (!window.confirm(`删除表达“${item.text}”？`))
    return
  saveState({
    phrases: state.value.phrases.filter(phrase => phrase.id !== item.id),
    favorites: state.value.favorites.filter(id => id !== item.id),
  })
  if (editingId.value === item.id)
    showForm.value = false
  message.value = '已删除'
}

function toggleFavorite(id: string) {
  const updated = favoriteIds.value.has(id)
    ? state.value.favorites.filter(item => item !== id)
    : [...state.value.favorites, id]
  saveState({ ...state.value, favorites: updated })
}

async function copyPhrase(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    message.value = '英文表达已复制'
  }
  catch {
    message.value = '复制失败，请手动选中英文表达'
  }
}

function exportBackup() {
  const blob = new Blob([JSON.stringify(state.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'my-ielts-writing-phrases.json'
  link.click()
  URL.revokeObjectURL(url)
}

async function importBackup(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file)
    return
  try {
    const imported = parseWritingBackup(await file.text())
    const before = state.value.phrases.length
    saveState(mergeWritingBackup(state.value, imported))
    message.value = `导入完成，新增 ${state.value.phrases.length - before} 条短语；同 ID 的词条已更新`
  }
  catch (error) {
    message.value = error instanceof Error ? `导入失败：${error.message}` : '导入失败'
  }
  input.value = ''
}
</script>

<template>
  <section class="text-gray-900 dark:text-gray-100">
    <div class="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold">写作短语库</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          按作文结构和表达功能整理，添加的内容保存在当前浏览器。
        </p>
      </div>
      <button type="button" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700" @click="addPhrase">
        + 添加短语
      </button>
    </div>

    <div class="mb-5 flex flex-wrap gap-2 border-b border-gray-200 pb-4 dark:border-gray-700">
      <button
        v-for="task in [{ id: 'task1', label: 'Task 1 · 小作文' }, { id: 'task2', label: 'Task 2 · 大作文' }]"
        :key="task.id"
        type="button"
        class="rounded-lg border px-4 py-2 text-sm font-semibold"
        :class="selectedTask === task.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'"
        @click="selectedTask = task.id as WritingTask"
      >
        {{ task.label }}
      </button>
      <span class="self-center text-sm text-gray-500 dark:text-gray-400">
        {{ currentPhrases.length }} 条表达
      </span>
    </div>

    <div class="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]">
      <input
        v-model="search"
        aria-label="搜索写作短语"
        type="search"
        placeholder="搜索英文、中文、例句或备注"
        class="min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
      <button
        type="button"
        class="rounded-lg border px-4 py-2 text-sm"
        :class="favoritesOnly ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-gray-800 dark:text-amber-300' : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'"
        @click="favoritesOnly = !favoritesOnly"
      >
        {{ favoritesOnly ? '★ 仅看收藏' : '☆ 仅看收藏' }}
      </button>
    </div>

    <div class="mb-6 flex flex-wrap gap-2">
      <button
        type="button"
        class="rounded-full border px-3 py-1.5 text-sm"
        :class="selectedCategory === 'all' ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-white' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300'"
        @click="selectedCategory = 'all'"
      >
        全部分类
      </button>
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        :title="category.description"
        class="rounded-full border px-3 py-1.5 text-sm"
        :class="selectedCategory === category.id ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-white' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300'"
        @click="selectedCategory = category.id"
      >
        {{ category.label }}
        <span class="ml-1 text-xs opacity-70">{{ currentPhrases.filter(item => item.category === category.id).length }}</span>
      </button>
    </div>

    <div v-if="message" role="status" class="mb-5 rounded-lg border border-gray-200 px-4 py-3 text-sm dark:border-gray-700">
      {{ message }}
    </div>

    <section v-if="showForm" class="mb-6 rounded-xl border border-blue-200 bg-blue-50/30 p-5 dark:border-blue-900 dark:bg-gray-800">
      <div class="mb-4 flex items-center justify-between gap-3">
        <h3 class="text-lg font-bold">{{ editingId ? '编辑短语' : '添加短语' }}</h3>
        <button type="button" class="text-sm text-gray-500 underline" @click="showForm = false">关闭</button>
      </div>
      <form class="grid gap-3 sm:grid-cols-2" @submit.prevent="savePhrase">
        <label class="flex flex-col gap-1 text-sm">
          作文类型
          <select v-model="form.task" class="rounded-lg border border-gray-300 bg-white p-2 text-gray-900">
            <option value="task1">Task 1 · 小作文</option>
            <option value="task2">Task 2 · 大作文</option>
          </select>
        </label>
        <label class="flex flex-col gap-1 text-sm">
          分类
          <select v-model="form.category" class="rounded-lg border border-gray-300 bg-white p-2 text-gray-900">
            <option v-for="category in formCategories" :key="category.id" :value="category.id">{{ category.label }}</option>
          </select>
        </label>
        <label class="flex flex-col gap-1 text-sm sm:col-span-2">
          英文表达 *
          <input ref="phraseInput" v-model="form.text" required class="rounded-lg border border-gray-300 bg-white p-2 text-gray-900" placeholder="accounted for the largest proportion of ...">
        </label>
        <label class="flex flex-col gap-1 text-sm sm:col-span-2">
          中文释义
          <input v-model="form.meaning" class="rounded-lg border border-gray-300 bg-white p-2 text-gray-900" placeholder="占……的最大比例">
        </label>
        <label class="flex flex-col gap-1 text-sm sm:col-span-2">
          例句
          <textarea v-model="form.example" rows="2" class="rounded-lg border border-gray-300 bg-white p-2 text-gray-900" placeholder="Services accounted for the largest proportion of the workforce." />
        </label>
        <label class="flex flex-col gap-1 text-sm sm:col-span-2">
          用法备注（选填）
          <input v-model="form.note" class="rounded-lg border border-gray-300 bg-white p-2 text-gray-900" placeholder="注意时态、介词或适用图表">
        </label>
        <div class="flex flex-wrap gap-3 sm:col-span-2">
          <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">保存短语</button>
          <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm" @click="showForm = false">取消</button>
        </div>
      </form>
    </section>

    <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
      当前显示 {{ visiblePhrases.length }} 条。点击“收藏”可建立自己的高频表达清单。
    </p>
    <div v-if="!visiblePhrases.length" class="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500 dark:border-gray-700">
      没有匹配的短语。可以调整筛选条件，或添加自己的表达。
    </div>
    <div v-else class="grid gap-4 lg:grid-cols-2">
      <article
        v-for="phrase in visiblePhrases"
        :key="phrase.id"
        class="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="mb-3 flex items-center justify-between gap-2">
          <span class="text-xs font-semibold text-blue-700 dark:text-blue-300">
            {{ writingCategories.find(item => item.id === phrase.category)?.label }}
          </span>
          <button
            type="button"
            class="text-sm"
            :class="favoriteIds.has(phrase.id) ? 'text-amber-600 dark:text-amber-300' : 'text-gray-500 dark:text-gray-400'"
            :aria-label="favoriteIds.has(phrase.id) ? '取消收藏' : '收藏短语'"
            @click="toggleFavorite(phrase.id)"
          >
            {{ favoriteIds.has(phrase.id) ? '★ 已收藏' : '☆ 收藏' }}
          </button>
        </div>
        <p class="mb-2 break-words text-lg font-semibold leading-relaxed">{{ phrase.text }}</p>
        <p class="mb-3 text-sm text-gray-600 dark:text-gray-300">{{ phrase.meaning }}</p>
        <p v-if="phrase.example" class="mb-2 border-l-2 border-gray-200 pl-3 text-sm italic leading-relaxed text-gray-500 dark:border-gray-600 dark:text-gray-400">
          {{ phrase.example }}
        </p>
        <p v-if="phrase.note" class="mb-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">用法：{{ phrase.note }}</p>
        <div class="mt-auto flex flex-wrap gap-4 border-t border-gray-100 pt-3 text-sm dark:border-gray-700">
          <button type="button" class="text-blue-600 dark:text-blue-400" @click="copyPhrase(phrase.text)">复制</button>
          <button type="button" class="text-blue-600 dark:text-blue-400" @click="editPhrase(phrase)">编辑</button>
          <button type="button" class="text-red-600 dark:text-red-400" @click="removePhrase(phrase)">删除</button>
        </div>
      </article>
    </div>

    <div class="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
      <p class="text-sm text-gray-500 dark:text-gray-400">记录仅保存在当前浏览器。换设备前请导出 JSON 备份。</p>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600" @click="exportBackup">导出 JSON 备份</button>
        <button type="button" class="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600" @click="backupInput?.click()">导入并合并备份</button>
        <input ref="backupInput" type="file" accept=".json,application/json" class="hidden" @change="importBackup">
      </div>
    </div>
  </section>
</template>
