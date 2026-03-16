import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import {{ name }} from '../components/{{ name }}.vue'

describe('{{ name }}.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount({{ name }}, {
      props: {
        /* 在這裡填寫 props */
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
