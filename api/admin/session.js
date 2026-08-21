import { getAdminSession, requireAdminHost } from '../_lib/admin-auth.js'
import { requireGet, sendJson } from '../_lib/http.js'

export default async function handler(req, res) {
  if (!requireAdminHost(req, res) || !requireGet(req, res)) return
  const session = getAdminSession(req)
  return sendJson(res, session ? 200 : 401, { authenticated: Boolean(session) })
}
