import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

import { getRequestHeader, sendJson } from './http.js'

const COOKIE_NAME = 'xtruck_admin_session'
const SESSION_SECONDS = 8 * 60 * 60
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_ATTEMPTS = 5
const loginAttempts = new Map()

function getAdminConfig() {
  const username = process.env.ADMIN_USERNAME?.trim() || ''
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim() || ''
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim() || ''

  if (!username || !passwordHash || sessionSecret.length < 32) {
    throw new Error('CONFIG: Admin authentication is not configured.')
  }
  return { passwordHash, sessionSecret, username }
}

function safeCompareText(left, right) {
  const leftHash = createHash('sha256').update(String(left)).digest()
  const rightHash = createHash('sha256').update(String(right)).digest()
  return timingSafeEqual(leftHash, rightHash)
}

function parseCookies(req) {
  const cookieHeader = getRequestHeader(req, 'cookie') || ''
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((part) => part.trim().split('='))
      .filter(([name, value]) => name && value)
      .map(([name, ...value]) => [name, decodeURIComponent(value.join('='))]),
  )
}

function signPayload(payload, secret) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

function getRequestHost(req) {
  return String(getRequestHeader(req, 'x-forwarded-host') || getRequestHeader(req, 'host') || '')
    .split(',')[0]
    .trim()
    .split(':')[0]
    .toLowerCase()
}

export function requireAdminHost(req, res) {
  if (process.env.VERCEL_ENV !== 'production' || getRequestHost(req) === 'admin.xtruckohw808.com') {
    return true
  }
  sendJson(res, 404, { error: 'Not found.' })
  return false
}

export function hashAdminPassword(password) {
  if (typeof password !== 'string' || password.length < 12) {
    throw new Error('Password must contain at least 12 characters.')
  }
  const salt = randomBytes(16)
  const cost = 16384
  const blockSize = 8
  const parallelization = 1
  const hash = scryptSync(password, salt, 64, {
    N: cost,
    maxmem: 64 * 1024 * 1024,
    p: parallelization,
    r: blockSize,
  })
  return `scrypt$${cost}$${blockSize}$${parallelization}$${salt.toString('base64url')}$${hash.toString('base64url')}`
}

function verifyAdminPassword(password, storedHash) {
  const [algorithm, costValue, blockSizeValue, parallelizationValue, saltValue, hashValue] =
    storedHash.split('$')
  if (algorithm !== 'scrypt' || !saltValue || !hashValue) return false

  try {
    const expected = Buffer.from(hashValue, 'base64url')
    const actual = scryptSync(password, Buffer.from(saltValue, 'base64url'), expected.length, {
      N: Number(costValue),
      maxmem: 64 * 1024 * 1024,
      p: Number(parallelizationValue),
      r: Number(blockSizeValue),
    })
    return expected.length === actual.length && timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}

function getClientAddress(req) {
  return String(getRequestHeader(req, 'x-forwarded-for') || req.socket?.remoteAddress || 'unknown')
    .split(',')[0]
    .trim()
}

function getRateLimitRecord(req) {
  const key = getClientAddress(req)
  const now = Date.now()
  const current = loginAttempts.get(key)
  if (!current || current.resetAt <= now) {
    const record = { attempts: 0, resetAt: now + RATE_LIMIT_WINDOW_MS }
    loginAttempts.set(key, record)
    return { key, record }
  }
  return { key, record: current }
}

export function authenticateAdmin(req, username, password) {
  const { key, record } = getRateLimitRecord(req)
  if (record.attempts >= RATE_LIMIT_ATTEMPTS) return false

  const config = getAdminConfig()
  const usernameValid = safeCompareText(username, config.username)
  const passwordValid = verifyAdminPassword(password, config.passwordHash)
  const valid = usernameValid && passwordValid

  if (valid) {
    loginAttempts.delete(key)
    return true
  }

  record.attempts += 1
  loginAttempts.set(key, record)
  return false
}

export function setAdminSessionCookie(res) {
  const { sessionSecret, username } = getAdminConfig()
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS, username }),
  ).toString('base64url')
  const token = `${payload}.${signPayload(payload, sessionSecret)}`
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`,
  )
}

export function clearAdminSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
  )
}

export function getAdminSession(req) {
  try {
    const { sessionSecret, username } = getAdminConfig()
    const token = parseCookies(req)[COOKIE_NAME] || ''
    const [payload, signature] = token.split('.')
    if (
      !payload ||
      !signature ||
      !safeCompareText(signature, signPayload(payload, sessionSecret))
    ) {
      return null
    }

    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (
      session.exp <= Math.floor(Date.now() / 1000) ||
      !safeCompareText(session.username, username)
    ) {
      return null
    }
    return session
  } catch {
    return null
  }
}

export function requireAdminSession(req, res) {
  if (!requireAdminHost(req, res)) return null
  const session = getAdminSession(req)
  if (!session) sendJson(res, 401, { error: 'Authentication required.' })
  return session
}
