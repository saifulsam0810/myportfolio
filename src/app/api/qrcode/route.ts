import { NextRequest } from 'next/server'
import QRCode from 'qrcode'
import { ok, err } from '@/lib/api'

// POST /api/qrcode - generate QR code data URL for a given text/url
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const text: string = body.text ?? body.url ?? ''
    if (!text) return err('Parameter "text" diperlukan', 400)

    const dataUrl = await QRCode.toDataURL(text, {
      width: body.width ?? 320,
      margin: body.margin ?? 2,
      color: {
        dark: body.dark ?? '#1e3a8a', // navy-800
        light: body.light ?? '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })

    return ok({ dataUrl, text })
  } catch (e) {
    return err(`Galan jana QR: ${(e as Error).message}`, 500)
  }
}
