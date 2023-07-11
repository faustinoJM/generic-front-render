import "./datatableResource.scss";
import { DataGrid} from '@mui/x-data-grid';
import { Link } from "react-router-dom"
import { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import exceljs from 'exceljs';
import { saveAs } from 'file-saver';
import api from "../../services/api";
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import EditNoteIcon from '@mui/icons-material/EditNote';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
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

const DatatableResourceINSS = ({ listName, listPath, columns, userRows, setUserRows, loading, setLoading, settings, setSettings}) => {
    const workbook = new exceljs.Workbook();
    const [year, setYear] = useState(0);
    const componentRef = useRef();
    const [single, setSingle] = useState([]);
    const { t, i18n } = useTranslation();
    // const {data, error, isError, isLoading } = useQuery('payrolls', fetchPrintData)

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
        // setUserRows(data2.filter(row => (row.year === +e) && (row.month === month)))
        // console.log(data.filter(row => row.year === +e))
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'INSS-data',
        // onAfterPrint: () => alert('Print sucess')
    })

    const handleTxt = async (id) => {
        const response = await api.get(`payrolls/output/${id}`)
        let sismo_txt = ""
        let date_sismo = formatDate.format(new Date()).split("/")
        let sismo_name = `Company_NUIT${date_sismo[1]}${date_sismo[2]}`

        response.data.map(data => {
          let event_date = formatDate.format(new Date(data.inss_event_date))
          let event_date_txt = event_date.split("/")
          data.inss_event = data.absences <= 0 && data.inss_event === 10 ? "" : data.inss_event//(data.inss_event < 0 ? '10' : data.inss_event)
          // let event = data.inss_event > 0 ?  data.inss_event : data.absences > 0 ? 10 : ""
          event_date_txt = +data.inss_event > 0 ? `${event_date_txt[0]}${event_date_txt[1]}${event_date_txt[2]}` : ""
          data.salary_base = (+data.salary_base + data.total_overtime - data.total_absences).toFixed(2)
          data.subsidy = data.subsidy + data.subsidy_food + data.subsidy_medical + data.subsidy_residence + data.subsidy_vacation  
          // console.log("event",event, (data.absences < 0))
          
          // data.inss_event_date = data?.inss_event > 0 ? event_date : ""
          data.days = 30 - (+data.absences)
          data.inss_event = data.inss_event > 0 ? data.inss_event : ""
          // sismo_txt = sismo_txt + `${data.social_security};${data.days};${(data.salary_base * 100).toFixed(0)};${+data.subsidy * 100};${+data.bonus * 100};${data.inss_event};${event_date_txt};\n`
          sismo_txt = sismo_txt + `${data.social_security};${data.days};${(data.total_income * 100).toFixed(0)};;;${data.inss_event};${event_date_txt};\n`

        })
        const element = document.createElement("a")
        const file = new Blob([sismo_txt], {
          type: "text/plain;charset-utf-8",
        });
        element.href = URL.createObjectURL(file);
        element.download = sismo_name;
        document.body.appendChild(element)
        element.click();
    }

    const exportExcelFile = useCallback(async (id, settings) => {
      const response = await api.get(`payrolls/output/${id}`)

      const excelPayroll = response.data ///filter(row => (row.year === +year) && (row.month === month))

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
        worksheet.getCell('A1').value = `${settings?.company_name ? settings.company_name : "INSS Elint Payroll"}`

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
              let event_date = formatDate.format(new Date(data.inss_event_date))
              let event_date_txt = event_date.split("/")
              event_date_txt = +data.inss_event > 0 ? `${event_date_txt[0]}${event_date_txt[1]}${event_date_txt[2]}` : ""
              data.inss_event = data.inss_event > 0 ? data.inss_event : ""

              salary_liquid = salary_liquid + data.salary_liquid
              salary_base = salary_base + data.salary_base
              total_income = total_income + data.total_income
              inss_employee = inss_employee + data.inss_employee
              inss_company = inss_company + data.inss_company
              irps = irps + data.irps
              total_inss = total_inss + data.total_inss
              total_cash_advances = total_cash_advances + data.cash_advances
              total_subsidy = total_subsidy + data.subsidy + data.subsidy_food + data.subsidy_medical 
                              + data.subsidy_residence + data.subsidy_vacation + data.total_overtime + 
                              data.subsidy_shift + data.subsidy_transport + data.subsidy_night + data.subsidy_risk +
                              data.subsidy_attendance + data.subsidy_performance + data.subsidy_leadership+
                              data.subsidy_commission
              total_bonus +=  data.bonus + data.subsidy_commission
              total_backpay += data.backpay
              total_total_absences += data.total_absences
              total_total_overtime += data.total_overtime
              total_syndicate_employee += data.syndicate_employee

              // data.inss_event
              // data.salary_base = (+data.salary_base + data.total_overtime - data.total_absences).toFixed(2)
              data.subsidy = data.subsidy + data.subsidy_food + data.subsidy_medical + data.subsidy_residence + data.subsidy_vacation + 
                              data.total_overtime + data.subsidy_shift + data.subsidy_transport + data.subsidy_night + data.subsidy_risk +
                              data.subsidy_attendance + data.subsidy_performance + data.subsidy_leadership
              data.bonus = data.bonus + data.subsidy_commission 
              data.inss_event_date = data?.inss_event ? event_date : ""
              data.days = 30 - (+data.absences)
              // data.sismo_txt = `${data.social_security};${data.days};${+(data.salary_base * 100).toFixed(0)};${+data.subsidy * 100};${+data.bonus * 100};${data?.inss_event ?? ""};${event_date_txt}`
              data.sismo_txt = `${data.social_security};${data.days};${+(data.total_income * 100).toFixed(0)};;;${data?.inss_event ?? ""};${event_date_txt}`
              data.nib = String(data.nib)
              data.birth_date = ""
              
          })
          // loop through data and add each one to worksheet
          excelPayroll.forEach(singleData => {
            worksheet.addRow(singleData);
          });
          
         worksheet.addRow({
          social_security: "TOTAL",  
          employee_name: "",
          days: "",
          birth_date: "",
          salary_base:  salary_base, 
          subsidy: total_subsidy,
          bonus: total_bonus,
          total_income: total_income,
          inss_event: "",
          inss_event_date: "",
          inss_company: inss_company,
          inss_employee: inss_employee,
          total_inss: total_inss,
          // total_bonus
        });
        worksheet.lastRow.font = { bold: true };
        // worksheet.getColumn(4).numFmt = "#,##0.00"
        worksheet.getColumn(5).numFmt = "#,##0.00"
        worksheet.getColumn(6).numFmt = "#,##0.00"
        worksheet.getColumn(7).numFmt = "#,##0.00"
        worksheet.getColumn(8).numFmt = "#,##0.00"
        worksheet.getColumn(11).numFmt = "#,##0.00"
        worksheet.getColumn(12).numFmt = "#,##0.00"
        worksheet.getColumn(13).numFmt = "#,##0.00"

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
                        <Link to={`/${listPath}/social-security/${params.row.id}`} style={{textDecoration: "none"}}>
                                <div className="editButton">
                                    <EditIcon /> {t("Datatable.2")}
                                </div>
                        </Link>
                        <div className="printButton" onClick={() => handleTxt(params.row.id)}>
                            <StickyNote2Icon />  TXT
                        </div>
                        <div className="editButton" onClick={() => exportExcelFile(params.row.id, settings)}>
                            <DescriptionIcon className="edIcon"/> {t("Datatable.4")}
                        </div>
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
      "SISMO TXT",
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
      {key: "inss_event"},
      {key: "inss_event_date"},
      {key: "inss_employee"},
      {key: "inss_company"},
      {key: "total_inss"},
      {key: "sismo_txt"},
    ]