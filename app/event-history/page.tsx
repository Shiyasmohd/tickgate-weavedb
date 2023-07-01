'use client'
import { CustomConnectButton } from "@/components/custom-connect"
import EventCard from "@/components/event-card"
import { getEventsByOwner } from "@/lib/helper"
import { WeaveDBData } from "@/types/types"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

export default function EventHistory() {

    const account = useAccount()
    const [eventsHistory, setEventHistory] = useState<WeaveDBData[]>([])



    const fetchData: any = async () => {
        const allEvents = await getEventsByOwner(account.address as string);
        //@ts-ignore
        setEventHistory(allEvents);
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div >
            {
                !account.address ?
                    <div className="flex flex-col justify-center items-center gap-6 h-[calc(100vh-200px)]">
                        <h1 className="text-3xl text-center font-extrabold leading-tight tracking-tighter md:text-4xl">
                            Please Connect Your Wallet to Continue.
                        </h1>
                        <div className="md:hidden">
                            <CustomConnectButton />
                        </div>
                    </div>
                    :
                    <div className="w-full p-6 max-w-[800px] flex justify-center my-0 mx-auto">
                        <div className="w-full mb-9">
                            <h2 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl my-5">
                                Event History
                            </h2>
                            {
                                eventsHistory.length === 0 ?
                                    <div className="flex flex-col justify-center items-center gap-6 h-[calc(100vh-200px)]">
                                        <h1 className="text-3xl text-center font-extrabold leading-tight tracking-tighter md:text-4xl">
                                            No Events Created By You.
                                        </h1>

                                    </div>
                                    :
                                    <div className="w-full grid grid-cols-2 gap-4 xl:grid-cols-3">
                                        {
                                            eventsHistory.map((event: WeaveDBData) => {
                                                return (
                                                    <div className="">
                                                        <Link href={`/event/${event.id}`} key={event.id}>
                                                            <EventCard event={event.data} />
                                                        </Link>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                            }
                        </div>
                    </div>
            }
        </div>
    )
}