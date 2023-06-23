import "./datatableResource.scss";
import { DataGrid} from '@mui/x-data-grid';
import { Link } from "react-router-dom"
import { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import exceljs from 'exceljs';
import { saveAs } from 'file-saver';
import api from "../../services/api";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import DescriptionIcon from '@mui/icons-material/Description';
import PrintPayroll from "../printPayroll/PrintPayroll";
import { printPDF } from "../printPayroll/PrintPayroll";
import { useQuery } from 'react-query'
import PrintINSS from "../printResources/PrintINSS";
import { useTranslation } from 'react-i18next';

const formatSalary = () => {
    return new Intl.NumberFormat("en-US",{maximumFractionDigits: 2, minimumFractionDigits: 2})
}

const formatDate = new Intl.DateTimeFormat("pt-br", { dateStyle: 'short'})  

const payrollDate = formatDate.format(new Date())

async function fetchPrintData(){
    const {data} = await api.get("payrolls")
    return data
}


const DatatableResourceBanks = ({ listName, listPath, columns, userRows, setUserRows, loading, setLoading }) => {
    const workbook = new exceljs.Workbook();
    const [year, setYear] = useState(0);
    const componentRef = useRef();
    const [single, setSingle] = useState([]);
    const { t, i18n } = useTranslation();
    const {data, error, isError, isLoading } = useQuery('payrolls', fetchPrintData)



    const submitByYear = async (e) => {
        setYear(e)
        // setUserRows(data2.filter(row => (row.year === +e) && (row.month === month)))
        // console.log(data.filter(row => row.year === +e))
    }

    const exportExcelFile = useCallback(async (id) => {
      const response = await api.get(`payrolls/output/${id}`)

      const excelPayroll = response.data //.filter(row => (row.year === +year) && (row.month === month))

      const workSheetName = 'Worksheet-1';
      const workBookName = 'Elint-Systems-Payroll';
      try {
        // creating one worksheet in workbook
        const worksheet = workbook.addWorksheet(workSheetName);

        //add 1st Header 
        const header1 = [""]


        worksheet.addRow(header1);
        // merge by start row, start column, end row, end column (equivalent to K10:M12)
        worksheet.mergeCells(1,1,2,keycolumns.length);
        // worksheet.mergeCells('A1', 'J2');
        worksheet.getCell('A1').value = 'Conta de Banco Elint Payroll'

        //add header
        worksheet.addRow(header2);

        // add worksheet columns
        // each columns contains header and its mapping key from data
        worksheet.columns = keycolumns;
  
        // updated the font for first row.
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(2).font = { bold: true };
        worksheet.getRow(3).font = { bold: true };
        // worksheet.getRow(4).font = { bold: true };
  
        // loop through all of the columns and set the alignment with width.
        // worksheet.columns.forEach(column => {
        //   column.width = column.header.length + 15;
        //   // column.width = column.eachCell.length + 20;
        //   column.alignment = { horizontal: 'center' };
        // });
  
      //   // loop through data and add each one to worksheet
      //   excelPayroll.forEach(singleData => {
      //     worksheet.addRow(singleData);
      //   });
        // console.log(excelPayroll)
         //add row 
          
         // loop through data and add each one to worksheet
         excelPayroll.forEach(singleData => {
          worksheet.addRow({
            employee_name: singleData.employee_name,
            salary_liquid: formatSalary().format(singleData.salary_liquid) ?? "-",
            bank_name: singleData.bank_name ?? "-",
            bank_account: singleData.bank_account ?? "-",
            nib: String(singleData.nib) ?? "-",
          });
        });
     
        // loop through all of the rows and set the outline style.
        worksheet.eachRow({ includeEmpty: false }, row => {
          // store each cell to currentCell
          const currentCell = row._cells;
  
          // loop through currentCell to apply border only for the non-empty cell of excel
          currentCell.forEach(singleCell => {
            // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
            const cellAddress = singleCell._address;
  
            // apply border
            worksheet.getCell(cellAddress).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
            worksheet.getCell(cellAddress).alignment = {
              horizontal: "center",
              vertical: "middle"
            };
          });
        });

        worksheet.getColumn(2).alignment = { horizontal: 'left' };
        worksheet.getCell("B3").alignment = { horizontal: 'center', vertical: 'middle' }
        worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell("A30", "B30").outlineLevel = 1;
        worksheet.getColumn(25).outlineLevel = 1;
        // worksheet.getColumn("salary_thirteenth").hidden = true
        // worksheet.getColumn("days").hidden = true
        // worksheet.getColumn("nib").hidden = false ? false : true

        worksheet.columns.forEach(function (column, i) {
          var maxLength = 0;
          column["eachCell"]({ includeEmpty: true }, function (cell) {
              var columnLength = cell.value ? cell.value.toString().length : 15;
              if (columnLength > maxLength ) {
                  maxLength = columnLength;
              }
          });
          column.width = maxLength < 10 ? 10 : maxLength;
      });

        // write the content using writeBuffer
        const buf = await workbook.xlsx.writeBuffer();
  
        // download the processed file
        saveAs(new Blob([buf]), `${workBookName}(${payrollDate}).xlsx`);
      } catch (error) {
        console.error('<<<ERRROR>>>', error);
        console.error('Something Went Wrong', error.message);
      } finally {
        // removing worksheet's instance to create new one
        workbook.removeWorksheet(workSheetName);
      }
    }, []);

    const onCellEditCommit = ({ id, field, value }) => {
        api.put(`payrolls/${id}`, {[field]: value}).then(response => console.log(response))

            // console.log("id: "+id+" "+field + ": "+ value)
            // console.log("zabuza: ", {[field]: value})
        
            setUserRows((prevData) =>
            prevData.map((item) =>
              item.id === id ? { ...item, [field]: value } : item
            )
          );

            // var obj = {};
            // obj[field] = value;
            // console.log(obj)
      };

    const actionColumn = [
        { 
            field: "action", 
            headerName: "", 
            width: 450, 
            align: "center",
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        {/* <Link to={`/${listPath}/output/${params.row.month}-${params.row.year}`} style={{textDecoration: "none"}}>
                            <div className="viewButton">
                                <VisibilityIcon /> Ver
                            </div>
                        </Link> */}
                        <div className="editButton" onClick={() => exportExcelFile(params.row.id)}>
                            <DescriptionIcon className="edIcon"/> {t("Datatable.4")}
                        </div>
                        {/* <div className="printButton" onClick={() => handleSinglePrint(params.row.id)}>
                              <PrintIcon />  Imprimir
                        </div> */}
                    </div>
                )
            }
        }
    ]
    return (
        <div className="datatable">
            <div className="datatableTitle">
                {t("AbsencesList.1")}
                <PrintINSS componentRef={componentRef} single={single}/>
            </div>
            <DataGrid
            sx={{
                fontFamily:"Plus Jakarta Sans, sans-serif", color:'black',

                "& .MuiDataGrid-main": {
                    // remove overflow hidden overwise sticky does not work
                    overflow: "unset"
                  },
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                   outline: "1px solid red",
                },
                
                                               
             }}
                showCellRightBorder={true}
                showColumnRightBorder={true}
                columnBuffer={columns.length}
                rows={userRows}
                columns={columns.concat(actionColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
                // checkboxSelection
                onCellEditCommit={onCellEditCommit}
                autoHeight    
                loading={loading}
  
                // showCellRightBorder={true}  
           
                />
                
        </div>
    )
}

export default DatatableResourceBanks;

    const header2 = [
      "Nome do Funcionario",
      "Salario Liquido",
      "Nome do Banco",
      "Numero de Conta",
      "NIB"
    ]

    const keycolumns = [
      {key: "employee_name"},
      {key: "salary_liquid"},
      {key: "bank_name"},
      {key: "bank_account"},
      {key: "nib"},
    ]

const keyToPropMonth = {
      "month1": "Janeiro",
      "month2": "Fevereiro",
      "month3": "Marco",
      "month4": "Abril",
      "month5": "Maio",
      "month6": "Junho",
      "month7": "Julho",
      "month8": "Agosto",
      "month9": "Setembro",
      "month10": "Outubro",
      "month11": "Novembro",
      "month12": "Dezembro",
  }

  const keyToPropMonth2 = {
      "Janeiro": "month1",
      "Fevereiro": "month2",
      "Marco": "month3",
      "Abril": "month4",
      "Maio": "month5",
      "Junho": "month6",
      "Julho": "month7",
      "Agosto": "month8",
      "Setembro": "month9",
      "Outubro": "month10",
      "Novembro": "month11",
      "Dezembro": "month12",
}