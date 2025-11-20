import React from "react"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import{CirclePlus,Printer,Trash2,Save}from"lucide-react"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import NearMissRegisterModal from"@/pages/NearMiss/NearMissRegister"
import Pagination from"@/components/common/base/Pagination"
import useFilterBar from"@/hooks/useFilterBar"
import useTabNavigation from"@/hooks/useTabNavigation"
import usePagination from"@/hooks/usePagination"
import useTableActions from"@/hooks/tableActions"

type NearMissRow=DataRow&{
  id:number|string
  danger:string
  place:string
  registrant:string
  date:string
  result:string
  reason:string
  sitePhotos:string[]
}

const TAB_LABELS=["아차사고","안전보이스"]
const TAB_PATHS=["/nearmiss","/nearmiss/safevoice"]

const nearMissColumns:Column[]=[
  {key:"id",label:"번호"},
  {key:"place",label:"장소"},
  {key:"danger",label:"유해위험요인"},
  {key:"registrant",label:"등록인"},
  {key:"date",label:"등록일"},
  {key:"sitePhotos",label:"현장사진",type:"photo"},
  {key:"result",label:"처리결과",type:"stateToggle",stateOptions:{
    left:{text:"채택",color:"sky"},
    right:{text:"미채택",color:"red"}
  }},
  {key:"reason",label:"미처리 사유",type:"input"},
  {key:"manage",label:"관리",type:"manage"}
]

const initialNearMissData:NearMissRow[]=[
  {id:3,danger:"지게차충돌",place:"산업현장",registrant:"홍길동",date:"2025/06/01",result:"미채택",reason:"기존 대책으로 충분하여 개선 효과 미미",sitePhotos:["/images/photo1.jpg","/images/photo2.jpg"],manage:""},
  {id:2,danger:"감전",place:"지하1층 전기실",registrant:"홍길동",date:"2025/06/01",result:"미채택",reason:"장비 교체가 선행되어야 개선 가능",sitePhotos:["/images/photo3.jpg"],manage:""},
  {id:1,danger:"추락",place:"지하3층 전기실",registrant:"홍길동",date:"2025/06/01",result:"미채택",reason:"우선순위가 높은 과제가 존재함",sitePhotos:[],manage:""}
]

export default function NearMiss(){
  const[data,setData]=React.useState(initialNearMissData)
  const[checkedIds,setCheckedIds]=React.useState<(number|string)[]>([])
  const[modalOpen,setModalOpen]=React.useState(false)

  const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText}=useFilterBar()
  const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)

  const{
    currentPage,
    totalPages,
    currentData,
    onPageChange
  }=usePagination<NearMissRow>(data,30)

  const{
    handleDelete,
    handleDownload,
    handlePrint
  }=useTableActions({
    data,
    checkedIds,
    onDeleteSuccess:ids=>setData(prev=>prev.filter(row=>!ids.includes(row.id)))
  })

  const handleStateToggle=(id:number|string,newValue:string)=>{
    setData(prev=>prev.map(r=>r.id===id?{...r,result:newValue,reason:newValue==="채택"?"채택 완료":r.reason}:r))
  }

  const handleInputChange=(id:number|string,key:string,value:string)=>{
    setData(prev=>prev.map(r=>r.id===id?{...r,[key]:value}:r))
  }

  const handleSaveRow=(newItem:Partial<NearMissRow>)=>{
    const nextId=Math.max(...data.map(r=>Number(r.id)))+1
    setData([{id:nextId,result:"미채택",reason:"",sitePhotos:[],danger:"",place:"",registrant:"",date:"",manage:"",...newItem},...data])
    setModalOpen(false)
  }

  return(
    <section className="nearmiss-content w-full bg-white">
      <PageTitle>{TAB_LABELS[currentIndex]}</PageTitle>
      <TabMenu tabs={TAB_LABELS}activeIndex={currentIndex}onTabClick={handleTabClick}className="mb-6"/>

      <div className="mb-3">
        <FilterBar
          startDate={startDate}
          endDate={endDate}
          onStartDate={setStartDate}
          onEndDate={setEndDate}
          searchText={searchText}
          onSearchText={setSearchText}
          onSearch={()=>{}}
        />
      </div>

      <div className="mb-3 flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-2">
        <span className="text-sm text-gray-600 leading-none mt-2 sm:mt-0">총 {data.length}건</span>
        <div className="flex gap-1 justify-end w-full sm:w-auto">
          <Button variant="action"onClick={()=>setModalOpen(true)}className="flex gap-1 items-center"><CirclePlus size={16}/>신규등록</Button>
          <Button variant="action"onClick={handleDownload}className="flex gap-1 items-center"><Save size={16}/>다운로드</Button>
          <Button variant="action"onClick={handlePrint}className="flex gap-1 items-center"><Printer size={16}/>인쇄</Button>
          <Button variant="action"onClick={handleDelete}className="flex gap-1 items-center"><Trash2 size={16}/>삭제</Button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white">
        <DataTable
          columns={nearMissColumns}
          data={currentData}
          onCheckedChange={setCheckedIds}
          onStateToggleChange={handleStateToggle}
          onInputChange={handleInputChange}
        />
      </div>

      <Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>
      <div className="flex justify-end mt-5"><Button variant="primary">저장하기</Button></div>

      {modalOpen&&(
        <NearMissRegisterModal
          isOpen={modalOpen}
          onClose={()=>setModalOpen(false)}
          onSave={handleSaveRow}
        />
      )}
    </section>
  )
}
