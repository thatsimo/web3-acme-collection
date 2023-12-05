import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: NextRequest) {
  const pinataContent = await req.json()
  try {
    const { data } = await axios({
      method: 'post',
      url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      data: {
        pinataContent,
        pinataMetadata: {
          name: 'metadata.json',
        },
      },
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    })

    return NextResponse.json(data.IpfsHash, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json('Upload Error', { status: 500 })
  }
}
