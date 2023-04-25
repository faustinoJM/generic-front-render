import "./singleEmployee.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Chart from "../../components/chart/Chart"
import Table from "../../components/table/Table"
import api from "../../services/api"
import { useParams, useLocation} from 'react-router-dom';
import { useEffect, useState } from "react"

const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }
const formatDate = () => {
    return new Intl.DateTimeFormat("pt-br", { dateStyle: 'short'})
  }


const SingleEmployee = () => {
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
                    <h1 className="title">Dados do Funcionario</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <div className="editButton">Editar</div>
                        <div className="item">
                             <div className="details">
                                <h2 className="title">Dados Pessoias</h2>
                                <div className="detailItem">
                                    <span className="ItemKey">Nome:</span>
                                    <span className="itemTitle" styles={{color: "red"}}>{data.name}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Email:</span>
                                    <span className="itemValue">{data.email}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Contacto:</span>
                                    <span className="itemValue">{data.contact}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Data de Nascimento:</span>
                                    <span className="itemValue">{data.birth_date}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Numero de BI:</span>
                                    <span className="itemValue">{data.bi}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Nacionalidade:</span>
                                    <span className="itemValue">{data.nationality}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Naturalidade:</span>
                                    <span className="itemValue">{data.place_birth}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Estado Civil:</span>
                                    <span className="itemValue">{data.marital_status}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Sexo:</span>
                                    <span className="itemValue">{data.gender}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Residencia:</span>
                                    <span className="itemValue">{data.address}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">NUIT:</span>
                                    <span className="itemValue">{data.nuit}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Numero de Dependentes:</span>
                                    <span className="itemValue">{data.dependents}</span>
                                </div>
                                <hr />
                                <h2 className="title">Dados da Empresa</h2>
                                <div className="detailItem">
                                    <span className="ItemKey">Departamento:</span>
                                    <span className="itemValue">{data.department_id}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Cargo:</span>
                                    <span className="itemValue">{data.position_id}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Salario Base:</span>
                                    <span className="itemValue">{data.salary}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Subsidio:</span>
                                    <span className="itemValue">{data.subsidy}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Data do inicio:</span>
                                    <span className="itemValue">{data.start_date}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Data do fim:</span>
                                    <span className="itemValue">{data.end_date}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Estado do funcionario:</span>
                                    <span className="itemValue">{data.employee_status}</span>
                                </div>
                                <hr />
                                <h2 className="title">Dados da Financeiros</h2>
                                <div className="detailItem">
                                    <span className="ItemKey">Nome do banco:</span>
                                    <span className="itemValue">{data.bank_name}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Numero da Conta Bancaria:</span>
                                    <span className="itemValue">{data.bank_account}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">NIB:</span>
                                    <span className="itemValue">{data.nib}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Numero Seg. Social:</span>
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
