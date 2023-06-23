import "./listInputINSS.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { useEffect, useState } from "react"
import api from "../../services/api"
import DatatableInputPayroll from "../../components/datatable/DatatableInputPayroll"
import { Link, useParams } from "react-router-dom"
import DatatableInputAbsences from "../../components/datatableResources/DatatableInputAbsences"


const payrollInputColumns = [
    { field: 'employee_id', headerName: 'ID', width: 70, align:'center', headerAlign: 'center', hide: true},
    { field: 'employee_name', headerName: 'Nome', width: 200,align:'left', headerAlign: 'center', },
    // { field: "salary_base", headerName: "Salario Base", width: 130, editable: false, align:'center', headerAlign: 'center',},
    { field: "absences",  headerName: "Faltas", width: 100, editable: true, align:'center', headerAlign: 'center'},
    // { field: "subsidy", headerName: "Subsidio", width: 130, editable: true, align:'center', headerAlign: 'center',},
    // { field: "bonus", headerName: "Comissao", width: 100, editable: true, align:'center', headerAlign: 'center',},
    { field: "month",headerName: "MES", width: 100},
    { field: "year",headerName: "ANO", width: 70}
]
const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }

const formatDate = new Intl.DateTimeFormat("pt-br", { dateStyle: 'short'})  

  
export const visible = {
    employee_name: true,
    department_name: true,
    position_name: true,
    absences: true,
    overtime50: true,
    overtime100: true,
    
}

const ListInputAbsences = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true)
    const [searchName, setSearchName] = useState("")
    const params = useParams()

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("settings")
            if (response.data) {
                setSettings(response.data)
            }
        }

            fetchData()
        }, [])

    useEffect(() => {
        async function fetchData() {
            const response = await api.get(`payrolls/output/${params.payrollId}`)
             console.log(listPath)
             console.log(response.data)
            //  console.log(response.data.data)

             response.data.map((data) => {
                data.salary_base = formatSalary().format(data.salary_base)
                data.absences = data.absences 
                data.total_income = formatSalary().format(data.total_income)
                data.subsidy = formatSalary().format(data.subsidy)
                data.bonus = formatSalary().format(data.bonus)
                data.cash_advances = formatSalary().format(data.cash_advances)
                data.backpay = formatSalary().format(data.backpay)
                data.subsidy_food = formatSalary().format(data.subsidy_food)
                data.subsidy_transport = formatSalary().format(data.subsidy_transport)
                data.subsidy_residence = formatSalary().format(data.subsidy_residence)
                data.subsidy_medical = formatSalary().format(data.subsidy_medical)
                data.subsidy_vacation = formatSalary().format(data.subsidy_vacation)
                data.salary_thirteenth = formatSalary().format(data.salary_thirteenth)    
                data.inss_event_date = formatDate.format(new Date(data.inss_event_date))
            })
            if (response.status === 200) {
                setLoading(false)
            }
            setUserRows(response.data)
            // setUserRows(response.data.filter(data => {
            //     if (searchName === "")
            //         return data
            //     else if (data.name.toLowerCase().includes(searchName.toLocaleLowerCase()))
            //         return data
            // }))
        }
        fetchData()
      
    }, [listPath])

    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar searchName={searchName} setSearchName={setSearchName}/>
                <DatatableInputAbsences listName={listName} listPath={listPath} columns={payrollInputColumns}
                userRows={userRows} setUserRows={setUserRows} settings={settings}
                loading={loading} setLoading={setLoading}
                searchName={searchName} setSearchName={setSearchName}
                />
            </div>
        </div>
    )
}

// function formatSalary() {
//     return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
//   }

export default ListInputAbsences



