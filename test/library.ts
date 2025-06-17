import { expect, test } from '@rstest/core'
import sqlite from '@/driver/sqlite'
import VexORM from '@/index'

const db = new VexORM(sqlite.open(''))
  .registerModel('books', {
    id: 'int',
    title: 'str',
    author: 'str',
    isbn: 'str',
    totalCopies: 'int',
    availableCopies: 'int',
    createdAt: 'datetime',
  })
  .registerModel('members', {
    id: 'int',
    name: 'str',
    email: 'str',
    membershipNumber: 'str',
    phoneNumber: 'str',
    createdAt: 'datetime',
    status: { type: 'str', index: true, default: '!23' },
    borrowRecords: { reference: 'model.borrowRecords[]' },
  })
  .registerModel('borrowRecords', {
    id: { type: 'int', primaryKey: true },
    book: { reference: 'model.books' },
    member: { reference: 'model.members' },
    borrowDate: 'datetime',
    dueDate: 'datetime',
    returnDate: 'datetime',
    status: { type: 'str', default: '' as 'active' | 'inactive' },
    status2: { type: 'str', default: 1 },
    createdAt: 'datetime',
  })

test('library system model definition', () => {
  expect(db.get('boo1ks')).toBeDefined()
  expect(db['~modelTypes'].books).toBeDefined()
  expect(db['~modelTypes'].members).toBeDefined()
  expect(db['~modelTypes'].borrowRecords).toBeDefined()
})
