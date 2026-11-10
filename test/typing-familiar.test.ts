import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TYPING_FAMILIAR_KEY, addFamiliarWord, clearFamiliarChapter, isFamiliarWord, loadFamiliarWords } from '../src/lib/typingFamiliar'
import TypingPractice from '../src/pages/vocabulary/typing.vue'

vi.mock('../src/pages/vocabulary/vocabulary', () => ({
  default: {
    '01_自然地理': {
      words: [[
        { word: ['warm'], meaning: '温暖', pos: 'adj.', example: '' },
        { word: ['rain'], meaning: '雨', pos: 'n.', example: '' },
        { word: ['warm'], meaning: '温暖', pos: 'adj.', example: '' },
        { word: ['wind'], meaning: '风', pos: 'n.', example: '' },
      ]],
    },
    '02_植物': { words: [[{ word: ['warm'], meaning: '温暖', pos: 'adj.', example: '' }]] },
  },
}))

function mountTyping() {
  return mount(TypingPractice, { global: { stubs: { 'router-link': true } } })
}

function shownWord(wrapper: ReturnType<typeof mountTyping>) {
  return wrapper.get('.font-mono').text()
}

beforeEach(() => {
  localStorage.clear()
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('typing familiar words', () => {
  it('stores words by chapter, normalizes spelling, and supports restoration', () => {
    const marked = addFamiliarWord({}, '01_自然地理', ' Warm ')
    expect(addFamiliarWord(marked, '01_自然地理', 'warm')).toEqual(marked)
    expect(isFamiliarWord(marked, '01_自然地理', 'WARM')).toBe(true)
    expect(isFamiliarWord(marked, '02_植物', 'warm')).toBe(false)

    localStorage.setItem(TYPING_FAMILIAR_KEY, JSON.stringify(marked))
    const loaded = loadFamiliarWords()
    expect(isFamiliarWord(loaded, '01_自然地理', 'warm')).toBe(true)
    expect(isFamiliarWord(clearFamiliarChapter(loaded, '01_自然地理'), '01_自然地理', 'warm')).toBe(false)
  })

  it('recovers from malformed saved data', () => {
    localStorage.setItem(TYPING_FAMILIAR_KEY, '{bad JSON')
    expect(loadFamiliarWords()).toEqual({})
  })

  it('marks a word using Enter and excludes it after reopening the chapter', async () => {
    const first = mountTyping()
    expect(shownWord(first)).toBe('warm')

    await first.get('input[type="text"]').trigger('keydown', { key: 'Enter' })
    expect(shownWord(first)).toBe('rain')
    expect(first.text()).toContain('已熟悉 2 个，剩余 2 个')
    first.unmount()

    const reopened = mountTyping()
    expect(shownWord(reopened)).toBe('rain')
    await reopened.get('select').setValue('02_植物')
    expect(shownWord(reopened)).toBe('warm')
    await reopened.get('select').setValue('01_自然地理')
    expect(shownWord(reopened)).toBe('rain')
    await reopened.get('button[class*="underline"]').trigger('click')
    expect(shownWord(reopened)).toBe('warm')
    reopened.unmount()
  })

  it('does not skip the next word when marking a later duplicate', async () => {
    vi.useFakeTimers()
    const wrapper = mountTyping()
    const input = wrapper.get('input[type="text"]')
    await input.setValue('warm')
    await vi.advanceTimersByTimeAsync(201)
    await nextTick()
    expect(shownWord(wrapper)).toBe('rain')
    await input.setValue('rain')
    await vi.advanceTimersByTimeAsync(201)
    await nextTick()
    expect(shownWord(wrapper)).toBe('warm')

    await input.trigger('keydown', { key: 'Enter' })
    expect(shownWord(wrapper)).toBe('wind')
    expect(wrapper.text()).toContain('已熟悉 2 个，剩余 2 个')
    wrapper.unmount()
  })

  it('cancels a pending auto-advance when marking the same word', async () => {
    vi.useFakeTimers()
    const wrapper = mountTyping()
    const input = wrapper.get('input[type="text"]')
    await input.setValue('warm')
    await input.trigger('keydown', { key: 'Enter' })
    await vi.advanceTimersByTimeAsync(250)
    await nextTick()
    expect(shownWord(wrapper)).toBe('rain')
    wrapper.unmount()
  })
})
