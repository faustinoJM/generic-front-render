import "./listOutputPayroll.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { useEffect, useState } from "react"
import api from "../../services/api"
import DatatableOutputPayroll from "../../components/datatable/DatatableOutputPayroll"
import { Link, useParams } from "react-router-dom"


const payrollOutputColumns = [
    { field: 'employee_id', headerName: 'ID', width: 70, pinnable: true, headerAlign: 'center',},
    { field: 'employee_name', headerName: 'Nome', width: 200, headerAlign: 'center',},
    { field: "department_name", headerName:"Departamento", width: 150,  align:'center', headerAlign: 'center', },
    { field: "position_name", headerName:"Cargo", width: 150,  align:'center', headerAlign: 'center', },
    { field: "salary_base", headerName: "Salario Base", width: 130, align:'center', headerAlign: 'center',},
    { field: "subsidy",  headerName: "Subsidio", width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_transport",  headerName: "Subsidio Transporte", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_food",  headerName: "Subsidio Alimentacao", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_residence",  headerName: "Subsidio Residencia", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_medical",  headerName: "Subsidio Medico", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_vacation",  headerName: "Subsidio de ferias", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "salary_thirteenth",  headerName: "Decimo Terceiro", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "bonus",  headerName: "Bonus", width: 130,  align:'center', headerAlign: 'center',},
    { field: "total_overtime", headerName: "Total Horas Extras", width: 135,  align:'center', headerAlign: 'center',},
    { field: "total_absences", headerName: "Total Desconto Faltas", width: 100, align:'center', headerAlign: 'center',},
    { field: "cash_advances",  headerName: "Emprestimos", width: 130,  align:'center', headerAlign: 'center',},
    { field: "backpay",  headerName: "Retroativos", width: 130,  align:'center', headerAlign: 'center',},
    { field: "total_income",  headerName: "Salario Bruto", width: 130,  align:'center', headerAlign: 'center',},
    { field: "irps",  headerName: "IRPS", width: 130,  align:'center', headerAlign: 'center',},
    { field: "syndicate_employee",  headerName: "Sindicato", width: 130, align:'center', headerAlign: 'center',},
    { field: "inss_employee",  headerName: "INSS (3%)", width: 130, align:'center', headerAlign: 'center',},
    { field: "inss_company",  headerName: "INSS (4%)", width: 130,  align:'center', headerAlign: 'center',},
    { field: "total_inss",  headerName: "Total INSS", width: 130,  align:'center', headerAlign: 'center',},
    { field: "salary_liquid",headerName: "Salario Liquido", width: 150, align:'center', headerAlign: 'center',},
    { field: "month",headerName: "MES", width: 100},
    { field: "year",headerName: "ANO", width: 70}
]

const payrollOutputColumnsEN = [
    { field: 'employee_id', headerName: 'ID', width: 70, pinnable: true, headerAlign: 'center',},
    { field: 'employee_name', headerName: 'Name', width: 200, headerAlign: 'center',},
    { field: "department_name", headerName:"Department", width: 150,  align:'center', headerAlign: 'center', },
    { field: "position_name", headerName:"Position", width: 150,  align:'center', headerAlign: 'center', },
    { field: "salary_base", headerName: "Base Salary", width: 130, align:'center', headerAlign: 'center',},
    { field: "subsidy",  headerName: "Subsidy", width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_transport",  headerName: "Transport Allowance", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_food",  headerName: "Food Allowance", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_residence",  headerName: "Residence Allowance", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_medical",  headerName: "Medical Allowance", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_vacation",  headerName: "Vacation Allowance", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "salary_thirteenth",  headerName: "Salary Thirtheen", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "bonus",  headerName: "Bonus", width: 130,  align:'center', headerAlign: 'center',},
    { field: "total_overtime", headerName: "Total Overtime", width: 135,  align:'center', headerAlign: 'center',},
    { field: "total_absences", headerName: "Total Absences", width: 100, align:'center', headerAlign: 'center',},
    { field: "cash_advances",  headerName: "Cash Advances", width: 130,  align:'center', headerAlign: 'center',},
    { field: "backpay",  headerName: "Backpay", width: 130,  align:'center', headerAlign: 'center',},
    { field: "total_income",  headerName: "Gross Salary", width: 130,  align:'center', headerAlign: 'center',},
    { field: "irps",  headerName: "IRPS", width: 130,  align:'center', headerAlign: 'center',},
    { field: "syndicate_employee",  headerName: "Syndicate", width: 130, align:'center', headerAlign: 'center',},
    { field: "inss_employee",  headerName: "INSS (3%)", width: 130, align:'center', headerAlign: 'center',},
    { field: "inss_company",  headerName: "INSS (4%)", width: 130,  align:'center', headerAlign: 'center',},
    { field: "total_inss",  headerName: "Total INSS", width: 130,  align:'center', headerAlign: 'center',},
    { field: "salary_liquid",headerName: "Liquid Salary", width: 150, align:'center', headerAlign: 'center',},
    { field: "month",headerName: "MONTH", width: 100},
    { field: "year",headerName: "YEAR", width: 70}
]

export const outputColumnVisible= {
    employee_id: true,
    employee_name: true,
    position_name: true,
    department_name: true,
    total_overtime: true,
    total_absences: true,
    cash_advances: true,
    bonus: true,
    backpay: true,
    syndicate_employee: true,
    subsidy: true,
    subsidy_transport: true,
    subsidy_food: true,
    subsidy_residence: true,
    subsidy_medical: true,
    subsidy_vacation: true,
    salary_thirteenth: true,
  };
  
const ListOutputPayroll = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true)
    const [active, setActive] = useState(true)
    const params = useParams()
    const [searchName, setSearchName] = useState("")
    const [columns,  setColumns] = useState(payrollOutputColumns)
    const [loadLang, SetLoadLang] = useState(false)

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("settings")
            if (response.data) {
                
                // response.data.column_position_name === "true" ? outputColumnVisible.position_name = true : outputColumnVisible.position_name = false
                // response.data.column_department_name === "true" ? outputColumnVisible.department_name = true : outputColumnVisible.department_name = true
                // response.data.column_absences === "true" ? outputColumnVisible.total_absences = true : outputColumnVisible.total_absences = false
                // response.data.column_overtime === "true" ? outputColumnVisible.total_overtime = true : outputColumnVisible.total_overtime = false
                // response.data.column_backpay === "true" ? outputColumnVisible.backpay = true : outputColumnVisible.backpay = false
                // response.data.column_cash_advances === "true" ? outputColumnVisible.cash_advances = true : outputColumnVisible.cash_advances = false
                // response.data.column_bonus === "true" ? outputColumnVisible.bonus = true : outputColumnVisible.bonus = false
                // response.data.column_syndicate === "true" ? outputColumnVisible.syndicate_employee = true : outputColumnVisible.syndicate_employee = false
                // response.data.column_subsidy === "true" ? outputColumnVisible.subsidy = true : outputColumnVisible.subsidy = false
                // response.data.column_subsidy_transport === "true" ? outputColumnVisible.subsidy_transport = true : outputColumnVisible.subsidy_transport = false
                // response.data.column_subsidy_food === "true" ? outputColumnVisible.subsidy_food = true : outputColumnVisible.subsidy_food = false
                // response.data.column_subsidy_residence === "true" ? outputColumnVisible.subsidy_residence = true : outputColumnVisible.subsidy_residence = false
                // response.data.column_subsidy_medical === "true" ? outputColumnVisible.subsidy_medical = true : outputColumnVisible.subsidy_medical = false
                // response.data.column_subsidy_vacation === "true" ? outputColumnVisible.subsidy_vacation = true : outputColumnVisible.subsidy_vacation = false
                // response.data.column_salary_thirteenth === "true" ? outputColumnVisible.salary_thirteenth = true : outputColumnVisible.salary_thirteenth = false
                payrollOutputColumns.map(data => {
                    if (data.field === "employee_name") {
                        // response.data.language_options === "en" ? data.headerName = "Name" : data.headerName = data.headerName
                    }
                    if (data.field === "position_name") {
                        response.data.column_position_name === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Position" : data.headerName = data.headerName
                    }
                    if (data.field === "department_name") {
                        response.data.column_department_name === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Department" : data.headerName = data.headerName
                    }
                    if (data.field === "total_absences") {
                        response.data.column_absences === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Total Absences" : data.headerName = data.headerName
                    }
                    if (data.field === "cash_advances") {
                        response.data.column_cash_advances === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Cash Advances" : data.headerName = data.headerName
                    }
                    if (data.field === "total_overtime") {
                        response.data.column_overtime === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Total Overtime" : data.headerName = data.headerName
                    }
                    if (data.field === "backpay") {
                        response.data.column_backpay === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Backpay" : data.headerName = data.headerName
                    }
                    if (data.field === "bonus") {
                        response.data.column_bonus === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Bonus" : data.headerName = data.headerName
                    }
                    if (data.field === "syndicate_employee") {
                        response.data.column_syndicate === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Syndicate Employee" : data.headerName = data.headerName
                    }
                    if (data.field === "subsidy") {
                        response.data.column_subsidy === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Subsidy" : data.headerName = data.headerName
                    }
                    if (data.field === "subsidy_transport") {
                        response.data.column_subsidy_transport === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Transport Allowance" : data.headerName = data.headerName
                    }
                    if (data.field === "subsidy_food") {
                        response.data.column_subsidy_food === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Food Allowance" : data.headerName = data.headerName
                    }
                    if (data.field === "subsidy_residence") {
                        response.data.column_subsidy_residence === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Residence Allowance" : data.headerName = data.headerName
                    }
                    if (data.field === "subsidy_medical") {
                        response.data.column_subsidy_medical === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Medical Allowance" : data.headerName = data.headerName
                    }
                    if (data.field === "subsidy_vacation") {
                        response.data.column_subsidy_vacation === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Vacation Allowance" : data.headerName = data.headerName
                    }
                    if (data.field === "salary_thirteenth") {
                        response.data.column_salary_thirteenth === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Salary thirteenth" : data.headerName = data.headerName
                    }
                    if (data.field === "salary_fourteenth") {
                        response.data.column_salary_thirteenth === "true" ? data.hide = false : data.hide = true
                        // response.data.language_options === "en" ? data.headerName = "Salary Fourteenth" : data.headerName = data.headerName
                    }
                    if (data.field === "salary_base") {
                        // response.data.language_options === "en" ? data.headerName = "Base Salary" : data.headerName = data.headerName
                    }
                    if (data.field === "total_income") {
                        // response.data.language_options === "en" ? data.headerName = "Gross Salary" : data.headerName = data.headerName
                    }
                    if (data.field === "salary_liquid") {
                        // response.data.language_options === "en" ? data.headerName = "Net Salary" : data.headerName = data.headerName
                    }
                    if (data.field === "month") {
                        // response.data.language_options === "en" ? data.headerName = "Month" : data.headerName = data.headerName
                    }
                    if (data.field === "year") {
                        // response.data.language_options === "en" ? data.headerName = "Year" : data.headerName = data.headerName
                    }

                    response.data.language_options === "en" ? setColumns(payrollOutputColumnsEN) : setColumns(payrollOutputColumns)
                })
                    console.log("output", payrollOutputColumns)
                    console.log("output", params.payrollId)

                setSettings(response.data)
            }
        }

            fetchData()
        }, [loadLang])
        
    useEffect(() => {
        async function fetchData() {
            const response = await api.get(`${listPath}/output/${params.payrollId}`)
            console.log("output2", response.data)

            let totalLiquid = 0
            let totalBase = 0
            let totalIrps = 0
            let totalGross = 0
            let totalInss = 0
            let totalInssCompany = 0
            let totalInssEmployee = 0
            let totalLength = 0
            let total_cash_advances = 0
            let total_subsidy = 0
            let total_bonus = 0
            let total_backpay = 0
            let total_total_absences = 0
            let total_total_overtime = 0
            let total_syndicate_employee = 0

            // response.data = response.data.filter(data => data.payroll_id === params.payrollId)

            totalLength = response.data.map((data, index) => {
                totalLiquid += (+data.salary_liquid)
                totalBase += (+data.salary_base)
                totalGross += (+data.total_income)
                totalIrps += (+data.irps)
                totalInss += (+data.total_inss)
                totalInssCompany += (+data.inss_company)
                totalInssEmployee += (+data.inss_employee)
                total_cash_advances += (+data.cash_advances)
                total_subsidy += (+data.subsidy)
                total_bonus += (+data.bonus)
                total_backpay += (+data.backpay)
                total_total_absences += (+data.total_absences)
                total_total_overtime += (+data.total_overtime)
                total_syndicate_employee += (+data.syndicate_employee)
             })
             
             response.data.map((data, index) => {
                data.employee_id = index + 1
                data.salary_base = formatSalary().format(data.salary_base)
                data.salary_liquid = formatSalary().format(data.salary_liquid)
                data.total_income = formatSalary().format(data.total_income)
                data.irps = formatSalary().format(data.irps)
                data.inss_employee = formatSalary().format(data.inss_employee)
                data.subsidy = formatSalary().format(data.subsidy)
                data.bonus = formatSalary().format(data.bonus)
                data.cash_advances = formatSalary().format(data.cash_advances)
                data.backpay = formatSalary().format(data.backpay)
                data.total_absences = formatSalary().format(data.total_absences)
                data.total_overtime = formatSalary().format(data.total_overtime)
                data.inss_company = formatSalary().format(data.inss_company)
                data.total_inss = formatSalary().format(data.total_inss)
                data.syndicate_employee = formatSalary().format(data.syndicate_employee)
                data.subsidy_food = formatSalary().format(data.subsidy_food)
                data.subsidy_transport = formatSalary().format(data.subsidy_transport)
                data.subsidy_residence = formatSalary().format(data.subsidy_residence)
                data.subsidy_medical = formatSalary().format(data.subsidy_medical)
                data.subsidy_vacation = formatSalary().format(data.subsidy_vacation)
                data.salary_thirteenth = formatSalary().format(data.salary_thirteenth)
            })

            const totalRow = [
                {
                    id: "totalId",
                    employee_id: totalLength.length + 1,
                    employee_name: "Total",
                    department_name: "", 
                    position_name: "", 
                    salary_base: formatSalary().format(totalBase), 
                    subsidy: formatSalary().format(total_subsidy), 
                    bonus: formatSalary().format(total_bonus), 
                    total_overtime: formatSalary().format(total_total_overtime), 
                    total_absences: formatSalary().format(total_total_absences), 
                    cash_advances: formatSalary().format(total_cash_advances), 
                    backpay: formatSalary().format(total_backpay), 
                    total_income: formatSalary().format(totalGross), 
                    irps: formatSalary().format(totalIrps), 
                    inss_employee: formatSalary().format(totalInssEmployee), 
                    salary_liquid: formatSalary().format(totalLiquid), 
                    inss_company: formatSalary().format(totalInssCompany), 
                    total_inss: formatSalary().format(totalInss), 
                    syndicate_employee: formatSalary().format(total_syndicate_employee)
                }
            ]
            if (response.status === 200) {
                setLoading(false)
            }
            // setUserRows(response.data.concat(totalRow))
            console.log("::", searchName)
            setUserRows(response.data.filter(data => {
                if (searchName === "")
                    return data
                else if (data.employee_name.toLowerCase().includes(searchName.toLocaleLowerCase()))
                    return data
            }).concat(totalRow))
            console.log("output", response.data)

        }
        fetchData()
      
    }, [listPath, searchName])

    return (
        <div className="list">
            {/* {console.log(userRows)} */}
            <Sidebar active={active} setActiv={setActive}/>
            <div className="listContainer">
                <Navbar searchName={searchName} setSearchName={setSearchName} SetLoadLang={SetLoadLang}/>
                <DatatableOutputPayroll listName={listName} listPath={listPath} 
                    columns={columns} userRows={userRows} setUserRows={setUserRows} 
                    active={loading} setLoading={setLoading} settings={settings} 
                    payrollId={params.payrollId}
                    searchName={searchName} setSearchName={setSearchName}
                    />
            </div>
        </div>
    )
}

function formatSalary() {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }

export default ListOutputPayroll

