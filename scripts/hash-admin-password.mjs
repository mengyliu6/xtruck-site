import { hashAdminPassword } from '../api/_lib/admin-auth.js'

const password = process.argv[2] || ''

if (!password) {
  console.error('Usage: npm run admin:hash-password -- "your-strong-password"')
  process.exitCode = 1
} else {
  try {
    console.log(hashAdminPassword(password))
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Unable to hash the password.')
    process.exitCode = 1
  }
}
