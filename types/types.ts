export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}

export type Chain = "Polygon" | "Ethereum"

export type EventType = "Meet Up" | "Workshop" | "Hackathon" | "Conference"
export type EventData = {
  id?: string;
  eventName: string;
  startTime: string;
  endTime: string;
  contractAddress: string;
  location: string;
  mapLink: string;
  imageUrl: string;
  allowList: string;
  attendList: string[];
  typeOfEvent: EventType;
  chain: Chain;
  eventCreator: string;
}

export type WeaveDBData = {
  data: EventData
  id: string
  setter: string
}