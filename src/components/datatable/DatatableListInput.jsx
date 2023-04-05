import "./datatableListInput.scss";
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
// import { userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useDemoData } from '@mui/x-data-grid-generator';

const DatatableListInput = ({ listName, listPath, columns, userRows, setUserRows }) => {
   const [data2, setData2] = useState(userRows);
   const [rows, setRows] = useState([]);
//   console.log(data)
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState("");


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
    
useEffect(() => {
    async function fetchData() {
        const response = await api.get("payrolls")

        setData2(response.data)
    
        console.log(year)
        console.log(month)
    }
        fetchData()
    }, [year, month])

    const submitByYear = async (e) => {
        setYear(e)
        setUserRows(data2.filter(row => (row.year === +e) && (row.month === month)))
        // console.log(data.filter(row => row.year === +e))
        
    }

    const submitByMonth = async (e) => {
        // console.log("kkk: ",e, year)
        setMonth(e)
        setUserRows(data2.filter(row => (row.month === e) && (row.year === +year)))
        // console.log(data.filter(row => row.month === month))
        
    }

    const handleDelete = async (year, month, router) => {
    console.log("aaa"+router)
    await api.delete('payrolls', { data: { year, month }})
    setRows(rows.filter(item => !(month === item.month && +year === +item.year)))
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
            width: 200, 
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        {/* <Link to={`/${listPath}/update/${params.row.id}`} style={{textDecoration: "none"}}>
                            <div className="editButton">Processar</div>
                        </Link> */}
                        <div className="deleteButton" onClick={() => handleDelete(params.row.year, params.row.month, listPath)}>Remover</div>
                    </div>
                )
            }
        }
    ]
    return (
        <div className="datatable">
            <div className="datatableTitle">
                Lista de folhas de Salarios
                {listName}
                {/* {listPath === "payrolls" ? 
                <div className="anoMes">
                    <label>Ano: </label>
                        <select id="year" name="year" onChange={e => submitByYear(e.target.value)}>
                            <option value="">Selecione Ano</option>
                            <option >2022</option>
                            <option >2023</option>
                            <option >2024</option>
                        </select>
                    <label>Mes: </label>
                        <select id="month" name="month" onChange={e => submitByMonth(e.target.value)} >
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
                    :  ""
                } */}
            </div>

            <DataGrid
            sx={{
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
                    border: "1px solid lightgray"
                  },
                // "& .MuiDataGrid-row": {
                //   borderTop: 1,
                //   borderBottom: 0
                // },

                    "& .MuiDataGrid-cell": {
                    border: 1,
                    borderRight: 0,
                    borderTop: 0,
                    // add more css for customization
                    },
                                               
             }}
                 columnBuffer={columns.length}
                rows={rows}
                columns={columns.concat(actionColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
                // checkboxSelection
                onCellEditCommit={onCellEditCommit}
                autoHeight      
                // showCellRightBorder={true}  
           
                />
                
        </div>
    )
}

export default DatatableListInput;
