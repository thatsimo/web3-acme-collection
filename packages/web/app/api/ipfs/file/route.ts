import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

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
