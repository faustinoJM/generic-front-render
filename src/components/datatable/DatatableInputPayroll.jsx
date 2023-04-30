import "./datatableInputPayroll.scss";
import { DataGrid} from '@mui/x-data-grid';
// import { userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import api from "../../services/api";

const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
  }

  export const vvisible = {
    employee_name: true,
    departament_name: true,
    position_name: true,
    absences: true,
    overtime50: true,
    overtime100: true,
}
export const visible = {
    employee_name: true,
    departament_name: true,
    position_name: true,
    absences: true,
    overtime50: true,
    overtime100: true,
}

const DatatableInputPayroll = ({ listName, listPath, columns, userRows, setUserRows, settings, loading, setLoading}) => {
    const [data2, setData2] = useState(userRows);
    // const [loading, setLoading] = useState(true)
    const [columnsVisible, setColumnsVisible] = useState(payrollInputColumns);
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState("");
    const [yearOptions, setYearOptions] = useState([])

    useEffect(() => {
        console.log("2", settings)
        if((Object.keys(settings).length) > 0)
            setColumnsVisible(columns)
        
    }, [settings])

    // useEffect(() => {
    //     // setLoading(true)
    //         if (userRows.length > 0)
    //         setLoading(false)
    //         if (userRows.length <= 0)
    //         setTimeout(() => {
    //         setLoading(false)
    //         }, 5000)
            

    //     }, [userRows])


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
        setUserRows(() => data2.filter(data => data.month === month && data.year === year))
    }, [year, month])

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("payrolls/input")

            response.data.map((data) => {
                data.salary_base = formatSalary().format(data.salary_base)
                data.subsidy = formatSalary().format(data.subsidy)
                data.bonus = formatSalary().format(data.bonus)
                data.cash_advances = formatSalary().format(data.cash_advances)
                data.backpay = formatSalary().format(data.backpay)
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
                {listName}
                <div className="anoMes">
                    <label>Ano: </label>
                        <select id="year" name="year" value={year} onChange={e => submitByYear(e.target.value)}>
                            <option value="">Selecione Ano</option>
                            {yearOptions ? yearOptions.map((data, i) => {
                                return <option key={i}>{data}</option>
                            })
                                : null
                           }
                            {/* <option >2022</option>
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
                <Link to={`/${listPath}/new`} className="link">
                    Nova Folha
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
    { field: "departament_name", headerName:"Departemento", width: 180,  align:'left', headerAlign: 'center', },
    { field: "position_name", headerName:"Cargo", width: 180,  align:'left', headerAlign: 'center', },
    { field: "salary_base", headerName: "Salario Base", width: 130, editable: false, align:'center', headerAlign: 'center',},
    { field: "subsidy", headerName: "Subsidio", width: 130, editable: false, align:'center', headerAlign: 'center',},
    { field: "subsidy_transport",  headerName: "Subsidio Transporte", width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_food",  headerName: "Subsidio Alimentacao", width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_residence",  headerName: "Subsidio Residencia", width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_medical",  headerName: "Subsidio Medico", width: 130,  align:'center', headerAlign: 'center',},
    { field: "subsidy_vacation",  headerName: "Subsidio de ferias", width: 130,  align:'center', headerAlign: 'center',},
    { field: "salary_thirteenth",  headerName: "Subsidio", width: 130,  align:'center', headerAlign: 'center',},
    { field: "overtime50", headerName: "Horas Extras 50%", width: 135, editable: true, align:'center', headerAlign: 'center',},
    { field: "overtime100", headerName: "Horas Extras 100%", width: 140, editable: true,  align:'center', headerAlign: 'center',},
    { field: "bonus", headerName: "Bonus", width: 100, editable: true, align:'center', headerAlign: 'center',},
    { field: "absences",  headerName: "Faltas", width: 100, editable: true, align:'center', headerAlign: 'center'},
    { field: "cash_advances",  headerName: "Adiantamentos", width: 130, editable: true, align:'center', headerAlign: 'center',},
    { field: "backpay",  headerName: "Retroativos", width: 130, editable: true, align:'center', headerAlign: 'center',},
    // { field: "total_income",  headerName: "Rendimento Total", width: 130,  align:'center', headerAlign: 'center',},
    // { field: "irps",  headerName: "IRPS", width: 130,  align:'center', headerAlign: 'center',},
    // { field: "inss",  headerName: "INSS", width: 130, align:'center', headerAlign: 'center',},
    // { field: "salary_liquid",headerName: "Salario Liquido", width: 150, align:'center', headerAlign: 'center',},
    // { field: "month",headerName: "MES", width: 50},
    // { field: "year",headerName: "ANO", width: 70}
]
