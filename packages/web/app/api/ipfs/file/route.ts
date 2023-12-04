import { NextRequest, NextResponse } from 'next/server'
import pinataSDK from '@pinata/sdk'
import axios from 'axios'

const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT })

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  try {
    const { data } = await axios({
      method: 'post',
      url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    })

    return NextResponse.json(data.IpfsHash, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json('Upload Error', { status: 500 })
  }
}

export async function GET() {
  const response = await pinata.pinList({
    pageLimit: 1,
  })

  if (!response.rows[0])
    return NextResponse.json('Data not found', { status: 404 })

  return NextResponse.json(response.rows[0], { status: 200 })
}
