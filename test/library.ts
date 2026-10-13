import sqlite from '@/driver/sqlite'
import VexORM from '@/index'

const db = new VexORM(sqlite.open(''))
  .define('user', {
    id: 'uuid',
    name: 'text',
    email: { type: 'text', unique: true },
    status: { type: 'text', enum: ['active', 'inactive'], default: 'active', index: true },
    createdAt: { type: 'datetime', default: new Date() },
    posts: { reference: 'post[]' },
  })
  .define('post', {
    id: 'int',
    createdAt: 'datetime',
    updatedAt: 'timestamp',
    title: 'text',
    content: { type: 'text', notNull: true },
    published: { type: 'bool', default: false },
    author: { reference: 'user', foreignKey: 'authorId' },
    tags: { type: 'json', default: [] },
    comments: { reference: 'comment[]' },
  })
  .define('comment', {
    id: 'int',
    content: 'text',
    author: { reference: 'user' },
    post: { reference: 'post', onDelete: 'CASCADE' },
    likes: { type: 'int', default: 0 },
  })

export default [
  db.get('user'),
  db['~modelsType'].user,
  db['~modelsType'].post,
  db['~modelsType'].comment.author?.posts?.[0]?.comments?.[0]?.content,
  db['~modelsType'].comment,
]
