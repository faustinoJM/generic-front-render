import { useEffect, useRef, useState } from "react"
import './printPayslipBucket.scss'
import api from "../../services/api"

const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
}

const formatDate = () => {
    return new Intl.DateTimeFormat("pt-br", { dateStyle: 'long'})
}

const PrintPayslipBucket = ({componentRef, printData}) => {
    // const componentRef = useRef();
    const [companyName, setCompanyName] = useState("")
    const [setting, setSetting] = useState("")
    const [urlLogo, setUrlLogo] = useState(null);

    useEffect(() => {
        async function fetch() {
            const response = await api.get("settings")
            // const responsePay = await api.get("payrolls")
            // setprintData(responsePay.data)
            if (response.data){
                setSetting(response.data)
                setCompanyName(response.data.company_name)
                setUrlLogo(response.data.companyLogoURL)
            } else {
                setCompanyName("Elint Payroll")
            }
        }
        fetch()
    }, [])

    let date  = new Date()

    return (
        <div style={{display: "none"}}>
        <div  ref={componentRef} style={{width: '100%', height: window.innerHeight}}>
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
                {printData.map(single => 
                    <tr>
                        <td>
                            <div className="page">
                                <div className="print-top" style={{height: "480px", padding: "0 25px"}}>
                                    <div className="logo-and-adress">
                                        <div className="nameAdress">
                                            <h2>{setting?.company_name ?? "Elint Payroll"}</h2>
                                            <span>{setting?.company_address ?? "Av. Kruss Gomes"}</span>
                                            <span>{setting?.company_city ?? "Beira"}</span>
                                            <span>{setting?.company_province ?? "Sofala"}</span>
                                        </div>
                                        <div className="logo-print">
                                        {urlLogo ? <img 
                                                src={
                                                urlLogo ? urlLogo : ""
                                                } 
                                                alt="" />
                                            : ""
                                            }
                                        </div>
                                    </div>
                                    <div className="employeeData">
                                        <div className="idRecibo">
                                            <div className="id">
                                                <span>ID do Trabalhador:</span>
                                                <span>{single.employee_number}</span>
                                            </div>
                                            <div className="recibo">
                                                <span className="title">Recibo/Payslip</span>
                                                <div className="mes">
                                                    <span>Para mes de:</span>
                                                    <span>{single.month}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tableEmployeeData">
                                            <table>
                                                <tr>
                                                    <th>Nome:</th>
                                                    <td>{single.employee_name}</td>
                                                    <th>Nr. Seg. Social:</th>
                                                    <td>{single.social_security}</td>
                                                </tr>
                                                <tr>
                                                    <th>Cargo:</th>
                                                    <td>{single.position_name}</td>
                                                    <th>Nr. NUIT:</th>
                                                    <td>{single.nuit}</td>
                                                </tr>
                                                <tr>
                                                    <th>Departamento:</th>
                                                    <td>{single.department_name}</td>
                                                    <th>Dias de Ferias:</th>
                                                    <td>{single.vacation}</td>
                                                </tr>
                                            </table>
                                        </div> 
                                    </div>

                                    <hr style={{border: "0", height: "1px", background: "lightgray"}}/>

                                    <div className="employePayment">
                                        <table>
                                                <thead>
                                                    <tr>
                                                        <th style={{borderLeft: "1px solid #FFF", borderTop: "1px solid #FFF", borderRight: "1px solid #FFF"}}></th>
                                                        <th style={{borderLeft: "1px solid #FFF", borderTop: "1px solid #FFF"}}></th>
                                                        <th>Remuneracoes</th>
                                                        <th>Descontos</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th>Salario Base</th>
                                                        <td></td>
                                                        <td>{formatSalary().format(single.salary_base)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Horas Extras - 50%</th>
                                                        <td>{single.overtime50}</td>
                                                        <td>{formatSalary().format(+single.totalOvertime50)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Horas Extras - 100%</th>
                                                        <td>{single.overtime100}</td>
                                                        <td>{formatSalary().format(single.totalOvertime100)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Subsidios</th>
                                                        <td></td>
                                                        <td>{formatSalary().format(single.subsidy)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Bonus</th>
                                                        <td></td>
                                                        <td>{formatSalary().format(single.bonus)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Faltas</th>
                                                        <td>{single.absences}</td>
                                                        <td></td>
                                                        <td>{formatSalary().format(single.total_absences)}</td>
                                                    </tr>
                                                    {/* <tr>
                                                        <th>Outros Descontos</th>
                                                        <td></td>
                                                        <td></td>
                                                    </tr> */}
                                                    <tr>
                                                        <th>Salario Bruto</th>
                                                        <td></td>
                                                        <td>{formatSalary().format(single.total_income)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>IRPS</th>
                                                        <td></td>
                                                        <td style={{border: "none"}}></td>
                                                        <td>{formatSalary().format(single.irps)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>INSS</th>
                                                        <td></td>
                                                        <td style={{border: "none"}}></td>
                                                        <td>{formatSalary().format(single.inss_employee)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Emprestimo</th>
                                                        <td></td>
                                                        <td style={{border: "none"}}></td>
                                                        <td>{formatSalary().format(single.cash_advances)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Salario Liquido</th>
                                                        <td style={{borderRight: "1px solid #FFF"}}></td>
                                                        <td style={{borderLeft: "1px solid #FFF", borderRight: "1px solid #FFF"}}>{formatSalary().format(single.salary_liquid)}</td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>          
                                        </table>
                                    </div>

                                    <hr style={{border: "0", height: "1px", background: "lightgray"}}/>

                                    <div className="footer">
                                        <div className="signature">
                                            <div>
                                                <span>{setting.language_options ===  "pt" ? "Assinatura:" : "Signature:"}</span>
                                                <span className="linha">___________________________</span>
                                            </div>
                                            <div>
                                                <span>{setting.language_options ===  "pt" ? "Assinatura:" : "Signature:"}</span>
                                                <span className="linha">___________________________</span>
                                            </div>
                                        </div>
                                        <div className="date">
                                            <span>{setting.language_options ===  "pt" ? "Data: " : "Date: "}</span>
                                            <span>{setting.language_options ===  "pt" ? formatDate("pt-br").format(date) : formatDate("en-uk").format(date)}</span>
                                        </div>
                                        <div className="comment">
                                            <span>{setting?.payslip_comment ?? ""}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <hr style={{border: "0", borderBottom: "1px solid black", width: "800px"}}></hr>

                                <div className="print-down" style={{height: "480px", padding: "0 25px"}}>
                                    <div className="logo-and-adress">
                                        <div className="nameAdress">
                                            <h2>{setting?.company_name ?? "Elint Payroll"}</h2>
                                            <span>{setting?.company_address ?? "Av. Kruss Gomes"}</span>
                                            <span>{setting?.company_city ?? "Beira"}</span>
                                            <span>{setting?.company_province ?? "Sofala"}</span>
                                        </div>
                                        <div className="logo-print">
                                        {urlLogo ? <img 
                                                src={
                                                urlLogo ? urlLogo : ""
                                                } 
                                                alt="" />
                                            : ""
                                            }
                                        </div>
                                    </div>
                                    <div className="employeeData">
                                        <div className="idRecibo">
                                            <div className="id">
                                                <span>ID do Trabalhador:</span>
                                                <span>{single.employee_number}</span>
                                            </div>
                                            <div className="recibo">
                                                <span className="title">Recibo/Payslip</span>
                                                <div className="mes">
                                                    <span>Para mes de:</span>
                                                    <span>{single.month}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tableEmployeeData">
                                            <table>
                                                <tr>
                                                    <th>Nome:</th>
                                                    <td>{single.employee_name}</td>
                                                    <th>Nr. Seg. Social:</th>
                                                    <td>{single.social_security}</td>
                                                </tr>
                                                <tr>
                                                    <th>Cargo:</th>
                                                    <td>{single.position_name}</td>
                                                    <th>Nr. NUIT:</th>
                                                    <td>{single.nuit}</td>
                                                </tr>
                                                <tr>
                                                    <th>Departamento:</th>
                                                    <td>{single.department_name}</td>
                                                    <th>Dias de Ferias:</th>
                                                    <td>{single.vacation}</td>
                                                </tr>
                                            </table>
                                        </div> 
                                    </div>

                                    <hr style={{border: "0", height: "1px", background: "lightgray"}}/>

                                    <div className="employePayment">
                                        <table>
                                                <thead>
                                                    <tr>
                                                        <th style={{borderLeft: "1px solid #FFF", borderTop: "1px solid #FFF", borderRight: "1px solid #FFF"}}></th>
                                                        <th style={{borderLeft: "1px solid #FFF", borderTop: "1px solid #FFF"}}></th>
                                                        <th>Remuneracoes</th>
                                                        <th>Descontos</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th>Salario Base</th>
                                                        <td></td>
                                                        <td>{formatSalary().format(single.salary_base)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Horas Extras - 50%</th>
                                                        <td>{single.overtime50}</td>
                                                        <td>{formatSalary().format(+single.totalOvertime50)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Horas Extras - 100%</th>
                                                        <td>{single.overtime100}</td>
                                                        <td>{formatSalary().format(single.totalOvertime100)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Subsidios</th>
                                                        <td></td>
                                                        <td>{formatSalary().format(single.subsidy)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Bonus</th>
                                                        <td></td>
                                                        <td>{formatSalary().format(single.bonus)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Faltas</th>
                                                        <td>{single.absences}</td>
                                                        <td></td>
                                                        <td>{formatSalary().format(single.total_absences)}</td>
                                                    </tr>
                                                    {/* <tr>
                                                        <th>Outros Descontos</th>
                                                        <td></td>
                                                        <td></td>
                                                    </tr> */}
                                                    <tr>
                                                        <th>Salario Bruto</th>
                                                        <td></td>
                                                        <td>{formatSalary().format(single.total_income)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>IRPS</th>
                                                        <td></td>
                                                        <td style={{border: "none"}}></td>
                                                        <td>{formatSalary().format(single.irps)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>INSS</th>
                                                        <td></td>
                                                        <td style={{border: "none"}}></td>
                                                        <td>{formatSalary().format(single.inss_employee)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Emprestimo</th>
                                                        <td></td>
                                                        <td style={{border: "none"}}></td>
                                                        <td>{formatSalary().format(single.cash_advances)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Salario Liquido</th>
                                                        <td style={{borderRight: "1px solid #FFF"}}></td>
                                                        <td style={{borderLeft: "1px solid #FFF", borderRight: "1px solid #FFF"}}>{formatSalary().format(single.salary_liquid)}</td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>          
                                        </table>
                                    </div>

                                    <hr style={{border: "0", height: "1px", background: "lightgray"}}/>

                                    <div className="footer">
                                        <div className="signature">
                                            <div>
                                                <span>{setting.language_options ===  "pt" ? "Assinatura:" : "Signature:"}</span>
                                                <span className="linha">___________________________</span>
                                            </div>
                                            <div>
                                                <span>{setting.language_options ===  "pt" ? "Assinatura:" : "Signature:"}</span>
                                                <span className="linha">___________________________</span>
                                            </div>
                                        </div>
                                        <div className="date">
                                            <span>{setting.language_options ===  "pt" ? "Data: " : "Date: "}</span>
                                            <span>{setting.language_options ===  "pt" ? formatDate("pt-br").format(date) : formatDate("en-uk").format(date)}</span>
                                        </div>
                                        <div className="comment">
                                            <span>{setting?.payslip_comment ?? ""}</span>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </td>
                    </tr>
                )}
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


export default PrintPayslipBucket


// const PrintPayslipBucket = ({componentRef, printData}) => {
//     // const componentRef = useRef();
//     const [companyName, setCompanyName] = useState("")
//     const [setting, setSetting] = useState("")
//     const [urlLogo, setUrlLogo] = useState(null);

//     useEffect(() => {
//         async function fetch() {
//             const response = await api.get("settings")
//             // const responsePay = await api.get("payrolls")
//             // setprintData(responsePay.data)
//             if (response.data){
//                 setSetting(response.data)
//                 setCompanyName(response.data.company_name)
//                 setUrlLogo(response.data.companyLogoURL)
//             } else {
//                 setCompanyName("Elint Payroll")
//             }
//         }
//         fetch()
//     }, [])

//     let date  = new Date()

//     return (
//         <div style={{display: "none"}}>
//         <div  ref={componentRef} style={{width: '100%', height: window.innerHeight}}>
//             {/* text-align: center */}
//             <div className="page-header">
//                     {/* I'm The Header
//                     <br/> */}
//             </div>

//             <div className="page-footer">
//                 {/* I'm The Footer */}
//             </div>
            
//             <table className="page-body">
//                 <thead>
//                 <tr>
//                     <td>
//                     <div className="page-header-space"></div>
//                     </td>
//                 </tr>
//                 </thead>

//                 <tbody>
//                 {printData.map(single => 
//                     <tr>
//                         <td>
//                             <div className="page">
//                                 <div className="nameAdress">
//                                     <h2>{setting?.company_name ?? "Elint Payroll"}</h2>
//                                     <span>{setting?.company_address ?? "Av. Kruss Gomes"}</span>
//                                     <span>{setting?.company_city ?? "Beira"}</span>
//                                 </div>
//                                 <div className="employeeData">
//                                     <div className="idRecibo">
//                                         <div className="id">
//                                             <span>ID do Trabalhador:</span>
//                                             <span>{single.employee_number}</span>
//                                         </div>
//                                         <div className="recibo">
//                                             <span className="title">Recibo/Payslip</span>
//                                             <div className="mes">
//                                                 <span>Para mes de:</span>
//                                                 <span>{single.month}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="tableEmployeeData">
//                                         <table>
//                                             <tr>
//                                                 <th>Nome:</th>
//                                                 <td>{single.employee_name}</td>
//                                                 <th>Nr. Seg. Social:</th>
//                                                 <td>{single.social_security}</td>
//                                             </tr>
//                                             <tr>
//                                                 <th>Cargo:</th>
//                                                 <td>{single.position_name}</td>
//                                                 <th>Nr. Contribuinte:</th>
//                                                 <td>{single.nuit}</td>
//                                             </tr>
//                                             <tr>
//                                                 <th>Departamento:</th>
//                                                 <td>{single.department_name}</td>
//                                                 <th>Dias de Ferias:</th>
//                                                 <td>{single.vacation}</td>
//                                             </tr>
//                                         </table>
//                                     </div> 
//                                 </div>

//                                 <br/>
//                                 <hr/>

//                                 <div className="employePayment">
//                                     <table>
//                                             <thead>
//                                                 <tr>
//                                                     <th style={{borderLeft: "1px solid #FFF", borderTop: "1px solid #FFF", borderRight: "1px solid #FFF"}}></th>
//                                                     <th style={{borderLeft: "1px solid #FFF", borderTop: "1px solid #FFF"}}></th>
//                                                     <th>Remuneracoes</th>
//                                                     <th>Descontos</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 <tr>
//                                                     <th>Salario Base</th>
//                                                     <td></td>
//                                                     <td>{formatSalary().format(single.salary_base)}</td>
//                                                 </tr>
//                                                 <tr>
//                                                     <th>Horas Extras - 50%</th>
//                                                     <td>{single.overtime50}</td>
//                                                     <td>{formatSalary().format(+single.totalOvertime50)}</td>
//                                                 </tr>
//                                                 <tr>
//                                                     <th>Horas Extras - 100%</th>
//                                                     <td>{single.overtime100}</td>
//                                                     <td>{formatSalary().format(single.totalOvertime100)}</td>
//                                                 </tr>
//                                                 <tr>
//                                                     <th>Subsidios</th>
//                                                     <td></td>
//                                                     <td>{formatSalary().format(single.subsidy)}</td>
//                                                 </tr>
//                                                 <tr>
//                                                     <th>Bonus</th>
//                                                     <td></td>
//                                                     <td>{formatSalary().format(single.bonus)}</td>
//                                                 </tr>
//                                                 <tr>
//                                                     <th>Faltas</th>
//                                                     <td>{single.absences}</td>
//                                                     <td></td>
//                                                     <td>{formatSalary().format(single.total_absences)}</td>
//                                                 </tr>
//                                                 {/* <tr>
//                                                     <th>Outros Descontos</th>
//                                                     <td></td>
//                                                     <td></td>
//                                                 </tr> */}
//                                                 <tr>
//                                                     <th>Salario Bruto</th>
//                                                     <td></td>
//                                                     <td>{formatSalary().format(single.total_income)}</td>
//                                                 </tr>
//                                                 <tr>
//                                                     <th>IRPS</th>
//                                                     <td></td>
//                                                     <td style={{border: "none"}}></td>
//                                                     <td>{formatSalary().format(single.irps)}</td>
//                                                 </tr>
//                                                 <tr>
//                                                     <th>INSS</th>
//                                                     <td></td>
//                                                     <td style={{border: "none"}}></td>
//                                                     <td>{formatSalary().format(single.inss_employee)}</td>
//                                                 </tr>
//                                                 <tr>
//                                                     <th>Emprestimo</th>
//                                                     <td></td>
//                                                     <td style={{border: "none"}}></td>
//                                                     <td>{formatSalary().format(single.cash_advances)}</td>
//                                                 </tr>
//                                                 <tr>
//                                                     <th>Salario Liquido</th>
//                                                     <td style={{borderRight: "1px solid #FFF"}}></td>
//                                                     <td style={{borderLeft: "1px solid #FFF", borderRight: "1px solid #FFF"}}>{formatSalary().format(single.salary_liquid)}</td>
//                                                     <td></td>
//                                                 </tr>
//                                             </tbody>          
//                                     </table>
//                                 </div>

//                                 <hr/>
//                                 <br/>

//                                 <div className="footer">
//                                     <div>
//                                         <span>Assinatura:</span>
//                                         <span className="linha">___________________________</span>
//                                     </div>
//                                     <div>
//                                         <span>Data: </span>
//                                         <span>{formatDate().format(date)}</span>
//                                     </div>
//                                     <div>
//                                         <span>Local: </span>
//                                         <span>{
//                                             setting.company_city  && setting.company_province? setting.company_city+", "+setting.company_province  : "_______________________"
//                                         }
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </td>
//                     </tr>
//                 )}
//                 </tbody>

//                 <tfoot>
//                 <tr>
//                     <td>
//                     <div className="page-footer-space"></div>
//                     </td>
//                 </tr>
//                 </tfoot>

//             </table>

//         </div>
//         </div>
//     )
// }