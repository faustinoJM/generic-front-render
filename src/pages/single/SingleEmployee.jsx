import "./singleEmployee.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Chart from "../../components/chart/Chart"
import api from "../../services/api"
import { useParams, useLocation} from 'react-router-dom';
import { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next';

const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }
const formatDate = () => {
    return new Intl.DateTimeFormat("pt-br", { dateStyle: 'short'})
  }


const SingleEmployee = () => {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState({});
    // const params = useParams();
    // console.log(params)

  
    useEffect(() => {
        async function fetch() {
            const [ , , id] = window.location.pathname.split("/")
            const response = await api.get(`employees/${id}`)
            const birth_date = new Date(response.data.birth_date)
            const start_date = new Date(response.data.start_date)
                        
            response.data.birth_date = formatDate().format(birth_date) 
            response.data.start_date = formatDate().format(start_date)
            response.data.salary = formatSalary().format(response.data.salary)
            response.data.subsidy = formatSalary().format(response.data.subsidy) 
            setData(response.data)
           
        }
        fetch()
    }, [])
    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <h1 className="title">{t("EmployeeData.1")}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <div className="editButton">{t("EmployeeData.2")}</div>
                        <div className="item">
                             <div className="details">
                                <h2 className="title">{t("PersonalData.0")}</h2>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("PersonalData.1")}:</span>
                                    <span className="itemTitle" styles={{color: "red"}}>{data.name}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("PersonalData.14")}:</span>
                                    <span className="itemValue">{data.email}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("PersonalData.11")}:</span>
                                    <span className="itemValue">{data.contact_1}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("PersonalData.2")}:</span>
                                    <span className="itemValue">{data.birth_date}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("PersonalData.5")}:</span>
                                    <span className="itemValue">{data.bi}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("PersonalData.4")}:</span>
                                    <span className="itemValue">{data.nationality}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("PersonalData.3")}:</span>
                                    <span className="itemValue">{data.place_birth}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("PersonalData.6")}:</span>
                                    <span className="itemValue">{data.marital_status}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("PersonalData.8")}:</span>
                                    <span className="itemValue">{data.gender}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("PersonalData.10")}:</span>
                                    <span className="itemValue">{data.address}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("PersonalData.15")}:</span>
                                    <span className="itemValue">{data.nuit}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("PersonalData.16")}:</span>
                                    <span className="itemValue">{data.dependents}</span>
                                </div>
                                <hr />
                                <h2 className="title">{t("CompanyData.0")}</h2>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("CompanyData.1")}</span>
                                    <span className="itemValue">{data.department_name}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("CompanyData.3")}:</span>
                                    <span className="itemValue">{data.position_name}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("CompanyData.9")}:</span>
                                    <span className="itemValue">{data.salary}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("CompanyData.10")}:</span>
                                    <span className="itemValue">{data.subsidy}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("CompanyData.5")}:</span>
                                    <span className="itemValue">{data.start_date}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("CompanyData.6")}:</span>
                                    <span className="itemValue">{data.end_date}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("CompanyData.7")}:</span>
                                    <span className="itemValue">{data.employee_status}</span>
                                </div>
                                <hr />
                                <h2 className="title">{t("FinancialData.0")}</h2>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("FinancialData.1")}:</span>
                                    <span className="itemValue">{data.bank_name}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("FinancialData.2")}:</span>
                                    <span className="itemValue">{data.bank_account}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("FinancialData.3")}:</span>
                                    <span className="itemValue">{data.nib}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">{t("FinancialData.4")}:</span>
                                    <span className="itemValue">{data.social_security}</span>
                                </div>
                             </div>     
                        </div>
                    </div>
                </div>
                    
                
            </div>
        </div>        
    )
}

// function formatSalary() {
//     return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
//   }
// function formatDate() {
//     return new Intl.DateTimeFormat("pt-br", { dateStyle: 'short'})
//   }

export default SingleEmployee
