import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print";
import api from "../../services/api";
import './printPayslip.scss'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"



const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }
const formatDate = (language) => {
    return new Intl.DateTimeFormat(language, { dateStyle: 'long'})
  }

  
  export function printPayslipBucket(printData) {
    console.log(printData)
    const montYear = printData.length > 0 ? `${printData[0].month}/${printData[0].year}` : ""
    let totalRow = []
    if (printData.length > 0) {
        totalRow = totalPrint(printData)

        printData.map(data => {
            data.salary_base = formatSalary().format(data.salary_base)
            data.subsidy = data.subsidy > 0 ? formatSalary().format(data.subsidy) : "-"
            data.total_overtime =  data.total_overtime > 0 ? formatSalary().format(data.total_overtime) : "-"
            data.bonus = data.bonus > 0 ? formatSalary().format(data.bonus) : "-"
            data.total_absences = data.total_absences > 0 ? formatSalary().format(data.total_absences) : "-"
            data.total_income = formatSalary().format(data.total_income)
            data.inss_employee = formatSalary().format(data.inss_employee)
            data.inss_company = formatSalary().format(data.inss_company)
            data.total_inss = formatSalary().format(data.total_inss)
            data.irps = formatSalary().format(data.irps)
            data.cash_advances = formatSalary().format(data.cash_advances)
            data.syndicate_employee = formatSalary().format(data.syndicate_employee)
            data.salary_liquid = formatSalary().format(data.salary_liquid)
        })
    }

    pdfMake.vfs = pdfFonts.pdfMake.vfs

    const reportTitle = [
        {
            text: "IFM Wages\nAv. Kruss Gomes\nBeira",
            fontSize: 12,
            bold: true,
            margin: [40, 10, 40, 10]
        },
    ]
    
    const dados = printData.map((data, index) => {
        return [
            {text: data.employee_name, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.position_name, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.department_name, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.social_security, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.nuit, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.vacation, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.salary_base, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.total_income, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.salary_liquid, fontSize: 10, margin: [0, 2, 0, 2]},
        ]
    })

    const details = [
        {
            table: {
                // widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
                headerRows: 1,
                body: [
                    [
                        {text: "Nome", style: "tableHeader", alignment: "center", fontSize: 10, margin: [0, 2, 0, 2]},
                        {text: "Cargo", style: "tableHeader", alignment: "center", fontSize: 10, margin: [0, 2, 0, 2]},
                        {text: "Departamento", style: "tableHeader", alignment: "center", fontSize: 10, margin: [0, 2, 0, 2]},
                        {text: "Nr. Seg. Social", style: "tableHeader", alignment: "center", fontSize: 10, margin: [0, 2, 0, 2]},
                        {text: "Nr. Contribuinte", style: "tableHeader", alignment: "center", fontSize: 10, margin: [0, 2, 0, 2]},
                        {text: "Dias de Ferias", style: "tableHeader", alignment: "center", fontSize: 10, margin: [0, 2, 0, 2]},
                        {text: "Salario Base", style: "tableHeader", alignment: "center", fontSize: 10, margin: [0, 2, 0, 2]},
                        {text: "Salario Bruto", style: "tableHeader", alignment: "center", fontSize: 10, margin: [0, 2, 0, 2]},
                        {text: "Salario Liquido", style: "tableHeader", alignment: "center", fontSize: 10, margin: [0, 2, 0, 2]},
                    ],
                    // [ {text: "sdsada", fontSize: 10, margin: [0, 2, 0, 2]}]
                    // [ {text: "sdsada", fontSize: 10, margin: [0, 2, 0, 2]}]

                    ...dados,
                
                ]

            },
        },
        {text: "\n\n"},
        
        

        
    ]

    function rodape(currentPage, pageCount) {
        return [
            {
                text: currentPage + ' / ' + pageCount,
                alignment: 'right',
                fontSize: 15,
                // bold: true,
                margin: [0, 10, 20, 0]
            }
        ]
    }

    const reportFooter = [
        {
           
            text: `Assinatura\n________________________\nData: ${formatDate().format(new Date())}`,
            fontSize: 8,
            bold: false,
            margin: [40, 20, 40, 100]
        },
    ]

    const docDefinitions =  {
        pageSize: 'A4',
        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: 'portrait',
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 40, 60, 40, 700 ],
        header: [reportTitle],
        content: [details],
        footer: [reportFooter],
        info: {
            title: `Elint-Systems-Payroll PDF ${montYear}`,
            author: 'elint systems',
            subject: 'subject of document',
            keywords: 'keywords for document',
            },
    }

    pdfMake.createPdf(docDefinitions).open()
    // pdfMake.createPdf(docDefinitions).download('optionalName.pdf');

}



const PrintPayslip = ({componentRef, single}) => {
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
    const printSlipType = (type) => {
        if (type === 1 || !type)
            return (
            <div  ref={componentRef} style={{width: '100%', height: window.innerHeight}}>
                <div className="containerPrintSlip">
                    <div className="print-down" style={{padding: "0 25px"}}>
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
            </div>
            )
        if (type === 2)
            return (
                <div  ref={componentRef} style={{width: '100%', height: window.innerHeight}}>
                    <div className="containerPrintSlip">
                        <div className="print-down" style={{padding: "15px 45px"}}>
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
                </div>
            )

    }

    return (
        <div style={{display: "none"}} className="noneDiv">
           {printSlipType(setting.payslip_type)}
        </div>
    )
}


export default PrintPayslip


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