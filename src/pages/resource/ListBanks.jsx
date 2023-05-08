import "./listBanks.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { useEffect, useState } from "react"
import api from "../../services/api"
import exceljs from 'exceljs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx/xlsx.mjs';
import { read, utils, writeFileXLSX,xl } from 'xlsx';
import ddd from "./Duploica.xlsx"
import axios from "axios"
// import Excel from "exceljs/dist/es5/exceljs.browser";
import { Workbook } from 'exceljs';



const payrollColumns = [
    { field: 'id', headerName: 'ID', width: 70, align:'center', headerAlign: 'center',},
    { field: 'month', headerName: 'Mes', width: 150,align:'center', headerAlign: 'center',},
    // { field: "dependents", headerName:"Dependentes", width: 120,  align:'center', headerAlign: 'center', },
    { field: "year", headerName:"Ano", width: 180,  align:'center', headerAlign: 'center', },
    { field: "total", headerName:"Total Funcionarios", width: 180,  align:'center', headerAlign: 'center', },
 
]

const ListBanks = ({ listName, listPath }) => {
    const [userRows, setUserRows] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const response = await api.get(`${listPath}`)
             console.log(listPath)

             if (response.status === 200) {
                setLoading(false)
            }
            setUserRows(response.data)

        }
        fetchData()
      
    }, [listPath])

    //   var workbook = new exceljs.Workbook(); 
    //   workbook.xlsx.readFile("https://file-examples.com/wp-content/uploads/2017/02/file_example_XLS_10.xls").then(function () {

    //     //Get sheet by Name
    //     var worksheet=workbook.getWorksheet('Sheet1');
    
    //     //Get Lastrow
    //     var row = worksheet.lastRow
    
    //     //Update a cell
    //     row.getCell(1).value = 5;
    
    //     row.commit();

    //     console.log("dkskd")
    
    //     //Save the workbook
    //     // return workbook.xlsx.writeFile("data/Sample.xlsx");
    
    // });

    async function testAxiosXlsx(url) {
        const options = { 
            url,
            withCredentials: true,
            responseType: "arraybuffer"
        }
        // let axiosResponse = await axios(options);
        const workbook = XLSX.read(ddd);
        const worksheetName = workbook.SheetNames[0] // get sheetName
        const worksheet = workbook.Sheets[worksheetName]
    
        let worksheets = workbook.SheetNames.map(sheetName => {
            return { sheetName, data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) };
        });

        const data = utils.sheet_to_json(worksheet);
        console.log(data)
    
        console.log("json:\n", JSON.stringify(worksheets), "\n\n");
        // console.log("xml:\n", jsontoxml(worksheets, {}));
    }
    
    testAxiosXlsx("https://file-examples.com/wp-content/uploads/2017/02/file_example_XLSX_10.xlsx");


    // function handleImport() {
    //     let file = "C:/Users/ConsulLda/Desktop/"
    //     const wb = new exceljs.Workbook();
    //     const reader = new FileReader()
      
    //     reader.readAsArrayBuffer(file)
    //     reader.onload = () => {
    //       const buffer = reader.result;
    //       wb.xlsx.load(buffer).then(workbook => {
    //         console.log(workbook, 'workbook instance')
    //         workbook.eachSheet((sheet, id) => {
    //           sheet.eachRow((row, rowIndex) => {
    //             console.log(row.values, rowIndex)
    //           })
    //         })
    //       })
    //     }
    //   }
    //   handleImport()

    // const workbook = new Excel.Workbook();
    // workbook.xlsx.readFile("https://file-examples.com/wp-content/uploads/2017/02/file_example_XLSX_10.xlsx").then(function () {

    //         //Get sheet by Name
    //         var worksheet=workbook.getWorksheet('Sheet1');
        
    //         //Get Lastrow
    //         var row = worksheet.lastRow
    //         console.log(worksheet)
    // })

    const validateExcelFile = (ddd) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(ddd);
          reader.onload = () => {
            const buffer = reader.result;
            const workbook = new Workbook();
            workbook.xlsx
              .load(buffer)
              .then(() => {
                const worksheet = workbook.getWorksheet(1);
                const rowCount = worksheet.getColumn(1).values;
                const columnCount = worksheet.getRow(1);
                //  validate table data
                console.log(rowCount);
                console.log(columnCount);
                resolve('Excel file is valid.');
              })
              .catch((error) => {
                reject('Error occurred while loading the workbook.');
              });
          };
        });
      };
      validateExcelFile("https://file-examples.com/wp-content/uploads/2017/02/file_example_XLSX_10.xlsx")
    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <div>
                    Banco
                </div>
                {/* <DatatableResource listName={listName} listPath={listPath} columns={payrollColumns} 
                userRows={userRows} setUserRows={setUserRows} 
                loading={loading} setLoading={setLoading}/> */}
            </div>
        </div>
    )
}

export default ListBanks