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

    return (
        <div style={{display: "none"}} className="noneDiv">
            {/* <div ref={componentRef} style={{width: '80%', height: window.innerHeight, marginRight: 'auto', marginLeft: 'auto'}}> */}
            <div ref={componentRef} style={{}} className="componentRef">
                <div className="containerPrintSlip">
                    
                    <div className="printSlip-1" style={{height: "500px", padding: "0 25px"}}>
                        <div className="logo_and_adress">
                            <div className="nameAdress">
                                <h1>{setting?.company_name ?? "Elint Payroll"}</h1>
                                <span>{setting?.company_address ?? "Av. Kruss Gomes"}</span>
                                <span>{setting?.company_city ?? "Beira"}</span>
                                <span>{setting?.company_province ?? "Sofala"}</span>
                            </div>
                            <div className="logo_print">
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
                            <div className="date">
                                <span>{setting.language_options ===  "pt" ? "Data: " : "Date: "}</span>
                                <span>{setting.language_options ===  "pt" ? formatDate("pt-br").format(date) : formatDate("en-uk").format(date)}</span>
                            </div>
                            <div className="comment">
                                <span>{setting?.payslip_comment ?? ""}</span>
                            </div>
                        </div>
                    </div>

                    <hr style={{}}/>

                    <div className="printSlip-2" style={{height: "500px", padding: "0 25px"}}>
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
                                    <tr>
                                        <th>{setting.language_options ===  "pt" ? "Subsidios Ferias" : "Subsidy"}</th>
                                        <td></td>
                                        <td>{formatSalary().format(single.subsidy)}</td>
                                    </tr>
                                    <tr>
                                        <th>{setting.language_options ===  "pt" ? "Subsidios Alimentacao" : "Subsidy"}</th>
                                        <td></td>
                                        <td>{formatSalary().format(single.subsidy)}</td>
                                    </tr>
                                    <tr>
                                        <th>{setting.language_options ===  "pt" ? "Subsidios Transporte" : "Subsidy"}</th>
                                        <td></td>
                                        <td>{formatSalary().format(single.subsidy)}</td>
                                    </tr>
                                    <tr>
                                        <th>{setting.language_options ===  "pt" ? "Subsidios Turno" : "Subsidy"}</th>
                                        <td></td>
                                        <td>{formatSalary().format(single.subsidy)}</td>
                                    </tr>
                                    <tr>
                                        <th>{setting.language_options ===  "pt" ? "Subsidios Chefia" : "Subsidy"}</th>
                                        <td></td>
                                        <td>{formatSalary().format(single.subsidy)}</td>
                                    </tr>
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