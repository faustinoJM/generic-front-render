import "./sidebar.scss"
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import MoreTimeOutlinedIcon from '@mui/icons-material/MoreTimeOutlined';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import CreditCardOffOutlinedIcon from '@mui/icons-material/CreditCardOffOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import ElderlyIcon from '@mui/icons-material/Elderly';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useTranslation } from 'react-i18next';


import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import {useQuery} from 'react-query'
import api from "../../services/api";

async function fetchSettings(){
    const {data} = await api.get("settings") 
    return data
}

function addToken() {
    api.defaults.headers['Authorization'] = !!localStorage.getItem('@ConsulPayroll:refresh_token') ? `Bearer ${localStorage.getItem('@ConsulPayroll:refresh_token')}` : '';
  }

const Sidebar = ({active, setActive}) => {
    addToken()
    const { signOut } = useAuth();
    const [setting, setSetting] = useState(null)
    const [companyName, setCompanyName] = useState("")
    const [urlLogo, setUrlLogo] = useState(null);
    const { t, i18n } = useTranslation();

    const {data, error, isError, isLoading } = useQuery('settings', fetchSettings)

    useEffect(() => {
        if (!isLoading) {
            if (data)
                setUrlLogo(data.companyLogoURL)
        }
    }, [data])
    
    // console.log("sidebar", data)
    // console.log(data)
    // useEffect(() => {
    //     async function fetch() {
    //         const respose = await api.get("settings")
            
    //         if (respose.data){
    //             setSetting(respose.data)
    //             setCompanyName(respose.data.company_name)
    //         } else {
    //             setCompanyName("Elint Payroll")
    //         }
   
    //     }
    //     fetch()
    // }, [])
    // if(isLoading){
    //     return <div>Loading...</div>
    //   }
    //   if(isError){
    //     return <div>Error! {error.message}</div>
    //   }
    return (
        <div className="sidebar">
            <div className="top">
                <Link to="/" style={{textDecoration: "none"}} className="linkTop">
                    <span className="logo">{data?.company_name ?? 'Elint Payroll'}</span>
                    {urlLogo ? <div className="logoImg">
                                <img 
                                    src={
                                    urlLogo ? urlLogo : ""
                                    } 
                                    alt="" />
                    </div>
                    : ""
                    }
                </Link>
            </div>
            <hr />
            <div className="center">
                <ul>
                    {/* <p className="title">PRINCIPAL</p> */}
                            {/* <p>{t('Thanks.1')} {t('Why.1')}</p> */}
                    <p className="title">{t('Sidebar.1')}</p>
                    <li>
                        <NavLink to="/" className="navLink" style={{textDecoration: "none"}}>
                            <DashboardIcon className="icon" />
                            <span>{t('Sidebar.2')}</span>
                        </NavLink>
                    </li>
                    <p className="title">{t('Sidebar.3')}</p>
                    <li>
                        <NavLink to="/employees" className="navLink" style={{textDecoration: "none"}}>
                            <PersonOutlineOutlinedIcon className="icon" />
                            <span>{t('Sidebar.4')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/positions" className="navLink" style={{textDecoration: "none"}}>
                            <BusinessCenterOutlinedIcon className="icon" />
                            <span>{t('Sidebar.5')}</span>
                        </NavLink>
                    </li>
                    {/* <li>
                        <NavLink to="/schedules" className="navLink" style={{textDecoration: "none"}}>
                            <AccessTimeOutlinedIcon className="icon" />
                            <span>Horario</span>
                        </NavLink>
                        </li>
                     */}
                    <p className="title">{t('Sidebar.6')}</p>
                    <li>
                        <NavLink to="/departments" className="navLink" style={{textDecoration: "none"}}>
                            <ApartmentOutlinedIcon className="icon" />
                            <span>{t('Sidebar.7')}</span>
                        </NavLink>
                    </li>
                    <p className="title">{t('Sidebar.8')}</p>
                    <li>
                        <NavLink to="/payrolls/new" className="navLink" style={{textDecoration: "none"}}>
                            <InsertDriveFileIcon className="icon" />
                            <span>{t('Sidebar.9')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/payrolls/input" className="navLink" style={{textDecoration: "none"}}>
                            <PointOfSaleOutlinedIcon className="icon" />
                            <span>{t('Sidebar.10')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/payrolls/list" className={`navLink ${active ? "active" : ""}`} style={{textDecoration: "none"}}>
                            <PaymentOutlinedIcon className="icon" />
                            <span>{t('Sidebar.11')}</span>
                        </NavLink>
                    </li>
                   <p className="title">{t('Sidebar.12')}</p>
                    {/* <li>
                        <NavLink to="/resources/banks" className="navLink" style={{textDecoration: "none"}}>
                            <AccountBalanceIcon className="icon" />
                            <span>Banco</span>
                        </NavLink>
                    </li> */}
                    <li>
                        <NavLink to="/resources/social-security" className="navLink" style={{textDecoration: "none"}}>
                            <ElderlyIcon className="icon" />
                            <span>{t('Sidebar.13')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/resources/absences" className="navLink" style={{textDecoration: "none"}}>
                            <FactCheckOutlinedIcon className="icon" />
                            <span>{t('Sidebar.14')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/resources/vacation" className="navLink" style={{textDecoration: "none"}}>
                            <WorkOffIcon className="icon" />
                            <span>{t('Sidebar.18')}</span>
                        </NavLink>
                    </li>  
                    <li>
                        <NavLink to="/resources/bank" className="navLink" style={{textDecoration: "none"}}>
                            <AccountBalanceIcon className="icon" />
                            <span>{t('Sidebar.19')}</span>
                        </NavLink>
                    </li> 
                    {/* <li>
                        <NavLink to="/resources/report" className="navLink" style={{textDecoration: "none"}}>
                            <DescriptionIcon className="icon" />
                            <span>Relatorio</span>
                        </NavLink>
                    </li>  */}
                    {/* <li>   
                        <NavLink to="/cashadvances" className="navLink" style={{textDecoration: "none"}}>
                            <PointOfSaleOutlinedIcon className="icon" />
                            <span>Emprestimos</span>
                        </NavLink>
                        </li> 
                        <li>
                        <NavLink to="/overtime" className="navLink" style={{textDecoration: "none"}}>
                            <MoreTimeOutlinedIcon className="icon" />
                            <span>Horas Extras</span>
                        </NavLink>
                        </li>
                        <li>
                        <NavLink to="/dedunctions" className="navLink" style={{textDecoration: "none"}}>
                            <CreditCardOffOutlinedIcon className="icon" />
                            <span>Deducao</span>
                        </NavLink>
                        </li>
                        */}
                    <p className="title">{t('Sidebar.15')}</p>
                    {/* <li>
                        <NavLink to="/profile" className="navLink" style={{textDecoration: "none"}}>
                            <AccountBoxOutlinedIcon className="icon" />
                            <span>Perfil</span>
                        </NavLink>
                    </li> */}
                    <li>
                        <NavLink to="/settings" className="navLink" style={{textDecoration: "none"}}>
                            <SettingsApplicationsIcon className="icon" />
                            <span>{t('Sidebar.16')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink onClick={signOut} to="/login" className="navLink" style={{textDecoration: "none"}}>
                            <ExitToAppOutlinedIcon className="icon" />
                            <span>{t('Sidebar.17')}</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="bottom">
                <div className="colorOptions"></div>
                <div className="colorOptions"></div>
            </div>
        </div>
        
    )
}

export default Sidebar