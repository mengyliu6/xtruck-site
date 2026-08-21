import { authenticateAdmin, requireAdminHost, setAdminSessionCookie } from '../_lib/admin-auth.js'
import { readJsonBody, requirePost, sendJson } from '../_lib/http.js'

const INVALID_LOGIN = 'Invalid username or password.'

export default async function handler(req, res) {
  if (!requireAdminHost(req, res) || !requirePost(req, res)) return

  try {
    const body = readJsonBody(req)
    const username = typeof body.username === 'string' ? body.username.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    if (!authenticateAdmin(req, username, password)) {
      return sendJson(res, 401, { error: INVALID_LOGIN })
    }
    setAdminSessionCookie(res)
    return sendJson(res, 200, { authenticated: true })
  } catch (error) {
    console.error('Admin login failed.', error)
    return sendJson(res, 401, { error: INVALID_LOGIN })
  }
}
