// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(404)
    return
  }
  // const body = JSON.parse(req.body)
  // console.log(body)
  console.log(req.body)
  console.log(req.body.keys)
  res.status(200).json({ name: 'John Doe' })
}
