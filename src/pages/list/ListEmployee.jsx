import "./listEmployee.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { useEffect, useState } from "react"
import api from "../../services/api"
import { compareAsc, format } from 'date-fns'
import DatatableEmployee from "../../components/datatable/DatatableEmployee"


const employeeColumns = [
    { field: 'employee_id', headerName: 'ID', width: 70, pinnable: true },
    { field: 'name', headerName: 'Nome', width: 200, editable: true, align:'left', headerAlign: 'center'},
    { field: "birth_date", headerName:"Data Nascimento", width: 160,  },
    { field: "gender", headerName: "Genero", width: 130, align:'center', headerAlign: 'center' },
    // { field: "address", headerName: "Endereco", width: 130, align:'center', headerAlign: 'center' },
    { field: "contact", headerName: "Contacto", width: 130, align:'center', headerAlign: 'center' },
    // { field: "email",  headerName: "Email", width: 100, align:'center', headerAlign: 'center' },
    // { field: "nuit",  headerName: "NUIT", width: 130, align:'center', headerAlign: 'center' },
    { field: "dependents",  headerName: "Dependentes", width: 120, align:'center', headerAlign: 'center' },
    { field: "salary",  headerName: "Salario Base", width: 130, align:'center', headerAlign: 'center' },
    { field: "subsidy",  headerName: "Subsidio", width: 100, align:'center', headerAlign: 'center' },
    // { field: "bank_name",headerName: "Nome do Banco", width: 130, align:'center', headerAlign: 'center' },
    // { field: "bank_account",headerName: "Numero da Conta", width: 130, align:'center', headerAlign: 'center' },
    // { field: "nib",headerName: "NIB", width: 50, align:'center', headerAlign: 'center' ,},
    // { field: "social_security",headerName: "Numero Seg. Social", width: 130, align:'center', headerAlign: 'center'},
    { field: "start_date",headerName: "Data Inicio", width: 100,align:'center', headerAlign: 'center' },
    { field: "end_date",headerName: "Data Fim", width: 100, align:'center', headerAlign: 'center' },
    { field: "employee_status",headerName: "Estado", width: 70, align:'center', headerAlign: 'center'}
]

const formatSalary = new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  
const formatDate = new Intl.DateTimeFormat("pt-br", { dateStyle: 'short'})  

const ListEmployee = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    const [loading, setLoading] = useState(true)
    const [searchName, setSearchName] = useState("")

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("settings")
            if (response.data) {

                employeeColumns.map(data => {
                    if (data.field === "name") {
                        response.data.language_options === "en" ? data.headerName = "Name" : data.headerName = data.headerName
                    }
                    if (data.field === "birth_date") {
                        response.data.language_options === "en" ? data.headerName = "Birth Data" : data.headerName = data.headerName
                    }
                    if (data.field === "gender") {
                        response.data.language_options === "en" ? data.headerName = "Gender" : data.headerName = data.headerName
                    }
                    if (data.field === "contact") {
                        response.data.language_options === "en" ? data.headerName = "Contact" : data.headerName = data.headerName
                    }
                    if (data.field === "dependents") {
                        response.data.language_options === "en" ? data.headerName = "Dependents" : data.headerName = data.headerName
                    }
                    if (data.field === "salary") {
                            response.data.language_options === "en" ? data.headerName = "Salary" : data.headerName = data.headerName
                    }
                    if (data.field === "subsidy") {
                        response.data.language_options === "en" ? data.headerName = "Subsidy" : data.headerName = data.headerName
                    }
                    if (data.field === "start_date") {
                        response.data.language_options === "en" ? data.headerName = "Start Date" : data.headerName = data.headerName
                    }
                    if (data.field === "end_date") {
                        response.data.language_options === "en" ? data.headerName = "End Date" : data.headerName = data.headerName
                    }
                    if (data.field === "employee_status") {
                        response.data.language_options === "en" ? data.headerName = "Employee Status" : data.headerName = data.headerName
                    }
                    })
            }
        }

            fetchData()
        }, [])
 
    useEffect(() => {
        async function fetchData() {
            const response = await api.get(listPath)
             console.log(listPath)
             console.log(response.data)
            //  console.log(response.data.data)

            response.data.map(user => {
                user.salary = formatSalary.format(user.salary)
                user.subsidy = formatSalary.format(user.subsidy)
                let birth_date = new Date(user.birth_date)
                let start_date = new Date(user.start_date)
                // let date = format(new Date(user.birth_date), 'yyyy-MM-dd')
                user.birth_date = formatDate.format(birth_date)
                user.start_date = formatDate.format(start_date)
                // console.log(user.birth_date)

            })
            if (response.status === 200) {
                setLoading(false)
            }
            // setUserRows(response.data)

            setUserRows(response.data.filter(data => {
                if (searchName === "")
                    return data
                else if (data.name.toLowerCase().includes(searchName.toLocaleLowerCase()))
                    return data
            }))
        }
        fetchData()
      
    }, [listPath, searchName])

    // useEffect(() => {
    //     console.log("ListEmp", searchName)
    //     setUserRows(userRows.filter(data => {
    //         if (searchName === "")
    //             return data
    //         else if (data.name.toLowerCase().includes(searchName.toLocaleLowerCase()))
    //             return data
    //     }))
    // }, [searchName])

    return (
        <div className="list">
            <Sidebar/>
            {console.log("Pora",searchName)}
            <div className="listContainer">
                <Navbar searchName={searchName} setSearchName={setSearchName}/>
                <DatatableEmployee listName={listName} listPath={listPath} 
                columns={employeeColumns} userRows={userRows} setUserRows={setUserRows}
                loading={loading} setLoading={setLoading}
                searchName={searchName} setSearchName={setSearchName}/>
            </div>
        </div>
    )
}


export default ListEmployee

// function formatSalary() {
//     return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
//   }
// function formatDate() {
//     return new Intl.DateTimeFormat("pt-br", { dateStyle: 'short'})
//   }