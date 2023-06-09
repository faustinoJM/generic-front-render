import "./datatableListPayrolls.scss";
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
import EditIcon from '@mui/icons-material/Edit';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import { printPDF } from "../printPayroll/PrintPayroll";
import {useQuery} from 'react-query'
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import PrintPayslipBatch from "../printPayslip/PrintPayslipBatch";

const formatSalary = () => {
    return new Intl.NumberFormat("en-US",{maximumFractionDigits: 2, minimumFractionDigits: 2})
}

const formatDate = new Intl.DateTimeFormat("pt-br", { dateStyle: 'short'})  

const payrollDate = formatDate.format(new Date())

async function fetchPrintData(){
    const {data} = await api.get("payrolls")
    return data
}

const DatatableListPayrolls = ({ listName, listPath, columns, setColumns, userRows, setUserRows, loading, setLoading, setting, setSetting }) => {
    const workbook = new exceljs.Workbook();
    const [year, setYear] = useState(0);
    const componentRef = useRef();
    const [printPayroll, setPrintPayroll] = useState([]);
    const [lockPayroll, setLockPayroll] = useState("");
    const {data, error, isError, isLoading } = useQuery('payrolls', fetchPrintData)
    const [urlLogo, setUrlLogo] = useState(null);
    const { t, i18n } = useTranslation();

    const handlePrintPayroll = (year, month) => {
      const fetch = async () => {
        
        const response = await api.get("settings")
       
        if (data) {
        let printData = data.filter(data => data.year === year && data.month === month)
        printData = printData.sort((a, b) => a.employee_name.toLowerCase() > b.employee_name.toLowerCase() ? 1 : -1);
          if(response.data)
            printPDF(printData, response.data, urlLogo)
          }
      }
      fetch()
    }

    useEffect(() => {
      async function fetchData() {
          console.log(printPayroll)
          if(!(Object.keys(printPayroll).length === 0))
            handlePrint()
      }
          fetchData()
      }, [printPayroll])

      useEffect(() => {
        setLockPayroll(userRows)
      }, [userRows])

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'emp-data',
        // onAfterPrint: () => alert('Print sucess')
    })

    const handlePrintPayslip = (id, year, month) => {
      api.get(`payrolls/output/${id}`)
        .then(response => {setPrintPayroll(response.data)})
    }

    const handleLockPayroll = async (id, payroll_status) => {
      payroll_status = payroll_status === "true" ? "false" : "true" 
      const payroll = await api.put(`payroll/${id}`, { payroll_status })
      const response = await api.get("payroll")
      //   .then(response => {setPrintPayroll(response.data)})
      // console.log({ payroll_status: payroll_status, payroll })
      // setUserRows(prev => prev)
      setUserRows(response.data)
    }

    const submitByYear = async (e) => {
        setYear(e)
        // setUserRows(data2.filter(row => (row.year === +e) && (row.month === month)))
        // console.log(data.filter(row => row.year === +e))
    }

    const exportExcelFile = useCallback(async (year, month, setting) => {
      // console.log("1z",year, month)
      // console.log("2z", excelPayroll)
      const response = await api.get("payrolls")

      const excelPayroll2 = response.data.filter(row => (row.year === +year) && (row.month === month))

      const workSheetName = 'Worksheet-1';
      const workBookName = 'Elint-Systems-Payroll';
      try {
        // creating one worksheet in workbook
        const worksheet = workbook.addWorksheet(workSheetName);

        //add 1st Header 
        const header1 = [""]

        // const header2 = ["Year", "Month", "Make", "Model", "Gender"];
        
        //add title and date 
        worksheet.addRow(header1);
        // merge by start row, start column, end row, end column (equivalent to K10:M12)
        worksheet.mergeCells(1,1,2,header3.length);
        // worksheet.mergeCells('A1', 'J2');
        worksheet.getCell('A1').value = setting?.company_name ?? 'Elint Payroll'

        //add header
        worksheet.addRow(header2(setting));

        //merge header with subheader row
        // worksheet.mergeCells(3,12,3,24);
        worksheet.mergeCells("L3", "AF3"); //Remuneracoes
        // // worksheet.mergeCells(3,26,3,31);
        worksheet.mergeCells("AH3", "AN3"); //Descontos
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
        worksheet.mergeCells('AG3', 'AG4');
        worksheet.mergeCells('AO3', 'AO4');
        worksheet.mergeCells('AP3', 'AP4');
        worksheet.mergeCells('AQ3', 'AQ4');
        worksheet.mergeCells('AR3', 'AR4');
        worksheet.mergeCells('AS3', 'AS4');

        //add subheader values(remuneracoes header)
        worksheet.getCell('L4').value = setting.language_options  === "pt" ? "Subsidio de Alimentacao" : "Food Allowance"
        worksheet.getCell('M4').value = setting.language_options  === "pt" ? "Subsidio de Residencia" : "Housing Allowance"
        worksheet.getCell('N4').value = setting.language_options  === "pt" ? "Subsidio Medico" : "Medical Allowance"
        worksheet.getCell('O4').value = setting.language_options  === "pt" ? "Subsidio de Transporte" : "Transport Allowance"
        worksheet.getCell('P4').value = setting.language_options  === "pt" ? "Subsidio de Ferias" : "Vacation Allowance"
        worksheet.getCell('Q4').value = setting.language_options  === "pt" ? "Subsidio de Turno" : "Shift Allowance"
        worksheet.getCell('R4').value = setting.language_options  === "pt" ? "Subsidio de Noturno" : "Night Allowance"
        worksheet.getCell('S4').value = setting.language_options  === "pt" ? "Subsidio de Risco" : "Risk Allowance"
        worksheet.getCell('T4').value = setting.language_options  === "pt" ? "Subsidio de Asseduidade" : "Attendace Allowance"
        worksheet.getCell('U4').value = setting.language_options  === "pt" ? "Subsidio de Desempenho" : "Perfomance Allowance"
        worksheet.getCell('V4').value = setting.language_options  === "pt" ? "Subsidio de Chefia" : "Leadership Allowance"
        worksheet.getCell('W4').value = setting.language_options  === "pt" ? "Outros Subsidio" : "Other Subsidy"
        worksheet.getCell('X4').value = "Bonus"
        worksheet.getCell('Y4').value = setting.language_options  === "pt" ? "Comissao" : "Comission"
        worksheet.getCell('Z4').value = setting.language_options  === "pt" ? "Horas Extras 50" : "Overtime 50"
        worksheet.getCell('AA4').value = setting.language_options  === "pt" ? "Horas Extras 100" : "Overtime 100"
        worksheet.getCell('AB4').value = setting.language_options  === "pt" ? "Total Horas Extras" : "Total Overtime"
        worksheet.getCell('AC4').value = setting.language_options  === "pt" ? "Faltas" : "Absences"
        worksheet.getCell('AD4').value = setting.language_options  === "pt" ? "Total desconto por Faltas" : "Total discount for absences"
        worksheet.getCell('AE4').value = setting.language_options  === "pt" ? "Retroativos" : "Backpay"
        worksheet.getCell('AF4').value = setting.language_options  === "pt" ? "Decimo terceiro Sal." : "Thirteenth Salary"

        //add subheader values(descontos header)
        worksheet.getCell('AH4').value = "INSS (3%)"
        worksheet.getCell('AI4').value = "INSS (4%)"
        worksheet.getCell('AJ4').value = "INSS Total"
        worksheet.getCell('AK4').value = "IRPS"
        worksheet.getCell('AL4').value = setting.language_options  === "pt" ? "Sindicato" : "Syndicate"
        worksheet.getCell('AM4').value = "IPA"
        worksheet.getCell('AN4').value = setting.language_options  === "pt" ? "Emprestimo" : "Cash Advances"

        // worksheet.addRow(header3);

        //add key column
        worksheet.columns = keycolumns

        // const subHeader = [];
        // subHeader[5] = "Male";
        // subHeader[6] = "Female";
        // subHeader[7] = "Other";
        // worksheet.addRow(subHeader);
        // worksheet.mergeCells("E2:G2");
        // worksheet.addRow(["2020", "March", "Abc", "xyz", "", "Y"]);
        // worksheet.addRow(["2020", "March", "Abc", "xyz", "Y", ""]);
        // worksheet.addRow(["2020", "March", "Abc", "xyz", "", "", "Y"]);

        // add worksheet columns
        // each columns contains header and its mapping key from data
        // worksheet.columns = columnsExcel;
  
        // updated the font for first row.
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(2).font = { bold: true };
        worksheet.getRow(3).font = { bold: true };
        worksheet.getRow(4).font = { bold: true };
      
        // loop through all of the columns and set the alignment with width.
        // worksheet.columns.forEach(column => {
        //   column.width = column.header.length + 15;
        //   // column.width = column.eachCell.length + 20;
        //   column.alignment = { horizontal: 'left' };
        // });

        worksheet.getRow(1).alignment = { horizontal: 'center' };
        worksheet.getRow(2).alignment = { horizontal: 'center', vertical: 'middle' };
        // worksheet.getColumn(3).alignment = { horizontal: 'center' };
        // worksheet.getColumn(4).alignment = { horizontal: 'center' };

      //   // loop through data and add each one to worksheet
        // excelPayroll.forEach(singleData => {
        //   worksheet.addRow(singleData);
        // });
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
          let total_ipa_employee = 0 
          let total_subsidy = 0
          let irps = 0
          let total_subsidy_food =  0
          let total_subsidy_residence =  0
          let total_subsidy_medical =  0
          let total_subsidy_vacation =  0
          let total_subsidy_transport = 0
          let total_subsidy_shift = 0
          let total_subsidy_night = 0
          let total_subsidy_risk = 0
          let total_subsidy_attendance = 0
          let total_subsidy_performance = 0
          let total_subsidy_leadership = 0
          let total_subsidy_commission = 0
          let total_salary_thirteenth = 0
          let total_overtime = 0
          let total_absences = 0
          let absences = 0
          let total_bonus = 0
          let total_backpay = 0
          let total_overtime50 = 0
          let total_overtime100 = 0
          let total_base_day = 0
          let total_base_hour = 0

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
              total_ipa_employee += data.ipa_employee
              total_subsidy_food += data.subsidy_food
              total_subsidy_residence += data.subsidy_residence
              total_subsidy_medical += data.subsidy_medical
              total_subsidy_vacation += data.subsidy_vacation
              total_subsidy_transport += data.subsidy_transport
              total_subsidy_shift += data.subsidy_shift
              total_subsidy_night += data.subsidy_night
              total_subsidy_risk += data.subsidy_risk
              total_subsidy_attendance += data.subsidy_attendance
              total_subsidy_performance += data.subsidy_performance
              total_subsidy_leadership += data.subsidy_leadership
              total_subsidy_commission += data.subsidy_commission
              total_salary_thirteenth += data.salary_thirteenth
              total_overtime += data.total_overtime
              total_absences += data.total_absences
              total_bonus += data.bonus
              total_backpay += data.backpay
              total_overtime50 += data.overtime50
              total_overtime100 += data.overtime100
              absences += data.absences
              total_base_day += data.base_day
              total_base_hour += data.base_hour
              data.nib = String(data.nib)
          })

          // loop through data and add each one to worksheet
        excelPayroll2.forEach(singleData => {
          console.log("excel12", singleData, "singleData.bonus", singleData.bonus)
          worksheet.addRow({
            employee_id: "",
            employee_name: singleData.employee_name,
            dependents: singleData.dependents,
            position_name: singleData.position_name, 
            department_name: singleData.department_name,  
            month: singleData.month, 
            year: singleData.year, 
            salary_liquid:  singleData.salary_liquid, 
            salary_base:  singleData.salary_base, 
            total_income: singleData.total_income,
            inss_employee: singleData.inss_employee,
            inss_company: singleData.inss_company,
            total_inss: singleData.total_inss,
            bank_name: singleData.bank_name,
            bank_account: singleData.bank_account,
            irps: singleData.irps,
            nib: singleData.nib,
            social_security: singleData.social_security,
            overtime50: singleData.overtime50, 
            overtime100: singleData.overtime100, 
            total_overtime: singleData.total_overtime, 
            absences: singleData.absences, 
            total_absences: singleData.total_absences, 
            cash_advances: singleData.cash_advances, 
            syndicate_employee: singleData.syndicate_employee,
            ipa_employee: singleData.ipa_employee,
            subsidy: singleData.subsidy, 
            bonus: singleData.bonus, 
            backpay: singleData.backpay, 
            month_total_workdays: singleData.month_total_workdays,
            day_total_workhours: singleData.day_total_workhours,
            base_day: singleData.base_day,
            base_hour: singleData.base_hour,
            subsidy_food: singleData.subsidy_food,
            subsidy_residence: singleData.subsidy_residence,
            subsidy_medical: singleData.subsidy_medical,
            subsidy_vacation: singleData.subsidy_vacation,
            subsidy_transport: singleData.subsidy_transport,
            subsidy_shift: singleData.subsidy_shift,
            subsidy_night: singleData.subsidy_night,
            subsidy_risk: singleData.subsidy_risk,
            subsidy_attendance: singleData.subsidy_attendance,
            subsidy_performance: singleData.subsidy_performance,
            subsidy_leadership: singleData.subsidy_leadership,
            subsidy_commission: singleData.subsidy_commission,
            salary_thirteenth: singleData.salary_thirteenth,
          });
        });
          
         worksheet.addRow({
          salary_liquid: salary_liquid, 
          salary_base: salary_base, 
          total_income: total_income,
          inss_employee: inss_employee,
          inss_company: inss_company,
          total_inss: total_inss,
          irps: irps,
          employee_id: "",
          employee_name: "TOTAL",
          dependents: "",
          position_name: "", 
          department_name: "",  
          month: "", 
          year: "", 
          nib: "",
          social_security: "",
          bank_name: "",
          bank_account: "",
          overtime50: total_overtime50, 
          overtime100: total_overtime100, 
          total_overtime: total_overtime, 
          absences: absences, 
          total_absences: total_absences, 
          cash_advances: total_cash_advances, 
          syndicate_employee: total_syndicate_employee,
          subsidy: total_subsidy, 
          bonus: total_bonus, 
          backpay: total_backpay, 
          month_total_workdays: "",
          day_total_workhours: "",
          base_day: total_base_day,
          base_hour: total_base_hour,
          ipa_employee: total_ipa_employee,
          subsidy_food: total_subsidy_food,
          subsidy_residence: total_subsidy_residence,
          subsidy_medical: total_subsidy_medical,
          subsidy_vacation: total_subsidy_vacation,
          subsidy_transport: total_subsidy_transport,
          subsidy_shift: total_subsidy_shift,
          subsidy_night: total_subsidy_night,
          subsidy_risk: total_subsidy_risk,
          subsidy_attendance: total_subsidy_attendance,
          subsidy_performance: total_subsidy_performance,
          subsidy_leadership: total_subsidy_leadership,
          subsidy_commission: total_subsidy_commission,
          salary_thirteenth: total_salary_thirteenth,
      });
     
      worksheet.lastRow.font = { bold: true };
      worksheet.mergeCells(worksheet.lastRow.number, 1, worksheet.lastRow.number, 8)

      worksheet.getCell('L4').numFmt = '# ?/?'; //#,##0.00
      worksheet.getColumn(9).numFmt = "#,##0.00"
      worksheet.getColumn(10).numFmt = "#,##0.00"
      worksheet.getColumn(11).numFmt = "#,##0.00"
      worksheet.getColumn(12).numFmt = "#,##0.00"
      worksheet.getColumn(13).numFmt = "#,##0.00"
      worksheet.getColumn(14).numFmt = "#,##0.00"
      worksheet.getColumn(15).numFmt = "#,##0.00"
      worksheet.getColumn(16).numFmt = "#,##0.00"
      worksheet.getColumn(17).numFmt = "#,##0.00"
      worksheet.getColumn(18).numFmt = "#,##0.00"
      worksheet.getColumn(19).numFmt = "#,##0.00"
      worksheet.getColumn(20).numFmt = "#,##0.00"
      worksheet.getColumn(21).numFmt = "#,##0.00"
      worksheet.getColumn(22).numFmt = "#,##0.00"
      worksheet.getColumn(23).numFmt = "#,##0.00"
      worksheet.getColumn(24).numFmt = "#,##0.00"
      worksheet.getColumn(25).numFmt = "#,##0.00"
      // worksheet.getColumn(26).numFmt = "#,##0.00" overtime50
      // worksheet.getColumn(27).numFmt = "#,##0.00" overtime100
      worksheet.getColumn(28).numFmt = "#,##0.00"
      // worksheet.getColumn(29).numFmt = "#,##0.00" absences
      worksheet.getColumn(30).numFmt = "#,##0.00"
      worksheet.getColumn(31).numFmt = "#,##0.00"
      worksheet.getColumn(32).numFmt = "#,##0.00"
      worksheet.getColumn(33).numFmt = "#,##0.00"
      worksheet.getColumn(34).numFmt = "#,##0.00"
      worksheet.getColumn(35).numFmt = "#,##0.00"
      worksheet.getColumn(36).numFmt = "#,##0.00"
      worksheet.getColumn(37).numFmt = "#,##0.00"
      worksheet.getColumn(38).numFmt = "#,##0.00"
      worksheet.getColumn(39).numFmt = "#,##0.00"
      worksheet.getColumn(40).numFmt = "#,##0.00"
      worksheet.getColumn(41).numFmt = "#,##0.00"
      // worksheet.getColumn(42).numFmt = "#,##0.00"
      // worksheet.getColumn(43).numFmt = "#,##0.00"
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
        worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.lastRow.alignment = { horizontal: 'center' };
        // worksheet.getColumn("nib").hidden = false ? false : true
        // worksheet.getColumn(header2.length).hidden = false ? false : true
        // worksheet.getRow(2).alignment = { horizontal: 'center', vertical: 'middle' };


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
    // const exportExcelFile = useCallback(async (year, month) => {
    //     // console.log("1z",year, month)
    //     // console.log("2z", excelPayroll)
    //     const response = await api.get("payrolls")

    //     const excelPayroll2 = response.data.filter(row => (row.year === +year) && (row.month === month))

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
    //         column.alignment = { horizontal: 'left' };
    //       });

    //       worksheet.getRow(1).alignment = { horizontal: 'center' };
    //       worksheet.getColumn(3).alignment = { horizontal: 'center' };
    //       worksheet.getColumn(4).alignment = { horizontal: 'center' };

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
    //         let total_syndicate_employee = 0
    //         let total_subsidy = 0
    //         let irps = 0

    //         excelPayroll2.map(data => {
    //             salary_liquid = salary_liquid + data.salary_liquid
    //             salary_base = salary_base + data.salary_base
    //             total_income = total_income + data.total_income
    //             inss_employee = inss_employee + data.inss_employee
    //             inss_company = inss_company + data.inss_company
    //             irps = irps + data.irps
    //             total_inss = total_inss + data.total_inss
    //             total_cash_advances = total_cash_advances + data.cash_advances
    //             total_subsidy = total_subsidy + data.subsidy
    //             total_syndicate_employee += data.syndicate_employee

    //             data.salary_base = formatSalary().format(data.salary_base)
    //             data.salary_liquid = formatSalary().format(data.salary_liquid)
    //             data.total_income = formatSalary().format(data.total_income)
    //             data.irps = formatSalary().format(data.irps)
    //             data.inss_employee = formatSalary().format(data.inss_employee)
    //             data.subsidy = formatSalary().format(data.subsidy)
    //             data.bonus = formatSalary().format(data.bonus)
    //             data.cash_advances = formatSalary().format(data.cash_advances)
    //             data.syndicate_employee = formatSalary().format(data.syndicate_employee)
    //             data.backpay = formatSalary().format(data.backpay)
    //             data.total_absences = formatSalary().format(data.total_absences)
    //             data.total_overtime = formatSalary().format(data.total_overtime)
    //             data.inss_company = formatSalary().format(data.inss_company)
    //             data.total_inss = formatSalary().format(data.total_inss)
    //             data.nib = String(data.nib)
    //         })
    //         // loop through data and add each one to worksheet
           
    //       excelPayroll2.forEach(singleData => {
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
    //         total_overtime: "", 
    //         absences: "", 
    //         total_absences: "", 
    //         cash_advances: formatSalary().format(total_cash_advances), 
    //         syndicate_employee: formatSalary().format(total_syndicate_employee),
    //         subsidy: formatSalary().format(total_subsidy), 
    //         bonus: "", 
    //         backpay: "", 
    //     });
       
    //     worksheet.lastRow.font = { bold: true };

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
    //     //   setExcelPayroll([])
    //     }
    //   }, []);

    const handleDelete = (id) => {
        // console.log("aaa"+router)
        // await api.delete('payrolls', { data: { year, month }})
        api.delete(`payroll/${id}`).then(() => {
          setUserRows(userRows.filter(item => !(id === item.id)))
        }).catch((err) => {
          Swal.fire({
            icon: 'error',
            title: `Error ${err.response.status}`,
            text: err.response.data.message,
            // footer: '<a href="">Why do I have this issue?</a>'
          })
        })

        // setRows(rows.filter(item => !(month === item.month && +year === +item.year)))
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

    const actionColumn = [
        { 
            field: "action", 
            headerName: "", 
            width: 680, 
            align: "left",
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                      {params.row.payroll_status !==  "true" ? 
                        <Link to={`/${listPath}/list/input/${params.row.id}`} style={{textDecoration: "none"}}>
                          <div className="editButton">
                              <EditIcon /> {t("Datatable.2")}
                          </div>
                        </Link>
                        : null
                        }
                        <div className="printButton" onClick={() => handlePrintPayroll(params.row.year, params.row.month)}>
                            {/* handlePrintPayroll(params.row.year, params.row.month) */}
                              <PrintIcon />  {t("Datatable.5")}
                          </div>
                        <div className="editButton" onClick={() => exportExcelFile(params.row.year, params.row.month, setting)}>
                            <DescriptionIcon className="edIcon"/> {t("Datatable.4")}
                        </div>
                        <Link to={`/${listPath}/list/output/${params.row.id}`} style={{textDecoration: "none"}}>
                          {/* to={`/${listPath}/${params.row.id}`} */}
                          {/* to={`/${listPath}/output/${params.row.month}-${params.row.year}`} */}
                          <div className="viewButton">
                              <VisibilityIcon /> {t("Datatable.1")}
                          </div>
                        </Link>
                        <div className="deleteButton" onClick={() => handleDelete(params.row.id)}>
                            <DeleteForeverIcon /> {t("Datatable.3")}
                        </div>
                        <div className="printButton" onClick={() => handlePrintPayslip(params.row.id, params.row.year, params.row.month)}>
                              <PrintIcon />  {t("Datatable.6")}
                        </div>
                        <div className={params.row.payroll_status !==  "true" ? "editButton" : "deleteButton"} onClick={() => handleLockPayroll(params.row.id, params.row.payroll_status)}>
                              {params.row.payroll_status !== "true" ? 
                              <><LockOpenIcon /> {t("Datatable.7")}</>
                              : <><LockIcon /> {t("Datatable.8")}</>
                              }
                        </div>
                        {/* <select className={params.row.payroll_status !==  "true" ? "editButton" : "deleteButton"} onChange={() => handleLockPayroll(params.row.id, params.row.payroll_status)}>
                        {params.row.payroll_status !== "true" ? 
                        <option selected><LockOpenIcon />Aberto</option>
                         : <option><LockOpenIcon />Aberto</option>
                            }
                            {params.row.payroll_status === "true" ? 
                          <option selected><LockIcon />Fechado</option>
                        : <option ><LockIcon />Fechado</option>
                            }
                        </select> */}
                    </div>
                )
            }
        }
    ]
    return (
        <div className="datatable">
            <div className="datatableTitle">
                {t("PayrollList.1")}
                {/* {listPath === "payrolls" ? 
                <div className="anoMes">
                    <label>Ano: </label>
                        <select id="year" name="year" onChange={e => submitByYear(e.target.value)}>
                            <option value="">Selecione Ano</option>
                            <option >2022</option>
                            <option >2023</option>
                            <option >2024</option>
                        </select>
                */}
                {/* <PrintPayroll componentRef={componentRef} printData={printPayroll}/> */}
                <PrintPayslipBatch componentRef={componentRef} printData={printPayroll} />
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
                initialState={{
                  sorting: {
                      sortModel: [{ field: 'month', sort: 'asc' }],
                    },
                }}
  
                // showCellRightBorder={true}  
           
                />
                
        </div>
    )
}

export default DatatableListPayrolls;


const columnsExcel = [
    // {header: "id", key: "id", width: 25},
    // {header: "employee_uid", key: "employee_uid",  width: 25},
    // {header: "Id", key: "employee_id",  width: 25},
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
    {header: "Emprestimos", key: "cash_advances", width: 25},
    {header: "Sindicato", key: "syndicate_employee", width: 25},
    {header: "Salario Liquido", key: "salary_liquid", width: 25},

    ]

const header2 = (setting) => {
  const header2 = [
    // "Id",
    setting.language_options === "pt" ? "Nome" : "Name",
    setting.language_options === "pt" ? "Dependentes" : "Dependents",
    setting.language_options === "pt" ? "Cargo": "Position",
    setting.language_options === "pt" ? "Departamento" : "Department",
    setting.language_options === "pt" ? "Mes" : "Month",
    setting.language_options === "pt" ? "Ano" : "Year",
    setting.language_options === "pt" ? "Total dias de Trabalho" : "Total workdays",
    setting.language_options === "pt" ? "Total horas de Trabalho" : "Total workhours",
    setting.language_options === "pt" ? "Salario Base" : "Base Salary", 
    setting.language_options === "pt" ? "Base diaria" : "Daily basis", 
    setting.language_options === "pt" ? "Base Hora" : "Hourly basis", 
    setting.language_options === "pt" ? "Remuneracaoes" : "Income", //Subsidio de Alimentacao
    "", //Subsidio de Residencia
    "", //Subsidio Medico
    "", //Subsidio de Transporte
    "", //Subsidio de Ferias
    "", //Subsidio de Turno
    "", //Subsidio de Noturno
    "", //Subsidio de Risco
    "", //Subsidio de Asseduidade
    "", //Subsidio de Desempenho
    "", //Subsidio de Chefia
    "", //Outros Subsidio
    "", //"Bonus"
    "", //"Comissao"
    "", //Horas Extras 50
    "", //Horas Extras 100
    "", //Total Horas Extras
    "", //"Faltas"
    "", //Total desconto por Faltas
    "", //"Retroativos"
    "", //Decimo terceiro Sal.
    setting.language_options === "pt" ? "Salario Bruto" : "Gross Salary", 
    setting.language_options === "pt" ? "Descontos" : "Deduction", //"INSS (3%)" 
    "", //"INSS (4%)" 
    "", //"INSS Total" 
    "", //"IRPS"
    "", //Syndicate
    "", //"IPA"
    "", //Cash Advances
    setting.language_options === "pt" ? "Salario Liquido" : "Liquid Salary", 
    setting.language_options === "pt" ? "Nome do Banco" : "Bank Name",
    setting.language_options === "pt" ? "Numero de Conta" : "Bank Account",
    "NIB",
    setting.language_options === "pt" ? "Num. Seg" : "Social Sec. Num.",
  ]

  return header2
}

// const header2 = [
//   // "Id",
//   "Nome",
//   "Dependentes",
//   "Cargo",
//   "Departamento",
//   "Mes",
//   "Ano",
//   "Total dias de Trabalho",
//   "total horas de Trabalho",
//   "Salario Base", 
//   "Base diaria", 
//   "Base Hora", 
//   "Remuneracaoes",
//   "",
//   "",
//   "",
//   "",
//   "",
//   "",
//   "",
//   "",
//   "",
//   "",
//   "",
//   "",
//   "Salario Bruto", 
//   "Descontos", 
//   "", 
//   "", 
//   "",
//   "",
//   "",
//   "Salario Liquido", 
//   "NIB",
//   "Num. Seg",
// ]


const header3 = [
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
  "Base diaria", 
  "Base Hora", 
  "Subsidio de Transporte",
  "Subsidio de Alimentacao",
  "Subsidio de Residencia",
  "Subsidio Medico",
  "Subsidio de Ferias",
  "Subsidio de Turno",
  "Subsidio de Noturno",
  "Subsidio de Risco",
  "Subsidio de Asseduidade",
  "Subsidio de Desempenho",
  "Subsidio de Chefia",
  "Outros Subsidio",
  "Bonus",
  "Comissao",
  "Horas Extras 50",
  "Horas Extras 100",
  "Total Horas Extras",
  "Faltas",
  "Total desconto por Faltas",
  "Retroativos",
  "Decimo terceiro Sal.",
  "Salario Bruto", 
  "INSS (3%)", 
  "INSS (4%)", 
  "INSS Total", 
  "IRPS",
  "Sindicato",
  "IPA",
  "Emprestimo",
  "Salario Liquido", 
  "Conta Bancaria",
  "Numero de Conta",
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
  {key: "base_day"},
  {key: "base_hour"},
  {key: "subsidy_food"},
  {key: "subsidy_residence"},
  {key: "subsidy_medical"},
  {key: "subsidy_vacation"},
  {key: "subsidy_transport"},
  {key: "subsidy_shift"},
  {key: "subsidy_night"},
  {key: "subsidy_risk"},
  {key: "subsidy_attendance"},
  {key: "subsidy_performance"},
  {key: "subsidy_leadership"},
  {key: "subsidy_commission"},
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
  {key: "ipa_employee"}, 
  {key: "syndicate_employee"}, 
  {key: "cash_advances"},   
  {key: "salary_liquid"},   
  {key: "bank_name"},
  {key: "bank_account"},
  {key: "nib"},
  {key: "social_security"} 
]

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
  let total_subsidy_food =  0
  let total_subsidy_residence =  0
  let total_subsidy_medical =  0
  let total_subsidy_vacation =  0
  let total_overtime50 = 0
  let total_overtime100 = 0
  let total_absences = 0
  let total_base_day = 0
  let total_base_hour = 0
  
  totalLength = printData.map((data, index) => {
      total_liquid += (+data.salary_liquid)
      total_base += (+data.salary_base)
      total_gross += (+data.total_income)
      total_Irps += (+data.irps)
      total_Inss += (+data.total_inss)
      total_InssCompany += (+data.inss_company)
      total_InssEmployee += (+data.inss_employee)
      total_cash_advances += (+data.cash_advances)
      total_syndicate_employee += (+data.syndicate_employee)
      total_subsidy += (+data.subsidy)
      total_bonus += (+data.bonus)
      total_backpay += (+data.backpay)
      total_total_absences += (+data.total_absences)
      total_total_overtime += (+data.total_overtime)
      total_subsidy_food += (+data.subsidy_food)
      total_subsidy_residence += (+data.subsidy_residence)
      total_subsidy_medical += (+data.subsidy_medical)
      total_subsidy_vacation += (+data.subsidy_vacation)
      total_overtime50 += (+data.overtime50)
      total_overtime100 += (+data.overtime100)
      total_absences += (+data.absences)
      total_base_day += (+data.base_day)
      total_base_hour += (+data.base_hour)
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
          "subsidy_food": total_subsidy_food,
          "subsidy_residence": total_subsidy_residence,
          "subsidy_medical": total_subsidy_medical,
          "subsidy_vacation": total_subsidy_vacation,
          }]
      
      return totalRow
  }