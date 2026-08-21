import { clearAdminSessionCookie, requireAdminSession } from '../_lib/admin-auth.js'
import { requirePost, sendJson } from '../_lib/http.js'

export default async function handler(req, res) {
  if (!requirePost(req, res) || !requireAdminSession(req, res)) return
  clearAdminSessionCookie(res)
  return sendJson(res, 200, { authenticated: false })
}
