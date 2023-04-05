import "./widget.scss"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Widget = ({ type, dbData, link }) => {
    const [total, setStotal] = useState(0);
    const formatSalary = new Intl.NumberFormat("de-DE", {maximumFractionDigits: 2, minimumFractionDigits: 2})

    useEffect(() => {
        if(type === "payrolls"){
            let income = 0
            dbData && dbData.map(employee => {
                income = income + employee.total_income
                setStotal(formatSalary.format(income))
            })
            console.log(income)
        } else {
            dbData && setStotal(dbData.length)
        }
    }, [dbData])

    let data; 
    //temporary
    const amount = 100;
    const diff = 20;
    
    switch (type) {
        case "employees":
            data = {
                title: "FUNCIONARIOS",
                isMoney: false,
                link: "ver funcionarios",
                icon: (
                    <PersonOutlineOutlinedIcon className="icon" 
                    style={{
                        color: "crimson",
                        backgroundColor: "rgba(255, 0, 0, 0.2)"
                    }}/>
                )
            }
        break;
        case "positions":
            data = {
                title: "CARGOS",
                isMoney: false,
                link: "ver cargos",
                icon: (
                    <BusinessCenterOutlinedIcon className="icon" 
                    style={{
                        color: "goldenrod",
                        backgroundColor: "rgba(218, 165, 32, 0.2)"
                    }}/>
                )
            }
        break;
        case "departments":
            data = {
                title: "DEPARTAMENTOS",
                isMoney: false,
                link: "ver departamentos",
                icon: (
                    <ApartmentOutlinedIcon className="icon" 
                    style={{
                        color: "green",
                        backgroundColor: "rgba(0, 128, 0, 0.2)"
                    }}/>
                )
            }
        break;
        case "payrolls":
            data = {
                title: "TOTAL PAGAMENTOS",
                isMoney: true,
                link: "ver folha de salario",
                icon: (
                    <PointOfSaleOutlinedIcon className="icon" 
                    style={{
                        color: "purple",
                        backgroundColor: "rgba(128, 0, 128, 0.2)"
                    }}/>
                )
            }
        break;
        default:
            break;  
    }
    return (
        <div className="widget">
            <div className="left">
                <span className="title">{data.title}</span>
                <span className="counter">{dbData && total}</span>
                <Link to={link} className="link">{data.link}</Link>
            </div>
            <div className="right">
                {/* <div className="percentage positive">
                    <KeyboardArrowUpIcon />
                    {diff} %
                </div>  */}
              {data.icon}
            </div>
        </div>
    )
}

export default Widget