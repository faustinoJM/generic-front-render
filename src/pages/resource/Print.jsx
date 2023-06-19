import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print";
import api from "../../services/api";
import './printz.scss'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"



const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }
const formatDate = (language) => {
    return new Intl.DateTimeFormat(language, { dateStyle: 'long'})
  }




const PrintZ = ({componentRef, single}) => {
    // const componentRef = useRef();
    const [companyName, setCompanyName] = useState("")
    const [setting, setSetting] = useState("")
    const [urlLogo, setUrlLogo] = useState(null);

    useEffect(() => {
        async function fetch() {
            const response = await api.get("settings")
            // const responsePay = await api.get("payrolls")
            // setmaumau(responsePay.data)
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
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'emp-data',
        onAfterPrint: () => alert('Print sucess')
    })
    let date  = new Date()

    // return (
    //     <div style={{display: "none"}}>
    //     <div  ref={componentRef} style={{width: '100%', height: window.innerHeight}}>
    //         {/* text-align: center */}
    //         <div className="page-header">
    //                 {/* I'm The Header
    //                 <br/> */}
    //         </div>

    //         <div className="page-footer">
    //             {/* I'm The Footer */}
    //         </div>
            
    //         <table className="page-body">
    //             <thead>
    //             <tr>
    //                 <td>
    //                 <div className="page-header-space"></div>
    //                 </td>
    //             </tr>
    //             </thead>

    //             <tbody>
    //             {maumau.map(single => 
    //                 <tr>
    //                     <td>
    //                         <div className="page">
    //                             <div className="nameAdress">
    //                                 <h1>{setting?.company_name ?? "Elint Payroll"}</h1>
    //                                 <span>{setting?.company_address ?? "Av. Kruss Gomes"}</span>
    //                                 <span>{setting?.company_city ?? "Beira"}</span>
    //                             </div>
    //                             <div className="employeeData">
    //                                 <div className="idRecibo">
    //                                     <div className="id">
    //                                         <span>ID do Trabalhador:</span>
    //                                         <span>{single.employee_id}</span>
    //                                     </div>
    //                                     <div className="recibo">
    //                                         <span className="title">Recibo/Payslip</span>
    //                                         <div className="mes">
    //                                             <span>Para mes de:</span>
    //                                             <span>{single.month}</span>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                                 <div className="tableEmployeeData">
    //                                     <table>
    //                                         <tr>
    //                                             <th>Nome:</th>
    //                                             <td>{single.employee_name}</td>
    //                                             <th>Nr. Seg. Social:</th>
    //                                             <td>{single.social_security}</td>
    //                                         </tr>
    //                                         <tr>
    //                                             <th>Cargo:</th>
    //                                             <td>{single.position_name}</td>
    //                                             <th>Nr. Contribuinte:</th>
    //                                             <td>{single.nuit}</td>
    //                                         </tr>
    //                                         <tr>
    //                                             <th>Departamento:</th>
    //                                             <td>{single.department_name}</td>
    //                                             <th>Dias de Ferias:</th>
    //                                             <td>{single.vacation}</td>
    //                                         </tr>
    //                                     </table>
    //                                 </div> 
    //                             </div>

    //                             <br/>
    //                             <hr/>

    //                             <div className="employePayment">
    //                                 <table>
    //                                         <thead>
    //                                             <tr>
    //                                                 <th style={{borderLeft: "1px solid #FFF", borderTop: "1px solid #FFF", borderRight: "1px solid #FFF"}}></th>
    //                                                 <th style={{borderLeft: "1px solid #FFF", borderTop: "1px solid #FFF"}}></th>
    //                                                 <th>Remuneracoes</th>
    //                                                 <th>Descontos</th>
    //                                             </tr>
    //                                         </thead>
    //                                         <tbody>
    //                                             <tr>
    //                                                 <th>Salario Base</th>
    //                                                 <td></td>
    //                                                 <td>{formatSalary().format(single.salary_base)}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <th>Horas Extras - 50%</th>
    //                                                 <td>{single.overtime50}</td>
    //                                                 <td>{formatSalary().format(+single.totalOvertime50)}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <th>Horas Extras - 100%</th>
    //                                                 <td>{single.overtime100}</td>
    //                                                 <td>{formatSalary().format(single.totalOvertime100)}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <th>Subsidios</th>
    //                                                 <td></td>
    //                                                 <td>{formatSalary().format(single.subsidy)}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <th>Bonus</th>
    //                                                 <td></td>
    //                                                 <td>{formatSalary().format(single.bonus)}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <th>Faltas</th>
    //                                                 <td>{single.absences}</td>
    //                                                 <td></td>
    //                                                 <td>{formatSalary().format(single.total_absences)}</td>
    //                                             </tr>
    //                                             {/* <tr>
    //                                                 <th>Outros Descontos</th>
    //                                                 <td></td>
    //                                                 <td></td>
    //                                             </tr> */}
    //                                             <tr>
    //                                                 <th>Salario Bruto</th>
    //                                                 <td></td>
    //                                                 <td>{formatSalary().format(single.total_income)}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <th>IRPS</th>
    //                                                 <td></td>
    //                                                 <td style={{border: "none"}}></td>
    //                                                 <td>{formatSalary().format(single.irps)}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <th>INSS</th>
    //                                                 <td></td>
    //                                                 <td style={{border: "none"}}></td>
    //                                                 <td>{formatSalary().format(single.inss_employee)}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <th>Emprestimo</th>
    //                                                 <td></td>
    //                                                 <td style={{border: "none"}}></td>
    //                                                 <td>{formatSalary().format(single.cash_advances)}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <th>Salario Liquido</th>
    //                                                 <td style={{borderRight: "1px solid #FFF"}}></td>
    //                                                 <td style={{borderLeft: "1px solid #FFF", borderRight: "1px solid #FFF"}}>{formatSalary().format(single.salary_liquid)}</td>
    //                                                 <td></td>
    //                                             </tr>
    //                                         </tbody>          
    //                                 </table>
    //                             </div>

    //                             <hr/>
    //                             <br/>

    //                             <div className="footer">
    //                                 <div>
    //                                     <span>Assinatura:</span>
    //                                     <span className="linha">___________________________</span>
    //                                 </div>
    //                                 <div>
    //                                     <span>Data: </span>
    //                                     <span>{formatDate().format(date)}</span>
    //                                 </div>
    //                                 <div>
    //                                     <span>Local: </span>
    //                                     <span>{
    //                                         setting.company_city  && setting.company_province? setting.company_city+", "+setting.company_province  : "_______________________"
    //                                     }
    //                                     </span>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </td>
    //                 </tr>
    //             )}
    //             </tbody>

    //             <tfoot>
    //             <tr>
    //                 <td>
    //                 <div className="page-footer-space"></div>
    //                 </td>
    //             </tr>
    //             </tfoot>

    //         </table>

    //     </div>
    //     </div>
    // )

    return (
        <div  className="noneDiv">
            {/* <div ref={componentRef} style={{width: '80%', height: window.innerHeight, marginRight: 'auto', marginLeft: 'auto'}}> */}
            <div ref={componentRef} style={{}} className="componentRef">
                <div className="containerPrintSlip">
                    <table>
                        <thead>
                        </thead>
                        <tbody style={{height: "100%"}}>
                            <tr style={{background: "red", height: "50%"}}>
                                <td style={{height: "100%"}}>
                                <div className="printSlip1">
                        
                        {/* <br/> 
                            <hr/>*/}
                        <div className="employePayment">
                        <hr/>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{borderLeft: "1px solid #FFF", borderTop: "1px solid #FFF", borderRight: "1px solid #FFF"}}></th>
                                        <th style={{borderLeft: "1px solid #FFF", borderTop: "1px solid #FFF"}}></th>
                                        <th>{setting.language_options ===  "pt" ? "Remuneracoes" : "Income"}</th>
                                        <th>{setting.language_options ===  "pt" ? "Descontos" : "Deduction"}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>{setting.language_options ===  "pt" ? "Salario Base" : "Base Salary"}</th>
                                        <td></td>
                                        <td>{formatSalary().format(single.salary_base)}</td>
                                    </tr>
                                    {setting?.column_overtime === "true" ?
                                    <tr>
                                        <th>{setting.language_options ===  "pt" ? "Horas Extras - 50%" : "Overtime - 50%"}</th>
                                        <td>{single.overtime50}</td>
                                        <td>{formatSalary().format(+single.totalOvertime50)}</td>
                                    </tr>
                                    : ""
                                    }
                                    {setting?.column_overtime === "true" ?
                                    <tr>
                                        <th>{setting.language_options ===  "pt" ? "Horas Extras - 100%" : "Overtime - 100%"}</th>
                                        <td>{single.overtime100}</td>
                                        <td>{formatSalary().format(single.totalOvertime100)}</td>
                                    </tr>
                                    : ""
                                    }
                                    {setting.column_subsidy === "true" ?
                                    <tr>
                                        <th>{setting.language_options ===  "pt" ? "Subsidios" : "Subsidy"}</th>
                                        <td></td>
                                        <td>{formatSalary().format(single.subsidy)}</td>
                                    </tr>
                                    : ""
                                    }
                                    {setting.column_bonus === "true" ? 
                                    <tr>
                                        <th>Bonus</th>
                                        <td></td>
                                        <td>{formatSalary().format(single.bonus)}</td>
                                    </tr>
                                    : ""
                                    }
                                    {setting.column_absences === "true" ? 
                                    <tr>
                                        <th>{setting.language_options ===  "pt" ? "Faltas" : "Absences"}</th>
                                        <td>{single.absences}</td>
                                        <td></td>
                                        <td>{formatSalary().format(single.total_absences)}</td>
                                    </tr>
                                    : ""
                                    }
                                    <tr>
                                        <th>{setting.language_options ===  "pt" ? "Salario Bruto" : "Gross Salary"}</th>
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
                                    {setting.column_cash_advances === "true" ?
                                    <tr>
                                        <th>{setting.language_options ===  "pt" ? "Emprestimo" : "Cash Advances"}</th>
                                        <td></td>
                                        <td style={{border: "none"}}></td>
                                        <td>{formatSalary().format(single.cash_advances)}</td>
                                    </tr>
                                    : ""
                                    }
                                    {setting.column_syndicate === "true" ?
                                    <tr>
                                        <th>{setting.language_options ===  "pt" ? "Sindicato" : "Syndicate"}</th>
                                        <td></td>
                                        <td style={{border: "none"}}></td>
                                        <td>{formatSalary().format(single.syndicate_employee)}</td>
                                    </tr>
                                    : ""
                                    }
                                    <tr>
                                        <th>{setting.language_options ===  "pt" ? "Salario Liquido" : "Liquid Salary"}</th>
                                        <td style={{borderRight: "1px solid #FFF"}}></td>
                                        <td style={{borderLeft: "1px solid #FFF", borderRight: "1px solid #FFF"}}>{formatSalary().format(single.salary_liquid)}</td>
                                        <td></td>
                                    </tr>
                                </tbody>          
                            </table>
                            <hr/>
                        </div>
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
                            <div>
                                <span>{setting.language_options ===  "pt" ? "Data: " : "Date: "}</span>
                                <span>{setting.language_options ===  "pt" ? formatDate("pt-br").format(date) : formatDate("en-uk").format(date)}</span>
                            </div>
                            {/* <div>
                                <span>Local: </span>
                                <span>{
                                    setting.company_city  && setting.company_province? setting.company_city+", "+setting.company_province  : "_______________________"
                                }
                                </span>
                            </div> */}
                            
                        </div>
                                </div>
                                </td>
                                
                            
                            </tr>
                            <tr style={{background: "green", minHeight: "500px"}}>
                                <td  style={{height: "50%"}}>
                                <div className="printSlip2">
                            <div className="logo_and_adress">
                                <div className="nameAdress">
                                    <h1>{setting?.company_name ?? "Elint Payroll"}</h1>
                                    <span>{setting?.company_address ?? "Av. Kruss Gomes"}</span>
                                    <span>{setting?.company_city ?? "Beira"}</span>
                                    <span>{setting?.company_province ?? "Sofala"}</span>
                                </div>
                                <div className="logo_print">
                                    { urlLogo ?<img 
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
                                        <span>{setting.language_options === "pt" ? "ID do Trabalhador: " : "Employee Id: "}</span>
                                        <span>{single.employee_number}</span>
                                    </div>
                                    <div className="recibo">
                                        <span className="title">Recibo/Payslip</span>
                                        <div className="mes">
                                            <span>{setting.language_options ===  "pt" ? "Para mes de: " : "For months of: "}</span>
                                            <span>{single.month}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="tableEmployeeData">
                                    <table>
                                        <tr>
                                            <th>{setting.language_options ===  "pt" ? "Nome" : "Name"}</th>
                                            <td>{single.employee_name}</td>
                                            <th>{setting.language_options ===  "pt" ? "Nr. Seg. Social" : "Social Security Num."}</th>
                                            <td>{single.social_security}</td>
                                        </tr>
                                        <tr>
                                            <th>{setting.language_options ===  "pt" ? "Cargo" : "Position"}</th>
                                            <td>{single.position_name}</td>
                                            <th>{setting.language_options ===  "pt" ? "Numero de Nuit" : "Nuit Number"}</th>
                                            <td>{single.nuit}</td>
                                        </tr>
                                        <tr>
                                            <th>{setting.language_options ===  "pt" ? "Departamento" : "Department"}</th>
                                            <td>{single.department_name}</td>
                                            <th>{setting.language_options ===  "pt" ? "Dias de Ferias" : "Vacation days"}</th>
                                            <td>{single.vacation}</td>
                                        </tr>
                                    </table>
                                </div> 
                            </div>
                            {/* <br/> 
                                <hr/>*/}
                            <div className="employePayment">
                            <hr/>
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{borderLeft: "1px solid #FFF", borderTop: "1px solid #FFF", borderRight: "1px solid #FFF"}}></th>
                                            <th style={{borderLeft: "1px solid #FFF", borderTop: "1px solid #FFF"}}></th>
                                            <th>{setting.language_options ===  "pt" ? "Remuneracoes" : "Income"}</th>
                                            <th>{setting.language_options ===  "pt" ? "Descontos" : "Deduction"}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>{setting.language_options ===  "pt" ? "Salario Base" : "Base Salary"}</th>
                                            <td></td>
                                            <td>{formatSalary().format(single.salary_base)}</td>
                                        </tr>
                                        {setting?.column_overtime === "true" ?
                                        <tr>
                                            <th>{setting.language_options ===  "pt" ? "Horas Extras - 50%" : "Overtime - 50%"}</th>
                                            <td>{single.overtime50}</td>
                                            <td>{formatSalary().format(+single.totalOvertime50)}</td>
                                        </tr>
                                        : ""
                                        }
                                        {setting?.column_overtime === "true" ?
                                        <tr>
                                            <th>{setting.language_options ===  "pt" ? "Horas Extras - 100%" : "Overtime - 100%"}</th>
                                            <td>{single.overtime100}</td>
                                            <td>{formatSalary().format(single.totalOvertime100)}</td>
                                        </tr>
                                        : ""
                                        }
                                        {setting.column_subsidy === "true" ?
                                        <tr>
                                            <th>{setting.language_options ===  "pt" ? "Subsidios" : "Subsidy"}</th>
                                            <td></td>
                                            <td>{formatSalary().format(single.subsidy)}</td>
                                        </tr>
                                        : ""
                                        }
                                        {setting.column_bonus === "true" ? 
                                        <tr>
                                            <th>Bonus</th>
                                            <td></td>
                                            <td>{formatSalary().format(single.bonus)}</td>
                                        </tr>
                                        : ""
                                        }
                                        {setting.column_absences === "true" ? 
                                        <tr>
                                            <th>{setting.language_options ===  "pt" ? "Faltas" : "Absences"}</th>
                                            <td>{single.absences}</td>
                                            <td></td>
                                            <td>{formatSalary().format(single.total_absences)}</td>
                                        </tr>
                                        : ""
                                        }
                                        <tr>
                                            <th>{setting.language_options ===  "pt" ? "Salario Bruto" : "Gross Salary"}</th>
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
                                        {setting.column_cash_advances === "true" ?
                                        <tr>
                                            <th>{setting.language_options ===  "pt" ? "Emprestimo" : "Cash Advances"}</th>
                                            <td></td>
                                            <td style={{border: "none"}}></td>
                                            <td>{formatSalary().format(single.cash_advances)}</td>
                                        </tr>
                                        : ""
                                        }
                                        {setting.column_syndicate === "true" ?
                                        <tr>
                                            <th>{setting.language_options ===  "pt" ? "Sindicato" : "Syndicate"}</th>
                                            <td></td>
                                            <td style={{border: "none"}}></td>
                                            <td>{formatSalary().format(single.syndicate_employee)}</td>
                                        </tr>
                                        : ""
                                        }
                                        <tr>
                                            <th>{setting.language_options ===  "pt" ? "Salario Liquido" : "Liquid Salary"}</th>
                                            <td style={{borderRight: "1px solid #FFF"}}></td>
                                            <td style={{borderLeft: "1px solid #FFF", borderRight: "1px solid #FFF"}}>{formatSalary().format(single.salary_liquid)}</td>
                                            <td></td>
                                        </tr>
                                    </tbody>          
                                </table>
                                <hr/>
                            </div>
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
                                <div>
                                    <span>{setting.language_options ===  "pt" ? "Data: " : "Date: "}</span>
                                    <span>{setting.language_options ===  "pt" ? formatDate("pt-br").format(date) : formatDate("en-uk").format(date)}</span>                            </div>
                            </div>
                                </div>
                                </td>
                                
                            </tr>
                        </tbody>
                    </table>
                    

                    

                </div>
            </div>
        </div>
    )
}


export default PrintZ


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


// {column_bonus}{column_subsidy}{column_absences}{column_cash_advances}
// {column_overtime}