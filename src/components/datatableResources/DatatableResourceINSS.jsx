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

const DatatableResourceINSS = ({ listName, listPath, columns, userRows, setUserRows, loading, setLoading }) => {
    const workbook = new exceljs.Workbook();
    const [rows, setRows] = useState([]);
    const [year, setYear] = useState(0);
    const componentRef = useRef();
    const [single, setSingle] = useState([]);
    const { t, i18n } = useTranslation();
    const {data, error, isError, isLoading } = useQuery('payrolls', fetchPrintData)

    useEffect(() => {
        async function fetchData() {
            console.log(single)
            if(!(Object.keys(single).length === 0))
                handlePrint()
        }
        fetchData()
    }, [single])

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("payrolls")
            let id = ""
            let incrment = 0
            let mes = "";
            let ano = 0;
            let total = 0;
            let newPayroll = [];
            
            response.data.map((data, index) => {
                // data.id = index + 1
            
                if (!(mes === data.month && ano === +data.year)) {
                    // delete data
                    
                    total = response.data.filter(data1 => data.month === data1.month && +data.year === +data1.year).length
                    id = data.id = index + 1
                    
                    // total = total + index
                    // newPayroll.push(data)
                    let alreadyExists = newPayroll.find(data2 => data.month === data2.month && data.year === +data2.year)
                    if (!alreadyExists) {
                        incrment += 1; 
                        newPayroll.push({id: incrment, month: data.month, year: data.year, total: total })
                    }
                }
                mes = data.month
                ano = data.year
                
            })

            setRows(newPayroll)
    
        }
            fetchData()
    }, [])


    const submitByYear = async (e) => {
        setYear(e)
        // setUserRows(data2.filter(row => (row.year === +e) && (row.month === month)))
        // console.log(data.filter(row => row.year === +e))
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'INSS-data',
        // onAfterPrint: () => alert('Print sucess')
    })

    const handleSinglePrint = (id) => {
        api.get(`payrolls`)
         .then(response => {setSingle(response.data)})
        // api.get(`payrolls`)
        //  .then(response => {printPayslipBucket(response.data)})
        // console.log(single)
    }

    const exportExcelFile = useCallback(async (year, month) => {
      const response = await api.get("payrolls")

      const excelPayroll = response.data.filter(row => (row.year === +year) && (row.month === month))

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
        worksheet.getCell('A1').value = 'INSS Elint Payroll'

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
          let salary_liquid = 0
          let salary_base = 0 
          let total_income = 0
          let inss_employee = 0
          let inss_company = 0
          let total_inss = 0
          let total_cash_advances = 0
          let total_subsidy = 0
          let irps = 0
          let total_bonus = 0
          let total_backpay = 0
          let total_total_absences = 0
          let total_total_overtime = 0
          let total_syndicate_employee = 0

          excelPayroll.map(data => {
              salary_liquid = salary_liquid + data.salary_liquid
              salary_base = salary_base + data.salary_base
              total_income = total_income + data.total_income
              inss_employee = inss_employee + data.inss_employee
              inss_company = inss_company + data.inss_company
              irps = irps + data.irps
              total_inss = total_inss + data.total_inss
              total_cash_advances = total_cash_advances + data.cash_advances
              total_subsidy = total_subsidy + data.subsidy
              total_bonus +=  data.bonus
              total_backpay += data.backpay
              total_total_absences += data.total_absences
              total_total_overtime += data.total_overtime
              total_syndicate_employee += data.syndicate_employee


              data.salary_base = formatSalary().format(data.salary_base)
              data.salary_liquid = formatSalary().format(data.salary_liquid)
              data.total_income = formatSalary().format(data.total_income)
              data.irps = formatSalary().format(data.irps)
              data.inss_employee = formatSalary().format(data.inss_employee)
              data.subsidy = formatSalary().format(data.subsidy)
              data.bonus = formatSalary().format(data.bonus)
              data.cash_advances = formatSalary().format(data.cash_advances)
              data.backpay = formatSalary().format(data.backpay)
              data.total_absences = formatSalary().format(data.total_absences)
              data.total_overtime = formatSalary().format(data.total_overtime)
              data.inss_company = formatSalary().format(data.inss_company)
              data.total_inss = formatSalary().format(data.total_inss)
              data.overtime50 = formatSalary().format(data.overtime50)
              data.overtime100 = formatSalary().format(data.overtime100)
              data.base_day = formatSalary().format(data.base_day)
              data.base_hour =  formatSalary().format(data.base_hour)
              data.subsidy_food = formatSalary().format(data.subsidy_food)
              data.subsidy_residence = formatSalary().format(data.subsidy_residence)
              data.subsidy_medical = formatSalary().format(data.subsidy_medical)
              data.subsidy_vacation = formatSalary().format(data.subsidy_vacation)
              data.salary_thirteenth = formatSalary().format(data.salary_thirteenth)
              data.nib = String(data.nib)
              data.days = 30 - (+data.absences)
              data.birth_date = ""
              data.event = ""
              data.event_date = ""
          })
          // loop through data and add each one to worksheet
          excelPayroll.forEach(singleData => {
            worksheet.addRow(singleData);
          });
          
         worksheet.addRow({
          employee_id: "",
          employee_name: "TOTAL",
          dependents: "",
          position_name: "", 
          department_name: "",  
          month: "", 
          year: "", 
          nib: "",
          social_security: "",
          overtime50: "", 
          overtime100: "", 
          total_overtime: formatSalary().format(total_total_overtime), 
          absences: "", 
          total_absences: formatSalary().format(total_total_absences), 
          cash_advances: formatSalary().format(total_cash_advances), 
          syndicate_employee: formatSalary().format(total_syndicate_employee),
          subsidy: formatSalary().format(total_subsidy), 
          bonus: "", 
          backpay: formatSalary().format(total_backpay), 
          salary_liquid:  formatSalary().format(salary_liquid), 

          social_security: "TOTAL",  
          employee_name: "",
          days: "",
          birth_date: "",
          salary_base:  formatSalary().format(salary_base), 
          subsidy: formatSalary().format(total_subsidy),
          bonus: formatSalary().format(total_bonus),
          total_income: formatSalary().format(total_income),
          event: "",
          event_date: "",
          inss_company: formatSalary().format(inss_company),
          inss_employee: formatSalary().format(inss_employee),
          total_inss: formatSalary().format(total_inss),


          // total_bonus
        });
        worksheet.lastRow.font = { bold: true };

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
        worksheet.getColumn("birth_date").hidden = true
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
                        <div className="editButton" onClick={() => exportExcelFile(params.row.year, params.row.month)}>
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
                {t("INSSList.1")}
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
                rows={rows}
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

export default DatatableResourceINSS;

    const header2 = [
      "Numero Benificiario",
      "Nome do Benificiario",
      "Dias",
      "Data de Nascimento",
      "Remuneracao",
      "Subsidios",
      "Comissao",
      "Total",
      "Evento", 
      "Data Evento",
      "INSS Funcionario",
      "INSS Empresa",
      "Total INSS",
    ]

    const keycolumns = [
      {key: "social_security"},  
      {key: "employee_name"},
      {key: "days"},
      {key: "birth_date"},
      {key: "salary_base"},
      {key: "subsidy"},
      {key: "bonus"},
      {key: "total_income"},
      {key: "event"},
      {key: "event_date"},
      {key: "inss_employee"},
      {key: "inss_company"},
      {key: "total_inss"},
    ]