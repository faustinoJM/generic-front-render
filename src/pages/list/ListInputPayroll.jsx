import "./listInputPayroll.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { useEffect, useState } from "react"
import api from "../../services/api"
import DatatableInputPayroll from "../../components/datatable/DatatableInputPayroll"

const payrollInputColumns = [
    { field: 'employee_id', headerName: 'ID', width: 70, align:'center', headerAlign: 'center', hide: true},
    { field: 'employee_name', headerName: 'Nome', width: 200,align:'left', headerAlign: 'center', },
    // { field: "dependents", headerName:"Dependentes", width: 120,  align:'center', headerAlign: 'center', },
    { field: "departament_name", headerName:"Departamento", width: 180,  align:'left', headerAlign: 'center',  },
    { field: "position_name", headerName:"Cargo", width: 180,  align:'left', headerAlign: 'center', },
    { field: "salary_base", headerName: "Salario Base", width: 130, editable: false, align:'center', headerAlign: 'center',},
    { field: "subsidy", headerName: "Subsidio", width: 130, editable: false, align:'center', headerAlign: 'center',},
    { field: "overtime50", headerName: "Horas Extras 50%", width: 135, editable: true, align:'center', headerAlign: 'center',},
    { field: "overtime100", headerName: "Horas Extras 100%", width: 140, editable: true,  align:'center', headerAlign: 'center',},
    { field: "bonus", headerName: "Bonus", width: 100, editable: true, align:'center', headerAlign: 'center',},
    { field: "absences",  headerName: "Faltas", width: 100, editable: true, align:'center', headerAlign: 'center'},
    { field: "cash_advances",  headerName: "Adiantamentos", width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "backpay",  headerName: "Retroativos", width: 130, editable: true, align:'center', headerAlign: 'center',},
    // { field: "total_income",  headerName: "Rendimento Total", width: 130,  align:'center', headerAlign: 'center',},
    // { field: "irps",  headerName: "IRPS", width: 130,  align:'center', headerAlign: 'center',},
    // { field: "inss",  headerName: "INSS", width: 130, align:'center', headerAlign: 'center',},
    // { field: "salary_liquid",headerName: "Salario Liquido", width: 150, align:'center', headerAlign: 'center',},
    { field: "month",headerName: "MES", width: 100},
    { field: "year",headerName: "ANO", width: 70}
]
const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }
export const visible = {
    employee_name: true,
    departament_name: true,
    position_name: true,
    absences: true,
    overtime50: true,
    overtime100: true,
}

const ListInputPayroll = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    const [settings, setSettings] = useState({});

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("settings")
            if (response.data) {
                // response.data.absences === "true" ? visible.absences = true : visible.absences = false
                // response.data.overtime === "true" ? visible.overtime50 = true : visible.overtime50 = false
                // response.data.overtime === "true" ? visible.overtime100 = true : visible.overtime100 = false
    
                payrollInputColumns.map(data => {
                    // if (data.field === "employee_name")
                    // data.hide = true
                    // if (data.field === "departament_name")
                    // data.hide = true
                    // if (data.field === "position_name")
                    // data.hide = true
                    if (data.field === "absences")
                    response.data.absences === "true" ? data.hide = false : data.hide = true
                    if (data.field === "cash_advances")
                    response.data.cash_advances === "true" ? data.hide = false : data.hide = true
                    if (data.field === "backpay")
                    response.data.backpay === "true" ? data.hide = false : data.hide = true
                    if (data.field === "bonus")
                    response.data.bonus === "true" ? data.hide = false : data.hide = true
                    if (data.field === "subsidy")
                    response.data.subsidy === "true" ? data.hide = false : data.hide = true
                    if (data.field === "overtime50")
                    response.data.overtime === "true" ? data.hide = false : data.hide = true
                    if (data.field === "overtime100")
                    response.data.overtime === "true" ? data.hide = false : data.hide = true
                    })
                    console.log("Input", payrollInputColumns)
                setSettings(response.data)
                
            }
        }

            fetchData()
        }, [])

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("payrolls/input")
             console.log(listPath)
             console.log(response.data)
             console.log(response.data.data)

             response.data.map((data) => {
                data.salary_base = formatSalary().format(data.salary_base)
                data.subsidy = formatSalary().format(data.subsidy)
                data.bonus = formatSalary().format(data.bonus)
                data.cash_advances = formatSalary().format(data.cash_advances)
                data.backpay = formatSalary().format(data.backpay)
            })
            setUserRows(response.data)
        }
        fetchData()
      
    }, [listPath])

    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <DatatableInputPayroll listName={listName} listPath={listPath} columns={payrollInputColumns} userRows={userRows} setUserRows={setUserRows} settings={settings}/>
            </div>
        </div>
    )
}

// function formatSalary() {
//     return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
//   }

export default ListInputPayroll



