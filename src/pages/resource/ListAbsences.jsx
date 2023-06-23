import "./listAbsences.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { useEffect, useState } from "react"
import api from "../../services/api"
import Register from "../register/Register"
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import DatatableResourceAbsences from "../../components/datatableResources/DatatableResourceAbsences"


const payrollColumns = [
    { field: 'id', headerName: 'ID', width: 70, align:'center', headerAlign: 'center',},
    { field: 'month', headerName: 'MES', width: 150,align:'center', headerAlign: 'center',},
    // { field: "dependents", headerName:"Dependentes", width: 120,  align:'center', headerAlign: 'center', },
    { field: "year", headerName:"ANO", width: 180,  align:'center', headerAlign: 'center', },
    { field: "total_employee", headerName:"TOTAL FUNCIONARIOS", width: 180,  align:'center', headerAlign: 'center', },
 
]

const ListAbsences = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    const [loading, setLoading] = useState(true)

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
            }
        }

            fetchData()
    }, [])

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("payroll")
             console.log(listPath)

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
                {/* <ChakraProvider>
                    <Register />
                </ChakraProvider> */}

                <DatatableResourceAbsences listName={listName} listPath={listPath} columns={payrollColumns} 
                userRows={userRows} setUserRows={setUserRows} 
                loading={loading} setLoading={setLoading}/>
            </div>
        </div>
    )
}

export default ListAbsences