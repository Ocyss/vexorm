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
    status: { type: 'str', index: true, default: 'active' as const },
  })
  .registerModel('borrowRecords', {
    id: { type: 'int', primaryKey: true },
    bookId: { type: 'int', foreignKey: 'books.id', index: true },
    book: 'model.books',
    memberId: { type: 'int', foreignKey: 'members.id', index: true },
    member: 'model.members',
    borrowDate: 'datetime',
    dueDate: 'datetime',
    returnDate: 'datetime',
    status: 'str',
    createdAt: 'datetime',
  })

test('library system model definition', () => {
  expect(db.get('boo1ks')).toBeDefined()
  expect(db['~modelTypes'].books).toBeDefined()
  expect(db['~modelTypes'].members).toBeDefined()
  expect(db['~modelTypes'].borrowRecords).toBeDefined()
})
