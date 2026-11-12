<script setup lang="ts">
import { ref } from 'vue'
import WritingCopyPractice from '../../components/WritingCopyPractice.vue'
import WritingNotebook from '../../components/WritingNotebook.vue'
import sentences from './100sentences'

const activeView = ref<'phrases' | 'sentences' | 'copy'>('phrases')
</script>

<template>
  <div class="px-4 pt-6 2xl:px-0">
    <div
      class="mb-4 border border-gray-200 rounded-lg bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <nav class="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-4 dark:border-gray-700" aria-label="写作练习导航">
        <button
          type="button"
          class="rounded-lg border px-4 py-2 text-sm font-semibold"
          :class="activeView === 'phrases' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'"
          @click="activeView = 'phrases'"
        >
          写作笔记（表达 / 观点 / 错误）
        </button>
        <button
          type="button"
          class="rounded-lg border px-4 py-2 text-sm font-semibold"
          :class="activeView === 'sentences' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'"
          @click="activeView = 'sentences'"
        >
          100 句翻译练习
        </button>
        <button
          type="button"
          class="rounded-lg border px-4 py-2 text-sm font-semibold"
          :class="activeView === 'copy' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'"
          @click="activeView = 'copy'"
        >
          范文抄写
        </button>
      </nav>

      <WritingNotebook v-if="activeView === 'phrases'" />
      <WritingCopyPractice v-else-if="activeView === 'copy'" />

      <div v-else class="items-center justify-between lg:flex ">
        <div class="mb-4 lg:mb-0">
          <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            100 句翻译练习
          </h3>
          <span class="text-base font-normal text-gray-500 dark:text-gray-400">能够写出 error-free 的句子</span>
        </div>
      </div>
      <!-- Table -->
      <div v-if="activeView === 'sentences'" class="mt-6 flex flex-col">
        <div class="overflow-x-auto rounded-lg">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden shadow sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <tbody class="bg-white dark:bg-gray-800 border-b-1">
                  <template v-for="item of sentences" :key="item.no">
                    <template v-if="item.no == null">
                      <tr class="border-t-1 border-x-1">
                        <td colspan="5" class="p-4 font-bold text-xl">{{ item.title }}</td>
                      </tr>
                    </template>
                    <template v-else>
                      <tr class="border-t-1">
                        <td class="p-4 border-x-1" rowspan="2">
                          {{ item.no }}
                        </td>
                        <td class="p-4 border-r-1" rowspan="2">
                          {{ item.sentence }}
                        </td>
                        <td class="p-4 border-b-1 flex items-center">
                          <div class="mr-4" title="来自书上标准答案"><i class="i-carbon-book block"></i></div>
                          <div>{{ item.translationFromBook }}</div>
                        </td>
                        <td class="p-4 border-x-1 w-30% whitespace-pre-line" rowspan="2">
                          {{ item.remark }}
                        </td>
                      </tr>
                      <tr>
                        <td class="p-4 flex items-center">
                          <div class="mr-4" title="来自 ChatGPT"><i class="i-simple-icons-openai block"></i></div>
                          <div>{{ item.chatgpt }}</div>
                        </td>
                      </tr>
                    </template>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
