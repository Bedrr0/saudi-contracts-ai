import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

// لو App Router: ضع هذا الملف في /app/api/analyze/route.ts
// لو Pages Router: /pages/api/analyze.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { text } = req.body    // أو حسب اللي ترسله من الواجهة
    const apiKey = process.env.DEEPSEEK_API_KEY!
    const response = await axios.post(
      'https://api.deepseek.com/v1/analyze',
      { content: text },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res.status(200).json(response.data)
  } catch (err: any) {
    console.error('DeepSeek error:', err.response?.data || err.message)
    return res
      .status(err.response?.status || 500)
      .json({ error: err.response?.data || err.message })
  }
}
