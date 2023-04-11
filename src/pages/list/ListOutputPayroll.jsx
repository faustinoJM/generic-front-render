import "./listOutputPayroll.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { useEffect, useState } from "react"
import api from "../../services/api"
import DatatableOutputPayroll from "../../components/datatable/DatatableOutputPayroll"

const payrollColumns = [
    { field: 'employee_id', headerName: 'ID', width: 70, pinnable: true, headerAlign: 'center',},
    { field: 'employee_name', headerName: 'Nome', width: 200, headerAlign: 'center',},
    { field: "departament_name", headerName:"Departamento", width: 150,  align:'center', headerAlign: 'center', },
    { field: "position_name", headerName:"Cargo", width: 150,  align:'center', headerAlign: 'center', },
    { field: "salary_base", headerName: "Salario Base", width: 130, align:'center', headerAlign: 'center',},
    { field: "subsidy",  headerName: "Subsidio", width: 130,  align:'center', headerAlign: 'center',},
    { field: "bonus",  headerName: "Bonus", width: 130,  align:'center', headerAlign: 'center',},
    { field: "total_overtime", headerName: "Total Horas Extras", width: 135,  align:'center', headerAlign: 'center',},
    { field: "total_absences", headerName: "Total Desconto Faltas", width: 100, align:'center', headerAlign: 'center',},
    { field: "cash_advances",  headerName: "Adiantamentos", width: 130,  align:'center', headerAlign: 'center',},
    { field: "backpay",  headerName: "Retroativos", width: 130,  align:'center', headerAlign: 'center',},
    { field: "total_income",  headerName: "Salario Bruto", width: 130,  align:'center', headerAlign: 'center',},
    { field: "irps",  headerName: "IRPS", width: 130,  align:'center', headerAlign: 'center',},
    { field: "inss_employee",  headerName: "INSS (3%)", width: 130, align:'center', headerAlign: 'center',},
    { field: "salary_liquid",headerName: "Salario Liquido", width: 150, align:'center', headerAlign: 'center',},
    { field: "inss_company",  headerName: "INSS (4%)", width: 130,  align:'center', headerAlign: 'center',},
    { field: "total_inss",  headerName: "Total INSS", width: 130,  align:'center', headerAlign: 'center',},
    { field: "month",headerName: "MES", width: 100},
    { field: "year",headerName: "ANO", width: 70}
]

export const outputColumnVisible= {
    employee_id: true,
    total_overtime: true,
    total_absences: true,
    cash_advances: true,
    bonus: true,
    subsidy: true,
    backpay: true
  };
  
const ListOutputPayroll = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    const [settings, setSettings] = useState({});
    const [month2, setMonth2] = useState()
    const [year2, setYear2] = useState()

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("settings")
            if (response.data) {
                // response.data.absences === "true" ? visible.absences = true : visible.absences = false
                // response.data.overtime === "true" ? visible.bonus = true : visible.overtime50 = false
                // response.data.overtime === "true" ? visible.overtime100 = true : visible.overtime100 = false
    
                // payrollColumns.map(data => {
                //     // if (data.field === "employee_name")
                //     // data.hide = true
                //     // if (data.field === "departament_name")
                //     // data.hide = true
                //     // if (data.field === "position_name")
                //     // data.hide = true
                //     if (data.field === "total_absences")
                //     response.data.absences === "true" ? data.hide = false : data.hide = true
                //     if (data.field === "total_overtime")
                //     response.data.overtime === "true" ? data.hide = false : data.hide = true
                //     if (data.field === "backpay")
                //     response.data.backpay === "true" ? data.hide = false : data.hide = true
                //     if (data.field === "cash_advances")
                //     response.data.cash_advances === "true" ? data.hide = false : data.hide = true
                //     if (data.field === "bonus")
                //     response.data.bonus === "true" ? data.hide = false : data.hide = true
                //     if (data.field === "subsidy")
                //     response.data.subsidy === "true" ? data.hide = false : data.hide = true
                //     // if (data.field === "overtime100")
                //     // response.data.overtime === "true" ? data.hide = false : data.hide = true
                //     })
                response.data.absences === "true" ? outputColumnVisible.total_absences = true : outputColumnVisible.total_absences = false
                response.data.overtime === "true" ? outputColumnVisible.total_overtime = true : outputColumnVisible.total_overtime = false
                response.data.backpay === "true" ? outputColumnVisible.backpay = true : outputColumnVisible.backpay = false
                response.data.cash_advances === "true" ? outputColumnVisible.cash_advances = true : outputColumnVisible.cash_advances = false
                response.data.bonus === "true" ? outputColumnVisible.bonus = true : outputColumnVisible.bonus = false
                response.data.subsidy === "true" ? outputColumnVisible.subsidy = true : outputColumnVisible.subsidy = false
                    // console.log("Input", payrollColumns)
                setSettings(response.data)
                
            }
        }

            fetchData()
        }, [])
    useEffect(() => {
        async function fetchData() {
            const response = await api.get(`${listPath}`)
            //  console.log(listPath)
            //  console.log(response.data)
            //  console.log(response.data.data)

            let totalLiquid = 0
            let totalBase = 0
            let totalIrps = 0
            let totalGross = 0
            let totalInss = 0
            let totalInssCompany = 0
            let totalInssEmployee = 0
            let totalLength = 0
            let monthGreater = 0
            let yearGreater = 0
            let dateAux = new Date("2000/12/31")

            totalLength = response.data.map((data, index) => {
                totalLiquid += (+data.salary_liquid)
                totalBase += (+data.salary_base)
                totalGross += (+data.total_income)
                totalIrps += (+data.irps)
                totalInss += (+data.inss_company) + (+data.inss_employee)
                totalInssCompany += (+data.inss_company)
                totalInssEmployee += (+data.inss_employee)
                
                if (dateAux.getTime() < new Date(data.created_at).getTime()) {
                    monthGreater = data.month
                    yearGreater = data.year
                    dateAux = new Date(data.created_at)
                }
             })
             setYear2(yearGreater)
             setMonth2(monthGreater)
             console.log(monthGreater, yearGreater)

             response.data.map((data, index) => {
                data.employee_id = index + 1
                data.salary_base = formatSalary().format(data.salary_base)
                data.salary_liquid = formatSalary().format(data.salary_liquid)
                data.total_income = formatSalary().format(data.total_income)
                data.irps = formatSalary().format(data.irps)
                data.inss_employee = formatSalary().format(data.inss_employee)
                data.inss_company = formatSalary().format(data.inss_company)
                data.total_overtime = formatSalary().format(data.total_overtime)
                data.subsidy = formatSalary().format(data.subsidy)
                data.bonus = formatSalary().format(data.bonus)
                data.backpay = formatSalary().format(data.backpay)
                data.total_absences = formatSalary().format(data.total_absences)
                data.cash_advances = formatSalary().format(data.cash_advances)
                data.base_day = formatSalary().format(data.base_day)
                data.base_hour = formatSalary().format(data.base_hour)
                data.total_inss = formatSalary().format(data.total_inss)
            })
            const totalRow = [
                {
                id: "totalId",
                employee_id: totalLength.length + 1,
                employee_name: "Total",
                departament_name: "", 
                position_name: "", 
                salary_base: formatSalary().format(totalBase), 
                subsidy: "", 
                bonus: "", 
                total_overtime: "", 
                total_absences: "", 
                cash_advances: "", 
                backpay: "", 
                total_income: formatSalary().format(totalGross), 
                irps: formatSalary().format(totalIrps), 
                inss_employee: formatSalary().format(totalInssEmployee), 
                salary_liquid: formatSalary().format(totalLiquid), 
                inss_company: formatSalary().format(totalInssCompany), 
                total_inss: formatSalary().format(totalInss), 
            }
        ]
            setUserRows(response.data.concat(totalRow))
            // console.log("1")
        }
        fetchData()
      
    }, [listPath])

    return (
        <div className="list">
            {/* {console.log(userRows)} */}
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <DatatableOutputPayroll listName={listName} listPath={listPath} 
                    columns={payrollColumns} userRows={userRows} setUserRows={setUserRows} 
                    settings={settings} outputColumnVisible={outputColumnVisible}
                    year2={year2} month2={month2} setMonth2={setMonth2} setYear2={setYear2}
                    />
            </div>
        </div>
    )
}

function formatSalary() {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }

export default ListOutputPayroll

