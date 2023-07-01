import "./listPayrolls.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { useEffect, useState } from "react"
import api from "../../services/api"
import DatatableListInput from "../../components/datatable/DatatableListPayrolls"

const payrollColumns = [
    { field: 'id', headerName: 'ID', width: 70, align:'center', headerAlign: 'center',},
    { field: 'month', headerName: 'MES', width: 150,align:'center', headerAlign: 'center',},
    // { field: "dependents", headerName:"Dependentes", width: 120,  align:'center', headerAlign: 'center', },
    { field: "year", headerName:"ANO", width: 180,  align:'center', headerAlign: 'center', },
    { field: "total_employee", headerName:"TOTAL FUNCIONARIOS", width: 180,  align:'center', headerAlign: 'center', },
]

const ListPayrolls = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    const [loading, setLoading] = useState(true)
    const [setting, setSetting] = useState(null)
    const [columns,  setColumns] = useState(payrollColumns)

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("settings")
            if (response.data) {

                payrollColumns.map(data => {
                    if (data.field === "month") {
                        response.data.language_options === "en" ? data.headerName = "MONTH" : data.headerName = data.headerName
                    }
                    if (data.field === "year") {
                        response.data.language_options === "en" ? data.headerName = "YEAR" : data.headerName = data.headerName
                    }
                    if (data.field === "total_employee") {
                        response.data.language_options === "en" ? data.headerName = "TOTAL EMPLOYEES" : data.headerName = data.headerName
                    }
                })
                setSetting(response.data)
            }
        }

            fetchData()
    }, [])

    useEffect(() => {
        async function fetchData() {
            const response = await api.get(`payroll`)
             console.log(listPath)
             console.log(response.data)

            if (response.status === 200) {
                setLoading(false)
            }
            setUserRows(response.data)
        }
        fetchData()
      
    }, [listPath])

    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <DatatableListInput listName={listName} listPath={listPath} columns={columns} setColumns={setColumns} 
                userRows={userRows} setUserRows={setUserRows}
                loading={loading} setLoading={setLoading}
                setting={setting} setSetting={setSetting}/>
            </div>
        </div>
    )
}

function formatSalary() {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }

export default ListPayrolls