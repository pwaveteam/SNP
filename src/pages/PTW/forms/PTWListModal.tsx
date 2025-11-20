// components/PTW/PTWListModal.tsx
import React, { useState } from "react"
import { X } from "lucide-react"
import Button from "@/components/common/base/Button"

interface PTWItem {
  id: string
  name: string
  writer: string
  type: "위험작업허가서" | "작업위험분석(JSA)" | "현장 위험성평가(JSA)" | "TBM"
  createdAt: string
}

interface PTWListModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (ptwId: string) => void
  documentType: "위험작업허가서" | "작업위험분석(JSA)" | "현장 위험성평가(JSA)" | "TBM"
}

const BORDER_COLOR = "border-[#DFDFDF]"
const HEADER_BG = "bg-[#F3F5F7]"
const TEXT_PRIMARY = "text-[#333A3F]"
const TEXT_SECONDARY = "text-[#595F68]"
const INPUT_CLASS = "h-[36px] border border-[var(--border)] rounded-[8px] px-3 bg-white focus:outline-none focus:ring-1 focus:ring-[var(--secondary)] text-sm font-normal text-gray-800 placeholder:text-gray-500"

// 문서 타입별 Mock 데이터
const MOCK_DATA: Record<string, PTWItem[]> = {
  "위험작업허가서": [
    {
      id: "PTW-001",
      name: "11월 용접 작업",
      writer: "홍길동",
      type: "위험작업허가서",
      createdAt: "2025-11-07"
    },
    {
      id: "PTW-002",
      name: "배관 용접 작업",
      writer: "최영수",
      type: "위험작업허가서",
      createdAt: "2025-11-03"
    },
    {
      id: "PTW-003",
      name: "화기 작업 허가",
      writer: "김민지",
      type: "위험작업허가서",
      createdAt: "2025-10-30"
    },
    {
      id: "PTW-004",
      name: "고소 작업 허가",
      writer: "이수진",
      type: "위험작업허가서",
      createdAt: "2025-10-25"
    },
    {
      id: "PTW-005",
      name: "중장비 작업 허가",
      writer: "박성호",
      type: "위험작업허가서",
      createdAt: "2025-10-20"
    }
  ],
  "작업위험분석(JSA)": [
    {
      id: "JSA-001",
      name: "배관 교체 작업 분석",
      writer: "김철수",
      type: "작업위험분석(JSA)",
      createdAt: "2025-11-06"
    },
    {
      id: "JSA-002",
      name: "설비 점검 분석",
      writer: "정민호",
      type: "작업위험분석(JSA)",
      createdAt: "2025-11-02"
    },
    {
      id: "JSA-003",
      name: "고소 작업 위험 분석",
      writer: "이수진",
      type: "작업위험분석(JSA)",
      createdAt: "2025-10-29"
    },
    {
      id: "JSA-004",
      name: "전기 작업 위험 분석",
      writer: "강동원",
      type: "작업위험분석(JSA)",
      createdAt: "2025-10-24"
    },
    {
      id: "JSA-005",
      name: "밀폐공간 작업 분석",
      writer: "윤지혜",
      type: "작업위험분석(JSA)",
      createdAt: "2025-10-18"
    }
  ],
  "현장 위험성평가(JSA)": [
    {
      id: "EVAL-001",
      name: "크레인 설치 작업 평가",
      writer: "이영희",
      type: "현장 위험성평가(JSA)",
      createdAt: "2025-11-05"
    },
    {
      id: "EVAL-002",
      name: "도장 작업 평가",
      writer: "강지훈",
      type: "현장 위험성평가(JSA)",
      createdAt: "2025-11-01"
    },
    {
      id: "EVAL-003",
      name: "비계 설치 평가",
      writer: "신동욱",
      type: "현장 위험성평가(JSA)",
      createdAt: "2025-10-28"
    },
    {
      id: "EVAL-004",
      name: "철골 조립 평가",
      writer: "조민석",
      type: "현장 위험성평가(JSA)",
      createdAt: "2025-10-22"
    },
    {
      id: "EVAL-005",
      name: "콘크리트 타설 평가",
      writer: "한지민",
      type: "현장 위험성평가(JSA)",
      createdAt: "2025-10-15"
    }
  ],
  "TBM": [
    {
      id: "TBM-001",
      name: "전기 점검 TBM",
      writer: "박민수",
      type: "TBM",
      createdAt: "2025-11-04"
    },
    {
      id: "TBM-002",
      name: "안전교육 실시 TBM",
      writer: "오세진",
      type: "TBM",
      createdAt: "2025-10-31"
    },
    {
      id: "TBM-003",
      name: "작업 전 안전점검 TBM",
      writer: "송하늘",
      type: "TBM",
      createdAt: "2025-10-27"
    },
    {
      id: "TBM-004",
      name: "위험요인 공유 TBM",
      writer: "김태양",
      type: "TBM",
      createdAt: "2025-10-21"
    },
    {
      id: "TBM-005",
      name: "일일 안전회의 TBM",
      writer: "이별",
      type: "TBM",
      createdAt: "2025-10-16"
    }
  ]
}

export default function PTWListModal({ isOpen, onClose, onSelect, documentType }: PTWListModalProps) {
  const [searchKeyword, setSearchKeyword] = useState("")
  
  // 해당 documentType의 데이터만 가져오기
  const allDocuments = MOCK_DATA[documentType] || []

  // 검색어로 필터링
  const ptwList = searchKeyword
    ? allDocuments.filter(item => 
        item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.writer.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : allDocuments

  const handleSelect = (ptwId: string) => {
    onSelect(ptwId)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-lg shadow-xl w-[900px] max-h-[80vh] flex flex-col">
        <div className={`flex items-center justify-between p-6 border-b ${BORDER_COLOR}`}>
          <h2 className={`text-[18px] font-semibold ${TEXT_PRIMARY}`}>{documentType} 목록</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F3F5F7] rounded transition"
          >
            <X size={24} className="text-[#869CAE]" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className={`${INPUT_CLASS} flex-1`}
              placeholder="작업명, 작성자로 검색"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
            />
            <Button 
              variant="primary" 
              className="h-[36px] px-5 text-sm"
              onClick={() => {}}
            >
              검색
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <table className={`w-full border-collapse border ${BORDER_COLOR}`}>
            <thead>
              <tr className={HEADER_BG}>
                <th className={`border ${BORDER_COLOR} p-3 text-[15px] font-medium ${TEXT_SECONDARY} w-[180px]`}>
                  문서 구분
                </th>
                <th className={`border ${BORDER_COLOR} p-3 text-[15px] font-medium ${TEXT_SECONDARY}`}>
                  작업명
                </th>
                <th className={`border ${BORDER_COLOR} p-3 text-[15px] font-medium ${TEXT_SECONDARY} w-[120px]`}>
                  작성자
                </th>
                <th className={`border ${BORDER_COLOR} p-3 text-[15px] font-medium ${TEXT_SECONDARY} w-[120px]`}>
                  작성일
                </th>
                <th className={`border ${BORDER_COLOR} p-3 text-[15px] font-medium ${TEXT_SECONDARY} w-[100px]`}>
                  선택
                </th>
              </tr>
            </thead>
            <tbody>
              {ptwList.length > 0 ? (
                ptwList.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F9FAFB] transition">
                    <td className={`border ${BORDER_COLOR} p-3 text-[15px] ${TEXT_PRIMARY} text-center`}>
                      {item.type}
                    </td>
                    <td className={`border ${BORDER_COLOR} p-3 text-[15px] ${TEXT_PRIMARY}`}>
                      {item.name}
                    </td>
                    <td className={`border ${BORDER_COLOR} p-3 text-[15px] ${TEXT_PRIMARY} text-center`}>
                      {item.writer}
                    </td>
                    <td className={`border ${BORDER_COLOR} p-3 text-[15px] ${TEXT_PRIMARY} text-center`}>
                      {item.createdAt}
                    </td>
                    <td className={`border ${BORDER_COLOR} p-3 text-center`}>
                      <Button 
                        variant="action" 
                        onClick={() => handleSelect(item.id)}
                        className="text-[13px] px-3 py-1"
                      >
                        불러오기
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={5} 
                    className={`border ${BORDER_COLOR} p-6 text-[15px] ${TEXT_SECONDARY} text-center`}
                  >
                    {searchKeyword ? "검색 결과가 없습니다." : "등록된 문서가 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}