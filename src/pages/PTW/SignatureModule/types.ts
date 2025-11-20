// src/pages/PTW/SignatureModule/types.ts

export interface SignatureInfo {
    name: string
    phone: string
    position: string
    source: 'org' | 'manual'
  }
  
  export interface SignatureSelectorProps {
    value?: SignatureInfo
    onChange: (person: SignatureInfo) => void
    disabled?: boolean
  }