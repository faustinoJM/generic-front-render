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

const departmentColumnEN = [
    { field: 'id', headerName: 'ID', width: 100,pinnable: true, hide: true },
    { field: 'name', headerName: 'POSITION NAME', width: 230},
    { field: "total_employee", headerName:"TOTAL EMPLOYEES", width: 230 },
]

const ListDepartment = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    const [loading, setLoading] = useState(true)
    const { t, i18n } = useTranslation();
    const [searchName, setSearchName] = useState("")
    const [columns,  setColumns] = useState(departmentColumn)
    const [loadLang, SetLoadLang] = useState(false)


    useEffect(() => {
        async function fetchData() {
            const response = await api.get("settings")
            if (response.data) {

                departmentColumn.map(data => {
                    // if (data.field === "name") {
                    //     response.data.language_options === "en" ? data.headerName = "DEPARTMENT NAME" : data.headerName = data.headerName
                    // }
                    // if (data.field === "total_employee") {
                    //     response.data.language_options === "en" ? data.headerName = "TOTAL EMPLOYEES" : data.headerName = data.headerName
                    // }
                    response.data.language_options === "en" ? setColumns(departmentColumnEN) : setColumns(departmentColumn)
                })
            }
        }

            fetchData()
    }, [loadLang])

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
                <Navbar searchName={searchName} setSearchName={setSearchName} SetLoadLang={SetLoadLang}/>
                <Datatable listName={t("Department.1")} listPath={listPath} columns={columns} 
                userRows={userRows} setUserRows={setUserRows} 
                loading={loading} setLoading={setLoading}/>
            </div>
        </div>
    )
}

export default ListDepartment