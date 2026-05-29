import { create } from 'zustand'

export type RowKind = 'normal' | 'demo' | 'reservado' | 'demo-reservado'

export type CarAnuncio = {
  tab: string
  num: number
  descripcion: string | null
  año: string | null
  precio: string | null
  oferta: string | null
  precioEspecial: string | null
  colorExt: string | null
  colorInt: string | null
  sucursal: string | null
  status: RowKind
}

interface AnunciadorState {
  car: CarAnuncio | null
  setCar: (car: CarAnuncio) => void
}

export const useAnunciador = create<AnunciadorState>((set) => ({
  car: null,
  setCar: (car) => set({ car }),
}))
