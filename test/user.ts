import { expect, test } from '@rstest/core'
import sqlite from '@/driver/sqlite'
import VexORM from '@/index'

const db = new VexORM(sqlite.open('')).define('users', {
  id: 'int',
  name: 'str',
  email: 'str',
  createdAt: 'datetime',
})

test('should sayHi correctly', () => {
  expect(1).toBe(1)
})
