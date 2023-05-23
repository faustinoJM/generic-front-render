import "./datatableEmployee.scss";
import { DataGrid} from '@mui/x-data-grid';
// import { userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import api from "../../services/api";
import { read, utils, writeFileXLSX } from 'xlsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {useQuery} from 'react-query'

const keyToPropMap = {
    "Nome": "name",
    "Dependentes": "dependents",
    "Salario Base": "salary",
    "Cargo": "position_id",
    "Departmento": "department_id",
    "Data de Nascimento": "birth_date",
    "Naturalidade": "place_birth",
    "Nacionalidade": "nationality",
    "Numero de BI": "bi",
    "Estado Civil": "marital_status",
    "Sexo": "gender",
    "Residencia": "address",
    "Contacto1": "contact_1",
    "Contacto2": "contact_2",
    "Email": "email",
    "NUIT": "nuit",
    "Subsidio": "subsidy",
    "Data de Inicio": "start_date",
    "Estado do Funcionario": "employee_status",
    "Nome do Banco": "bank_name",
    "Numero da Conta": "bank_account",
    "NIB": "nib",
    "Numero de Seg. Social": "social_security"
  };

const DatatableEmployee = ({ listName, listPath, columns, userRows, setUserRows, loading, setLoading}) => {
  const [excelFile, setExcelFile] = useState([]);
  const [excelError, setExcellError] = useState("")
//   const [loading, setLoading] = useState(false)
//   const {data, error, isError, isLoading } = useQuery('payrollsOutput', fetchPrintData)
    

  useEffect(() => {
    
  }, [loading])

  useEffect(() => { 
    if (excelFile) {
        const workbook = read(excelFile, {type: 'buffer'}); // parse the array buffer
        const worksheetName = workbook.SheetNames[0] // get sheetName
        const worksheet = workbook.Sheets[worksheetName]// get the first worksheet
        // const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // get the first worksheet
        const data = utils.sheet_to_json(worksheet); // generate objects
        // const formatDate = new Intl.DateTimeFormat("pt-br", { dateStyle: 'short'})
        const fetch = () => {
            api.get("employees").then((response) => setUserRows(response.data))
        }
        if (data.length > 0)
            api.post("payrolls/excel/import", data).then((response) => {
                if (response.status === 201){
                    //timer setUserRows
                    console.log("maumau")
                   
                    api.get("employees").then((response) => {
                        setUserRows(response.data)
                        if (response.status === 200)
                            setLoading(false)
                        })
                        
                    
                }
            })

    }
    }, [excelFile]);

    function handleFile (e) {
    // console.log("handleExcel file xlsx")
    let fileType = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
    const selectedFile = e.target.files[0]
    console.log(selectedFile)
    setLoading(true)

    // selectedFile && fileType.includes(selectedFile.type) ? console.log(selectedFile.type) : console.log("Selected File")
    if (selectedFile && fileType.includes(selectedFile.type)) {
        const reader = new FileReader()
        reader.readAsArrayBuffer(selectedFile)
        reader.onload = (e) => {
            console.log(e.target.result)
            setExcelFile(e.target.result)
            setExcellError("")

        }

    } else {
        setExcellError("Por favor insira um ficheiro Excel xlsx")
        setExcelFile(null)
    }
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

    const actionColumn = [
        { 
            field: "action", 
            headerName: "", 
            width: 280,
            align: "center", 
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`/${listPath}/${params.row.id}`} style={{textDecoration: "none"}}>
                            <div className="viewButton">
                                <VisibilityIcon /> Ver
                            </div>
                        </Link>
                        <Link to={`/${listPath}/update/${params.row.id}`} style={{textDecoration: "none"}}>
                            <div className="editButton">
                                <EditIcon className="edIcon"/> Editar
                            </div>
                        </Link>
                        <div className="deleteButton" onClick={() => handleDelete(params.row.id, listPath)}>
                            <DeleteForeverIcon /> Remover
                        </div>
                    </div>
                )
            }
        }
    ]
    return (
        <div className="datatable">
            {listName}
            <div className="datatableTitle">
                {listPath === "employees" ? 
                    <div className="link">
                        <label htmlFor="file">Importar Lista</label>
                        <input onChange={handleFile}  type="file" id="file" style={{ display: 'none' }}/>
                    </div>
                    :  ""
                }
                <Link to={`/${listPath}/new`} className="link">
                    Adicionar Novo
                </Link>
            </div>

            <DataGrid 
            sx={{
                "& .MuiDataGrid-main": {
                    overflow: "unset"
                  },
                          
                fontFamily:"Plus Jakarta Sans, sans-serif", color:'black'
             }}
                 columnBuffer={columns.length}
                rows={userRows}
                columns={columns.concat(actionColumn)}
                pageSize={8}
                rowsPerPageOptions={[8]}
                // checkboxSelection
                onCellEditCommit={onCellEditCommit}
                autoHeight       
                loading={loading}
                initialState={{
                    pinnedColumns: { left: ['id', 'name'] },
                    sorting: {
                        sortModel: [{ field: 'name', sort: 'asc' }],
                      },
                      columns: {
                        columnVisibilityModel: {
                            id: false,
                            employee_id: false
                          // Hide columns status and traderName, the other columns will remain visible
                        //   dependents: visible ? true : false,
                        //   action: false
                        },
                      },
                }}          
                />
                
        </div>
    )
}

export default DatatableEmployee;

  