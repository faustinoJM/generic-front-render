import { useState } from "react"
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"
import './printPayrollMulti.scss'
import api from "../../services/api";
import { useEffect } from "react";
import htmlToPdfmake from "html-to-pdfmake";
import cons from "./coons.jpeg"

const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }
const formatDate = () => {
    return new Intl.DateTimeFormat("pt-br", { dateStyle: 'long'})
  }

export function printPDF(printData, settingData, urlLogo) {  
    var ret = htmlToPdfmake(`<img src="http://localhost:3333/companyy-logo/a4df5c8f488f42edb31bb7396393bb13-1534421123621.jpeg">`, {
        imagesByReference:true
      });
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
        // {
        //     // text: printData.length > 0 ? `${printData[0].month}/${printData[0].year}` : "Clientes",
        //     // fontSize: 15,
        //     // bold: true,
        //     // margin: [15, 20, 0, 45],
        //     nodeName:"IMG",
        //     image:"img_ref_0",
        //     style:["html-img"],
        //     width: 150,
        //     height: 150,
        //         // alignment: 'right'
        // },

        // {
        //     margin: 10,
        //     columns: [
        //         {
        //             // usually you would use a dataUri instead of the name for client-side printing
        //             // sampleImage.jpg however works inside playground so you can play with it
        //             text: "blala",
        //             width: 40,
        //             alignment: 'right'
        //         },
                
        //         {
        //             "nodeName":"IMG",
        //             "image":"img_ref_0",
        //             "style":["html-img"],
        //             width: 40,
        //             height: 40,
        //             alignment: 'right'
        //            },
        //     ]
        // },
        {
            margin: 8,
            columns: [{
              table: {
                widths: ['50%', '50%'],
                body: [
                  [
                 {
                    // text: 'sampleImage.jpg',
                    width: 80,
                    height: 80,
                    text: printData.length > 0 ? `${printData[0].month}/${printData[0].year}` : "Clientes",
                    fontSize: 15,
                    bold: true,
                    margin: [40, 40, 0, 45],
                  }, 
                  {
                    nodeName: "IMG",
                    image: "img_ref_0",
                    style: ["html-img"],
                    width: 150,
                    height: 120,
                    alignment: 'right',
                    margin: [0, 0, 10, 0],
                  }]
                ]
              },
              layout: 'noBorders'
            }]
          },
    ]
    
    const dados = printData.map((data, index) => {
        return [
            {text: index + 1, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.employee_name, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.position_name, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.departament_name, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.salary_base, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.subsidy, fontSize: 10, margin: [0, 2, 0, 2], alignment: data.subsidy === "-" ? "center" : "left"},
            {text: data.bonus, fontSize: 10, margin: [0, 2, 0, 2], alignment: data.bonus === "-" ? "center" : "left"},
            {text: data.total_overtime, fontSize: 10, margin: [0, 2, 0, 2], alignment: data.total_overtime === "-" ? "center" : "left"},
            {text: data.total_absences, fontSize: 10, margin: [0, 2, 0, 2], alignment: data.total_absences === "-" ? "center" : "left"},
            {text: data.total_income, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.inss_employee, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.inss_company, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.total_inss, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.irps, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.cash_advances, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.syndicate_employee, fontSize: 10, margin: [0, 2, 0, 2]},
            {text: data.salary_liquid, fontSize: 10, margin: [0, 2, 0, 2]},
        ]
    })

    console.log("15", dados)
    console.log("11", totalRow)
    const details = [
        // {text: 'Column/row spans', style: 'subheader'},
        // 'Each cell-element can set a rowSpan or colSpan',
        // {
        //     "nodeName":"IMG",
        //     "image":"img_ref_0",
        //     "style":["html-img"],
        //     width: 150,
        //     height: 150,
        //     alignment: 'right'
        //    },
        {
            table: {
                // widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
                headerRows: 3,
                body: [
                    [
                        {text: "Elint Payroll", style: "tableHeader", colSpan: 17, alignment: "center"},
                        {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                    ],
                    [
                        {text: "Num", style: "tableHeader", rowSpan: 2, alignment: "center"},
                        {text: "Nome", style: "tableHeader", rowSpan: 2, alignment: "center"},
                        {text: "Cargo", style: "tableHeader", rowSpan: 2, alignment: "center"},
                        {text: "Departamento", style: "tableHeader", rowSpan: 2, alignment: "center"},
                        {text: "Salario base", style: "tableHeader", rowSpan: 2, alignment: "center"},
                        {text: "Remuneracoes", style: "tableHeader", colSpan: 4, alignment: "center"},
                        {},{},{},
                        {text: "Salario Bruto", style: "tableHeader", rowSpan: 2, alignment: "center"},
                        {text: "Descontos", style: "tableHeader", colSpan: 6, alignment: "center"},
                        {},{},{},{},{},
                        {text: "Salario Liquido", style: "tableHeader", rowSpan: 2, alignment: "center"},
                    ],
                    [
                        {},
                        {},
                        {},
                        {},
                        {},
                        {text: "Subsidio", style: "tableHeader", alignment: "center"},
                        {text: "Bonus", style: "tableHeader", alignment: "center"},
                        {text: "Horas Extras", style: "tableHeader", alignment: "center"},
                        {text: "Faltas", style: "tableHeader", alignment: "center"},
                        {},
                        {text: "INSS 3%", style: "tableHeader", alignment: "center"},
                        {text: "INSS 4%", style: "tableHeader", alignment: "center"},
                        {text: "Total INSS", style: "tableHeader", alignment: "center"},
                        {text: "IRPS", style: "tableHeader", alignment: "center"},
                        {text: "Adiantamentos", style: "tableHeader", alignment: "center"},
                        {text: "Sindicato", style: "tableHeader", alignment: "center"},
                        {},
                    ],
                    ...dados,
                    ...totalRow
                
                ]

            },
        },
        
        {text: '\nAssinatura \n________________________', alignment: "left"},
        {text: `\nData: ${formatDate().format(new Date())}`, alignment: "left"},

        // {
        //  "nodeName":"IMG",
        //  "image":"img_ref_0",
        //  "style":["html-img"]
        // }
        
        // {
        //     // if you specify both width and height - image will be stretched
        //     image: await urlToBase64(url),
        //     width: 150,
        //     height: 150
        // },

        // {text: 'Column/row spans', style: 'subheader', alignment: "right", margin: [50, 150, 400, 0]},
              
        // {text: 'Column/row spans', style: 'subheader'},
        // 'Each cell-element can set a rowSpan or colSpan',
        // {
        //     style: 'tableExample',
        //     color: '#444',
        //     table: {
        //         widths: [200, 'auto', 'auto'],
        //         headerRows: 2,
        //         body: [
        //             [
        //                 {text: "Header with Colspan = 2", style: "tableHeader", colSpan: 2, alignment: "center"},
        //                 {},
        //                 {text: "Header 3", style: "tableHeader", alignment: "center"}
        //             ],
        //             [
        //                 {text: "Header 1", style: "tableHeader", alignment: "center"},
        //                 {text: "Header 2", style: "tableHeader", alignment: "center"},
        //                 {text: "Header 3", style: "tableHeader", alignment: "center"},
        //             ],
        //             ['Simple value 1', "Sample value 2", "Sample value 3"],
        //             [{rowSpan: 3, text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor'}, 'Sample value 2', 'Sample value 3'],
		// 			['', 'Sample value 2', 'Sample value 3'],
		// 			['', 'Sample value 2', 'Sample value 3'],
        //             ['Sample value 1', {colSpan: 2, rowSpan: 2, text: 'Both:\nrowSpan and colSpan\ncan be defined at the same time'}, ''],
		// 			['Sample value 1', '', ''],
        //         ]
        //     }
        // }

        // {
        //     table: {
        //         headerRows: 1,
        //         widths: ['*', '*', '*', '*'],
        //         body: [
        //             [
        //                 {text: 'codigo', style: 'tableHeader', fontSize: 10},
        //                 {text: 'Nome', style: 'tableHeader', fontSize: 10},
        //                 {text: 'E-mail', style: 'tableHeader', fontSize: 10},
        //                 {text: 'Telefone', style: 'tableHeader', fontSize: 10},
                        
        //             ],
        //             ...dados
        //         ]

        //     },
        //     layout: 'headerLineOnly'
        // }
    ]

    function rodape(currentPage, pageCount) {
        return [
            {
                text: currentPage + ' / ' + pageCount,
                alignment: 'right',
                fontSize: 9,
                // bold: true,
                margin: [0, 10, 20, 0]
            }
        ]
    }

    const docDefinitions =  {
        pageSize: 'LEGAL',
        pageSize: 'A3',
        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: 'landscape',
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        // pageMargins: [ 40, 60, 40, 60 ],
        pageMargins: [40, 160, 40, 60],
        header: [reportTitle],
        // header: {
        //     margin: 10,
        //     columns: [
        //         {
        //             // usually you would use a dataUri instead of the name for client-side printing
        //             // sampleImage.jpg however works inside playground so you can play with it
        //             text: "blala",
        //             width: 40,
        //             alignment: 'right'
        //         },
        //         {
        //             margin: [10, 0, 0, 0],
        //             text: 'Here goes the rest',
        //             alignment: 'left'
        //         }
        //     ]
        // },
        content: [details],
        images: ret.images,
        "images":{
            "img_ref_0": settingData?.companyLogoURL ? settingData.companyLogoURL :  cons
            //"http://localhost:3333/companyy-logo/a4df5c8f488f42edb31bb7396393bb13-1534421123621.jpeg"
        },
        footer: rodape,
        info: {
            title: `Elint-Systems-Payroll PDF ${montYear}`,
            author: 'elint systems',
            subject: 'subject of document',
            keywords: 'keywords for document',
        },
    }
    console.log("515",ret.content)
    pdfMake.createPdf(docDefinitions).open()
    // pdfMake.createPdf(docDefinitions).download('optionalName.pdf');
    
    // var dd = {
    //   content:ret.content,
    //   images:ret.images
    // }
    // pdfMake.createPdf(dd).open();
  
// 'ret' contains:
//  {
//    "content":[
//      [
//        {
//          "nodeName":"IMG",
//          "image":"img_ref_0",
//          "style":["html-img"]
//        }
//      ]
//    ],
//    "images":{
//      "img_ref_0":"https://picsum.photos/seed/picsum/200"
//    }
//  }


}

const PrintPayroll = ({componentRef, printData}) => {
    console.log("helo",printData)
    const date  = new Date()
    const [urlLogo, setUrlLogo] = useState("");
    const [setting, setSetting] = useState({})

    useEffect(() => {
        async function fetch() {
            const response = await api.get("settings")
            if (response.data){
                setSetting(response.data)
                response.data.companyLogoURL ? setUrlLogo(response.data.companyLogoURL)
                : setUrlLogo("https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg")
            }
        }
        fetch()
    }, [])

    return (
        <div style={{display: "none"}} className="noneDiv2">
        <div  ref={componentRef} style={{width: '100%', height: window.innerHeight}} className="componentRef">
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
                            <div className="page">
                                <div className="addressLogo">
                                    <div className="nameAddress">
                                        <h1>{setting?.company_name ?? "Elint Payroll"}</h1>
                                        <span>{setting?.company_address ?? "Av. Kruss Gomes"}</span>
                                        <span>{setting?.company_city ?? "Beira"}</span>
                                        {/* <span>{setting?.company_province ?? "Sofala"}</span> */}
                                    </div>
                                    <div className="monthYear">
                                        <span>{printData.length > 0 ? 
                                            `${printData[0].month}/${printData[0].year}` : ""}
                                        </span>
                                    </div>
                                    <div className="logo">
                                        <img 
                                        src={
                                            urlLogo ? urlLogo : ""
                                        } 
                                        alt="" />
                                    </div>
                                </div>
                                <br/>
                                <div className="employePayment">
                                    <table>
                                            <thead>
                                                <tr>
                                                    <th rowSpan={2}>Num</th>
                                                    <th style={{width: 200}} rowSpan={2}>Nome</th>
                                                    {/* <th rowSpan={2}>Departamento:</th> */}
                                                    {/* <th rowSpan={2}>Cargo:</th> */}
                                                    <th rowSpan={2}>Salario Base:</th>
                                                    <th colSpan={4}>Remuneracoes</th>
                                                    <th rowSpan={2}>Salario Bruto</th>
                                                    <th colSpan={6}>Descontos</th>
                                                    <th rowSpan={2}>Salario Liquido</th>
                                                </tr>
                                                <tr>
                                                    <th>Subsidios</th>
                                                    <th>Bonus</th>
                                                    <th>Horas Extras</th>
                                                    <th>Faltas</th>
                                                    <th>INSS 3%</th>
                                                    <th>INSS 4$</th>
                                                    <th>Total INSS</th>
                                                    <th>IRPS</th>
                                                    <th>Sindicato</th>
                                                    <th>Emprestimos</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {printData.concat(returnTotalRow(printData)).map((data, i)=> 
                                            <tr>
                                                <td>{i + 1}</td>
                                                <td style={{width: 200, textAlign: i + 1 === printData.length + 1 ? "center" : "left"}}>{data.employee_name}</td>
                                                {/* <td>{data.departament_name}</td> */}
                                                {/* <td>{data.position_name}</td> */}
                                                <td>{formatSalary().format(data.salary_base)}</td>
                                                <td>{formatSalary().format(data.subsidy)}</td>
                                                <td>{formatSalary().format(data.bonus)}</td>
                                                <td>{formatSalary().format(data.total_overtime)}</td>
                                                <td>{formatSalary().format(data.total_absences)}</td>
                                                <td>{formatSalary().format(data.total_income)}</td>
                                                <td>{formatSalary().format(data.inss_employee)}</td>
                                                <td>{formatSalary().format(data.inss_company)}</td>
                                                <td>{formatSalary().format(data.total_inss)}</td>
                                                <td>{formatSalary().format(data.irps)}</td>
                                                <td>{formatSalary().format(data.syndicate_employee)}</td>
                                                <td>{formatSalary().format(data.cash_advances)}</td>
                                                <td>{formatSalary().format(data.salary_liquid)}</td>
                                            </tr>
                                            )}
                                            {/* <tr>
                                                <td>{printData.length + 1}</td>
                                                <td style={{width: 200}}>Total</td>
                                                <td>{formatSalary().format(printData.concat(returnTotalRow(printData)))[printData]}</td>
                                                <td>{formatSalary().format(0)}</td>
                                                <td>{formatSalary().format(0)}</td>
                                                <td>{formatSalary().format(0)}</td>
                                                <td>{formatSalary().format(0)}</td>
                                                <td>{formatSalary().format(0)}</td>
                                                <td>{formatSalary().format(0)}</td>
                                                <td>{formatSalary().format(0)}</td>
                                                <td>{formatSalary().format(0)}</td>
                                                <td>{formatSalary().format(0)}</td>
                                                <td>{formatSalary().format(0)}</td>
                                                <td>{formatSalary().format(0)}</td>
                                                <td>{formatSalary().format(0)}</td>
                                                
                                            </tr> */}
                                            
                                            </tbody>          
                                    </table>
                                </div>
                                <br/>
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
                                            "_______________________"
                                        }
                                        </span>
                                    </div>
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


export default PrintPayroll


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


const returnTotalRow = (printData) => {
    
    let total_liquid = 0
    let total_base = 0
    let total_Irps = 0
    let total_gross = 0
    let total_Inss = 0
    let total_InssCompany = 0
    let total_InssEmployee = 0
    let totalLength = 0
    let total_cash_advances = 0
    let total_syndicate_employee = 0
    let total_subsidy = 0
    let total_bonus = 0
    let total_backpay = 0
    let total_total_absences = 0
    let total_total_overtime = 0
    
    totalLength = printData.map((data, index) => {
        total_liquid += (+data.salary_liquid)
        total_base += (+data.salary_base)
        total_gross += (+data.total_income)
        total_Irps += (+data.irps)
        total_Inss += (+data.inss_company) + (+data.inss_employee)
        total_InssCompany += (+data.inss_company)
        total_InssEmployee += (+data.inss_employee)
        total_cash_advances += (+data.cash_advances)
        total_syndicate_employee += (+data.syndicate_employee)
        total_subsidy += (+data.subsidy)
        total_bonus += (+data.bonus)
        total_backpay += (+data.backpay)
        total_total_absences += (+data.total_absences)
        total_total_overtime += (+data.total_overtime)
    })
    
    const totalRow = [{
            "salary_liquid":  total_liquid, 
            "salary_base":  total_base, 
            "total_income": total_gross,
            "inss_employee": total_InssEmployee,
            "inss_company": total_InssCompany,
            "irps": total_Irps,
            "total_inss": total_Inss, 
            "employee_id": "",
            "employee_name": "TOTAL",
            "total_overtime": total_total_overtime, 
            "total_absences": total_total_absences, 
            "cash_advances": total_cash_advances, 
            "syndicate_employee": total_syndicate_employee,
            "subsidy": total_subsidy, 
            "bonus": total_bonus, 
            "backpay": total_backpay, 
            }]
        
        return totalRow
    }
    // return (
        //     <div style={{display: "none"}}>
        //         <div ref={componentRef} style={{width: '100%', height: window.innerHeight, marginTop: 'auto', marginBottom: 'auto'}}>
         //             <div className="container">
         //                 <div className="nameAdress">
         //                     <h1>{"Elint Payroll"}</h1>
         //                     <span>{"Av. Kruss Gomes"}</span>
         //                     <span>{"Porto da Beira"}</span>
         //                     <span>{"Beira"}</span>
         //                 </div>
         //                 <div className="tableEmployeeData">
                            
         //                     <table>
         //                         <caption>{printData.length > 0 ? `${printData[0].month}/${printData[0].year}` : ""}</caption>
         //                         <thead>
         //                             <tr  style={{marginTop: "80px"}}>
         //                                 <th rowSpan={2}>Num:</th>
         //                                 <th rowSpan={2}>Nome:</th>
         //                                 <th rowSpan={2}>Departamento:</th>
         //                                 <th rowSpan={2}>Cargo:</th>
         //                                 <th rowSpan={2}>Salario Base:</th>
         //                                 <th colSpan={4}>Remuneracoes</th>
         //                                 <th rowSpan={2}>Salario Bruto</th>
         //                                 <th colSpan={5}>Descontos</th>
         //                                 <th rowSpan={2}>Salario Liquido</th>
         
         //                             </tr>
         //                             <tr>
         //                                 <th>Subsidio</th>
         //                                 <th>Bonus:</th>
         //                                 <th>Horas Extras:</th>
         //                                 <th>Faltas:</th>
         //                                 <th>INSS 3%</th>
         //                                 <th>INSS 4$:</th>
         //                                 <th>Total INSS</th>
         //                                 <th>IRPS:</th>
         //                                 <th>Adiantamentos</th>
         //                             </tr>
         //                         </thead>
         //                         <tbody>
         //                         {printData.length > 0 ? printData.map(data => 
         //                             <tr>
         //                                 <td>1</td>
         //                                 <td>{data.employee_name}</td>
         //                                 <td>{data.departament_name}</td>
         //                                 <td>{data.position_name}</td>
         //                                 <td>{formatSalary().format(data.salary_base)}</td>
         //                                 <td>{formatSalary().format(data.subsidy)}</td>
         //                                 <td>{formatSalary().format(data.total_overtime)}</td>
         //                                 <td>{formatSalary().format(data.bonus)}</td>
         //                                 <td>{formatSalary().format(data.total_absences)}</td>
         //                                 <td>{formatSalary().format(data.total_income)}</td>
         //                                 <td>{formatSalary().format(data.inss_employee)}</td>
         //                                 <td>{formatSalary().format(data.inss_company)}</td>
         //                                 <td>{formatSalary().format(data.total_inss)}</td>
         //                                 <td>{formatSalary().format(data.irps)}</td>
         //                                 <td>{formatSalary().format(data.cash_advances)}</td>
         //                                 <td>{formatSalary().format(data.salary_liquid)}</td>
         //                             </tr>
         //                             ) : ""}
         //                         </tbody>
         //                     </table>
         //                 </div> 
         //                 <br/>
         //                 <hr />
         //                 <div className="footer">
         //                     <div>
         //                         <span>Assinatura:</span>
         //                         <span className="linha">___________________________</span>
         //                     </div>
         //                     <div>
         //                         <span>Data: </span>
         //                         <span>{formatDate().format(date)}</span>
         //                     </div>
         //                     <div>
         //                         <span>Local: </span>
         //                         <span>
         //                         </span>
         //                     </div>
         //                 </div>
         //             </div>
                    
         //         </div>
         //     </div>
         // )