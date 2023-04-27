import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print";
import api from "../../services/api";
import './printINSS.scss'

const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }
const formatDate = () => {
    return new Intl.DateTimeFormat("pt-br", { dateStyle: 'long'})
  }

const PrintINSS = ({componentRef, single}) => {
    const [setting, setSetting] = useState([])
    const [totalEmployee, setTotalEmployee] = useState(0)
    const [total_salary_base, SetTotal_salary_base] = useState(0)
    const [total_Inss_Employee, setTotal_Inss_Employee] = useState(0)
    const [total_Inss_Company, setTotal_Inss_Company] = useState(0)

    useEffect(() => {
        //Salario apos faltas
        if (single.length > 0) {
            let total_salary_and_subsidy = 0
            let total_employee = 0
            let total_Inss_Employee = 0
            let total_Inss_Company = 0
            single.map((data, index) => {
                total_salary_and_subsidy += (data.salary_base - (data.salary_base / 30) * data.absences) + data.subsidy
                total_Inss_Employee += (data.salary_base - data.total_absences) * 0.03
                total_Inss_Company += (data.salary_base - data.total_absences) * 0.04
                total_employee = total_employee + 1
            })
            SetTotal_salary_base(total_salary_and_subsidy)
            setTotalEmployee(total_employee)
            setTotal_Inss_Employee(total_Inss_Employee)
            setTotal_Inss_Company(total_Inss_Company)
            setSetting(single)
        }
    }, [single])
   
    let date  = new Date()

    return (
            <div style={{display: "none"}}>
            <div  ref={componentRef} style={{width: '100%'}}>
                {/* text-align: center */}
                <div className="page-header">
                        {/* I'm The Header
                        <br/> */}
                </div>

                <div className="page-footer">
                    {/* I'm The Footer */}
                </div>
                
                <table className="page-body">
                    <thead>
                    <tr>
                        <td>
                        <div className="page-header-space"></div>
                        </td>
                    </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>
                                <div className="pageINSS">
                                    <div className="title">
                                        <h1>Folha Para INSS</h1>
                                    </div>
                                    <br/>
                                    <hr/>
                                    <br/>
                                    <div className="employeeINSSData">
                                        <div className="tableEmployeeINSSData">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th style={{width: "120px"}}>N. Benificiario:</th>
                                                        <th style={{width: "200px"}}>Nome do Benificiario:</th>
                                                        <th style={{width: "10px"}}>Dias</th>
                                                        <th>Data de Nasc.</th>
                                                        <th>Remuneracao</th>
                                                        <th>Subsidios</th>
                                                        <th>Comissao</th>
                                                        <th>Total</th>
                                                        <th>Evento</th>
                                                        <th>Data Evento</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {setting.map(single =>
                                                    <tr>
                                                        <td>{single.social_security}</td>
                                                        <td style={{textAlign: "left"}}>{single.employee_name}</td>
                                                        <td>{30}</td>
                                                        <td>{single.birth_date}</td>
                                                        <td>{formatSalary().format(single.salary_base)}</td>
                                                        <td>{formatSalary().format(single.subsidy)}</td>
                                                        <td>{single.subsidy ?? formatSalary().format(0)}</td>
                                                        <td>{formatSalary().format(single.salary_base + single.subsidy)}</td>
                                                        <td>{""}</td>
                                                        <td>{""}</td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </div> 
                                    </div>
                                    <br/>
                                    <hr/>
                                    <div className="footer">
                                        <div>
                                            <span>Quantidade de Benificiario: </span>
                                            <span className="linha">{totalEmployee}</span>
                                        </div>
                                        <div>
                                            <span>Valor Total da Remuneracao: </span>
                                            <span>{formatSalary().format(total_salary_base)}</span>
                                        </div>
                                        <div>
                                            <span>Valor do Contribuinte: </span>
                                            <span>{formatSalary().format(total_Inss_Company)}</span>
                                        </div>
                                        <div>
                                            <span>Valor do Benificiario: </span>
                                            <span>{formatSalary().format(total_Inss_Employee)}</span>
                                        </div>
                                    <hr/>
                                    <br/>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>

                    <tfoot>
                    <tr>
                        <td>
                        <div className="page-footer-space"></div>
                        </td>
                    </tr>
                    </tfoot>

                </table>

            </div>
            </div>
        )
}


export default PrintINSS


const totalPrint = (printData) => {
    
    let totalLiquid = 0
    let totalBase = 0
    let totalIrps = 0
    let totalGross = 0
    let totalInss = 0
    let totalInssCompany = 0
    let totalInssEmployee = 0
    let totalLength = 0
    let total_cash_advances = 0
    let total_syndicate_employee = 0
    let total_subsidy = 0
    let total_bonus = 0
    let total_backpay = 0
    let total_total_absences = 0
    let total_total_overtime = 0

    totalLength = printData.map((data, index) => {
        totalLiquid += (+data.salary_liquid)
        totalBase += (+data.salary_base)
        totalGross += (+data.total_income)
        totalIrps += (+data.irps)
        totalInss += (+data.inss_company) + (+data.inss_employee)
        totalInssCompany += (+data.inss_company)
        totalInssEmployee += (+data.inss_employee)
        total_cash_advances += (+data.cash_advances)
        total_syndicate_employee += (+data.syndicate_employee)
        total_subsidy += (+data.subsidy)
        total_bonus += (+data.bonus)
        total_backpay += (+data.backpay)
        total_total_absences += (+data.total_absences)
        total_total_overtime += (+data.total_overtime)
     })

     const totalRow = [[
        {text: totalLength.length + 1, fontSize: 10, margin: [0, 2, 0, 2]},
        {text: "Total", fontSize: 10, margin: [0, 2, 0, 2], alignment: "center", colSpan: 3},
        {},
        {},
        {text: formatSalary().format(totalBase), fontSize: 10, margin: [0, 2, 0, 2]},
        {text: formatSalary().format(total_subsidy), fontSize: 10, margin: [0, 2, 0, 2],},
        {text: formatSalary().format(total_bonus), fontSize: 10, margin: [0, 2, 0, 2],},
        {text: formatSalary().format(total_total_overtime), fontSize: 10, margin: [0, 2, 0, 2],},
        {text: formatSalary().format(total_total_absences), fontSize: 10, margin: [0, 2, 0, 2],},
        {text: formatSalary().format(totalGross), fontSize: 10, margin: [0, 2, 0, 2]},
        {text: formatSalary().format(totalInssEmployee), fontSize: 10, margin: [0, 2, 0, 2]},
        {text: formatSalary().format(totalInssCompany), fontSize: 10, margin: [0, 2, 0, 2]},
        {text: formatSalary().format(totalInss), fontSize: 10, margin: [0, 2, 0, 2]},
        {text: formatSalary().format(totalIrps), fontSize: 10, margin: [0, 2, 0, 2]},
        {text: formatSalary().format(total_cash_advances), fontSize: 10, margin: [0, 2, 0, 2]},
        {text: formatSalary().format(total_syndicate_employee), fontSize: 10, margin: [0, 2, 0, 2]},
        {text: formatSalary().format(totalLiquid), fontSize: 10, margin: [0, 2, 0, 2]},
    ]]

    return totalRow
}


// 250000
// 203162
// 8000
// 10000
// 58538.96
// 58668.83
// 15000
// 7774.5
// 58733.77
// 0
// 10000
// 7774.5