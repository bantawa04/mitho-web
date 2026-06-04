export interface Province {
  id: number
  name: string
  slug: string
  headquarter: string
}

export interface District {
  id: number
  provinceId: number
  name: string
  slug: string
}

export interface MunicipalityCategory {
  id: number
  name: string
  shortCode: string
}

export interface Municipality {
  id: number
  districtId: number
  name: string
  slug: string
  wards: number
  categoryId: number
  category: MunicipalityCategory
}
