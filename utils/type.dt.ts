export interface TruncateParams {
  text: string
  startChars: number
  endChars: number
  maxLength: number
}

// Property Parameters
export interface PropertyParams {
  id?: number
  name: string
  image: string
  category: string
  description: string
  location: string
  bedroom: number
  bathroom: number
  built: number
  squarefit: number
  price: number
}

//Property Structure
export interface PropertyStruct {
  id: number
  owner: number
  name: string
  image: string
  category: string
  description: string
  location: string
  bedroom: number
  bathroom: number
  built: number
  squarefit: number
  price: number
  sold: boolean
  deleted: boolean
}
