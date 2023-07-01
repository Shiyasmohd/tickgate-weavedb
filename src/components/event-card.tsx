
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import { EventData } from "@/types/types"


export default function EventCard({ event }: { event: EventData }) {

  return (
    <div>
      <Card className="h-full">
        <CardContent className="flex flex-col justify-between items-center">
          <Image
            src={event.imageUrl}
            width={400}
            height={320}
            alt="Card example background"
            className="w-full h-[215px] object-contain rounded-lg "
          />
          <h1 className="text-center mt-2">{event.eventName}</h1>
          <div className="pb-4">{new Date(event.startTime).toDateString()}</div>
        </CardContent>
      </Card>
    </div>
  )
}
