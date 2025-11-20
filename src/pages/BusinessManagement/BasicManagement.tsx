import React,{useState}from"react"
import Button from"@/components/common/base/Button"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import PageTitle from"@/components/common/base/PageTitle"
import FormScreen,{Field}from"@/components/common/forms/FormScreen"
import TabMenu from"@/components/common/base/TabMenu"
import useTableActions from"@/hooks/tableActions"

const columns:Column[]=[
{key:"factory",label:"사업장명",type:"input"},
{key:"manager",label:"안전보건관리책임자",type:"input"},
{key:"contact",label:"연락처",type:"input"},
{key:"address",label:"사업장 소재지",type:"input"}
]

const initialData:DataRow[]=[
{id:1,factory:"서울제조공장",manager:"김철수",contact:"010-1234-5678",address:"경기도 고양시 일산동구 장항동 112-23"},
{id:2,factory:"부산물류센터",manager:"이영희",contact:"051-987-6543",address:"부산광역시 해운대구 좌동 789-10"}
]

const fields:Field[]=[
{name:"company",label:"회사명",type:"text"},
{name:"ceo",label:"대표자",type:"text"},
{name:"address",label:"주소지",type:"text"},
{
name:"phonePrefix",
label:"전화번호",
type:"phone",
options:[
{value:"010",label:"010"},{value:"070",label:"070"},{value:"02",label:"02"},{value:"031",label:"031"},
{value:"032",label:"032"},{value:"033",label:"033"},{value:"041",label:"041"},{value:"042",label:"042"},
{value:"043",label:"043"},{value:"044",label:"044"},{value:"051",label:"051"},{value:"052",label:"052"},
{value:"053",label:"053"},{value:"054",label:"054"},{value:"055",label:"055"},{value:"061",label:"061"},
{value:"062",label:"062"},{value:"063",label:"063"},{value:"064",label:"064"}
]
},
{
name:"businessType1",
label:"업종",
type:"select",
options:[
{value:"식료품 제조업",label:"식료품 제조업"},{value:"음료 제조업",label:"음료 제조업"},{value:"담배 제조업",label:"담배 제조업"},
{value:"섬유제품 제조업",label:"섬유제품 제조업"},{value:"의복 제조업",label:"의복 제조업"},{value:"가죽 및 관련 제품 제조업",label:"가죽 및 관련 제품 제조업"},
{value:"목재 및 나무제품 제조업",label:"목재 및 나무제품 제조업"},{value:"펄프 종이 및 종이제품 제조업",label:"펄프 종이 및 종이제품 제조업"},
{value:"인쇄 및 기록매체 복제업",label:"인쇄 및 기록매체 복제업"},{value:"화학물질 및 화학제품 제조업",label:"화학물질 및 화학제품 제조업"},
{value:"의약품 제조업",label:"의약품 제조업"},{value:"고무 및 플라스틱 제조업",label:"고무 및 플라스틱 제조업"},
{value:"비금속 광물제품 제조업",label:"비금속 광물제품 제조업"},{value:"1차 금속 제조업",label:"1차 금속 제조업"},
{value:"금속가공제품 제조업",label:"금속가공제품 제조업"},
{
value:"전자부품 컴퓨터 영상 음향 및 통신장비 제조업",
label:"전자부품 컴퓨터 영상 음향 및 통신장비 제조업"
},
{value:"의료 정밀 광학기기 및 시계 제조업",label:"의료 정밀 광학기기 및 시계 제조업"},
{value:"전기장비 제조업",label:"전기장비 제조업"},{value:"기계 및 장비 제조업",label:"기계 및 장비 제조업"},
{value:"자동차 및 트레일러 제조업",label:"자동차 및 트레일러 제조업"},{value:"기타 운송장비 제조업",label:"기타 운송장비 제조업"},
{value:"가구 제조업",label:"가구 제조업"},{value:"기타 제품 제조업",label:"기타 제품 제조업"},
{value:"산업용 기계 및 장비 수리업",label:"산업용 기계 및 장비 수리업"},
{
value:"전기 가스 증기 및 공기조절 공급업",
label:"전기 가스 증기 및 공기조절 공급업"
},
{
value:"수도 하수 및 폐기물 처리 원료 재생업",
label:"수도 하수 및 폐기물 처리 원료 재생업"
},
{value:"도매 및 소매업",label:"도매 및 소매업"},{value:"운수 및 창고업",label:"운수 및 창고업"},
{value:"정보통신업",label:"정보통신업"},{value:"금융 및 보험업",label:"금융 및 보험업"},
{value:"부동산업",label:"부동산업"},{value:"전문 과학 및 기술 서비스업",label:"전문 과학 및 기술 서비스업"},
{
value:"사업시설 관리 사업 지원 및 임대 서비스업",
label:"사업시설 관리 사업 지원 및 임대 서비스업"
},
{value:"공공행정 국방 및 사회보장 행정",label:"공공행정 국방 및 사회보장 행정"},
{value:"교육 서비스업",label:"교육 서비스업"},{value:"보건업 및 사회복지 서비스업",label:"보건업 및 사회복지 서비스업"},
{
value:"예술 스포츠 및 여가관련 서비스업",
label:"예술 스포츠 및 여가관련 서비스업"
},
{
value:"협회 및 단체 수리 및 기타 개인 서비스업",
label:"협회 및 단체 수리 및 기타 개인 서비스업"
}
]
},
{
name:"businessType2",
label:"업태",
type:"select",
options:[
{value:"제조",label:"제조"},{value:"도매",label:"도매"},{value:"소매",label:"소매"},{value:"도소매",label:"도소매"},
{value:"서비스",label:"서비스"},{value:"운수업",label:"운수업"},{value:"임대업",label:"임대업"},
{value:"정보통신업",label:"정보통신업"},{value:"용역",label:"용역"},{value:"기타",label:"기타"}
]
},
{name:"businessNumber",label:"사업자등록번호",type:"text"},
{name:"signature",label:"서명",type:"signature"}
]

export default function BasicManagement(){
const[formValues,setFormValues]=useState({
company:"주식회사 테스트",ceo:"박대표",address:"서울특별시 강남구 도곡동 11-1",
phonePrefix:"010",phoneMiddle:"3867",phoneLast:"1234",
businessType1:"",businessType2:"",businessNumber:"333-00-67890",
signature:"/images/sample-signature.png"
})

const[data,setData]=useState<DataRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])

const{handleSave}=useTableActions({
data,
checkedIds,
onSave:()=>{}
})

const handleChange=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
const{name,value}=e.target
setFormValues(prev=>({...prev,[name]:value}))
}

const handleAdd=()=>{
const newId=data.length>0?Math.max(...data.map(d=>Number(d.id)))+1:1
setData(prev=>[...prev,{id:newId,factory:"",manager:"",contact:"",address:""}])
}

return(
<section className="mypage-content w-full">
<div className="flex justify-between items-center"><PageTitle>기본사업장관리</PageTitle></div>

<TabMenu tabs={["기본사업장관리"]}activeIndex={0}onTabClick={()=>{}}className="mb-6"/>

<FormScreen fields={fields}values={formValues}onChange={handleChange}onClose={()=>{}}onSave={handleSave}/>

<div className="flex justify-end mt-3">
<Button variant="primary"onClick={handleSave}>저장하기</Button>
</div>

<div className="flex justify-between items-center mt-8 mb-2">
<div><PageTitle>사업장목록</PageTitle></div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable
columns={columns}
data={data}
onCheckedChange={setCheckedIds}
onInputChange={(id,key,val)=>setData(p=>p.map(r=>r.id===id?{...r,[key]:val}:r))}
/>
<div className="mt-3 flex justify-start">
<Button variant="rowAdd"onClick={handleAdd}>+ 사업장추가</Button>
</div>
</div>

<div className="flex justify-end mt-3">
<Button variant="primary"onClick={handleSave}>저장하기</Button>
</div>
</section>
)
}