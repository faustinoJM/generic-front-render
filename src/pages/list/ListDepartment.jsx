import "./listDepartment.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { useEffect, useState } from "react"
import api from "../../services/api"
import { useTranslation } from 'react-i18next';

const departmentColumn = [
    { field: 'id', headerName: 'ID', width: 100,pinnable: true, hide: true },
    { field: 'name', headerName: 'NOME DO DEPARTMENTO', width: 230},
    { field: "total_employee", headerName:"TOTAL FUNCIONARIO", width: 230 },
]

const ListDepartment = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    const [loading, setLoading] = useState(true)
    const { t, i18n } = useTranslation();

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
                <Datatable listName={t("Department.1")} listPath={listPath} columns={departmentColumn} 
                userRows={userRows} setUserRows={setUserRows} 
                loading={loading} setLoading={setLoading}/>
            </div>
        </div>
    )
}

export default ListDepartment