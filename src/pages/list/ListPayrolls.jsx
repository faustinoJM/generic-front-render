import "./listPayrolls.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { useEffect, useState } from "react"
import api from "../../services/api"
import DatatableListInput from "../../components/datatable/DatatableListPayrolls"

const payrollColumns = [
    { field: 'id', headerName: 'ID', width: 70, align:'center', headerAlign: 'center',},
    { field: 'month', headerName: 'Mes', width: 150,align:'center', headerAlign: 'center',},
    // { field: "dependents", headerName:"Dependentes", width: 120,  align:'center', headerAlign: 'center', },
    { field: "year", headerName:"Ano", width: 180,  align:'center', headerAlign: 'center', },
    { field: "total", headerName:"Total Funcionarios", width: 180,  align:'center', headerAlign: 'center', },
 
]

const ListPayrolls = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const response = await api.get(`${listPath}`)
             console.log(listPath)
             console.log(response.data)
             console.log(response.data.data)

            //  response.data.map((data) => {
            //     data.salary_base = formatSalary().format(data.salary_base)
            //     data.bonus = formatSalary().format(data.bonus)
            //     data.cash_advances = formatSalary().format(data.cash_advances)
            // })
            setUserRows(response.data)

    

        }
        fetchData()
      
    }, [listPath])

    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <DatatableListInput listName={listName} listPath={listPath} columns={payrollColumns} userRows={userRows} setUserRows={setUserRows}/>
            </div>
        </div>
    )
}

function formatSalary() {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }

export default ListPayrolls