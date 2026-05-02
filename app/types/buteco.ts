export interface Buteco {
  name: string
  address: string
  photo: string
  details_url: string
  extracted_at: string
  lat: number | null
  lon: number | null
  city: string | null
  suburb: string | null
  district: string | null
}

export interface FilterState {
  search: string
  city: string | null
  suburbs: string[]
  districts: string[]
}
