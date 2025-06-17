import { defineConfig } from '@rstest/core'

export default defineConfig({
  testEnvironment: 'node',
  include: ['**\/*.{test,spec}.?(c|m)[jt]s?(x)', 'test/*.?(c|m)[jt]s?(x)'],
})
