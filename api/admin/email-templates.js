import { requireAdminSession } from '../_lib/admin-auth.js'
import { DEFAULT_EMAIL_TEMPLATES, EMAIL_TEMPLATE_KEYS } from '../_lib/email.js'
import { readJsonBody, sendJson } from '../_lib/http.js'
import { listEmailTemplates, upsertEmailTemplate } from '../_lib/supabase.js'

export default async function handler(req, res) {
  if (!requireAdminSession(req, res)) return
  if (!['GET', 'PUT'].includes(req.method)) {
    res.setHeader('Allow', 'GET, PUT')
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  try {
    if (req.method === 'PUT') {
      const body = readJsonBody(req)
      const key = String(body.key || '')
      const subject = String(body.subject || '').trim()
      const templateBody = String(body.body || '').trim()
      if (!EMAIL_TEMPLATE_KEYS.includes(key) || !subject || !templateBody) {
        return sendJson(res, 400, { error: 'Template key, subject and body are required.' })
      }
      if (subject.length > 200 || templateBody.length > 10000) {
        return sendJson(res, 400, { error: 'Email template is too long.' })
      }
      await upsertEmailTemplate({ body: templateBody, key, subject })
    }

    const stored = await listEmailTemplates()
    const templates = EMAIL_TEMPLATE_KEYS.map(
      (key) => stored.find((template) => template.key === key) || DEFAULT_EMAIL_TEMPLATES[key],
    )
    return sendJson(res, 200, { templates })
  } catch (error) {
    console.error('Unable to manage email templates.', error)
    return sendJson(res, 500, { error: 'Unable to manage email templates.' })
  }
}
