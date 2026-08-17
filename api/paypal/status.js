import { handleApiError, requireGet, sendJson } from '../_lib/http.js'
import { getProductAmounts } from '../_lib/orders.js'
import { assertPayPalConfiguration } from '../_lib/paypal.js'
import { assertSupabaseConfiguration } from '../_lib/supabase.js'

export default function handler(req, res) {
  if (!requireGet(req, res)) return

  try {
    const environment = assertPayPalConfiguration()
    assertSupabaseConfiguration()
    getProductAmounts(1)

    return sendJson(res, 200, { available: true, environment })
  } catch (error) {
    return handleApiError(res, error, 'Unable to confirm PayPal availability.')
  }
}
