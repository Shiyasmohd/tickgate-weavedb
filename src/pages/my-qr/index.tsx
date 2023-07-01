'use client'

import { useEffect, useState } from "react"
import QRCode from 'qrcode'
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function MyQR() {

    const account = useAccount()
    const [qrUrl, setQrUrl] = useState<string | null>(null)
    const router = useRouter()

    const generateQR = async () => {
        const url = await QRCode.toDataURL(account.address?.toLocaleLowerCase() as string);
        setQrUrl(url)
        console.log(url)
    }

    useEffect(() => {
        if (!account.isConnected) {
            router.push('/')
        } else {
            generateQR()
        }
    }, [account.isConnected])

    return (
        <div className="pt-10 px-6">
            <div className="max-w-[1000px] mx-auto flex flex-col items-center justify-center">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    My QR
                </h1>
                {
                    qrUrl ? <Image src={qrUrl} width={250} height={250} alt="" /> : ""
                }
            </div>
        </div>
    )
}