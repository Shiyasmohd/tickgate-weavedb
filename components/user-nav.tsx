import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { LucideDollarSign, CreditCard, Home, LogOut, PlusCircle, Settings, User, CalendarHeart, QrCode } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useRouter } from "next/navigation"
import { useAccount, useDisconnect } from "wagmi"
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit"
import { shortWalletAddress } from "@/lib/helper"
import Image from "next/image"

export default function UserNav() {

    const router = useRouter()
    const account = useAccount()
    const { disconnect } = useDisconnect()
    const { openAccountModal } = useAccountModal()
    const { openConnectModal } = useConnectModal()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 flex justify-center items-center">
                        <AvatarFallback>
                            <User className=" h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                {
                    account.address ?
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="md:hidden" onClick={() => router.push('/')}>
                                <Home className="mr-2 h-4 w-4" />
                                <span>Home</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="md:hidden" onClick={() => router.push('/create-event')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                <span>Create Event</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/event-history')}>
                                <CalendarHeart className="mr-2 h-4 w-4" />
                                <span>Event History</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/my-qr')}>
                                <QrCode className="mr-2 h-4 w-4" />
                                <span>My QR</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </DropdownMenuGroup>
                        : ""
                }
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={account.address ? openAccountModal : openConnectModal} >
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>{account.address ? shortWalletAddress(account.address) : "Connect Wallet"}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                {
                    account.address ?
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => disconnect()}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        : ""
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}