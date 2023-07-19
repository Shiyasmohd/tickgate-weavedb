import { Network, Alchemy } from "alchemy-sdk";
import { Chain, EventData, WeaveDBData } from "@/types/types";
import { Web3Storage } from 'web3.storage'
//@ts-ignore
import WeaveDB from "weavedb-sdk"

export const COLLECTION = "events"

export const shortWalletAddress = (address?: string) => {
    if (address) return address.slice(0, 5) + "..." + address.slice(-4,)
}

export const getAddressFromContract = async (contractAddr: string, chain: Chain): Promise<string[]> => {

    let network = chain == "Polygon" ? Network.MATIC_MAINNET : Network.ETH_MAINNET;

    console.log("network :", network)

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

function getAccessToken() {
    return process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY as string
}

function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() })
}

export function makeFileObjects(obj: any) {
    // You can create File objects from a Blob of binary data
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })

    const files = [
        new File([blob], 'allowList.json')
    ]
    console.log(files)
    return files
}

export async function storeFiles(files: any) {
    console.log("uplaod started...")
    const client = makeStorageClient()
    const cid = await client.put(files)
    console.log('stored files with cid:', cid)
    return `https://ipfs.io/ipfs/${cid}/${files[0].name}`
}

export async function getEventById(id: string): Promise<EventData> {
    const db = new WeaveDB({ contractTxId: process.env.NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID })
    await db.init()
    let res = await db.cget(COLLECTION, id)
    return res.data
}
export async function storeAddressToDb(id: string, url: string) {
    const db = new WeaveDB({ contractTxId: process.env.NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID })
    await db.init()
    let res = await db.update({ "allowList": url }, COLLECTION, id)
    console.log(res)
}

export async function admitUser(id: string, address: string) {
    const db = new WeaveDB({ contractTxId: process.env.NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID })
    await db.init()

    let res = await db.update({ "attendList": db.union(address) }, COLLECTION, id)
    console.log(res)
}

export async function getEventsByOwner(owner: string): Promise<WeaveDBData[]> {
    const db = new WeaveDB({ contractTxId: process.env.NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID })
    await db.init()
    let res = await db.cget(COLLECTION, ["eventCreator", "==", owner])
    console.log(res)
    return res
}