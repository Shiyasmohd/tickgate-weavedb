import { Network, Alchemy } from "alchemy-sdk";
import { Chain } from "@/types/types";
import { app, db } from "@/config/firebase-config";
import {
    serverTimestamp,
    collection,
    addDoc,
    DocumentReference,
    query,
    getDocs,
    where,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";

export const shortWalletAddress = (address?: string) => {
    if (address) return address.slice(0, 5) + "..." + address.slice(-4,)
}

export const getAddressFromContract = async (contractAddr: string, chain: Chain): Promise<string[]> => {

    let network = chain == "Polygon" ? Network.MATIC_MAINNET : Network.ETH_MAINNET;

    const settings = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API,
        network,
    };

    const alchemy = new Alchemy(settings);
    console.log(alchemy)

    const nftAddresses = await alchemy.nft
        .getOwnersForContract(contractAddr)
        .then(res => {
            console.log("Total address :", res.owners.length)
            return res.owners
        })
        .catch(err => console.log(err));

    if (nftAddresses) return nftAddresses
    else return []

}

export const getEventsData = async (address?: string) => {
    let q;
    if (address) {
        q = query(collection(db, "events"), where("eventCreator", "==", address));
    } else {
        q = query(collection(db, "events"));
    }

    const data = await getDocs(q);
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    // //usage
    // // Get all events
    // const allEvents = await getEventsData();
    // console.log(allEvents); // Array of all event data

    // // Get events by specific address
    // const eventsByAddress = await getEventsData("example-address");
    // console.log(eventsByAddress); // Array of event data filtered by address
};

//function to query event by doc id 
export const getEventById = async (id: string) => {
    const docRef = doc(db, "events", id);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
        // Handle case where no document with the given ID is found
        return null;
    }

    const data = docSnapshot.data();

    return { ...data, id: docSnapshot.id };
}

export const admitUser = async (id: string, address: string) => {
    const docRef = doc(db, "events", id);
    const update = await updateDoc(docRef, {
        attendList: arrayUnion(address)
    })
        .then((res) => {
            console.log(res)
            return "success"
        })
        .catch((err) => {
            console.log(err)
            return "error"
        })

    return update
}
export const storeAddressToDb = async (id: string, addresses: string[]) => {
    const docRef = doc(db, "events", id);
    const update = await updateDoc(docRef, {
        allowList: addresses
    })
        .then((res) => {
            console.log(res)
            return "success"
        })
        .catch((err) => {
            console.log(err)
            return "error"
        })

    return update
}