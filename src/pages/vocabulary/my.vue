<script setup lang="ts">
import { addPersonalEntries, mergeEntries, parsePersonalImport, personalEntries, savePersonalEntries } from '../../lib/personalVocabulary'
import type { PersonalEntry } from '../../lib/personalVocabulary'

const word = ref('')
const meaning = ref('')
const example = ref('')
const note = ref('')
const batch = ref('')
const message = ref('')
const editing = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const saladictTemplate = '%text%\t%trans%\t%context%\t%note%'
function copyTemplate() {
  return navigator.clipboard.writeText(saladictTemplate)
}

function clearForm() {
  word.value = ''
  meaning.value = ''
  example.value = ''
  note.value = ''
  editing.value = ''
}

function saveWord() {
  if (!word.value.trim()) {
    message.value = '请先填写英文单词或短语'
    return
  }
  const entry = { word: word.value, meaning: meaning.value, example: example.value, note: note.value }
  const remaining = editing.value
    ? personalEntries.value.filter(item => item.word.toLocaleLowerCase() !== editing.value.toLocaleLowerCase())
    : personalEntries.value
  savePersonalEntries(mergeEntries(remaining, [entry]))
  clearForm()
  message.value = '已保存，可在打字练习中选择“我的单词”'
}

function edit(item: PersonalEntry) {
  word.value = item.word
  meaning.value = item.meaning
  example.value = item.example
  note.value = item.note
  editing.value = item.word
  document.getElementById('personal-word')?.focus()
}

function remove(item: PersonalEntry) {
  if (!window.confirm(`删除「${item.word}」？`))
    return
  savePersonalEntries(personalEntries.value.filter(entry => entry.word !== item.word))
  message.value = '已删除'
}

function importText(text: string, filename = '') {
  try {
    const entries = parsePersonalImport(text, filename)
    if (!entries.length) {
      message.value = '没有发现有效词条，请检查导出格式'
      return
    }
    const before = personalEntries.value.length
    const after = addPersonalEntries(entries)
    message.value = `已读取 ${entries.length} 条，新增 ${after - before} 条；相同词条已更新或忽略`
    batch.value = ''
  }
  catch (error) {
    message.value = error instanceof Error ? `导入失败：${error.message}` : '导入失败'
  }
}

async function importFile(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file)
    return
  importText(await file.text(), file.name)
  target.value = ''
}

function exportEntries() {
  const blob = new Blob([JSON.stringify(personalEntries.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'my-ielts-words.json'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8 text-gray-900 dark:text-gray-100">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-3xl font-bold">我的单词</h1>
        <p class="mt-2 text-gray-500">单词和短语共 {{ personalEntries.length }} 条，保存在当前浏览器。</p>
      </div>
      <router-link to="/vocabulary/typing" class="rounded bg-blue-600 px-4 py-2 text-white">开始打字练习 →</router-link>
    </div>

    <div v-if="message" role="status" class="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-800 dark:bg-gray-800 dark:text-blue-200">{{ message }}</div>

    <section class="mb-6 rounded-lg border border-gray-200 p-5 dark:border-gray-700">
      <h2 class="mb-3 text-xl font-semibold">{{ editing ? '编辑词条' : '添加单词或短语' }}</h2>
      <form class="grid gap-3 sm:grid-cols-2" @submit.prevent="saveWord">
        <label class="flex flex-col gap-1">英文单词 / 短语 *
          <input id="personal-word" v-model="word" required class="rounded border p-2 text-gray-900" placeholder="by contrast">
        </label>
        <label class="flex flex-col gap-1">中文释义
          <input v-model="meaning" class="rounded border p-2 text-gray-900" placeholder="相比之下">
        </label>
        <label class="flex flex-col gap-1">例句 / 上下文
          <input v-model="example" class="rounded border p-2 text-gray-900" placeholder="By contrast, ...">
        </label>
        <label class="flex flex-col gap-1">备注
          <input v-model="note" class="rounded border p-2 text-gray-900" placeholder="写作 Task 1">
        </label>
        <div class="flex gap-2 sm:col-span-2">
          <button type="submit" class="rounded bg-blue-600 px-4 py-2 text-white">保存词条</button>
          <button v-if="editing" type="button" class="rounded border px-4 py-2" @click="clearForm">取消编辑</button>
        </div>
      </form>
    </section>

    <section class="mb-6 rounded-lg border border-gray-200 p-5 dark:border-gray-700">
      <h2 class="mb-2 text-xl font-semibold">从沙拉查词导入</h2>
      <p class="mb-2 text-sm leading-6 text-gray-500">在沙拉查词的生词本中选择“导出文本”，使用自定义模板 <code>%text%\t%trans%\t%context%\t%note%</code>（字段间用真正的 Tab 键分隔），换行替换为空格。也支持官方 Anki 模板的反引号分隔，以及 CSV / TSV / JSON / 一行一个短语。</p>
      <div class="mb-3"><button type="button" class="text-sm text-blue-600 underline" @click="copyTemplate">复制沙拉查词导出模板（Tab 分隔）</button></div>
      <textarea v-model="batch" rows="4" class="w-full rounded border p-2 text-gray-900" placeholder="by contrast\t相比之下\namount of electricity produced\t发电量" />
      <div class="mt-3 flex flex-wrap gap-2">
        <button type="button" class="rounded bg-blue-600 px-4 py-2 text-white" @click="importText(batch)">导入粘贴内容</button>
        <button type="button" class="rounded border px-4 py-2" @click="fileInput?.click()">选择导出文件</button>
        <input ref="fileInput" type="file" accept=".txt,.csv,.tsv,.json,text/plain,application/json" class="hidden" @change="importFile">
        <button type="button" class="rounded border px-4 py-2" @click="exportEntries">备份我的词库 (JSON)</button>
      </div>
      <p class="mt-3 text-sm text-gray-500">截图中的词汇可以交给 ChatGPT 转成一行一条的文本后粘贴进来。导入会去重，不会删除现有收藏。</p>
    </section>

    <section class="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
      <h2 class="mb-3 text-xl font-semibold">已收藏的词条</h2>
      <p v-if="!personalEntries.length" class="text-gray-500">词库为空。添加词条后即可练习。</p>
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="entry in personalEntries" :key="entry.word" class="flex flex-wrap items-start justify-between gap-2 py-3">
          <div class="min-w-0 flex-1">
            <p class="font-semibold break-words">{{ entry.word }}</p>
            <p v-if="entry.meaning" class="text-sm text-gray-600 dark:text-gray-300">{{ entry.meaning }}</p>
            <p v-if="entry.example" class="text-sm italic text-gray-500">{{ entry.example }}</p>
          </div>
          <div class="flex gap-2 text-sm">
            <button class="text-blue-600" @click="edit(entry)">编辑</button>
            <button class="text-red-600" @click="remove(entry)">删除</button>
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>
