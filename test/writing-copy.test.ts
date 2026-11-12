import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import WritingCopyPractice from '../src/components/WritingCopyPractice.vue'
import { essaySentences, essayWordCount, writingCopyEssays } from '../src/lib/writingCopySamples'
import { writingChartTypes, writingQuestionTypes } from '../src/lib/writingPhrases'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('writing copy practice', () => {
  it('includes one original model for every Task 1 and Task 2 category with sufficient length and annotations', () => {
    expect(writingCopyEssays.filter(essay => essay.task === 'task2').map(essay => essay.category).sort())
      .toEqual(writingQuestionTypes.map(category => category.id).sort())
    expect(writingCopyEssays.filter(essay => essay.task === 'task1').map(essay => essay.category).sort())
      .toEqual(writingChartTypes.map(category => category.id).sort())
    expect(new Set(writingCopyEssays.map(essay => essay.id)).size).toBe(writingCopyEssays.length)
    for (const essay of writingCopyEssays) {
      expect(essayWordCount(essay), `${essay.id} length`).toBeGreaterThanOrEqual(essay.task === 'task2' ? 250 : 150)
      expect(essay.paragraphs.length).toBeGreaterThanOrEqual(3)
      for (const sentence of essaySentences(essay)) {
        expect(sentence[0].length).toBeGreaterThan(20)
        expect(sentence[1].length).toBeGreaterThan(15)
        expect(sentence[2].length).toBeGreaterThan(10)
      }
    }
  })

  it('advances the current sentence and its hints only after an exact match', async () => {
    const wrapper = mount(WritingCopyPractice)
    const [first, second] = essaySentences(writingCopyEssays[0])
    expect(wrapper.text()).toContain(first[1])
    await wrapper.get('textarea[aria-label="逐句抄写输入"]').setValue('Incorrect sentence')
    await vi.advanceTimersByTimeAsync(400)
    expect(wrapper.text()).toContain('已完成 0 /')

    await wrapper.get('textarea[aria-label="逐句抄写输入"]').setValue(first[0])
    await vi.advanceTimersByTimeAsync(400)
    expect(wrapper.text()).toContain('已完成 1 /')
    expect(wrapper.text()).toContain(second[1])
    expect(wrapper.get('textarea').element.value).toBe('')
    wrapper.unmount()
  })

  it('keeps each essay progress independently when switching Task 1 and Task 2 or remounting', async () => {
    const wrapper = mount(WritingCopyPractice)
    const first = essaySentences(writingCopyEssays[0])[0][0]
    await wrapper.get('textarea').setValue(first)
    await vi.advanceTimersByTimeAsync(400)
    await wrapper.get('button[aria-pressed="false"]').trigger('click')
    expect(wrapper.text()).toContain('Task 1 小作文')
    expect(wrapper.text()).toContain('已完成 0 /')
    await wrapper.get('textarea').setValue('Partial work')
    wrapper.unmount()

    const reopened = mount(WritingCopyPractice)
    await reopened.get('button[aria-pressed="false"]').trigger('click')
    expect(reopened.get('textarea').element.value).toBe('Partial work')
    await reopened.get('button[aria-pressed="false"]').trigger('click')
    expect(reopened.text()).toContain('已完成 1 /')
    reopened.unmount()
  })
})
