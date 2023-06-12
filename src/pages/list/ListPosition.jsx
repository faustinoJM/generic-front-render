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
    const [searchName, setSearchName] = useState("")

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("settings")
            if (response.data) {

                positionColumns.map(data => {
                    if (data.field === "name") {
                        response.data.language_options === "en" ? data.headerName = "POSITION NAME" : data.headerName = data.headerName
                    }
                    if (data.field === "total_employee") {
                        response.data.language_options === "en" ? data.headerName = "TOTAL EMPLOYEES" : data.headerName = data.headerName
                    }
                })
            }
        }

            fetchData()
    }, [])


    useEffect(() => {
        async function fetchData() {
            const response = await api.get(`${listPath}`)
            console.log(listPath)
            
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

    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar searchName={searchName} setSearchName={setSearchName}/>
                <Datatable listName={t("Position.1")} listPath={listPath} columns={positionColumns} 
                userRows={userRows} setUserRows={setUserRows} 
                loading={loading} setLoading={setLoading}/>
            </div>
        </div>
    )
}

export default ListPosition