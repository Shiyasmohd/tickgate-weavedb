import * as React from "react"
import Link from "next/link"

import { NavItem } from "@/types/types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import Image from "next/image"
import Logo from '../../public/logo.png'
import { useAccount } from "wagmi"
import { usePathname } from "next/navigation"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {

  const account = useAccount()
  const path = usePathname()

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Image src={Logo} alt="tickgate" width={100} />
      </Link>
      {items?.length && account.address ? (
        <nav className="hidden md:flex gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    `flex items-center text-sm font-medium text-muted-foreground ${path == item.href ? "text-black" : ""} `,
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
