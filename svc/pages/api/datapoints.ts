// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  ats: Number[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(404)
    return
  }
  const ats: Number[] = req.body.ats
  console.log(ats)
  res.status(200).json({ats: ats})
}
