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
  images: string[]
  category: 'House' | 'Apartment' | 'Condo' | 'Townhouse' | 'Villa'
  description: string
  location: string
  city: string
  state: string
  country: string
  zipCode: string | number
  bedroom: string | number
  bathroom: string | number
  built: string | number
  squarefit: string | number
  price: string | number
}

//Property Structure
export interface PropertyStruct {
  id: number
  owner: string
  name: string
  images: string[]
  category: 'House' | 'Apartment' | 'Condo' | 'Townhouse' | 'Villa'
  description: string
  location: string
  city: string
  state: string
  country: string
  zipCode: number
  bedroom: number
  bathroom: number
  built: number
  squarefit: number
  price: number
  sold: boolean
  deleted: boolean
}

//Create Review Param
export interface ReviewParams {
  propertyId: number
  id?: number
  comment: string
}

//Review Structure
export interface ReviewStruct {
  id: number
  propertyId: number
  comment: string
  reviewer: string
  deleted: boolean
  timestamp: number
}
