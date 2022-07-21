// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Data = {
  ats: number[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(404)
    return
  }
  const ats: number[] = req.body.ats
  console.log(ats)
  const response = await prisma.datapoints.createMany({
    data: ats.map((at) => {
      return {at: new Date(at)}
    }),
    skipDuplicates: true
  })
  res.status(200).json({ats: ats})
}
