import { Network, Alchemy } from "alchemy-sdk";
import { Chain } from "@/types/types";
import { Web3Storage, getFilesFromPath, File } from 'web3.storage'
//@ts-ignore
import WeaveDB from "weavedb-sdk"

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

const createEvent = async (

) => {

    console.log("Connecting Weavedb")
    const db = new WeaveDB({ contractTxId: process.env.WEAVEDB_CONTRACT_TX_ID })
    await db.init()
    let res = await db.add({ "age": 20, "name": "Shiyas" }, "new-testing")
    console.log(res)

}

function getAccessToken() {
    return process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY as string
}

function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() })
}

export async function storeFiles(files: any) {
    console.log("uplaod started...")
    const client = makeStorageClient()
    const cid = await client.put(files)
    console.log('stored files with cid:', cid)
    return `https://ipfs.io/ipfs/${cid}/${files[0].name}`
}