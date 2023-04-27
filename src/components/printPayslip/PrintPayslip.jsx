import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print";
import api from "../../services/api";
import './printPayslip.scss'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"



const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }
const formatDate = () => {
    return new Intl.DateTimeFormat("pt-br", { dateStyle: 'long'})
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
            {text: data.departament_name, fontSize: 10, margin: [0, 2, 0, 2]},
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
    const [maumau, setmaumau] = useState([])

    useEffect(() => {
        async function fetch() {
            const response = await api.get("settings")
            // const responsePay = await api.get("payrolls")
            // setmaumau(responsePay.data)
            if (response.data){
                setSetting(response.data)
                setCompanyName(response.data.company_name)
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
    //                                             <td>{single.departament_name}</td>
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
    //                                                 <th>Subsidio</th>
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
    //                                                 <th>Adiantamento</th>
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
        <div style={{display: "none"}}>
            {/* <div ref={componentRef} style={{width: '80%', height: window.innerHeight, marginRight: 'auto', marginLeft: 'auto'}}> */}
            <div ref={componentRef} style={{}}>
                <div className="container">
                    <div className="nameAdress">
                        <h1>{setting?.company_name ?? "Elint Payroll"}</h1>
                        <span>{setting?.company_address ?? "Av. Kruss Gomes"}</span>
                        <span>{setting?.company_city ?? "Beira"}</span>
                        <span>{setting?.company_province ?? "Sofala"}</span>
                    </div>
                    <div className="employeeData">
                        <div className="idRecibo">
                            <div className="id">
                                <span>ID do Trabalhador:</span>
                                <span>{single.employee_id}</span>
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
                                    <th>Nr. Contribuinte:</th>
                                    <td>{single.nuit}</td>
                                </tr>
                                <tr>
                                    <th>Departamento:</th>
                                    <td>{single.departament_name}</td>
                                    <th>Dias de Ferias:</th>
                                    <td>{single.vacation}</td>
                                </tr>
                            </table>
                        </div> 
                    </div>
                    <br/>
                    <hr />
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
                                    <th>Subsidio</th>
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
                                    <th>Adiantamento</th>
                                    <td></td>
                                    <td style={{border: "none"}}></td>
                                    <td>{formatSalary().format(single.cash_advances)}</td>
                                </tr>
                                <tr>
                                    <th>Sindicato</th>
                                    <td></td>
                                    <td style={{border: "none"}}></td>
                                    <td>{formatSalary().format(single.syndicate_employee)}</td>
                                </tr>
                                <tr>
                                    <th>Salario Liquido</th>
                                    <td style={{borderRight: "1px solid #FFF"}}></td>
                                    <td style={{borderLeft: "1px solid #FFF", borderRight: "1px solid #FFF"}}>{formatSalary().format(single.salary_liquid)}</td>
                                    <td></td>
                                </tr>
                            </tbody>          
                        </table>
                        <hr/>
                    </div>
                    {/* <div>
                        <span>Salario Liquido</span>
                        <span></span>
                    </div> */}
                    <div className="footer">
                        <div>
                            <span>Assinatura:</span>
                            <span className="linha">___________________________</span>
                        </div>
                        <div>
                            <span>Data: </span>
                            <span>{formatDate().format(date)}</span>
                        </div>
                        <div>
                            <span>Local: </span>
                            <span>{
                                setting.company_city  && setting.company_province? setting.company_city+", "+setting.company_province  : "_______________________"
                            }
                            </span>
                        </div>
                        
                    </div>
                    {/* <div>
                        <hr/>
                        <h1>Assinatura</h1>
                        <button onClick={handlePrint}>Imprimir</button>
                    </div> */}
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
