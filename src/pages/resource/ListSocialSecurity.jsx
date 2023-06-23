import "./listSocialSecurity.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { useEffect, useState } from "react"
import api from "../../services/api"
import DatatableResourceINSS from "../../components/datatableResources/DatatableResourceINSS"

const payrollColumns = [
    { field: 'id', headerName: 'ID', width: 70, align:'center', headerAlign: 'center',},
    { field: 'month', headerName: 'MES', width: 150,align:'center', headerAlign: 'center',},
    // { field: "dependents", headerName:"Dependentes", width: 120,  align:'center', headerAlign: 'center', },
    { field: "year", headerName:"ANO", width: 180,  align:'center', headerAlign: 'center', },
    { field: "total_employee", headerName:"TOTAL FUNCIONARIOS", width: 180,  align:'center', headerAlign: 'center', },
 
]

const ListSocialSecurity = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    const [loading, setLoading] = useState(true)
    const [settings, setSettings] = useState({});


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
                    if (data.field === "total") {
                        response.data.language_options === "en" ? data.headerName = "TOTAL EMPLOYEES" : data.headerName = data.headerName
                    }
                })
                setSettings(response.data)
            }
        }

            fetchData()
    }, [])

    useEffect(() => {
        async function fetchData() {
            const response = await api.get(`payroll`)

            if (response.status === 200) {
                setLoading(false)
            }
            setUserRows(response.data)

        }
        fetchData()
      
    }, [])

    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <DatatableResourceINSS listName={listName} listPath={listPath} columns={payrollColumns} 
                userRows={userRows} setUserRows={setUserRows} settings={settings} setSettings={setSettings}
                loading={loading} setLoading={setLoading}/>
            </div>
        </div>
    )
}

export default ListSocialSecurity