import "./listPosition.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import { useTranslation } from 'react-i18next';

const positionColumns = [
    { field: 'id', headerName: 'ID', width: 100,pinnable: true, hide: true },
    { field: 'name', headerName: 'NOME DO CARGO', width: 230},
    { field: "total_employee", headerName:"TOTAL FUNCIONARIO", width: 230 },

]

const ListPosition = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    const [loading, setLoading] = useState(true)
    const { t, i18n } = useTranslation();

    useEffect(() => {
        async function fetchData() {
            const response = await api.get(`${listPath}`)
            console.log(listPath)
            setUserRows(response.data)

            if (response.status === 200) {
                setLoading(false)
            }

        }
        fetchData()
      
    }, [listPath])

    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <Datatable listName={t("Position.1")} listPath={listPath} columns={positionColumns} 
                userRows={userRows} setUserRows={setUserRows} 
                loading={loading} setLoading={setLoading}/>
            </div>
        </div>
    )
}

export default ListPosition