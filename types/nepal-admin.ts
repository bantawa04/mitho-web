export interface Province {
  id: number
  name: string
  headquarter: string
}

export interface District {
  id: number
  provinceId: number
  name: string
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
  wards: number
  categoryId: number
  category: MunicipalityCategory
}
