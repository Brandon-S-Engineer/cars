import { create } from 'zustand'

interface InventarioHighlightState {
  tab: string | null
  rowNum: number | null
  setHighlight: (tab: string, rowNum: number) => void
  clearHighlight: () => void
}

export const useInventarioHighlight = create<InventarioHighlightState>((set) => ({
  tab: null,
  rowNum: null,
  setHighlight: (tab, rowNum) => set({ tab, rowNum }),
  clearHighlight: () => set({ tab: null, rowNum: null }),
}))
