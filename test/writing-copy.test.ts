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
      expect(essay.id).toBe(`cam${essay.book}-test${essay.test}-${essay.task}`)
      expect(essay.questionImage).toMatch(/^https:\/\//)
      expect(essay.questionSource).toMatch(/^https:\/\//)
      expect(essay.imageCredit.length).toBeGreaterThan(5)
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

  it('keeps the active sentence by the input and the full essay in the right panel', async () => {
    const wrapper = mount(WritingCopyPractice)
    const [first, second] = essaySentences(writingCopyEssays[0])
    const input = wrapper.get('textarea[aria-label="逐句抄写输入"]')
    const preview = wrapper.get('[aria-label="当前句子"]')
    const essay = wrapper.get('aside[aria-label="范文全文"]')

    expect(preview.text()).toContain(first[0])
    expect(essay.text()).toContain(first[0])
    expect(essay.text()).toContain(`${first[0]} ${second[0]}`)
    expect(essay.element.compareDocumentPosition(input.element) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy()
    expect(wrapper.get('details').attributes()).toHaveProperty('open')

    await input.setValue(first[0])
    await vi.advanceTimersByTimeAsync(400)
    expect(preview.text()).toContain(second[0])
    expect(essay.get('[data-copy-active]').text()).toBe(second[0])
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

  it('displays the genuine task image instead of a simulated text prompt and links to the source', async () => {
    const wrapper = mount(WritingCopyPractice)
    const original = writingCopyEssays[0]
    expect(wrapper.text()).toContain(`Cambridge IELTS ${original.book}`)
    expect(wrapper.get('img').attributes('src')).toBe(original.questionImage)
    expect(wrapper.get('img').attributes('alt')).toBe(original.prompt)
    expect(wrapper.find('a[href="https://zim.vn/cam-16-test-3-writing-task-2"]').exists()).toBe(true)

    await wrapper.get('button[aria-pressed="false"]').trigger('click')
    const chart = writingCopyEssays.find(essay => essay.task === 'task1')!
    expect(wrapper.get('img').attributes('src')).toBe(chart.questionImage)
    expect(wrapper.text()).toContain(`Cambridge IELTS ${chart.book}`)
    expect(wrapper.text()).not.toContain('模拟图表数据')
    wrapper.unmount()
  })

  it('exposes the original question link if an external image cannot be displayed', async () => {
    const wrapper = mount(WritingCopyPractice)
    await wrapper.get('img').trigger('error')
    expect(wrapper.text()).toContain('外部题图暂时无法加载')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.get(`a[href="${writingCopyEssays[0].questionSource}"]`).exists()).toBe(true)

    await wrapper.get('select[aria-label="选择范文题型"]').setValue(writingCopyEssays[1].id)
    expect(wrapper.get('img').attributes('src')).toBe(writingCopyEssays[1].questionImage)
    wrapper.unmount()
  })
})
