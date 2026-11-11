import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TYPING_FAMILIAR_KEY, isFamiliarWord, loadFamiliarWords } from '../src/lib/typingFamiliar'
import { LISTENING_CHAPTER, READING_CHAPTERS, checkSpelling, getStudyWords } from '../src/lib/typingSources'
import ListeningKeywords from '../src/pages/listening/keyword.vue'
import ReadingKeywords from '../src/pages/reading/index.vue'
import TypingPractice from '../src/pages/vocabulary/typing.vue'

const audioUrls: string[] = []
const speak = vi.fn()

function mountTyping() {
  return mount(TypingPractice, { global: { stubs: { 'router-link': true } } })
}

function button(wrapper: ReturnType<typeof mountTyping>, label: string) {
  const match = wrapper.findAll('button').find(item => item.text().includes(label))
  if (!match)
    throw new Error(`Missing button: ${label}`)
  return match
}

beforeEach(() => {
  localStorage.clear()
  audioUrls.length = 0
  speak.mockReset()
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
    audioUrls.push(this.src)
    return Promise.resolve()
  })
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  vi.stubGlobal('speechSynthesis', { speak, cancel: vi.fn() })
  vi.stubGlobal('SpeechSynthesisUtterance', class {
    lang = ''
    constructor(public text: string) {}
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('reading and listening spelling sources', () => {
  it('adapts the existing three reading groups and 179 listening words without changing their source data', () => {
    expect(READING_CHAPTERS).toHaveLength(3)
    expect(READING_CHAPTERS.map(chapter => getStudyWords(chapter)?.length)).toEqual([20, 100, 256])
    expect(READING_CHAPTERS.reduce((count, chapter) => count + getStudyWords(chapter)!.length, 0)).toBe(376)
    expect(getStudyWords(READING_CHAPTERS[0])?.[0]).toMatchObject({
      word: ['resemble'],
      meaning: '像，与……相似',
      pos: 'v.',
    })
    expect(getStudyWords(READING_CHAPTERS[0])?.[0].example).toContain('like')
    expect(getStudyWords(LISTENING_CHAPTER)).toHaveLength(179)
    expect(getStudyWords(LISTENING_CHAPTER)?.[0]).toMatchObject({
      word: ['reserve'],
      meaning: '预订',
      example: '同义替换：book',
    })
    expect(getStudyWords(LISTENING_CHAPTER)?.[1].word[0]).toBe('in advance')
    expect(getStudyWords('01_自然地理')).toBeNull()
  })

  it('checks spelling independent of case and surrounding spaces, while respecting hyphens and letters', () => {
    expect(checkSpelling('  IN   ADVANCE  ', 'in advance')).toBe(true)
    expect(checkSpelling('ReSeMbLe', 'resemble')).toBe(true)
    expect(checkSpelling('inadvance', 'in advance')).toBe(false)
    expect(checkSpelling('re-serve', 'reserve')).toBe(false)
    expect(checkSpelling('resreve', 'reserve')).toBe(false)
  })

  it('hides the listening word until checking, then shows a correction and moves on with local MP3', async () => {
    localStorage.setItem('vocabulary_typing_chapter', LISTENING_CHAPTER)
    localStorage.setItem('vocabulary_typing_mode', 'dictation')
    const wrapper = mountTyping()
    expect((wrapper.get('select[aria-label="选择单词词库"]').element as HTMLSelectElement).value).toBe(LISTENING_CHAPTER)
    expect(wrapper.text()).toContain('预订')
    expect(wrapper.text()).not.toContain('reserve')
    expect(wrapper.text()).not.toContain('同义替换：book')
    expect(audioUrls.at(-1)).toContain('/179_audios/reserve.mp3')

    const input = wrapper.get('input[aria-label="默写英文单词"]')
    await input.setValue('resreve')
    expect(wrapper.text()).not.toContain('reserve')
    await button(wrapper, '检查拼写').trigger('click')
    expect(wrapper.text()).toContain('拼写错误，正确答案：reserve')
    expect(wrapper.text()).toContain('同义替换：book')
    expect(wrapper.text()).toContain('0 / 1')
    expect(input.attributes('disabled')).toBeDefined()

    await button(wrapper, '下一词').trigger('click')
    expect(wrapper.text()).not.toContain('拼写错误')
    expect(wrapper.text()).toContain('提前')
    expect(audioUrls.at(-1)).toContain('/179_audios/in%20advance.mp3')
    await input.setValue('IN   ADVANCE')
    await input.trigger('keydown', { key: 'Enter', ctrlKey: true })
    expect(wrapper.text()).toContain('拼写正确')
    expect(wrapper.text()).toContain('1 / 2')
    wrapper.unmount()
  })

  it('uses speech synthesis for reading, checks spelling and preserves independent familiar progress', async () => {
    localStorage.setItem('vocabulary_typing_chapter', READING_CHAPTERS[0])
    localStorage.setItem('vocabulary_typing_mode', 'dictation')
    const wrapper = mountTyping()
    expect(wrapper.text()).toContain('像，与……相似')
    expect(wrapper.text()).not.toContain('resemble')
    expect(speak).toHaveBeenCalledOnce()
    expect(speak.mock.calls[0][0].text).toBe('resemble')
    expect(speak.mock.calls[0][0].lang).toBe('en-GB')
    const input = wrapper.get('input[aria-label="默写英文单词"]')
    await input.setValue('RESEMBLE')
    await button(wrapper, '检查拼写').trigger('click')
    expect(wrapper.text()).toContain('拼写正确')
    expect(wrapper.text()).toContain('同义替换：like')

    await button(wrapper, '下一词').trigger('click')
    expect(speak.mock.calls.at(-1)[0].text).toBe('recognize')
    await input.trigger('keydown', { key: 'Enter' })
    expect(isFamiliarWord(loadFamiliarWords(), READING_CHAPTERS[0], 'recognize')).toBe(true)
    expect(isFamiliarWord(loadFamiliarWords(), LISTENING_CHAPTER, 'recognize')).toBe(false)
    expect(localStorage.getItem(TYPING_FAMILIAR_KEY)).toContain(READING_CHAPTERS[0])
    wrapper.unmount()

    const reopened = mountTyping()
    expect(reopened.text()).toContain('已熟悉 1 个')
    await reopened.get('select[aria-label="选择单词词库"]').setValue(LISTENING_CHAPTER)
    expect(reopened.text()).toContain('已熟悉 0 个')
    expect(audioUrls.at(-1)).toContain('/179_audios/reserve.mp3')
    reopened.unmount()
  })

  it('keeps the old typing mode and resets spelling feedback when switching modes or chapters', async () => {
    const wrapper = mountTyping()
    expect(wrapper.get('.font-mono').text().length).toBeGreaterThan(0)
    expect(wrapper.get('button[aria-pressed="true"]').text()).toContain('跟打')
    await wrapper.get('select[aria-label="选择单词词库"]').setValue(LISTENING_CHAPTER)
    await button(wrapper, '默写').trigger('click')
    const input = wrapper.get('input[aria-label="默写英文单词"]')
    await input.setValue('wrong')
    await button(wrapper, '检查拼写').trigger('click')
    expect(wrapper.text()).toContain('拼写错误')
    await wrapper.get('select[aria-label="选择单词词库"]').setValue(READING_CHAPTERS[1])
    expect(wrapper.text()).not.toContain('拼写错误')
    expect(wrapper.text()).toContain('本轮正确 / 已检查')
    expect(wrapper.text()).toContain('0 / 0')
    await button(wrapper, '跟打').trigger('click')
    expect(localStorage.getItem('vocabulary_typing_mode')).toBe('typing')
    expect(wrapper.get('.font-mono').text()).toBe(getStudyWords(READING_CHAPTERS[1])?.[0].word[0])
    wrapper.unmount()
  })

  it('opens spelling practice directly from the reading and listening word lists', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div />' } }, { path: '/vocabulary/typing', component: { template: '<div />' } }],
    })
    await router.push('/')
    await router.isReady()
    const options = { global: { plugins: [router] } }
    const reading = mount(ReadingKeywords, options)
    const readingLinks = reading.findAll('a[href="/vocabulary/typing"]').filter(link => link.text().includes('拼写练习'))
    expect(readingLinks).toHaveLength(3)
    await readingLinks[1].trigger('click')
    expect(localStorage.getItem('vocabulary_typing_chapter')).toBe(READING_CHAPTERS[1])
    expect(localStorage.getItem('vocabulary_typing_mode')).toBe('dictation')
    reading.unmount()

    const listening = mount(ListeningKeywords, options)
    const listeningLink = listening.findAll('a[href="/vocabulary/typing"]').find(link => link.text().includes('拼写练习'))
    expect(listeningLink).toBeDefined()
    await listeningLink!.trigger('click')
    expect(localStorage.getItem('vocabulary_typing_chapter')).toBe(LISTENING_CHAPTER)
    listening.unmount()

    const practice = mountTyping()
    expect(practice.get('select[aria-label="选择单词词库"]').attributes('aria-label')).toBe('选择单词词库')
    expect(practice.text()).toContain('预订')
    expect(practice.text()).not.toContain('reserve')
    practice.unmount()
  })
})
