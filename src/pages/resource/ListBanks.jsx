import "./listBanks.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { useEffect, useState } from "react"
import api from "../../services/api"
import DatatableResource from "../../components/datatableResources/DatatableResource"

const payrollColumns = [
    { field: 'id', headerName: 'ID', width: 70, align:'center', headerAlign: 'center',},
    { field: 'month', headerName: 'Mes', width: 150,align:'center', headerAlign: 'center',},
    // { field: "dependents", headerName:"Dependentes", width: 120,  align:'center', headerAlign: 'center', },
    { field: "year", headerName:"Ano", width: 180,  align:'center', headerAlign: 'center', },
    { field: "total", headerName:"Total Funcionarios", width: 180,  align:'center', headerAlign: 'center', },
 
]

const ListBanks = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const response = await api.get(`${listPath}`)
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
                <DatatableResource listName={listName} listPath={listPath} columns={payrollColumns} 
                userRows={userRows} setUserRows={setUserRows} 
                loading={loading} setLoading={setLoading}/>
            </div>
        </div>
    )
}

export default ListBanks