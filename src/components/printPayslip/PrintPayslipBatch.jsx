import { useEffect, useRef, useState } from "react"
import './printPayslipBatch.scss'
import api from "../../services/api"

const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
}

const formatDate = () => {
    return new Intl.DateTimeFormat("pt-br", { dateStyle: 'long'})
}

const PrintPayslipBatch = ({componentRef, printData}) => {
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

    const printSlipType = (type) => {
        if (type === 1 || !type)
            return (
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
                                                        {setting.column_overtime === "true" ? 
                                                        <tr>
                                                            <th>Horas Extras - 50%</th>
                                                            <td>{single.overtime50}</td>
                                                            <td>{formatSalary().format(+single.totalOvertime50)}</td>
                                                        </tr>
                                                        : null
                                                        }
                                                        {setting.column_overtime === "true" ? 
                                                        <tr>
                                                            <th>Horas Extras - 100%</th>
                                                            <td>{single.overtime100}</td>
                                                            <td>{formatSalary().format(single.totalOvertime100)}</td>
                                                        </tr>
                                                        : null
                                                        }
                                                        {setting.column_subsidy === "true" ? 
                                                        <tr>
                                                            <th>Subsidios</th>
                                                            <td></td>
                                                            <td>{formatSalary().format((single.subsidy + single.subsidy_attendance 
                                                            + single.subsidy_commission + single.subsidy_food + single.subsidy_leadership 
                                                            + single.subsidy_medical + single.subsidy_night + single.subsidy_shift
                                                            + single.subsidy_risk + single.subsidy_performance + single.subsidy_residence
                                                            + single.subsidy_transport + single.subsidy_vacation))}
                                                            </td>
                                                        </tr>
                                                        : null
                                                        }
                                                        {setting.column_bonus === "true" ? 
                                                        <tr>
                                                            <th>Bonus</th>
                                                            <td></td>
                                                            <td>{formatSalary().format(single.bonus)}</td>
                                                        </tr>
                                                        : null
                                                        }
                                                        {setting.column_absences === "true" ? 
                                                        <tr>
                                                            <th>Faltas</th>
                                                            <td>{single.absences}</td>
                                                            <td></td>
                                                            <td>{formatSalary().format(single.total_absences)}</td>
                                                        </tr>
                                                        : null 
                                                        }
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
                                                        {setting.column_syndicate === "true" ? 
                                                        <tr>
                                                            <th>Sindicato</th>
                                                            <td></td>
                                                            <td style={{border: "none"}}></td>
                                                            <td>{formatSalary().format(single.cash_advances)}</td>
                                                        </tr>
                                                        : null
                                                        }
                                                        {setting.column_ipa_employee === "true" ? 
                                                        <tr>
                                                            <th>IPA</th>
                                                            <td></td>
                                                            <td style={{border: "none"}}></td>
                                                            <td>{formatSalary().format(single.ipa_employee)}</td>
                                                        </tr>
                                                        : null
                                                        }
                                                        {setting.column_cash_advances === "true" ? 
                                                        <tr>
                                                            <th>Emprestimo</th>
                                                            <td></td>
                                                            <td style={{border: "none"}}></td>
                                                            <td>{formatSalary().format(single.cash_advances)}</td>
                                                        </tr>
                                                        : null
                                                        }
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
                                                        {setting.column_overtime === "true" ? 
                                                        <tr>
                                                            <th>Horas Extras - 50%</th>
                                                            <td>{single.overtime50}</td>
                                                            <td>{formatSalary().format(+single.totalOvertime50)}</td>
                                                        </tr>
                                                        : null
                                                        }
                                                        {setting.column_overtime === "true" ? 
                                                        <tr>
                                                            <th>Horas Extras - 100%</th>
                                                            <td>{single.overtime100}</td>
                                                            <td>{formatSalary().format(single.totalOvertime100)}</td>
                                                        </tr>
                                                        : null
                                                        }
                                                        {setting.column_subsidy === "true" ? 
                                                        <tr>
                                                            <th>Subsidios</th>
                                                            <td></td>
                                                            <td>{formatSalary().format((single.subsidy + single.subsidy_attendance 
                                                            + single.subsidy_commission + single.subsidy_food + single.subsidy_leadership 
                                                            + single.subsidy_medical + single.subsidy_night + single.subsidy_shift
                                                            + single.subsidy_risk + single.subsidy_performance + single.subsidy_residence
                                                            + single.subsidy_transport + single.subsidy_vacation))}
                                                            </td>
                                                        </tr>
                                                        : null
                                                        }
                                                        {setting.column_bonus === "true" ? 
                                                        <tr>
                                                            <th>Bonus</th>
                                                            <td></td>
                                                            <td>{formatSalary().format(single.bonus)}</td>
                                                        </tr>
                                                        : null
                                                        }
                                                        {setting.column_absences === "true" ? 
                                                        <tr>
                                                            <th>Faltas</th>
                                                            <td>{single.absences}</td>
                                                            <td></td>
                                                            <td>{formatSalary().format(single.total_absences)}</td>
                                                        </tr>
                                                        : null 
                                                        }
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
                                                        {setting.column_syndicate === "true" ? 
                                                        <tr>
                                                            <th>Sindicato</th>
                                                            <td></td>
                                                            <td style={{border: "none"}}></td>
                                                            <td>{formatSalary().format(single.cash_advances)}</td>
                                                        </tr>
                                                        : null
                                                        }
                                                        {setting.column_ipa_employee === "true" ? 
                                                        <tr>
                                                            <th>IPA</th>
                                                            <td></td>
                                                            <td style={{border: "none"}}></td>
                                                            <td>{formatSalary().format(single.ipa_employee)}</td>
                                                        </tr>
                                                        : null
                                                        }
                                                        {setting.column_cash_advances === "true" ? 
                                                        <tr>
                                                            <th>Emprestimo</th>
                                                            <td></td>
                                                            <td style={{border: "none"}}></td>
                                                            <td>{formatSalary().format(single.cash_advances)}</td>
                                                        </tr>
                                                        : null
                                                        }
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
            )
        if (type === 2)
            return (
                <div  ref={componentRef} style={{width: '100%', height: window.innerHeight}}>
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
                                    <div className="print-top" style={{height: "480px", padding: "0 50px"}}>
                                    <div>
                                        <div  className="employee-company-data">
                                            <div>
                                                <span style={{fontWeight: "700"}}>RECIBO DE SALARIO</span>
                                                <span style={{fontWeight: "600"}}>{setting.company_name}</span>
                                                <span>{setting?.company_province}, {setting?.company_city}, {setting.company_address}</span>
                                                <span>Nome: {single.employee_name}</span>
                                            </div>
                                            <div>
                                                <span>Ano: {single.year}</span>
                                                <span>Mes: {single.month}</span>
                                            </div>
                                        </div>

                                        <div className="wrapper-div">
                                            <div className="column-head">
                                                <span style={{fontWeight: "700"}}>Salario base</span>
                                                <span>Dias Trabalhados</span>
                                                <span style={{fontWeight: "700"}}>Salario do Mes</span>
                                                <span>Dias de Ferias</span>
                                                {setting.column_overtime === "true" ? <span>Horas Extras</span> : null}
                                                {setting.column_bonus === "true" ? <span>Bonus</span> : null}
                                                {setting.column_subsidy_commission === "true" ? <span>Comissao</span> : null}
                                                {setting.column_subsidy === "true" ? <span>Subsidios</span> : null}
                                                {setting.column_subsidy_vacation === "true" ? <span>{"Subsidios de Ferias"}</span> : null}
                                                {setting.column_subsidy_food === "true" ? <span>{"Subsidios de Alimentacao"}</span> : null}
                                                {setting.column_subsidy_transport === "true" ? <span>{"Subsidios de Transporte"}</span> : null}
                                                {setting.column_subsidy_medical === "true" ? <span>{"Subsidios Medico"}</span> : null}
                                                {setting.column_subsidy_residence === "true" ? <span>{"Subsidios de Residencia"}</span> : null}
                                                {setting.column_subsidy_shift === "true" ? <span>{"Subsidios de Turno"}</span> : null}
                                                {setting.column_subsidy_night === "true" ? <span>{"Subsidios de Noturno"}</span> : null}
                                                {setting.column_subsidy_risk === "true" ? <span>{"Subsidios de Risco" }</span> : null}
                                                {setting.column_subsidy_performance === "true" ? <span>{"Subsidios de Desempenho" }</span> : null}
                                                {setting.column_subsidy_attendance === "true" ? <span>{"Subsidios de Assiduidade" }</span> : null}
                                                {setting.column_subsidy_leadership === "true" ? <span>{"Subsidios de Chefia" }</span> : null}
                                                {setting.column_backpay === "true" ? <span>Retroativo</span> : null}
                                                <span style={{fontWeight: "700"}}>Salario Grosso</span>
                                                <span>IRPS</span>
                                                <span>INSS</span>
                                                {setting.column_syndicate === "true" ? <span>Sindicato</span> : null}
                                                {setting.column_ipa_employee === "true" ? <span>IPA</span> : null}
                                                {setting.column_cash_advances === "true" ? <span>Emprestimo</span> : null}
                                                <span style={{fontWeight: "700"}}>Salario a Receber</span>
                                            </div>
                                            <div className="column-img">
                                                {urlLogo ? <img
                                                    src={
                                                    urlLogo ? urlLogo : ""
                                                    } 
                                                    alt="" />
                                                    : ""
                                                }
                                            </div>
                                            <div className="column-data">
                                                <span style={{fontWeight: "700"}}>{formatSalary().format(single.salary_base)}</span>
                                                <span>{30 - single.absences}</span>
                                                <span style={{fontWeight: "700"}}>{formatSalary().format(single.salary_base - single.total_absences)}</span>
                                                <span>{single.vacation}</span>
                                                {setting.column_overtime === "true" ? <span>{formatSalary().format(single.total_overtime)}</span> : null}
                                                {setting.column_bonus === "true" ? <span>{formatSalary().format(single.bonus)}</span> : null}
                                                {setting.column_subsidy_commission === "true" ? <span>{formatSalary().format(single.subsidy_commission)}</span> : null}
                                                {setting.column_subsidy === "true" ? <span>{formatSalary().format(single.subsidy)}</span> : null}
                                                {setting.column_subsidy_vacation === "true" ? <span>{formatSalary().format(single.subsidy_vacation)}</span> : null}
                                                {setting.column_subsidy_food === "true" ? <span>{formatSalary().format(single.subsidy_food)}</span> : null}
                                                {setting.column_subsidy_transport === "true" ? <span>{formatSalary().format(single.subsidy_transport)}</span> : null}
                                                {setting.column_subsidy_medical === "true" ? <span>{formatSalary().format(single.subsidy_medical)}</span> : null}
                                                {setting.column_subsidy_residence === "true" ? <span>{formatSalary().format(single.subsidy_residence)}</span> : null}
                                                {setting.column_subsidy_shift === "true" ? <span>{formatSalary().format(single.subsidy_shift)}</span> : null}
                                                {setting.column_subsidy_night === "true" ? <span>{formatSalary().format(single.subsidy_night)}</span> : null}
                                                {setting.column_subsidy_risk === "true" ? <span>{formatSalary().format(single.subsidy_risk)}</span> : null}
                                                {setting.column_subsidy_performance === "true" ? <span>{formatSalary().format(single.subsidy_performance)}</span> : null}
                                                {setting.column_subsidy_attendance === "true" ? <span>{formatSalary().format(single.subsidy_attendance)}</span> : null}
                                                {setting.column_subsidy_leadership === "true" ? <span>{formatSalary().format(single.subsidy_leadership)}</span> : null}
                                                {setting.column_backpay === "true" ? <span>{formatSalary().format(single.backpay)}</span> : null}
                                                <span style={{fontWeight: "700"}}>{formatSalary().format(single.total_income)}</span>
                                                <span>{formatSalary().format(single.irps)}</span>
                                                <span>{formatSalary().format(single.inss_employee)}</span>
                                                {setting.column_syndicate === "true" ? <span>{formatSalary().format(single.syndicate_employee)}</span> : null}
                                                {setting.column_ipa_employee === "true" ? <span>{formatSalary().format(single.ipa_employee)}</span>: null}
                                                {setting.column_cash_advances === "true" ? <span>{formatSalary().format(single.cash_advances)}</span> : null}
                                                <span style={{fontWeight: "700"}}>{formatSalary().format(single.salary_liquid)}</span>
                                            </div>
                                        </div>

                                        <div className="footer-2">
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

                                    
                                    <hr style={{border: "0", borderBottom: "1px solid lightgray", width: "800px"}}></hr>

                                    <div className="print-down" style={{height: "480px", padding: "0 25px"}}>
                                        <div>
                                            <div  className="employee-company-data">
                                                <div>
                                                    <span style={{fontWeight: "700"}}>RECIBO DE SALARIO</span>
                                                    <span style={{fontWeight: "600"}}>{setting.company_name}</span>
                                                    <span>{setting?.company_province}, {setting?.company_city}, {setting.company_address}</span>
                                                    <span>Nome: {single.employee_name}</span>
                                                </div>
                                                <div>
                                                    <span>Ano: {single.year}</span>
                                                    <span>Mes: {single.month}</span>
                                                </div>
                                            </div>

                                            <div className="wrapper-div">
                                                <div className="column-head">
                                                    <span style={{fontWeight: "700"}}>Salario base</span>
                                                    <span>Dias Trabalhados</span>
                                                    <span style={{fontWeight: "700"}}>Salario do Mes</span>
                                                    <span>Dias de Ferias</span>
                                                    {setting.column_overtime === "true" ? <span>Horas Extras</span> : null}
                                                    {setting.column_bonus === "true" ? <span>Bonus</span> : null}
                                                    {setting.column_subsidy_commission === "true" ? <span>Comissao</span> : null}
                                                    {setting.column_subsidy === "true" ? <span>Subsidios</span> : null}
                                                    {setting.column_subsidy_vacation === "true" ? <span>{"Subsidios de Ferias"}</span> : null}
                                                    {setting.column_subsidy_food === "true" ? <span>{"Subsidios de Alimentacao"}</span> : null}
                                                    {setting.column_subsidy_transport === "true" ? <span>{"Subsidios de Transporte"}</span> : null}
                                                    {setting.column_subsidy_medical === "true" ? <span>{"Subsidios Medico"}</span> : null}
                                                    {setting.column_subsidy_residence === "true" ? <span>{"Subsidios de Residencia"}</span> : null}
                                                    {setting.column_subsidy_shift === "true" ? <span>{"Subsidios de Turno"}</span> : null}
                                                    {setting.column_subsidy_night === "true" ? <span>{"Subsidios de Noturno"}</span> : null}
                                                    {setting.column_subsidy_risk === "true" ? <span>{"Subsidios de Risco" }</span> : null}
                                                    {setting.column_subsidy_performance === "true" ? <span>{"Subsidios de Desempenho" }</span> : null}
                                                    {setting.column_subsidy_attendance === "true" ? <span>{"Subsidios de Assiduidade" }</span> : null}
                                                    {setting.column_subsidy_leadership === "true" ? <span>{"Subsidios de Chefia" }</span> : null}
                                                    {setting.column_backpay === "true" ? <span>Retroativo</span> : null}
                                                    <span style={{fontWeight: "700"}}>Salario Grosso</span>
                                                    <span>IRPS</span>
                                                    <span>INSS</span>
                                                    {setting.column_syndicate === "true" ? <span>Sindicato</span> : null}
                                                    {setting.column_ipa_employee === "true" ? <span>IPA</span> : null}
                                                    {setting.column_cash_advances === "true" ? <span>Emprestimo</span> : null}
                                                    <span style={{fontWeight: "700"}}>Salario a Receber</span>
                                                </div>
                                                <div className="column-img">
                                                    {urlLogo ? <img
                                                        src={
                                                        urlLogo ? urlLogo : ""
                                                        } 
                                                        alt="" />
                                                        : ""
                                                    }
                                                </div>
                                                <div className="column-data">
                                                    <span style={{fontWeight: "700"}}>{formatSalary().format(single.salary_base)}</span>
                                                    <span>{30 - single.absences}</span>
                                                    <span style={{fontWeight: "700"}}>{formatSalary().format(single.salary_base - single.total_absences)}</span>
                                                    <span>{single.vacation}</span>
                                                    {setting.column_overtime === "true" ? <span>{formatSalary().format(single.total_overtime)}</span> : null}
                                                    {setting.column_bonus === "true" ? <span>{formatSalary().format(single.bonus)}</span> : null}
                                                    {setting.column_subsidy_commission === "true" ? <span>{formatSalary().format(single.subsidy_commission)}</span> : null}
                                                    {setting.column_subsidy === "true" ? <span>{formatSalary().format(single.subsidy)}</span> : null}
                                                    {setting.column_subsidy_vacation === "true" ? <span>{formatSalary().format(single.subsidy_vacation)}</span> : null}
                                                    {setting.column_subsidy_food === "true" ? <span>{formatSalary().format(single.subsidy_food)}</span> : null}
                                                    {setting.column_subsidy_transport === "true" ? <span>{formatSalary().format(single.subsidy_transport)}</span> : null}
                                                    {setting.column_subsidy_medical === "true" ? <span>{formatSalary().format(single.subsidy_medical)}</span> : null}
                                                    {setting.column_subsidy_residence === "true" ? <span>{formatSalary().format(single.subsidy_residence)}</span> : null}
                                                    {setting.column_subsidy_shift === "true" ? <span>{formatSalary().format(single.subsidy_shift)}</span> : null}
                                                    {setting.column_subsidy_night === "true" ? <span>{formatSalary().format(single.subsidy_night)}</span> : null}
                                                    {setting.column_subsidy_risk === "true" ? <span>{formatSalary().format(single.subsidy_risk)}</span> : null}
                                                    {setting.column_subsidy_performance === "true" ? <span>{formatSalary().format(single.subsidy_performance)}</span> : null}
                                                    {setting.column_subsidy_attendance === "true" ? <span>{formatSalary().format(single.subsidy_attendance)}</span> : null}
                                                    {setting.column_subsidy_leadership === "true" ? <span>{formatSalary().format(single.subsidy_leadership)}</span> : null}
                                                    {setting.column_backpay === "true" ? <span>{formatSalary().format(single.backpay)}</span> : null}
                                                    <span style={{fontWeight: "700"}}>{formatSalary().format(single.total_income)}</span>
                                                    <span>{formatSalary().format(single.irps)}</span>
                                                    <span>{formatSalary().format(single.inss_employee)}</span>
                                                    {setting.column_syndicate === "true" ? <span>{formatSalary().format(single.syndicate_employee)}</span> : null}
                                                    {setting.column_ipa_employee === "true" ? <span>{formatSalary().format(single.ipa_employee)}</span>: null}
                                                    {setting.column_cash_advances === "true" ? <span>{formatSalary().format(single.cash_advances)}</span> : null}
                                                    <span style={{fontWeight: "700"}}>{formatSalary().format(single.salary_liquid)}</span>
                                                </div>
                                            </div>

                                            <div className="footer-2">
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
            )

    }

    let date  = new Date()

    return (
        <div style={{display: "none"}}>
            {printSlipType(setting.payslip_type)}
        </div>
    )
}


export default PrintPayslipBatch


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