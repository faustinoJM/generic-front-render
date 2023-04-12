import "./datatableOutputPayroll.scss";
import { DataGrid,} from '@mui/x-data-grid';
import { Link, useParams } from "react-router-dom"
import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { useReactToPrint } from "react-to-print";
import PrintPayslip from "../printPayslip/PrintPayslip";
import exceljs from 'exceljs';
import { saveAs } from 'file-saver';
import PrintIcon from '@mui/icons-material/Print';

const formatSalary = () => {
    return new Intl.NumberFormat("en-US",{maximumFractionDigits: 2, minimumFractionDigits: 2})
}

const formatDate = new Intl.DateTimeFormat("pt-br", { dateStyle: 'short'})  

const payrollDate = formatDate.format(new Date())

const DatatableOutputPayroll = ({ listName, listPath, columns, userRows, setUserRows, settings, outputColumnVisible, year2, month2, setMonth2, setYear2 }) => {
    const workbook = new exceljs.Workbook();
    const [data2, setData2] = useState(userRows);
    const [columnVisible, setColumnVisible] = useState(outputColumnVisible);
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState("");
    const componentRef = useRef();
    const [single, setSingle] = useState({});
    const [yearOptions, setYearOptions] = useState([])
    const [excelPayroll, setExcelPayroll] = useState([])
    const [loading, setLoading] = useState(true)
    const params = useParams()

    console.log("187",params.payrollId)
    
    useEffect(() => {
        // console.log("2", settings)
         if((Object.keys(settings).length) > 0)
          setColumnVisible(outputColumnVisible)
       
    }, [settings])


    useEffect(() => {
        async function fetchData() {
            const response = await api.get("payrolls")
            if (response.data){
              // setExcelPayroll(response.data)
            // console.log(response.data)
            if (month && year)
            setExcelPayroll(() => response.data.filter(row => (row.year === +year) && (row.month === month)))
          }
        }
            fetchData()
        }, [year, month])

    useEffect(() => {
        async function fetchData() {
            let years = 0;
            const yearsArray = []
            const response = await api.get("payrolls")
            // console.log("128", response.data)
            // setmaumau(response.data)

            response.data.map(data => {
                if (years !== +(data.year))
                    yearsArray.push(data.year)
                years = +(data.year)
            })
            // console.log(yearsArray)
            setYearOptions(yearsArray)
            setData2(response.data)

            // console.log(response.data)
            
            // if (response.data)
            // console.log(year)
            // console.log(month)
        }
            fetchData()
        }, [])

    useEffect(() => {
        async function fetchData() {
            console.log(single)
            if(!(Object.keys(single).length === 0))
             handlePrint()
        }
            fetchData()
        }, [single])

    useEffect(() => {
        // setLoading(true)
          if (userRows.length > 0)
            setLoading(false)
          if (userRows.length <= 0)
          setTimeout(() => {
            setLoading(false)
          }, 5000)
          

        }, [userRows])

        useEffect(() => {
          // setLoading(true)
          setUserRows(() => userRows.filter(row => (row.year === year2) && (row.month === month2)))
          setYear(year2)
          setMonth(month2)

          if (params.payrollId) {
            const year = params.payrollId.split("-")[1]
            const monht = params.payrollId.split("-")[0]
            let filteredRows = data2.filter(row => (row.year === +year) && (row.month === month))
            let totalLiquid = 0
                let totalBase = 0
                let totalIrps = 0
                let totalGross = 0
                let totalInss = 0
                let totalInssCompany = 0
                let totalInssEmployee = 0
                let totalLength = 0
    
                totalLength = filteredRows.map((data, index) => {
                    totalLiquid += (+data.salary_liquid)
                    totalBase += (+data.salary_base)
                    totalGross += (+data.total_income)
                    totalIrps += (+data.irps)
                    totalInss += (+data.inss_company) + (+data.inss_employee)
                    totalInssCompany += (+data.inss_company)
                    totalInssEmployee += (+data.inss_employee)
                    // console.log(data.created_at.getTime() > (new Date()).getTime()
                 })
    
                 const totalRow = [
                  {
                  id: "totalId",
                  employee_id: totalLength.length + 1,
                  employee_name: "Total",
                  departament_name: "", 
                  position_name: "", 
                  salary_base: formatSalary().format(totalBase), 
                  subsidy: "", 
                  bonus: "", 
                  total_overtime: "", 
                  total_absences: "", 
                  cash_advances: "", 
                  backpay: "", 
                  total_income: formatSalary().format(totalGross), 
                  irps: formatSalary().format(totalIrps), 
                  inss_employee: formatSalary().format(totalInssEmployee), 
                  salary_liquid: formatSalary().format(totalLiquid), 
                  inss_company: formatSalary().format(totalInssCompany), 
                  total_inss: formatSalary().format(totalInss), 
              }
          ]
    
            // setExcelPayroll(ddd)
            filteredRows.map((data, index) => {
                data.employee_id = index + 1
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
            })
            // console.log(data3.filter(row => (row.year === "2023")))
            setUserRows(filteredRows.concat(totalRow))
    
            setYear(+year)
            setMonth(monht)
          }
          }, [year2, month2])
          

    const submitByYear = async (e) => {
        setYear(e)
        let ddd = data2.filter(row => (row.year === +e) && (row.month === month) )
        setLoading(true)
        let filteredRows = data2.filter(row => (row.year === +e) && (row.month === month) )
        let totalLiquid = 0
            let totalBase = 0
            let totalIrps = 0
            let totalGross = 0
            let totalInss = 0
            let totalInssCompany = 0
            let totalInssEmployee = 0
            let totalLength = 0

            totalLength = filteredRows.map((data, index) => {
                totalLiquid += (+data.salary_liquid)
                totalBase += (+data.salary_base)
                totalGross += (+data.total_income)
                totalIrps += (+data.irps)
                totalInss += (+data.inss_company) + (+data.inss_employee)
                totalInssCompany += (+data.inss_company)
                totalInssEmployee += (+data.inss_employee)
                // console.log(data.created_at.getTime() > (new Date()).getTime()
             })

             const totalRow = [
              {
              id: "totalId",
              employee_id: totalLength.length + 1,
              employee_name: "Total",
              departament_name: "", 
              position_name: "", 
              salary_base: formatSalary().format(totalBase), 
              subsidy: "", 
              bonus: "", 
              total_overtime: "", 
              total_absences: "", 
              cash_advances: "", 
              backpay: "", 
              total_income: formatSalary().format(totalGross), 
              irps: formatSalary().format(totalIrps), 
              inss_employee: formatSalary().format(totalInssEmployee), 
              salary_liquid: formatSalary().format(totalLiquid), 
              inss_company: formatSalary().format(totalInssCompany), 
              total_inss: formatSalary().format(totalInss), 
          }
      ]

        // setExcelPayroll(ddd)
        filteredRows.map((data, index) => {
            data.employee_id = index + 1
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
        })
        // console.log(data3.filter(row => (row.year === "2023")))
        setUserRows(filteredRows.concat(totalRow))
        // setLoading(false)
        // setUserRows(data2.filter(row => ((row.year === +e) && (row.month === month)) || (row.year === +e)))
        // console.log(data.filter(row => row.year === +e))
        
    }

    const submitByMonth =  (e) => {
        setMonth(e)
        setLoading(true)
        // console.log(maumau)
        // let ddd = maumau.filter(row => (row.month === e))
        // console.log(ddd)
        // setExcelPayroll(ddd)
        let filteredRows = data2.filter(row => (row.month === e) && (row.year === +year) )
        let totalLiquid = 0
            let totalBase = 0
            let totalIrps = 0
            let totalGross = 0
            let totalInss = 0
            let totalInssCompany = 0
            let totalInssEmployee = 0
            let totalLength = 0

            totalLength = filteredRows.map((data, index) => {
                totalLiquid += (+data.salary_liquid)
                totalBase += (+data.salary_base)
                totalGross += (+data.total_income)
                totalIrps += (+data.irps)
                totalInss += (+data.inss_company) + (+data.inss_employee)
                totalInssCompany += (+data.inss_company)
                totalInssEmployee += (+data.inss_employee)
             })

             const totalRow = [
              {
              id: "totalId",
              employee_id: totalLength.length + 1,
              employee_name: "Total",
              departament_name: "", 
              position_name: "", 
              salary_base: formatSalary().format(totalBase), 
              subsidy: "", 
              bonus: "", 
              total_overtime: "", 
              total_absences: "", 
              cash_advances: "", 
              backpay: "", 
              total_income: formatSalary().format(totalGross), 
              irps: formatSalary().format(totalIrps), 
              inss_employee: formatSalary().format(totalInssEmployee), 
              salary_liquid: formatSalary().format(totalLiquid), 
              inss_company: formatSalary().format(totalInssCompany), 
              total_inss: formatSalary().format(totalInss), 
            }
      ]

      filteredRows.map((data, index) => {
            data.employee_id = index + 1
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
        })
        let kkk = data2.filter(row => (row.month === e) && (row.year === +year) )
        setUserRows(filteredRows.concat(totalRow))
        // setLoading(false)
        // setUserRows(data2.filter(row => ((row.month === e) && (row.year === +year)) || (row.month === e)))
        // console.log(data.filter(row => row.month === month))
        
    }

    const handleDelete = async (id, router) => {
      await api.delete(`${router}/${id}`)
      setUserRows(userRows.filter(item => item.id !== id))
    } 

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

      const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'emp-data',
        // onAfterPrint: () => alert('Print sucess')
    })

      const handleSingle = (id) => {
        api.get(`payrolls/${id}`)
         .then(response => {setSingle(response.data)})
    
        // console.log(single)
        
      }

    const exportExcelFile = useCallback(async () => {
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
            column.alignment = { horizontal: 'center' };
          });
    
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
                data.nib = String(data.nib)
            })
            // loop through data and add each one to worksheet
          excelPayroll.forEach(singleData => {
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
            subsidy: formatSalary().format(total_subsidy), 
            bonus: "", 
            backpay: "", 
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
          setExcelPayroll([])
        }
      }, [excelPayroll]);
     

    const actionColumn = [
        { 
            field: "action", 
            headerName: "", 
            width: 200,
            align:'center', headerAlign: 'center', 
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        {/* <Link to={`/${listPath}/${params.row.id}`} style={{textDecoration: "none"}}> */}
                            <div className="printButton" onClick={() => handleSingle(params.row.id)}>
                              <PrintIcon />  Imprimir
                            </div>
                        {/* </Link> */}
                        {/* <div className="deleteButton" onClick={() => handleDelete(params.row.id, listPath)}>Remover</div> */}
                    </div>
                )
            }
        }
    ]
    return (
        <div className="datatable">
            {/* {console.log("encima")} */}
            {listName}
            <div className="datatableTitle">
                <div className="link" onClick={exportExcelFile}>
                    Exportar Excel
                </div>
                <div className="anoMes">
                    <label>Ano: </label>
                        <select id="year" name="year" value={year} onChange={e => submitByYear(e.target.value)}>
                            <option value="">Selecione Ano</option>
                            {yearOptions ? yearOptions.map((data, i) => {
                                return <option key={i}>{data}</option>
                            })
                                : null
                           }
                            {/* <option>2020</option>
                            <option >2021</option>
                            <option >2022</option>
                            <option >2023</option>
                            <option >2024</option> */}
                        </select>
                    <label>Mes: </label>
                        <select id="month" name="month" value={month} onChange={e => submitByMonth(e.target.value)} >
                            <option value="">Selecione Mes</option>
                            <option >Janeiro</option>
                            <option >Fevereiro</option>
                            <option >Marco</option>
                            <option >Abril</option>
                            <option >Maio</option>
                            <option >Junho</option>
                            <option >Julho</option>
                            <option >Agosto</option>
                            <option >Setembro</option>
                            <option >Outubro</option>
                            <option >Novembro</option>
                            <option >Dezembro</option>
                        </select>
                </div> 
                {/* <Link to={`/${listPath}/new`} className="link">
                    Add Nova Folha
                </Link> */}
                <Link to={`/${listPath}/list`} className="link">
                   Lista de Folhas
                </Link>

                <PrintPayslip componentRef={componentRef} single={single} />
            </div>
            <div  style={{ height: 540, width: '100%' }}>
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
                // '.MuiDataGrid-virtualScroller': {
                //     height: '260px !important',
                //     overflowY: 'auto',
                //   },
                  '& .MuiDataGrid-cell:nth-child(2)': {
                    position:"sticky",
                    left:"0",
                    zIndex:"1",
                    backgroundColor: "white",
                    //  borderRight: "1px solid black",
                  },
                // "& .MuiDataGrid-row": {
                //   borderTop: 1,
                //   borderBottom: 0,
                // },

                    "& .MuiDataGrid-cell": {
                    border: 1,
                    // borderRight: 1,
                    // borderTop: 1,
                    //  borderBottom: 1,
                    // borderLeft: 1,
                    // add more css for customization
                    },
                    
             }}
                columnBuffer={columns.length}
                rows={userRows}
                columns={columns.concat(actionColumn)}
                pageSize={8}
                rowsPerPageOptions={[8]}
                // checkboxSelection
                onCellEditCommit={onCellEditCommit}
                // autoHeight 
                columnVisibilityModel={columnVisible} 
                // showCellRightBorder={true}  
                // slots={{
                //   loadingOverlay: LinearProgress,
                // }}
                loading={loading}
                initialState={{
                    pinnedColumns: { left: ['id', 'name'] },
                    sorting: {
                        sortModel: [{ field: 'employee_id', sort: 'asc' }],
                      },
                    // columns: {
                    //     columnVisibilityModel: {
                    //       // Hide columns status and traderName, the other columns will remain visible
                    //       overtime50: overtime,
                    //       overtime100: overtime, 
                    //       absences: absences,
                    //     //   bonus: false,
                    //     //   cash_advances: false,
                    //     //   backpay: false,
                    //     },
                    // },
                }}          
                />
            </div>
        </div>
    )
}

export default DatatableOutputPayroll;


const columnsExcel = [
    // {header: "id", key: "id", width: 25},
    // {header: "employee_uid", key: "employee_uid",  width: 25},
    {header: "Id", key: "employee_id",  width: 25},
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
    // {header: "Bonus", key: "bonus", width: 25},
    // {header: "Retroativos", key: "backpay", width: 25},
    {header: "IRPS", key: "irps", width: 25},
    {header: "INSS (3%)", key: "inss_employee", width: 25},
    {header: "INSS (4%)", key: "inss_company", width: 25},
    {header: "INSS Total", key: "total_inss", width: 25},
    {header: "Adiantamento", key: "cash_advances", width: 25},
    {header: "Salario Liquido", key: "salary_liquid", width: 25},

    ]

    const payrollColumns = [
        { field: 'employee_id', headerName: 'ID', width: 70, pinnable: true, headerAlign: 'center',},
        { field: 'employee_name', headerName: 'Nome', width: 200, headerAlign: 'center',},
        { field: "departament_name", headerName:"Departemento", width: 150,  align:'center', headerAlign: 'center', },
        { field: "position_name", headerName:"Cargo", width: 180,  align:'center', headerAlign: 'center', },
        { field: "salary_base", headerName: "Salario Base", width: 130, align:'center', headerAlign: 'center',},
        { field: "subsidy",  headerName: "Subsidio", width: 130,  align:'center', headerAlign: 'center',},
        { field: "bonus",  headerName: "Bonus", width: 130,  align:'center', headerAlign: 'center',},
        { field: "total_overtime", headerName: "Total Horas Extras", width: 135,  align:'center', headerAlign: 'center',},
        { field: "total_absences", headerName: "Total Desconto Faltas", width: 100, align:'center', headerAlign: 'center',},
        { field: "cash_advances",  headerName: "Adiantamentos", width: 130,  align:'center', headerAlign: 'center',},
        { field: "backpay",  headerName: "Retroativos", width: 130,  align:'center', headerAlign: 'center',},
        { field: "total_income",  headerName: "Salario Bruto", width: 130,  align:'center', headerAlign: 'center',},
        { field: "irps",  headerName: "IRPS", width: 130,  align:'center', headerAlign: 'center',},
        { field: "inss_employee",  headerName: "INSS (3%)", width: 130, align:'center', headerAlign: 'center',},
        { field: "salary_liquid",headerName: "Salario Liquido", width: 150, align:'center', headerAlign: 'center',},
        { field: "inss_company",  headerName: "INSS (4%)", width: 130,  align:'center', headerAlign: 'center',},
        { field: "total_inss",  headerName: "Total INSS", width: 130,  align:'center', headerAlign: 'center',},
        // { field: "month",headerName: "MES", width: 50},
        // { field: "year",headerName: "ANO", width: 70}
    ]


