import "./datatableInputResource.scss";
import { DataGrid} from '@mui/x-data-grid';
// import { userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useTranslation } from 'react-i18next';


const formatSalary = () => {
    return new Intl.NumberFormat("de-DE",{maximumFractionDigits: 2, minimumFractionDigits: 2})
}

const formatDate = new Intl.DateTimeFormat("pt-br", { dateStyle: 'short'})  

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

const DatatableInputVacation = ({ listName, listPath, columns, userRows, setUserRows, settings, loading, setLoading, searchName, setSearchName}) => {
    const [data2, setData2] = useState(userRows);
    // const [loading, setLoading] = useState(true)
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState("");
    const [yearOptions, setYearOptions] = useState([])
    const { t, i18n } = useTranslation();

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
            // const response = await api.get("payrolls/input")
            const response = await api.get("payrolls")

            response.data.map((data) => {
                data.salary_base = formatSalary().format(data.salary_base)
                // data.overtime50 = formatSalary().format(data.overtime50)
                // data.overtime100 = formatSalary().format(data.overtime100)
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



    const onCellEditCommit = ({ id, field, value }) => {
        if (value >= 0 && value <= 30)
        api.put(`employees/${id}`, {[field]: value}).then(response => console.log(response))

            // console.log("id: "+id+" "+field + ": "+ value)
            // console.log("zabuza: ", {[field]: value})
            if (value >= 0 && value <= 30) {
                setUserRows((prevData) =>
                    prevData.map((item) =>
                    item.id === id ? { ...item, [field]: value } : item
                ))
            } else {
                setUserRows((prevData) =>
                    prevData.map((item) => item
                ))
            }

            // var obj = {};
            // obj[field] = value;
            // console.log(obj)
      };

  
    return (
        <div className="datatable">
            <div className="datatableTitle">
                {t("INSSList.1")}
            </div>
            <div style={{ height: 545, width: '100%' }}>
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
                columns={columns}
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

export default DatatableInputVacation;

