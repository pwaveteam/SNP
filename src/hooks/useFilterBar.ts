import { useState } from "react"

export default function useFilterBar(){
  // 한국 표준시 오늘 날짜 yyyy-mm-dd 생성
  const today = new Date()
  const koreaToday = new Date(today.getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)

  const [startDate, setStartDate] = useState(koreaToday)  // 오늘 날짜로 기본값
  const [endDate, setEndDate] = useState("")              // 빈값
  const [searchText, setSearchText] = useState("")

  const resetFilters = () => {
    setStartDate(koreaToday)
    setEndDate("")
    setSearchText("")
  }

  return {
    startDate,
    endDate,
    searchText,
    setStartDate,
    setEndDate,
    setSearchText,
    resetFilters
  }
}
