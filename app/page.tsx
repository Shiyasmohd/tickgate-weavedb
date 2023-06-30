'use client'

import { CustomConnectButton } from "@/components/custom-connect"
import { useAccount } from "wagmi"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/navigation"
import EventCard from '@/components/event-card'
import { EventData } from "@/types/types"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
//@ts-ignore
import WeaveDB from "weavedb-sdk"

export default function IndexPage() {

  const [eventData, setEventData] = useState([]);
  const account = useAccount()
  const router = useRouter()

  const handleTest = async () => {

    console.log("Connecting Weavedb")
    const db = new WeaveDB({ contractTxId: process.env.WEAVEDB_CONTRACT_TX_ID })
    await db.init()
    let res = await db.add({ "age": 20, "name": "Shiyas" }, "new-testing")
    console.log(res)

  }

  useEffect(() => {
    const fetchData: any = async () => {
      // const allEvents = await getEventsData();
      //@ts-ignore
      setEventData(allEvents);
    }
    fetchData();
  }, [])

  return (
    <section className=" grid items-center gap-6 pb-8 pt-6 md:py-10">
      {
        !account.address ?
          <div className="flex flex-col justify-center items-center gap-6 h-[calc(100vh-200px)]">
            <h1 className="text-3xl text-center font-extrabold leading-tight tracking-tighter md:text-4xl">
              Please Connect Your Wallet <br /> to Continue.
            </h1>
            <div className="md:hidden">
              <CustomConnectButton />
            </div>
          </div>
          : <div className="w-full p-6 max-w-[500px] my-0 mx-auto">

            {/* Main Buttons */}
            <div className="w-full flex justify-center gap-9">
              <Link
                href='/my-qr'
                className="w-1/2 max-w-[250px] py-6 flex flex-col items-center gap-2 rounded-lg bg-[#5783db] shadow"
              >
                <button
                  className=" flex flex-col items-center gap-2 ">
                  <div className="invert w-[45px]">
                    <Image src={'/qr.png'} width={100} height={100} alt="" />
                  </div>
                  <div className="text-center text-white ">
                    My QR
                  </div>
                </button>
              </Link>

              <Link
                href='/create-event'
                className="w-1/2 max-w-[250px] py-6 flex flex-col items-center gap-2 rounded-lg bg-[#5dbea3] shadow"
              >
                <button
                  className=" flex flex-col items-center gap-2 ">
                  <div className="invert w-[45px]">
                    <Image src={'/create-icon2.png'} width={100} height={100} alt="" />
                  </div>
                  <div className="text-center  text-white ">
                    Create Event
                  </div>
                </button>
              </Link>
              <Button onClick={handleTest}>
                Test
              </Button>
            </div>
            {/* Created Events */}
            <div className="w-full my-9">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl my-5">
                Upcoming Events
              </h2>
              <div className="w-full grid grid-cols-2 gap-4">
                {eventData.map((event: EventData) => {
                  return (
                    <div className="h-full">
                      <Link href={`/event/${event.id}`} key={event.id} className="h-full">
                        <EventCard event={event} />
                      </Link>
                    </div>
                  )
                })}
              </div>

            </div>
          </div>
      }
    </section>
  )
}
