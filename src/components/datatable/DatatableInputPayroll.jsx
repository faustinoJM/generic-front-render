import "./datatableInputPayroll.scss";
import { DataGrid} from '@mui/x-data-grid';
// import { userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useTranslation } from 'react-i18next';


const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
}

export const vvisible = {
    employee_name: true,
    department_name: true,
    position_name: true,
    absences: true,
    overtime50: true,
    overtime100: true,
}

export const visible = {
    employee_name: true,
    department_name: true,
    position_name: true,
    absences: true,
    overtime50: true,
    overtime100: true,
}

const DatatableInputPayroll = ({ listName, listPath, columns, userRows, setUserRows, settings, loading, setLoading, searchName, setSearchName}) => {
    const [data2, setData2] = useState(userRows);
    // const [loading, setLoading] = useState(true)
    const [columnsVisible, setColumnsVisible] = useState(payrollInputColumns);
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState("");
    const [yearOptions, setYearOptions] = useState([])
    const { t, i18n } = useTranslation();

    useEffect(() => {
        console.log("2", settings)
        if((Object.keys(settings).length) > 0)
            setColumnsVisible(columns)
        
    }, [settings])

  useEffect(() => {
        let monthGreater = 0
        let yearGreater = 0
        let dateAux = new Date("2000/12/31")

        if (year <= 0) {
            userRows.map((data, index) => {

                if (dateAux.getTime() < new Date(data.created_at).getTime()) {
                    monthGreater = data.month
                    yearGreater = data.year
                    dateAux = new Date(data.created_at)
                }
             })
             setYear(yearGreater)
             setMonth(monthGreater)
             console.log(monthGreater, yearGreater)
        } 
        
    }, [userRows])

    useEffect(() => {
        // setUserRows(() => data2.filter(data => data.month === month && data.year === year))
        let UserRowsbyYearMonth =  data2.filter(data => data.month === month && data.year === year)
        setUserRows(UserRowsbyYearMonth.filter(data => {
            if (searchName === "")
                return data
            else if (data.employee_name.toLowerCase().includes(searchName.toLocaleLowerCase()))
                return data
        }))

    }, [year, month, searchName])

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("payrolls/input")

            response.data.map((data) => {
                data.salary_base = formatSalary().format(data.salary_base)
                data.overtime50 = formatSalary().format(data.overtime50)
                data.overtime100 = formatSalary().format(data.overtime100)
                data.subsidy = formatSalary().format(data.subsidy)
                data.bonus = formatSalary().format(data.bonus)
                data.cash_advances = formatSalary().format(data.cash_advances)
                data.backpay = formatSalary().format(data.backpay)
                data.subsidy_food = formatSalary().format(data.subsidy_food)
                data.subsidy_transport = formatSalary().format(data.subsidy_transport)
                data.subsidy_residence = formatSalary().format(data.subsidy_residence)
                data.subsidy_medical = formatSalary().format(data.subsidy_medical)
                data.subsidy_vacation = formatSalary().format(data.subsidy_vacation)
                data.salary_thirteenth = formatSalary().format(data.salary_thirteenth)
            })
            setData2(response.data)
        }
            fetchData()
        }, [])

    useEffect(() => {
    async function fetchData() {
        const yearsArray = []
        let years = 0;
        const response = await api.get("payrolls/input")

        response.data.map(data => {
            if (years !== +(data.year))
                yearsArray.push(data.year)
            years = +(data.year)
        })

        setYearOptions(yearsArray)
        }
        fetchData()
    }, [])

    const submitByYear = async (e) => {
        setYear(+e)
    }

    const submitByMonth = async (e) => {
        setMonth(e)
    }

    const handleDelete = async (id, router) => {
    await api.delete(`${router}/${id}`)
        setUserRows(userRows.filter(item => item.id !== id))
    } 

    const onCellEditCommit = ({ id, field, value }) => {
        if (value >= 0)
        api.put(`payrolls/${id}`, {[field]: value}).then(response => console.log(response))

            // console.log("id: "+id+" "+field + ": "+ value)
            // console.log("zabuza: ", {[field]: value})
            if (value >= 0)
            setUserRows((prevData) =>
            prevData.map((item) =>
              item.id === id ? { ...item, [field]: value } : item
            )
          ); else {
            setUserRows((prevData) =>
                prevData.map((item) => item
            )
          )
          }

            // var obj = {};
            // obj[field] = value;
            // console.log(obj)
      };

  
    return (
        <div className="datatable">
            <div className="datatableTitle">
                {t("ProcessPayroll.1")}
                <div className="anoMes">
                    <label>{t("ProcessPayroll.3")}: </label>
                        <select id="year" name="year" value={year} onChange={e => submitByYear(e.target.value)}>
                            <option value="">{t("ProcessPayroll.5")}</option>
                            {yearOptions ? yearOptions.map((data, i) => {
                                return <option key={i}>{data}</option>
                            })
                                : null
                           }
                            {/* <option >2022</option>
                            <option >2023</option>
                            <option >2024</option> */}
                        </select>
                    <label>{t("ProcessPayroll.4")}: </label>
                        <select id="month" name="month" value={month} onChange={e => submitByMonth(e.target.value)} >
                            <option value="">{t("ProcessPayroll.6")}</option>
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
                            {settings?.column_salary_thirteenth === "true" ?
                            <option>Decimo Terceirro Salario</option>  
                            : ""  
                            }
                            {settings?.column_salary_fourteenth === "true" ?
                            <option>Decimo Quarto Salario</option>  
                            : ""  
                            }
                        </select>
                </div> 
                <Link to={`/${listPath}/new`} className="link">
                    {t("ProcessPayroll.2")}
                </Link>
            </div>
            <div  style={{ height: 545, width: '100%' }}>
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
                  '& .MuiDataGrid-cell:nth-child(1)': {
                    position:"sticky",
                    left:"0",
                    zIndex:"1",
                    backgroundColor: "white",
                    borderLeft: "0.2px solid lightGray",
                    // borderRight: "1px solid black"
                  },

                //   '& .MuiDataGrid-cell:nth-child(1)': {                    
                //     borderLeft: "0.2px solid black",
                //   },
                // "& .MuiDataGrid-row": {
                // //   borderTop: 1,
                // //   borderBottom: 0,
                // //   borderRight: 1,
                // },

                    // "& .MuiDataGrid-cell": {
                    // border: 1,
                    // borderRight: 1,
                    // borderLeft: 0,
                    // borderTop: 1,
                    // borderBottom: 1,
                    // // add more css for customization
                    // },
             }}
                 columnBuffer={columns.length}
                rows={userRows}
                columns={columnsVisible}
                pageSize={8}
                rowsPerPageOptions={[8]}
                // checkboxSelection
                onCellEditCommit={onCellEditCommit}
                // autoHeight 
                // columnVisibilityModel={columnVisible} 
                showCellRightBorder={true}  
                showColumnRightBorder={true}
                loading={loading}
                initialState={{
                    pinnedColumns: { left: ['id', 'name'] },
                    sorting: {
                        sortModel: [{ field: 'employee_name', sort: 'asc' }],
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

export default DatatableInputPayroll;



const payrollInputColumns = [
    { field: 'employee_id', headerName: 'ID', width: 70, align:'center', headerAlign: 'center', hide: true},
    { field: 'employee_name', headerName: 'Nome', width: 200,align:'left', headerAlign: 'center',},
    // { field: "dependents", headerName:"Dependentes", width: 120,  align:'center', headerAlign: 'center', },
    { field: "department_name", headerName:"Departemento", width: 180,  align:'left', headerAlign: 'center', },
    { field: "position_name", headerName:"Cargo", width: 180,  align:'left', headerAlign: 'center', },
    { field: "salary_base", headerName: "Salario Base", width: 130, editable: false, align:'center', headerAlign: 'center',},
    { field: "subsidy", headerName: "Subsidio", width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "subsidy_transport",  headerName: "Subsidio Transporte", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_food",  headerName: "Subsidio Alimentacao", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_residence",  headerName: "Subsidio Residencia", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_medical",  headerName: "Subsidio Medico", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_vacation",  headerName: "Subsidio de ferias", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "salary_thirteenth",  headerName: "Decimo Terceiro", hide: true, width: 130,  align:'center', headerAlign: 'center',},
    { field: "overtime50", headerName: "Horas Extras 50%", width: 135, editable: true, align:'center', headerAlign: 'center',},
    { field: "overtime100", headerName: "Horas Extras 100%", width: 140, editable: true,  align:'center', headerAlign: 'center',},
    { field: "bonus", headerName: "Bonus", width: 100, editable: true, align:'center', headerAlign: 'center',},
    { field: "absences",  headerName: "Faltas", width: 100, editable: true, align:'center', headerAlign: 'center'},
    { field: "cash_advances",  headerName: "Emprestimos", width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "backpay",  headerName: "Retroativos", width: 130, editable: true, align:'center', headerAlign: 'center',},
    // { field: "total_income",  headerName: "Rendimento Total", width: 130,  align:'center', headerAlign: 'center',},
    // { field: "irps",  headerName: "IRPS", width: 130,  align:'center', headerAlign: 'center',},
    // { field: "inss",  headerName: "INSS", width: 130, align:'center', headerAlign: 'center',},
    // { field: "salary_liquid",headerName: "Salario Liquido", width: 150, align:'center', headerAlign: 'center',},
    // { field: "month",headerName: "MES", width: 50},
    // { field: "year",headerName: "ANO", width: 70}
]
