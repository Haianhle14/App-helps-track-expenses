const { pick } = require('lodash')

// Simple method to Convert a String to Slug
const slugify = (val) => {
  if (!val) return ''
  return String(val)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const pickUser = (user) => {
  if (!user) return {}
  return pick(user, [
    '_id',
    'email',
    'username',
    'displayName',
    'avatar',
    'bio',
    'role',
    'isActive',
    'require_2fa',
    'createdAt',
    'updatedAt',
    'sessions'
  ])
}

module.exports = {
  slugify,
  pickUser
}
