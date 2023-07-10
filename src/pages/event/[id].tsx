"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { admitUser, getAddressFromContract, getEventById, makeFileObjects, shortWalletAddress, storeAddressToDb, storeFiles } from "@/lib/helper";
import { useEffect, useState } from "react";
import { EventData } from "@/types/types";
import { QrReader } from 'react-qr-reader';
import { useAccount } from "wagmi";
import { ExternalLink, Loader2, ScanLine, UserCheck, UserPlus, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import axios from 'axios'
import { useRouter } from "next/router";
//@ts-ignore
import WeaveDB from 'weavedb-sdk'
import {
    ShareToLens, Theme, Size
} from '@lens-protocol/widgets-react'

export default function EventDetails() {

    const [eventData, setEventData] = useState<EventData>({} as EventData);
    const [eventStatus, setEventStatus] = useState<"notStarted" | "live" | "ended">("notStarted");
    const [scannedAddress, setScannedAddress] = useState<string>('');
    const [displayResult, setDisplayResult] = useState<"Scan QR Code" | "User Approved" | "User Rejected" | "User Already Entered">('Scan QR Code');
    const [loading, setLoading] = useState(false);
    const [allowList, setAllowList] = useState<string[]>([]);
    const account = useAccount()
    const { toast } = useToast()
    const router = useRouter()
    const [db, setDb] = useState()

    const checkEventStatus = async (startTime: string, endTime: string) => {
        const currentTime = new Date().getTime();
        const startTimeInMs = new Date(startTime).getTime();
        const endTimeInMs = new Date(endTime).getTime();
        if (currentTime < startTimeInMs) {
            setEventStatus("notStarted");
        } else if (currentTime > endTimeInMs) {
            setEventStatus("ended")
        } else {
            setEventStatus("live")
        }
    }

    const checkIfApproved = async (address: string) => {

        if (eventData.attendList.find(item => item == address)) {
            setDisplayResult("User Already Entered");
            console.log("User Already Entered")
            return false;
        }
        else if (allowList.find(item => item == address)) {
            console.log('approved');
            setDisplayResult("User Approved");
            return true;
        } else {
            setDisplayResult("User Rejected");
            console.log('rejected');
            return false;
        }
    }

    const handleFetchNfts = async () => {
        setLoading(true);
        console.log("fetching nfts from contract")
        const nftAddresses = await getAddressFromContract(eventData.contractAddress, eventData.chain);
        console.log({ nftAddresses })
        setAllowList(nftAddresses)
        let allowList = {
            addresses: nftAddresses,
        }
        let url = await storeFiles(makeFileObjects(allowList))
        let tempEventData: EventData = eventData;
        eventData.allowList = url;
        setEventData(tempEventData)

        await storeAddressToDb(router.query.id as string, url)

        setLoading(false);
    }

    const handleAdmit = async () => {
        setLoading(true);
        console.log("Admitting user..")
        let tempAttendList: EventData = eventData;
        tempAttendList.attendList.push(scannedAddress);
        setEventData(tempAttendList)
        await admitUser(router.query.id as string, scannedAddress as string)
        toast({
            description: `${scannedAddress} has been admitted`,
        })
        setDisplayResult("Scan QR Code")
        setLoading(false);
    }

    const gotoExplorer = (address: string) => {
        return `https://polygonscan.com/address/${address}`
    }

    useEffect(() => {
        const fetchData: any = async () => {
            const event = await getEventById(router.query.id as string);
            setEventData(event);
            checkEventStatus(event.startTime, event.endTime);
            if (event.allowList.length > 0) {
                console.log("Fetching allowList addresses")
                await axios.get(event.allowList)
                    .then((res) => {
                        setAllowList(res.data.addresses)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }
        fetchData();
    }, [router.query.id])

    return (
        <div className="w-full p-6 max-w-[500px] my-0 mx-auto flex flex-col">

            {
                eventData && eventData.eventName ?
                    <div>

                        {/* Event Details */}
                        <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl mt-5">
                            {eventData.eventName}
                        </h2>
                        <p className="-mt-1">
                            {eventData.typeOfEvent}
                        </p>

                        <div className="w-full">
                            <div className="w-full my-6">
                                {
                                    eventData && <Image
                                        src={eventData.imageUrl}
                                        className="rounded-lg w-full"
                                        width={400}
                                        height={400}
                                        alt="event image"
                                    />
                                }

                            </div>
                            <div className="w-full">
                                <Button
                                    disabled
                                    className="w-full text-white my-3"
                                >
                                    No. of Approved : {eventData.attendList?.length}
                                </Button>

                                {
                                    eventData?.eventCreator == account.address && eventData && eventStatus == "live" && (eventData.allowList.length == 0) ?
                                        <Button onClick={handleFetchNfts} className="w-full text-white">
                                            {
                                                loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Fetch NFT Addresses"
                                            }
                                        </Button>
                                        : ""
                                }

                                <div className="mt-3 flex justify-between flex-row">
                                    <ShareToLens
                                        title="Share to Lens"
                                        content="Hey, I am attending this event. Join me!"
                                        url={`https://tickgate-weavedb.vercel.app/event/${router.query.id}`}
                                        via="TickGate"
                                        theme={Theme.mint}
                                        size={Size.medium}
                                    />
                                    <Link href='https://claim.lens.xyz' target="_blank">
                                        <button className="bg-[#bde0c6] text-[#464646]  p-2 rounded-full px-4">
                                            Claim Lens handle
                                        </button>
                                    </Link>
                                </div>

                                {
                                    eventData?.eventCreator == account.address && eventData && eventStatus == "live" && eventData.allowList.length > 0 &&
                                    <div>
                                        <Dialog >
                                            <DialogTrigger asChild>
                                                <Button className="w-full text-white">Scan  </Button>
                                            </DialogTrigger>
                                            <DialogContent onCloseAutoFocus={() => setDisplayResult("Scan QR Code")}>
                                                <DialogHeader>
                                                    <DialogTitle>{eventData.eventName}</DialogTitle>
                                                    <DialogDescription>
                                                        <div className='w-full'>
                                                            <QrReader
                                                                onResult={(result: any, error) => {
                                                                    if (!!result) {
                                                                        setScannedAddress(result?.text)
                                                                        checkIfApproved(result?.text)
                                                                    }

                                                                    if (!!error) {
                                                                        // console.info(error);
                                                                    }
                                                                }}
                                                                constraints={{
                                                                    facingMode: 'environment'
                                                                }}
                                                            />
                                                            <p className="flex justify-center items-center gap-4 text-black text-center pt-2 pb-8">
                                                                {
                                                                    displayResult == "User Approved" ? <UserCheck color="#00c200" />
                                                                        : displayResult == "User Rejected" ? <XCircle color="#ff0000" />
                                                                            : displayResult == "User Already Entered" ? <UserPlus color="#ffae00" />
                                                                                : displayResult == "Scan QR Code" ? <ScanLine color="#000000" /> : ""

                                                                }
                                                                {displayResult}
                                                            </p>
                                                        </div>

                                                        <Button
                                                            disabled
                                                            className="w-full bg-[#000] text-white"
                                                        >
                                                            No. of Approved : {eventData.attendList?.length}
                                                        </Button>
                                                        {
                                                            displayResult == "User Approved" &&
                                                            <Button
                                                                onClick={handleAdmit}
                                                                className="w-full text-white mt-4"
                                                            >
                                                                {
                                                                    loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Admit User"
                                                                }
                                                            </Button>
                                                        }
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                }


                            </div>
                        </div>
                        {
                            eventData.mapLink ?
                                <Link href={eventData.mapLink} className="mt-6 flex gap-2">
                                    Location : <span className="underline flex gap-1 items-center"> {eventData.location} <ExternalLink className="h-4 w-4" /> </span>
                                </Link>
                                : ""
                        }
                        {
                            eventData.startTime ?
                                <div className="mt-2 flex gap-2">
                                    Start Time : {new Date(eventData.startTime).toDateString()} {new Date(eventData.startTime).toLocaleTimeString()}
                                </div>
                                : ""
                        }
                        {
                            eventData.endTime ?
                                <div className="mt-2 flex gap-2">
                                    End Time : {new Date(eventData.endTime).toDateString()} {new Date(eventData.endTime).toLocaleTimeString()}
                                </div>
                                : ""
                        }
                        {
                            eventData.contractAddress ?
                                <div className="mt-2 flex gap-2">

                                    Contract Address <Link href={gotoExplorer(eventData.contractAddress)}> {shortWalletAddress(eventData.contractAddress)}</Link>
                                </div>
                                : ""
                        }
                        {
                            eventData.chain ?
                                <div className="mt-2 flex gap-2">
                                    Chain : {eventData.chain}
                                </div>
                                : ""
                        }
                    </div>
                    : ""
            }
        </div>
    )
}
