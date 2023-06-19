import "./datatableOutputPayroll.scss";
import { DataGrid,} from '@mui/x-data-grid';
import { Link, useParams } from "react-router-dom"
import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { useReactToPrint } from "react-to-print";
import PrintPayslip, { printPayslipBucket } from "../printPayslip/PrintPayslip";
import exceljs from 'exceljs';
import { saveAs } from 'file-saver';
import PrintIcon from '@mui/icons-material/Print';
import {useQuery} from 'react-query'
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

const DatatableOutputPayroll = ({ listName, listPath, columns, userRows, setUserRows, settings, outputColumnVisible, loading, setLoading, payrollId, searchName, setSearchName}) => {
    const workbook = new exceljs.Workbook();
    const [data2, setData2] = useState(userRows);
    const [columnVisible, setColumnVisible] = useState(columns);
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState("");
    const componentRef = useRef();
    const [single, setSingle] = useState([]);
    const [yearOptions, setYearOptions] = useState([])
    const [excelPayroll, setExcelPayroll] = useState([])
    const [urlLogo, setUrlLogo] = useState(null);
    // const [loading, setLoading] = useState(true)
    const params = useParams()
    const { t, i18n } = useTranslation();

    const {data, error, isError, isLoading } = useQuery('payrollsOutput', fetchPrintData)


    useEffect(() => {
      if (userRows.length > 0) {
        setYear(userRows[0]?.year)
        setMonth(userRows[0]?.month)
      }
       
    }, [userRows])

    
    useEffect(() => {
      console.log("45",outputColumnVisible)
         if((Object.keys(settings).length) > 0)
          setColumnVisible(columns)
       
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
            const response = await api.get("payroll")

            response.data.map(data => {
                if (years !== +(data.year))
                    yearsArray.push(data.year)
                years = +(data.year)
            })
             
            setYearOptions(yearsArray)
            setData2(response.data)

        }
            fetchData()
            
        }, [year, month, userRows])
      
      
    useEffect(() => {
      console.log(data2)
      // let ddd = maumau.filter(row => (row.month === e))
      console.log("useeff", year, month)
      // setExcelPayroll(ddd)
      let filteredRows = data2.filter(row => (row.month === month) && (row.year === 2023) )
      let totalLiquid = 0
          let totalBase = 0
          let totalIrps = 0
          let totalGross = 0
          let totalInss = 0
          let totalInssCompany = 0
          let totalInssEmployee = 0
          let totalLength = 0
          let total_cash_advances = 0
          let total_subsidy = 0
          let total_bonus = 0
          let total_backpay = 0
          let total_total_absences = 0
          let total_total_overtime = 0
          let total_subsidy_food = 0
          let total_subsidy_transport =- 0
          let total_subsidy_residence = 0 
          let total_subsidy_medical = 0
          let total_subsidy_vacation = 0
          let total_salary_thirteenth = 0
          let total_syndicate_employee = 0

          totalLength = filteredRows.map((data, index) => {
              totalLiquid += (+data.salary_liquid)
              totalBase += (+data.salary_base)
              totalGross += (+data.total_income)
              totalIrps += (+data.irps)
              totalInss += (+data.inss_company) + (+data.inss_employee)
              totalInssCompany += (+data.inss_company)
              totalInssEmployee += (+data.inss_employee)
              total_cash_advances += (+data.cash_advances)
              total_subsidy += (+data.subsidy)
              total_bonus += (+data.bonus)
              total_backpay += (+data.backpay)
              total_total_absences += (+data.total_absences)
              total_total_overtime += (+data.total_overtime)
              total_subsidy_food += (+data.subsidy_food)
              total_subsidy_transport += (+data.subsidy_transport)
              total_subsidy_residence += (+data.subsidy_residence)
              total_subsidy_medical += (+data.subsidy_medical)
              total_subsidy_vacation += (+data.subsidy_vacation)
              total_salary_thirteenth += (+data.salary_thirteenth)
              total_syndicate_employee += (+data.syndicate_employee)

           })

           const totalRow = [
            {
            id: "totalId",
            employee_id: totalLength.length + 1,
            employee_name: "Total",
            department_name: "", 
            position_name: "", 
            salary_base: formatSalary().format(totalBase), 
            subsidy: formatSalary().format(total_subsidy), 
            bonus: formatSalary().format(total_bonus), 
            total_overtime: formatSalary().format(total_total_overtime), 
            total_absences: formatSalary().format(total_total_absences), 
            cash_advances: formatSalary().format(total_cash_advances), 
            backpay: formatSalary().format(total_backpay), 
            total_income: formatSalary().format(totalGross), 
            irps: formatSalary().format(totalIrps), 
            inss_employee: formatSalary().format(totalInssEmployee), 
            salary_liquid: formatSalary().format(totalLiquid), 
            inss_company: formatSalary().format(totalInssCompany), 
            total_inss: formatSalary().format(totalInss), 
            subsidy_food: formatSalary().format(total_subsidy_food),
            subsidy_transport: formatSalary().format(total_subsidy_transport),
            subsidy_residence: formatSalary().format(total_subsidy_residence),
            subsidy_medical: formatSalary().format(total_subsidy_medical),
            subsidy_vacation: formatSalary().format(total_subsidy_vacation),
            salary_thirteenth: formatSalary().format(total_salary_thirteenth),
            syndicate_employee: formatSalary().format(total_syndicate_employee),
            // total_subsidy
          }
    ]

    filteredRows.map((data, index) => {
          data.employee_id = index + 1
          data.salary_base = formatSalary().format(data.salary_base)
          data.salary_liquid = formatSalary().format(data.salary_liquid)
          data.total_income = formatSalary().format(data.total_income)
          data.total_overtime = formatSalary().format(data.total_overtime)
          data.total_absences = formatSalary().format(data.total_absences)
          data.cash_advances = formatSalary().format(data.cash_advances)
          data.backpay = formatSalary().format(data.backpay)
          data.bonus = formatSalary().format(data.bonus)
          data.subsidy = formatSalary().format(data.subsidy)
          data.subsidy_food = formatSalary().format(data.subsidy_food)
          data.subsidy_transport = formatSalary().format(data.subsidy_transport)
          data.subsidy_residence = formatSalary().format(data.subsidy_residence)
          data.subsidy_medical = formatSalary().format(data.subsidy_medical)
          data.subsidy_vacation = formatSalary().format(data.subsidy_vacation)
          data.salary_thirteenth = formatSalary().format(data.salary_thirteenth)
          data.syndicate_employee = formatSalary().format(data.syndicate_employee)
          data.irps = formatSalary().format(data.irps)
          data.inss_employee = formatSalary().format(data.inss_employee)
          data.inss_company = formatSalary().format(data.inss_company)
          data.total_inss = formatSalary().format(data.total_inss)
          data.syndicate_employee = formatSalary().format(data.syndicate_employee)

      })
      // let kkk = data2.filter(row => (row.month === e) && (row.year === +year) )
      // setUserRows(filteredRows.concat(totalRow))
      
      console.log("filteredRows", filteredRows)
      // setLoading(false)
      // setUserRows(data2.filter(row => ((row.month === e) && (row.year === +year)) || (row.month === e)))
      // console.log(data.filter(row => row.month === month))
    }, [year, month])

    // useEffect(() => {
    //   setUserRows(data2
    //     .filter(row => (row.month === month) && (row.year === 2023))
    //     .filter(data => {
    //       if (searchName === "")
    //           return data
    //       else if (data.employee_name.toLowerCase().includes(searchName.toLocaleLowerCase()))
    //           return data
    //       }
    //   ))
    // }, [searchName])

    useEffect(() => {
        async function fetchData() {
            console.log(single)
            if(!(Object.keys(single).length === 0))
             handlePrint()
        }
            fetchData()
        }, [single])

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
            let total_cash_advances = 0
            let total_subsidy = 0
            let total_bonus = 0
            let total_backpay = 0
            let total_total_absences = 0
            let total_total_overtime = 0
            let total_subsidy_food = 0
            let total_subsidy_transport =- 0
            let total_subsidy_residence = 0 
            let total_subsidy_medical = 0
            let total_subsidy_vacation = 0
            let total_salary_thirteenth = 0
            let total_syndicate_employee = 0

            totalLength = filteredRows.map((data, index) => {
                totalLiquid += (+data.salary_liquid)
                totalBase += (+data.salary_base)
                totalGross += (+data.total_income)
                totalIrps += (+data.irps)
                totalInss += (+data.total_inss)
                totalInssCompany += (+data.inss_company)
                totalInssEmployee += (+data.inss_employee)
                total_cash_advances += (+data.cash_advances)
                total_subsidy += (+data.subsidy)
                total_bonus += (+data.bonus)
                total_backpay += (+data.backpay)
                total_total_absences += (+data.total_absences)
                total_total_overtime += (+data.total_overtime)
                total_subsidy_food += (+data.subsidy_food)
                total_subsidy_transport += (+data.subsidy_transport)
                total_subsidy_residence += (+data.subsidy_residence)
                total_subsidy_medical += (+data.subsidy_medical)
                total_subsidy_vacation += (+data.subsidy_vacation)
                total_salary_thirteenth += (+data.salary_thirteenth)
                total_syndicate_employee += (+data.syndicate_employee)
                // console.log(data.created_at.getTime() > (new Date()).getTime()
             })

             const totalRow = [
              {
              id: "totalId",
              employee_id: totalLength.length + 1,
              employee_name: "Total",
              department_name: "", 
              position_name: "", 
              salary_base: formatSalary().format(totalBase), 
              subsidy: formatSalary().format(total_subsidy), 
              bonus: formatSalary().format(total_bonus), 
              total_overtime: formatSalary().format(total_total_overtime), 
              total_absences: formatSalary().format(total_total_absences), 
              cash_advances: formatSalary().format(total_cash_advances), 
              backpay: formatSalary().format(total_backpay), 
              total_income: formatSalary().format(totalGross), 
              irps: formatSalary().format(totalIrps), 
              inss_employee: formatSalary().format(totalInssEmployee), 
              salary_liquid: formatSalary().format(totalLiquid), 
              inss_company: formatSalary().format(totalInssCompany), 
              total_inss: formatSalary().format(totalInss), 
              subsidy_food: formatSalary().format(total_subsidy_food),
              subsidy_transport: formatSalary().format(total_subsidy_transport),
              subsidy_residence: formatSalary().format(total_subsidy_residence),
              subsidy_medical: formatSalary().format(total_subsidy_medical),
              subsidy_vacation: formatSalary().format(total_subsidy_vacation),
              salary_thirteenth: formatSalary().format(total_salary_thirteenth),
              syndicate_employee: formatSalary().format(total_syndicate_employee),

              
          }
      ]

        // setExcelPayroll(ddd)
        filteredRows.map((data, index) => {
            data.employee_id = index + 1
            data.salary_base = formatSalary().format(data.salary_base)
            data.salary_liquid = formatSalary().format(data.salary_liquid)
            data.total_income = formatSalary().format(data.total_income)
            data.total_absences = formatSalary().format(data.total_absences)
            data.total_overtime = formatSalary().format(data.total_overtime)
            data.cash_advances = formatSalary().format(data.cash_advances)
            data.backpay = formatSalary().format(data.backpay)
            data.bonus = formatSalary().format(data.bonus)
            data.subsidy = formatSalary().format(data.subsidy)
            data.subsidy_food = formatSalary().format(data.subsidy_food)
            data.subsidy_transport = formatSalary().format(data.subsidy_transport)
            data.subsidy_residence = formatSalary().format(data.subsidy_residence)
            data.subsidy_medical = formatSalary().format(data.subsidy_medical)
            data.subsidy_vacation = formatSalary().format(data.subsidy_vacation)
            data.salary_thirteenth = formatSalary().format(data.salary_thirteenth)
            data.syndicate_employee = formatSalary().format(data.syndicate_employee)
            data.irps = formatSalary().format(data.irps)
            data.inss_employee = formatSalary().format(data.inss_employee)
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

      const handleSinglePrint = (id) => {
        api.get(`payrolls/${id}`)
         .then(response => {setSingle(response.data)})
        // api.get(`payrolls`)
        //  .then(response => {printPayslipBucket(response.data)})
    
        // console.log(single)
        
      }

      const exportExcelFile = useCallback(async () => {
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
          worksheet.getCell('A1').value = 'Elint Payroll'

          //add header
          worksheet.addRow(header2);

          //merge header with subheader row
          worksheet.mergeCells(3,13,3,25);
          worksheet.mergeCells(3,27,3,32);
          worksheet.mergeCells(3,1,4,1);
          worksheet.mergeCells(3,2,4,2);
          worksheet.mergeCells(3,3,4,3);
          worksheet.mergeCells(3,4,4,4);
          worksheet.mergeCells(3,5,4,5);
          worksheet.mergeCells(3,6,4,6);
          worksheet.mergeCells(3,7,4,7);
          worksheet.mergeCells(3,8,4,8);
          worksheet.mergeCells(3,9,4,9);
          worksheet.mergeCells(3,10,4,10);
          worksheet.mergeCells(3,11,4,11);
          worksheet.mergeCells(3,12,4,12);
          worksheet.mergeCells(3,33,4,33);
          worksheet.mergeCells(3,34,4,34);
          worksheet.mergeCells(3,35,4,35);
          worksheet.mergeCells('Z3', 'Z4');

          //add subheader values(remuneracoes header)
          worksheet.getCell('M4').value = "Subsidio de Alimentacao"
          worksheet.getCell('N4').value = "Subsidio de Residencia"
          worksheet.getCell('O4').value = "Subsidio Medico"
          worksheet.getCell('P4').value = "Subsidio de Ferias"
          worksheet.getCell('Q4').value = "Outros Subsidio"
          worksheet.getCell('R4').value = "Bonus"
          worksheet.getCell('S4').value = "Horas Extras 50"
          worksheet.getCell('T4').value = "Horas Extras 100"
          worksheet.getCell('U4').value = "Total Horas Extras"
          worksheet.getCell('V4').value = "Faltas"
          worksheet.getCell('W4').value = "Total desconto por Faltas"
          worksheet.getCell('X4').value = "Retroativos"
          worksheet.getCell('Y4').value = "Decimo terceiro Sal."

          //add subheader values(descontos header)
          worksheet.getCell('AA4').value = "INSS (3%)"
          worksheet.getCell('AB4').value = "INSS (4%)"
          worksheet.getCell('AC4').value = "INSS Total"
          worksheet.getCell('AD4').value = "IRPS"
          worksheet.getCell('AE4').value = "Sindicato"
          worksheet.getCell('AF4').value = "Emprestimo"

    
          // add worksheet columns
          // each columns contains header and its mapping key from data
          worksheet.columns = keycolumns;
    
          // updated the font for first row.
          worksheet.getRow(1).font = { bold: true };
          worksheet.getRow(2).font = { bold: true };
          worksheet.getRow(3).font = { bold: true };
          worksheet.getRow(4).font = { bold: true };
    
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
                data.days = 30
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
            month_total_workdays: "",
            day_total_workhours: "",
            base_day: "",
            base_hour: "",
            subsidy_food: "",
            subsidy_residence: "",
            subsidy_medical: "",
            subsidy_vacation: "",
            salary_thirteenth: "",
            days: "",

            // total_bonus
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

          worksheet.getColumn(1).alignment = { horizontal: 'left' };
          worksheet.getCell("A3").alignment = { horizontal: 'center', vertical: 'middle' }
          worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
          worksheet.getColumn("salary_thirteenth").hidden = true
          worksheet.getColumn("days").hidden = true
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
          setExcelPayroll([])
        }
      }, [excelPayroll]);

    // const exportExcelFile = useCallback(async () => {
    //     const workSheetName = 'Worksheet-1';
    //     const workBookName = 'Elint-Systems-Payroll';
    //     try {
    //       // creating one worksheet in workbook
    //       const worksheet = workbook.addWorksheet(workSheetName);
    
    //       // add worksheet columns
    //       // each columns contains header and its mapping key from data
    //       worksheet.columns = columnsExcel;
    
    //       // updated the font for first row.
    //       worksheet.getRow(1).font = { bold: true };
    
    //       // loop through all of the columns and set the alignment with width.
    //       worksheet.columns.forEach(column => {
    //         column.width = column.header.length + 15;
    //         // column.width = column.eachCell.length + 20;
    //         column.alignment = { horizontal: 'center' };
    //       });
    
    //     //   // loop through data and add each one to worksheet
    //     //   excelPayroll.forEach(singleData => {
    //     //     worksheet.addRow(singleData);
    //     //   });
    //       // console.log(excelPayroll)
    //        //add row 
    //         let salary_liquid = 0
    //         let salary_base = 0 
    //         let total_income = 0
    //         let inss_employee = 0
    //         let inss_company = 0
    //         let total_inss = 0
    //         let total_cash_advances = 0
    //         let total_subsidy = 0
    //         let irps = 0
    //         let total_bonus = 0
    //         let total_backpay = 0
    //         let total_total_absences = 0
    //         let total_total_overtime = 0

    //         excelPayroll.map(data => {
    //             salary_liquid = salary_liquid + data.salary_liquid
    //             salary_base = salary_base + data.salary_base
    //             total_income = total_income + data.total_income
    //             inss_employee = inss_employee + data.inss_employee
    //             inss_company = inss_company + data.inss_company
    //             irps = irps + data.irps
    //             total_inss = total_inss + data.total_inss
    //             total_cash_advances = total_cash_advances + data.cash_advances
    //             total_subsidy = total_subsidy + data.subsidy
    //             total_bonus +=  data.bonus
    //             total_backpay += data.backpay
    //             total_total_absences += data.total_absences
    //             total_total_overtime += data.total_overtime

    //             data.salary_base = formatSalary().format(data.salary_base)
    //             data.salary_liquid = formatSalary().format(data.salary_liquid)
    //             data.total_income = formatSalary().format(data.total_income)
    //             data.irps = formatSalary().format(data.irps)
    //             data.inss_employee = formatSalary().format(data.inss_employee)
    //             data.subsidy = formatSalary().format(data.subsidy)
    //             data.bonus = formatSalary().format(data.bonus)
    //             data.cash_advances = formatSalary().format(data.cash_advances)
    //             data.backpay = formatSalary().format(data.backpay)
    //             data.total_absences = formatSalary().format(data.total_absences)
    //             data.total_overtime = formatSalary().format(data.total_overtime)
    //             data.inss_company = formatSalary().format(data.inss_company)
    //             data.total_inss = formatSalary().format(data.total_inss)
    //             data.base_day = formatSalary().format(data.base_day)
    //             data.base_hour =  formatSalary().format(data.base_hour)
    //             data.nib = String(data.nib)
    //         })
    //         // loop through data and add each one to worksheet
    //       excelPayroll.forEach(singleData => {
    //         worksheet.addRow(singleData);
    //       });
            
    //        worksheet.addRow({
    //         salary_liquid:  formatSalary().format(salary_liquid), 
    //         salary_base:  formatSalary().format(salary_base), 
    //         total_income: formatSalary().format(total_income),
    //         inss_employee: formatSalary().format(inss_employee),
    //         inss_company: formatSalary().format(inss_company),
    //         total_inss: formatSalary().format(total_inss),
    //         irps: formatSalary().format(irps),
    //         total_inss: formatSalary().format(total_inss), 
    //         employee_id: "",
    //         employee_name: "TOTAL",
    //         dependents: "",
    //         position_name: "", 
    //         department_name: "",  
    //         month: "", 
    //         year: "", 
    //         nib: "",
    //         social_security: "",
    //         overtime50: "", 
    //         overtime100: "", 
    //         total_overtime: formatSalary().format(total_total_overtime), 
    //         absences: "", 
    //         total_absences: formatSalary().format(total_total_absences), 
    //         cash_advances: formatSalary().format(total_cash_advances), 
    //         subsidy: formatSalary().format(total_subsidy), 
    //         bonus: "", 
    //         backpay: formatSalary().format(total_backpay), 

    //         total_bonus



    //     });
       
    //       // loop through all of the rows and set the outline style.
    //       worksheet.eachRow({ includeEmpty: false }, row => {
    //         // store each cell to currentCell
    //         const currentCell = row._cells;
    
    //         // loop through currentCell to apply border only for the non-empty cell of excel
    //         currentCell.forEach(singleCell => {
    //           // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
    //           const cellAddress = singleCell._address;
    
    //           // apply border
    //           worksheet.getCell(cellAddress).border = {
    //             top: { style: 'thin' },
    //             left: { style: 'thin' },
    //             bottom: { style: 'thin' },
    //             right: { style: 'thin' }
    //           };
    //         });
    //       });

    //       worksheet.columns.forEach(function (column, i) {
    //         var maxLength = 0;
    //         column["eachCell"]({ includeEmpty: true }, function (cell) {
    //             var columnLength = cell.value ? cell.value.toString().length : 15;
    //             if (columnLength > maxLength ) {
    //                 maxLength = columnLength;
    //             }
    //         });
    //         column.width = maxLength < 10 ? 10 : maxLength;
    //     });

    //       // write the content using writeBuffer
    //       const buf = await workbook.xlsx.writeBuffer();
    
    //       // download the processed file
    //       saveAs(new Blob([buf]), `${workBookName}(${payrollDate}).xlsx`);
    //     } catch (error) {
    //       console.error('<<<ERRROR>>>', error);
    //       console.error('Something Went Wrong', error.message);
    //     } finally {
    //       // removing worksheet's instance to create new one
    //       workbook.removeWorksheet(workSheetName);
    //       setExcelPayroll([])
    //     }
    //   }, [excelPayroll]);
     
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
                            <div className="printButton" onClick={() => handleSinglePrint(params.row.id)}>
                            {/* handleSinglePrint(params.row.id) */}
                              <PrintIcon />  {t("Datatable.5")}
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
            {t("PayrollList.2")}
            <div className="datatableTitle">
                <div className="link" onClick={exportExcelFile}>
                  {t("PayrollList.3")}
                </div>
                <div className="anoMes">
                    <label>{t("PayrollList.5")}: </label>
                        <select id="year" name="year" value={year} onChange={e => submitByYear(e.target.value)}>
                            <option value="">{t("PayrollList.7")}</option>
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
                    <label>{t("PayrollList.6")}: </label>
                        <select id="month" name="month" value={month} onChange={e => submitByMonth(e.target.value)} >
                            <option value="">{t("PayrollList.8")}</option>
                            <option value={"Janeiro"}>{t("Month.1")}</option>
                            <option value={"Fevereiro"}>{t("Month.2")}</option>
                            <option value={"Marco"}>{t("Month.3")}</option>
                            <option value={"Abril"}>{t("Month.4")}</option>
                            <option value={"Maio"}>{t("Month.5")}</option>
                            <option value={"Junho"}>{t("Month.6")}</option>
                            <option value={"Julho"}>{t("Month.7")}</option>
                            <option value={"Agosto"}>{t("Month.8")}</option>
                            <option value={"Setembro"}>{t("Month.9")}</option>
                            <option value={"Outubro"}>{t("Month.10")}</option>
                            <option value={"Novembro"}>{t("Month.11")}</option>
                            <option value={"Dezembro"}>{t("Month.12")}</option>
                            {settings?.column_salary_thirteenth === "true" ?
                            <option value={"Decimo Terceiro Salario"}>{t("Month.13")}</option>  
                            : ""  
                            }
                            {settings?.column_salary_fourteenth === "true" ?
                            <option value={"Decimo Quarto Salario"}>{t("Month.14")}</option>  
                            : ""  
                            }
                        </select>
                </div> 
                <Link to={`/${listPath}/list`} className="link">
                  {t("PayrollList.4")}
                </Link>

                <PrintPayslip componentRef={componentRef} single={single} />
            </div>
            <div style={{ height: 540, width: '100%' }}>
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
                columns={columnVisible.concat(actionColumn)}
                pageSize={8}
                rowsPerPageOptions={[8]}
                // checkboxSelection
                onCellEditCommit={onCellEditCommit}
                // autoHeight 
                // columnVisibilityModel={columnVisible} 
                // showCellRightBorder={true}  
                // slots={{
                //   loadingOverlay: LinearProgress,
                // }}
                // loading={loading}
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
    // {header: "Departamento", key: "department_name", width: 25},
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
    {header: "Emprestimos", key: "cash_advances", width: 25},
    {header: "Salario Liquido", key: "salary_liquid", width: 25},

    ]

    const header2 = [
      // "Id",
      "Nome",
      "Dependentes",
      "Cargo",
      "Departamento",
      "Mes",
      "Ano",
      "Total dias de Trabalho",
      "total horas de Trabalho",
      "Salario Base", 
      "Dias",
      "Base diaria", 
      "Base Hora", 
      "Remuneracaoes",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Salario Bruto", 
      "Descontos", 
      "", 
      "", 
      "",
      "",
      "",
      "Salario Liquido", 
      "NIB",
      "Num. Seg",
    ]

    const keycolumns = [
      // {key: "employee_id"},
      {key: "employee_name"},
      {key: "dependents"},
      {key: "position_name"},
      {key: "department_name"},
      {key: "month"},
      {key: "year"},
      {key: "month_total_workdays"},
      {key: "day_total_workhours"}, 
      {key: "salary_base"},
      {key: "days"},
      {key: "base_day"},
      {key: "base_hour"},
      {key: "subsidy_food"},
      {key: "subsidy_residence"},
      {key: "subsidy_medical"},
      {key: "subsidy_vacation"},
      {key: "subsidy"},
      {key: "bonus"},
      {key: "overtime50"}, 
      {key: "overtime100"}, 
      {key: "total_overtime"}, 
      {key: "absences"},
      {key: "total_absences"}, 
      {key: "backpay"},
      {key: "salary_thirteenth"},
      {key: "total_income"},
      {key: "inss_employee"},
      {key: "inss_company"},
      {key: "total_inss"},
      {key: "irps"},
      {key: "syndicate_employee"}, 
      {key: "cash_advances"},   
      {key: "salary_liquid"},   
      {key: "nib"},   
      {key: "social_security"},  
    ]


// useEffect(() => {
//   setLoading(true)
//   // console.log(userRows.filter(row => (row.year === year2) && (row.month === month2)))
//   // setUserRows(() => userRows.filter(row => (row.year === year2) && (row.month === month2)))
//   // setYear(year2)
//   // setMonth(month2)

//   if (params.payrollId || year2 && month2) {
//     // const year = params.payrollId ? params.payrollId.split("-")[1] : ""
//     // const month = params.payrollId ? params.payrollId.split("-")[0] : ""
//     const yearMonth = params.payrollId ? data2.find(row => (row.payroll_id === params.payrollId)) : ""
//     console.log("78",payrollId)
//     let filteredRows;
//     // params.payrollId ? filteredRows= data2.filter(row => (row.year === +year) && (row.month === month)) 
//     payrollId ? filteredRows = data2.filter(row => (row.payroll_id === payrollId)) 
//     : filteredRows = data2.filter(row => (row.year === year2) && (row.month === month2))
//     let totalLiquid = 0
//         let totalBase = 0
//         let totalIrps = 0
//         let totalGross = 0
//         let totalInss = 0
//         let totalInssCompany = 0
//         let totalInssEmployee = 0
//         let totalLength = 0
//         let total_cash_advances = 0
//         let total_subsidy = 0
//         let total_bonus = 0
//         let total_backpay = 0
//         let total_total_absences = 0
//         let total_total_overtime = 0
//         let total_subsidy_food = 0
//         let total_subsidy_transport =- 0
//         let total_subsidy_residence = 0 
//         let total_subsidy_medical = 0
//         let total_subsidy_vacation = 0
//         let total_salary_thirteenth = 0
//         let total_syndicate_employee = 0

//         totalLength = filteredRows.map((data, index) => {
//             totalLiquid += (+data.salary_liquid)
//             totalBase += (+data.salary_base)
//             totalGross += (+data.total_income)
//             totalIrps += (+data.irps)
//             totalInss += (+data.total_inss)
//             totalInssCompany += (+data.inss_company)
//             totalInssEmployee += (+data.inss_employee)
//             total_cash_advances += (+data.cash_advances)
//             total_subsidy += (+data.subsidy)
//             total_bonus += (+data.bonus)
//             total_backpay += (+data.backpay)
//             total_total_absences += (+data.total_absences)
//             total_total_overtime += (+data.total_overtime)
//             total_subsidy_food += (+data.subsidy_food)
//             total_subsidy_transport += (+data.subsidy_transport)
//             total_subsidy_residence += (+data.subsidy_residence)
//             total_subsidy_medical += (+data.subsidy_medical)
//             total_subsidy_vacation += (+data.subsidy_vacation)
//             total_salary_thirteenth += (+data.salary_thirteenth)
//             total_syndicate_employee += (+data.syndicate_employee)
//             // console.log(data.created_at.getTime() > (new Date()).getTime()
//           })

//           const totalRow = [
//           {
//           id: "totalId",
//           employee_id: totalLength.length + 1,
//           employee_name: "Total",
//           department_name: "", 
//           position_name: "", 
//           salary_base: formatSalary().format(totalBase), 
//           subsidy: formatSalary().format(total_subsidy), 
//           bonus: formatSalary().format(total_bonus), 
//           total_overtime: formatSalary().format(total_total_overtime), 
//           total_absences: formatSalary().format(total_total_absences),
//           cash_advances: formatSalary().format(total_cash_advances), 
//           backpay: formatSalary().format(total_backpay), 
//           total_income: formatSalary().format(totalGross), 
//           irps: formatSalary().format(totalIrps), 
//           inss_employee: formatSalary().format(totalInssEmployee), 
//           salary_liquid: formatSalary().format(totalLiquid), 
//           inss_company: formatSalary().format(totalInssCompany), 
//           total_inss: formatSalary().format(totalInss), 
//           subsidy_food: formatSalary().format(total_subsidy_food),
//           subsidy_transport: formatSalary().format(total_subsidy_transport),
//           subsidy_residence: formatSalary().format(total_subsidy_residence),
//           subsidy_medical: formatSalary().format(total_subsidy_medical),
//           subsidy_vacation: formatSalary().format(total_subsidy_vacation),
//           salary_thirteenth: formatSalary().format(total_salary_thirteenth),
//           syndicate_employee: formatSalary().format(total_syndicate_employee),
//       }
//   ]

//     // setExcelPayroll(ddd)
//     filteredRows.map((data, index) => {
//         data.employee_id = index + 1
//         data.salary_base = formatSalary().format(data.salary_base)
//         data.salary_liquid = formatSalary().format(data.salary_liquid)
//         data.total_income = formatSalary().format(data.total_income)
//         data.total_overtime = formatSalary().format(data.total_overtime)
//         data.total_absences = formatSalary().format(data.total_absences)
//         data.subsidy = formatSalary().format(data.subsidy)
//         data.cash_advances = formatSalary().format(data.cash_advances)
//         data.bonus = formatSalary().format(data.bonus)
//         data.backpay = formatSalary().format(data.backpay)
//         data.subsidy_food = formatSalary().format(data.subsidy_food)
//         data.subsidy_transport = formatSalary().format(data.subsidy_transport)
//         data.subsidy_residence = formatSalary().format(data.subsidy_residence)
//         data.subsidy_medical = formatSalary().format(data.subsidy_medical)
//         data.subsidy_vacation = formatSalary().format(data.subsidy_vacation)
//         data.salary_thirteenth = formatSalary().format(data.salary_thirteenth)
//         data.syndicate_employee = formatSalary().format(data.syndicate_employee)
//         data.irps = formatSalary().format(data.irps)
//         data.inss_employee = formatSalary().format(data.inss_employee)
//         data.inss_company = formatSalary().format(data.inss_company)
//         data.total_inss = formatSalary().format(data.total_inss)
//     })
//     // console.log(data3.filter(row => (row.year === "2023")))
//     setUserRows(filteredRows.concat(totalRow))
//     if (params.payrollId) {
//       // setYear(+year)
//       // setMonth(month)
//       setYear(+yearMonth?.year)
//       setMonth(yearMonth?.month)
    
//     } else {
//       setYear(year2)
//       setMonth(month2)
//     }
  
//   }
//   }, [year2, month2, payrollId])