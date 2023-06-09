import "./listEmployee.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { useEffect, useState } from "react"
import api from "../../services/api"
import DatatableInputPayroll from "../../components/datatable/DatatableInputPayroll"
import { Link, useParams } from "react-router-dom"

const payrollInputColumns = [
    { field: 'employee_id', headerName: 'ID', width: 70, align:'center', headerAlign: 'center', hide: true},
    { field: 'employee_name', headerName: 'Nome', width: 200,align:'left', headerAlign: 'center', },
    // { field: "dependents", headerName:"Dependentes", width: 120,  align:'center', headerAlign: 'center', },
    { field: "department_name", headerName:"Departamento", width: 180,  align:'left', headerAlign: 'center',  },
    { field: "position_name", headerName:"Cargo", width: 180,  align:'left', headerAlign: 'center', },
    { field: "salary_base", headerName: "Salario Base", width: 130, editable: false, align:'center', headerAlign: 'center',},
    { field: "subsidy", headerName: "Subsidio", width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "subsidy_transport",  headerName: "Subsidio Transporte", hide: true, width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "subsidy_food",  headerName: "Subsidio Alimentacao", hide: true, width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "subsidy_residence",  headerName: "Subsidio Residencia", hide: true, width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "subsidy_medical",  headerName: "Subsidio Medico", hide: true, width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "subsidy_vacation",  headerName: "Subsidio de Ferias", hide: true, width: 130, editable: true,   align:'center', headerAlign: 'center',},
    { field: "subsidy_shift",  headerName: "Subsidio de Turno", hide: true, editable: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_night",  headerName: "Subsidio Noturno", hide: true, editable: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_risk",  headerName: "Subsidio  de Riso", hide: true, editable: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_attendance",  headerName: "Subsidio  de Assiduidade", hide: true, editable: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_performance",  headerName: "Subsidio  de Desempenho", hide: true, editable: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_leadership",  headerName: "Subsidio  de Chefia", hide: true, editable: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_commission",  headerName: "Comissao", hide: true, editable: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "overtime50", headerName: "Horas Extras 50%", width: 135, editable: true, align:'center', headerAlign: 'center',},
    { field: "overtime100", headerName: "Horas Extras 100%", width: 140, editable: true,  align:'center', headerAlign: 'center',},
    { field: "bonus", headerName: "Bonus", width: 100, editable: true, align:'center', headerAlign: 'center',},
    { field: "absences",  headerName: "Faltas", width: 100, editable: true, align:'center', headerAlign: 'center'},
    { field: "cash_advances",  headerName: "Emprestimos", width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "backpay",  headerName: "Retroativos", width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "ipa_employee",  headerName: "IPA", width: 130, hide: true, editable: true, align:'center', headerAlign: 'center',},
    { field: "salary_thirteenth",  headerName: "Decimo Terceiro", width: 130, editable: true,   align:'center', headerAlign: 'center',},
    // { field: "total_income",  headerName: "Rendimento Total", width: 130,  align:'center', headerAlign: 'center',},
    // { field: "irps",  headerName: "IRPS", width: 130,  align:'center', headerAlign: 'center',},
    // { field: "inss",  headerName: "INSS", width: 130, align:'center', headerAlign: 'center',},
    // { field: "salary_liquid",headerName: "Salario Liquido", width: 150, align:'center', headerAlign: 'center',},
    { field: "month",headerName: "MES", width: 100},
    { field: "year",headerName: "ANO", width: 70}
]

const payrollInputColumnsEN = [
    { field: 'employee_id', headerName: 'ID', width: 70, align:'center', headerAlign: 'center', hide: true},
    { field: 'employee_name', headerName: 'Name', width: 200,align:'left', headerAlign: 'center', },
    // { field: "dependents", headerName:"Dependentes", width: 120,  align:'center', headerAlign: 'center', },
    { field: "department_name", headerName:"Department", width: 180,  align:'left', headerAlign: 'center',  },
    { field: "position_name", headerName:"Position", width: 180,  align:'left', headerAlign: 'center', },
    { field: "salary_base", headerName: "Base Salary", width: 130, editable: false, align:'center', headerAlign: 'center',},
    { field: "subsidy", headerName: "Subsidy", width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "subsidy_transport",  headerName: "Transport Allowance", hide: true, width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "subsidy_food",  headerName: "Food Allowance", hide: true, width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "subsidy_residence",  headerName: "Residence Allowance", hide: true, width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "subsidy_medical",  headerName: "Medical Allowance", hide: true, width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "subsidy_vacation",  headerName: "Vacation Allowance",hide: true,  width: 130, editable: true,   align:'center', headerAlign: 'center',},
    { field: "subsidy_shift",  headerName: "Shift Allowance", hide: true, editable: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_night",  headerName: "Night Allowance", hide: true, editable: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_risk",  headerName: "Risk Allowance", hide: true, editable: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_attendance",  headerName: "Attendance Allowance", hide: true, editable: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_performance",  headerName: "Performance Allowance", hide: true, editable: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_leadership",  headerName: "Leadership Allowance", hide: true,  editable: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_commission",  headerName: "Comission", hide: true, editable: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "overtime50", headerName: "Overtime 50%", width: 135, editable: true, align:'center', headerAlign: 'center',},
    { field: "overtime100", headerName: "Overtime 100%", width: 140, editable: true,  align:'center', headerAlign: 'center',},
    { field: "bonus", headerName: "Bonus", width: 100, editable: true, align:'center', headerAlign: 'center',},
    { field: "absences",  headerName: "Absences", width: 100, editable: true, align:'center', headerAlign: 'center'},
    { field: "cash_advances",  headerName: "Cash Advances", width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "backpay",  headerName: "Backpay", width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "ipa_employee",  headerName: "IPA", hide: true, width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "salary_thirteenth",  headerName: "Salary Thirteenth", width: 130, editable: true,   align:'center', headerAlign: 'center',},
    // { field: "total_income",  headerName: "Rendimento Total", width: 130,  align:'center', headerAlign: 'center',},
    // { field: "irps",  headerName: "IRPS", width: 130,  align:'center', headerAlign: 'center',},
    // { field: "inss",  headerName: "INSS", width: 130, align:'center', headerAlign: 'center',},
    // { field: "salary_liquid",headerName: "Salario Liquido", width: 150, align:'center', headerAlign: 'center',},
    { field: "month",headerName: "Month", width: 100},
    { field: "year",headerName: "Year", width: 70}
]

const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }
export const visible = {
    employee_name: true,
    department_name: true,
    position_name: true,
    absences: true,
    overtime50: true,
    overtime100: true,
}

const ListInputPayroll = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true)
    const [loadLang, SetLoadLang] = useState(false)
    const [searchName, setSearchName] = useState("")
    const [columns,  setColumns] = useState(payrollInputColumns)
    const params = useParams()

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("settings")
            if (response.data) {
                // response.data.absences === "true" ? visible.absences = true : visible.absences = false
                // response.data.overtime === "true" ? visible.overtime50 = true : visible.overtime50 = false
                // response.data.overtime === "true" ? visible.overtime100 = true : visible.overtime100 = false
    
                // payrollInputColumns.map(data => {
                //     if (data.field === "employee_name") {
                //         // response.data.language_options === "en" ? data.headerName = "Name" : data.headerName = data.headerName
                //     }
                //     if (data.field === "position_name") {
                //         response.data.column_position_name === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Position" : data.headerName = data.headerName
                //     }
                //     if (data.field === "department_name") {
                //         response.data.column_department_name === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Department" : data.headerName = data.headerName
                //     }
                //     if (data.field === "absences") {
                //         response.data.column_absences === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Absences" : data.headerName = data.headerName
                //     }
                //     if (data.field === "cash_advances") {
                //         response.data.column_cash_advances === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Cash Advances" : data.headerName = data.headerName
                //     }
                //     if (data.field === "overtime50") {
                //         response.data.column_overtime === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Overtime 50%" : data.headerName = data.headerName
                //     }
                //     if (data.field === "overtime100") {
                //             response.data.column_overtime === "true" ? data.hide = false : data.hide = true
                //             // response.data.language_options === "en" ? data.headerName = "Overtime 100%" : data.headerName = data.headerName
                //     }
                //     if (data.field === "backpay") {
                //         response.data.column_backpay === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Backpay" : data.headerName = data.headerName
                //     }
                //     if (data.field === "bonus") {
                //         response.data.column_bonus === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Bonus" : data.headerName = data.headerName
                //     }
                //     if (data.field === "subsidy") {
                //         response.data.column_subsidy === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Subsidy" : data.headerName = data.headerName
                //     }
                //     if (data.field === "subsidy_transport") {
                //         response.data.column_subsidy_transport === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Transport Allowance" : data.headerName = data.headerName
                //     }
                //     if (data.field === "subsidy_food") {
                //         response.data.column_subsidy_food === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Food Allowance" : data.headerName = data.headerName
                //     }
                //     if (data.field === "subsidy_residence") {
                //         response.data.column_subsidy_residence === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Residence Allowance" : data.headerName = data.headerName
                //     }
                //     if (data.field === "subsidy_medical") {
                //         response.data.column_subsidy_medical === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Medical Allowance" : data.headerName = data.headerName
                //     }
                //     if (data.field === "subsidy_vacation") {
                //         response.data.column_subsidy_vacation === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Vacation Allowance" : data.headerName = data.headerName
                //     }
                //     if (data.field === "salary_thirteenth") {
                //         response.data.column_salary_thirteenth === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Salary Thirteenth" : data.headerName = data.headerName
                //     }
                //     if (data.field === "salary_fourteenth") {
                //         response.data.column_salary_thirteenth === "true" ? data.hide = false : data.hide = true
                //         // response.data.language_options === "en" ? data.headerName = "Salary Fourteenth" : data.headerName = data.headerName
                //     }
                //     if (data.field === "salary_base") {
                //         // response.data.language_options === "en" ? data.headerName = "Base Salary" : data.headerName = data.headerName
                //     }
                //     if (data.field === "month") {
                //         // response.data.language_options === "en" ? data.headerName = "Month" : data.headerName = data.headerName
                //     }
                //     if (data.field === "year") {
                //         // response.data.language_options === "en" ? data.headerName = "Year" : data.headerName = data.headerName
                //     }

                //     response.data.language_options === "en" ? setColumns(payrollInputColumnsEN) : setColumns(payrollInputColumns)
                // })
                // console.log("111232", response.data)
                payroll_hide_column(payrollInputColumnsEN, response.data)
                payroll_hide_column(payrollInputColumns, response.data)
                response.data.language_options === "en" ? setColumns(payrollInputColumnsEN) : setColumns(payrollInputColumns)

                    // console.log("Input", payrollInputColumns)
                setSettings(response.data)
            }
        }

            fetchData()
    }, [loadLang])

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("settings")
            if (response.data) {
                
                payroll_hide_column(payrollInputColumnsEN, response.data)
                payroll_hide_column(payrollInputColumns, response.data)
                response.data.language_options === "en" ? setColumns(payrollInputColumnsEN) : setColumns(payrollInputColumns)

                setSettings(response.data)
            }
        }

            fetchData()
    }, [])

    useEffect(() => {
        async function fetchData() {
            const response = await api.get(`payrolls/input/${params.payrollId}`)
            // let response 
            // if (params.payrollId)
            //     response = await api.get(`payrolls/input/${params.payrollId}`)
            // else 
            //     response = await api.get(`payrolls`)
                
             console.log(listPath)
             console.log(response.data)
            //  console.log(response.data.data)

             response.data.map((data) => {
                data.salary_base = formatSalary().format(data.salary_base)
                // data.overtime50 = formatSalary().format(data.overtime50)
                // data.overtime100 = formatSalary().format(data.overtime100)
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
                data.subsidy_transport = formatSalary().format(data.subsidy_transport)
                data.subsidy_food = formatSalary().format(data.subsidy_food)
                data.subsidy_residence = formatSalary().format(data.subsidy_residence)
                data.subsidy_medical = formatSalary().format(data.subsidy_medical)
                data.subsidy_vacation = formatSalary().format(data.subsidy_vacation)
                data.subsidy_shift = formatSalary().format(data.subsidy_shift)
                data.subsidy_night = formatSalary().format(data.subsidy_night)
                data.subsidy_risk = formatSalary().format(data.subsidy_risk)
                data.subsidy_attendance = formatSalary().format(data.subsidy_attendance)
                data.subsidy_performance = formatSalary().format(data.subsidy_performance)
                data.subsidy_leadership = formatSalary().format(data.subsidy_leadership)
                data.subsidy_commission = formatSalary().format(data.subsidy_commission)
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
                <Navbar searchName={searchName} setSearchName={setSearchName} SetLoadLang={SetLoadLang}/>
                <DatatableInputPayroll listName={listName} listPath={listPath} columns={columns} 
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

export default ListInputPayroll


const payroll_hide_column = (payrollColumns, responseData) => {
     payrollColumns.map(data => {
        if (data.field === "employee_name") {
            // response.data.language_options === "en" ? data.headerName = "Name" : data.headerName = data.headerName
        }
        if (data.field === "position_name") {
            responseData.column_position_name === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Position" : data.headerName = data.headerName
        }
        if (data.field === "department_name") {
            responseData.column_department_name === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Department" : data.headerName = data.headerName
        }
        if (data.field === "absences") {
            responseData.column_absences === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Absences" : data.headerName = data.headerName
        }
        if (data.field === "cash_advances") {
            responseData.column_cash_advances === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Cash Advances" : data.headerName = data.headerName
        }
        if (data.field === "overtime50") {
            responseData.column_overtime === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Overtime 50%" : data.headerName = data.headerName
        }
        if (data.field === "overtime100") {
            responseData.column_overtime === "true" ? data.hide = false : data.hide = true
                // response.data.language_options === "en" ? data.headerName = "Overtime 100%" : data.headerName = data.headerName
        }
        if (data.field === "backpay") {
            responseData.column_backpay === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Backpay" : data.headerName = data.headerName
        }
        if (data.field === "bonus") {
            responseData.column_bonus === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Bonus" : data.headerName = data.headerName
        }
        if (data.field === "subsidy") {
            responseData.column_subsidy === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Subsidy" : data.headerName = data.headerName
        }
        if (data.field === "subsidy_transport") {
            responseData.column_subsidy_transport === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Transport Allowance" : data.headerName = data.headerName
        }
        if (data.field === "subsidy_food") {
            responseData.column_subsidy_food === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Food Allowance" : data.headerName = data.headerName
        }
        if (data.field === "subsidy_residence") {
            responseData.column_subsidy_residence === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Residence Allowance" : data.headerName = data.headerName
        }
        if (data.field === "subsidy_medical") {
            responseData.column_subsidy_medical === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Medical Allowance" : data.headerName = data.headerName
        }
        if (data.field === "subsidy_vacation") {
            responseData.column_subsidy_vacation === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Vacation Allowance" : data.headerName = data.headerName
        }
        if (data.field === "subsidy_shift") {
            responseData.column_subsidy_shift === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Vacation Allowance" : data.headerName = data.headerName
        }
        if (data.field === "subsidy_night") {
            responseData.column_subsidy_night === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Vacation Allowance" : data.headerName = data.headerName
        }
        if (data.field === "subsidy_risk") {
            responseData.column_subsidy_risk === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Vacation Allowance" : data.headerName = data.headerName
        }
        if (data.field === "subsidy_attendance") {
            responseData.column_subsidy_attendance === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Vacation Allowance" : data.headerName = data.headerName
        }
        if (data.field === "subsidy_performance") {
            responseData.column_subsidy_performance === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Vacation Allowance" : data.headerName = data.headerName
        }
        if (data.field === "subsidy_leadership") {
            responseData.column_subsidy_leadership === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Vacation Allowance" : data.headerName = data.headerName
        }
        if (data.field === "subsidy_commission") {
            responseData.column_subsidy_commission === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Vacation Allowance" : data.headerName = data.headerName
        }
        if (data.field === "ipa_employee") {
            responseData.column_ipa_employee === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Vacation Allowance" : data.headerName = data.headerName
        }
        if (data.field === "salary_thirteenth") {
            responseData.column_salary_thirteenth === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Salary Thirteenth" : data.headerName = data.headerName
        }
        if (data.field === "salary_fourteenth") {
            responseData.column_salary_thirteenth === "true" ? data.hide = false : data.hide = true
            // response.data.language_options === "en" ? data.headerName = "Salary Fourteenth" : data.headerName = data.headerName
        }
        if (data.field === "salary_base") {
            // response.data.language_options === "en" ? data.headerName = "Base Salary" : data.headerName = data.headerName
        }
        if (data.field === "month") {
            // response.data.language_options === "en" ? data.headerName = "Month" : data.headerName = data.headerName
        }
        if (data.field === "year") {
            // response.data.language_options === "en" ? data.headerName = "Year" : data.headerName = data.headerName
        }

    })
}



