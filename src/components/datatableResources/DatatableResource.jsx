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


const formatSalary = () => {
    return new Intl.NumberFormat("en-US",{maximumFractionDigits: 2, minimumFractionDigits: 2})
}

const formatDate = new Intl.DateTimeFormat("pt-br", { dateStyle: 'short'})  

const payrollDate = formatDate.format(new Date())

async function fetchPrintData(){
    const {data} = await api.get("payrolls")
    return data
}

const DatatableResource = ({ listName, listPath, columns, userRows, setUserRows, loading, setLoading }) => {
    const workbook = new exceljs.Workbook();
    const [rows, setRows] = useState([]);
    const [year, setYear] = useState(0);
    const componentRef = useRef();
    const [single, setSingle] = useState([]);
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
        // console.log("1z",year, month)
        // console.log("2z", excelPayroll)
        const response = await api.get("payrolls")

        const excelPayroll2 = response.data.filter(row => (row.year === +year) && (row.month === month))

        const workSheetName = 'Worksheet-1';
        const workBookName = 'Elint-Systems-Payroll';
        try {
          // creating one worksheet in workbook
          const worksheet = workbook.addWorksheet(workSheetName);

          // add worksheet columns
          // each columns contains header and its mapping key from data
          worksheet.columns = columnsExcel;
    
          // updated the font for first row.
          worksheet.getRow(1).font = { bold: true };
        
          // loop through all of the columns and set the alignment with width.
          worksheet.columns.forEach(column => {
            column.width = column.header.length + 15;
            // column.width = column.eachCell.length + 20;
            column.alignment = { horizontal: 'left' };
          });

          worksheet.getRow(1).alignment = { horizontal: 'center' };
          worksheet.getColumn(3).alignment = { horizontal: 'center' };
          worksheet.getColumn(4).alignment = { horizontal: 'center' };

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
            let total_syndicate_employee = 0
            let total_subsidy = 0
            let irps = 0

            excelPayroll2.map(data => {
                salary_liquid = salary_liquid + data.salary_liquid
                salary_base = salary_base + data.salary_base
                total_income = total_income + data.total_income
                inss_employee = inss_employee + data.inss_employee
                inss_company = inss_company + data.inss_company
                irps = irps + data.irps
                total_inss = total_inss + data.total_inss
                total_cash_advances = total_cash_advances + data.cash_advances
                total_subsidy = total_subsidy + data.subsidy
                total_syndicate_employee += data.syndicate_employee

                data.salary_base = formatSalary().format(data.salary_base)
                data.salary_liquid = formatSalary().format(data.salary_liquid)
                data.total_income = formatSalary().format(data.total_income)
                data.irps = formatSalary().format(data.irps)
                data.inss_employee = formatSalary().format(data.inss_employee)
                data.subsidy = formatSalary().format(data.subsidy)
                data.bonus = formatSalary().format(data.bonus)
                data.cash_advances = formatSalary().format(data.cash_advances)
                data.syndicate_employee = formatSalary().format(data.syndicate_employee)
                data.backpay = formatSalary().format(data.backpay)
                data.total_absences = formatSalary().format(data.total_absences)
                data.total_overtime = formatSalary().format(data.total_overtime)
                data.inss_company = formatSalary().format(data.inss_company)
                data.total_inss = formatSalary().format(data.total_inss)
                data.nib = String(data.nib)
            })
            // loop through data and add each one to worksheet
           
          excelPayroll2.forEach(singleData => {
            worksheet.addRow(singleData);
          });
            
           worksheet.addRow({
            salary_liquid:  formatSalary().format(salary_liquid), 
            salary_base:  formatSalary().format(salary_base), 
            total_income: formatSalary().format(total_income),
            inss_employee: formatSalary().format(inss_employee),
            inss_company: formatSalary().format(inss_company),
            total_inss: formatSalary().format(total_inss),
            irps: formatSalary().format(irps),
            total_inss: formatSalary().format(total_inss), 
            employee_id: "",
            employee_name: "TOTAL",
            dependents: "",
            position_name: "", 
            departament_name: "",  
            month: "", 
            year: "", 
            nib: "",
            social_security: "",
            overtime50: "", 
            overtime100: "", 
            total_overtime: "", 
            absences: "", 
            total_absences: "", 
            cash_advances: formatSalary().format(total_cash_advances), 
            syndicate_employee: formatSalary().format(total_syndicate_employee),
            subsidy: formatSalary().format(total_subsidy), 
            bonus: "", 
            backpay: "", 
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
            });
          });

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
        //   setExcelPayroll([])
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
                        <Link to={`/${listPath}/output/${params.row.month}-${params.row.year}`} style={{textDecoration: "none"}}>
                        {/* to={`/${listPath}/${params.row.id}`} */}
                        {/* {console.log(params.row.month+""+listPath)} */}
                                <div className="viewButton">
                                    <VisibilityIcon /> Ver
                                </div>
                        </Link>
                        <div className="editButton" onClick={() => exportExcelFile(params.row.year, params.row.month)}>
                            <DescriptionIcon className="edIcon"/> Exportar
                        </div>
                        <div className="printButton" onClick={() => handleSinglePrint(params.row.id)}>
                        {/* handleSinglePrint(params.row.year, params.row.month) */}
                              <PrintIcon />  Imprimir
                            </div>
                        {/* <div className="deleteButton" onClick={() => handleDelete(params.row.year, params.row.month, listPath)}>
                            <DeleteForeverIcon /> Remover
                        </div> */}
                    </div>
                )
            }
        }
    ]
    return (
        <div className="datatable">
            <div className="datatableTitle">
                {listName}
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

export default DatatableResource;


const columnsExcel = [
    // {header: "id", key: "id", width: 25},
    // {header: "employee_uid", key: "employee_uid",  width: 25},
    // {header: "Id", key: "employee_id",  width: 25},
    {header: "Nome", key: "employee_name",  width: 25},
    // {header: "Dependentes", key: "dependents", width: 25},
    // {header: "Cargo", key: "position_name", width: 25},
    // {header: "Departamento", key: "departament_name", width: 25},
    {header: "Mes", key: "month", width: 25},
    {header: "Ano", key: "year", width: 25},
    // {header: "NIB", key: "nib", width: 25, type: "text"},
    // {header: "Num. Seg. INSS", key: "social_security", width: 25},
    {header: "Salario Base", key: "salary_base", width: 25},
    {header: "Subsidio", key: "subsidy", width: 25},
    // {header: "Bonus", key: "bonus", width: 25},
    {header: "Salario Bruto", key: "total_income", width: 25},
    // {header: "Horas Extras 50", key: "overtime50", width: 25},
    // {header: "Horas Extras 100", key: "overtime100", width: 25},
    // {header: "Total Horas Extras", key: "total_overtime", width: 25},

    // {header: "Total dias de Trabalho Mes", key: "month_total_workdays", width: 25},
    // {header: "total horas de Trabalho por dia", key: "day_total_workhours", width: 25},
    // {header: "Base diaria", key: "base_day", width: 25},
    // {header: "Base Hora", key: "base_hour", width: 25},

    // {header: "Faltas", key: "absences", width: 25},
    // {header: "Total desconto por Faltas", key: "total_absences", width: 25},
    // {header: "Retroativos", key: "backpay", width: 25},
    {header: "IRPS", key: "irps", width: 25},
    {header: "INSS (3%)", key: "inss_employee", width: 25},
    {header: "INSS (4%)", key: "inss_company", width: 25},
    {header: "INSS Total", key: "total_inss", width: 25},
    {header: "Adiantamento", key: "cash_advances", width: 25},
    {header: "Sindicato", key: "syndicate_employee", width: 25},
    {header: "Salario Liquido", key: "salary_liquid", width: 25},

    ]