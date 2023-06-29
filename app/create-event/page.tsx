"use client"
import React, { useState } from "react";
import { v4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SetStateAction, useEffect } from "react";
import Lottie from "react-lottie";
import animationData from "../../public/tick-mark-lotti.json";
import { Chain, EventData, EventType } from "@/types/types";
import { db, storage } from "@/config/firebase-config";
import {
    serverTimestamp,
    collection,
    addDoc,
    DocumentReference,
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
    UploadTaskSnapshot,
} from "firebase/storage";
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi";



export default function CreateEvent() {
    const router = useRouter()
    const acceptedFileTypes = '.jpg, .jpeg, .png';
    const account = useAccount();
    const [eventName, setEventName] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [contractAddress, setContractAddress] = useState("");
    const [location, setLocation] = useState("");
    const [mapLink, setMapLink] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [typeOfEvent, setTypeOfEvent] = useState<EventType>("Meet Up");
    const [chain, setChain] = useState<Chain>('Polygon');
    const [eventCreator, setEventCreator] = useState("");
    const [docLoading, setDocLoading] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false)
    const [isFormSubmitting, setIsFormSubmitting] = useState(false)
    const eventCollectionRef = collection(db, "events");
    const storageRef = ref(storage, "events");

    const handleFileChange = (event: any) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 15000000) {
                alert("File size must be under 15MB!");
            } else {
                setImage(selectedFile);
            }
        }
    };

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const uploadImage = async (): Promise<string | undefined> => {
        if (!image) return "NA";
        setDocLoading(true);
        const docRef = ref(storage, `doc/logo/${image.name + v4()}`);
        try {
            //@ts-ignore
            const snapshot: UploadTaskSnapshot = await uploadBytes(docRef, image);
            const url: string = await getDownloadURL(snapshot.ref);
            setDocLoading(false);
            return url;
        } catch (error) {
            console.error("Error uploading file:", error);
            setDocLoading(false);
            return 'NA';
        }
    };

    const createEvent = async (imageUrl: string): Promise<void> => {
        try {
            const eventData: EventData = {
                eventName: eventName,
                startTime: startTime,
                endTime: endTime,
                contractAddress: contractAddress,
                location: location,
                mapLink: mapLink,
                allowList: [],
                attendList: [],
                typeOfEvent: typeOfEvent,
                chain: chain,
                eventCreator: account.address as string,
                imageUrl: imageUrl,
            };

            const docRef: DocumentReference = await addDoc(
                eventCollectionRef,
                eventData
            );
            setIsFormSubmitted(true)
            console.log("Document written with ID: ", docRef.id);
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (error) {
            setIsFormSubmitting(false);
            console.error("Error creating event:", error);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault(); // Prevent the default form submission behavior
        // Call the necessary functions to handle form submission
        setIsFormSubmitting(true)
        //@ts-ignore
        uploadImage().then((imageUrl) => createEvent(imageUrl));
    };

    return (
        <div className="pb-10" >
            {
                isFormSubmitted ?
                    <div className="h-[25rem] flex flex-col justify-center items-center">
                        <Lottie options={defaultOptions} height={50} width={50} />
                        <h3>Form submitted successfully</h3>
                    </div>
                    :
                    <div className="pt-10 px-6">
                        <div className="max-w-[1000px] mx-auto">
                            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                                Create Event
                            </h1>
                            <form className="mt-4 flex flex-col gap-3 md:w-3/4 lg:w-3/5 xl:w-1/2" onSubmit={handleSubmit}>
                                <div>
                                    <Label>Event Name</Label>
                                    <Input
                                        required={true}
                                        type="text"
                                        placeholder="NFT Kochi Meetup"
                                        className="mt-1"
                                        value={eventName}
                                        onChange={(e) => setEventName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Event type</Label>
                                    <Select onValueChange={(value) => setTypeOfEvent(value as EventType)} required={true}>
                                        <SelectTrigger className="mt-1" >
                                            <SelectValue placeholder="Meet Up" />
                                        </SelectTrigger>
                                        <SelectContent >
                                            <SelectItem value="Meet Up">Meet up</SelectItem>
                                            <SelectItem value="Workshop">Workshop</SelectItem>
                                            <SelectItem value="Hackathon">Hackathon</SelectItem>
                                            <SelectItem value="Conference">Conference</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Start Time</Label>
                                    <Input
                                        type="datetime-local"
                                        placeholder="Date"
                                        className="mt-1"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>End Time</Label>
                                    <Input
                                        type="datetime-local"
                                        placeholder="Date"
                                        className="mt-1"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Contract Address of NFT</Label>
                                    <Input
                                        required={true}
                                        type="text"
                                        placeholder="0x06C41df2358deD2Fd891522f9Da75eca2150c10B"
                                        className="mt-1"
                                        value={contractAddress}
                                        onChange={(e) => setContractAddress(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Select chain</Label>
                                    <Select onValueChange={(value) => setChain(value as Chain)} defaultValue='Polygon' >
                                        <SelectTrigger className="mt-1" >
                                            <SelectValue placeholder="Chain" />
                                        </SelectTrigger>
                                        <SelectContent >
                                            <SelectItem value="Ethereum">Ethereum</SelectItem>
                                            <SelectItem value="Polygon">Polygon</SelectItem>
                                            <SelectItem disabled={true} value="Solana">Solana</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Location</Label>
                                    <Input
                                        required={true}
                                        type="text"
                                        placeholder="Tinkerspace Kochi"
                                        className="mt-1"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Map Link</Label>
                                    <Input

                                        type="text"
                                        placeholder="https://goo.gl/maps/q8vrXu7cKuKxfASWA"
                                        className="mt-1"
                                        value={mapLink}
                                        onChange={(e) => setMapLink(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Logo</Label>
                                    <Input
                                        required={true}
                                        type='file'
                                        accept={acceptedFileTypes}
                                        className="mt-1"
                                        // value={image? image.name : ''}
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="flex justify-end mt-1">
                                    <Button disabled={isFormSubmitting} type="submit" >Submit</Button>
                                </div>
                            </form>
                        </div>
                    </div>
            }
        </div>
    );
}
