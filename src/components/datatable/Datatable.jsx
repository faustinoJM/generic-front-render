import "./datatable.scss";
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
// import { userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom"
import Swal from "sweetalert2";
import api from "../../services/api";
import { read, utils, writeFileXLSX } from 'xlsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useTranslation } from 'react-i18next';


const Datatable = ({ listName, listPath, columns, userRows, setUserRows, loading, setLoading }) => {
    //   const [loading, setLoading] = useState(false)
    const { t, i18n } = useTranslation();


    const handleDelete = (id, router) => {
        api.delete(`${router}/${id}`).then(() => {
            setUserRows(userRows.filter(item => item.id !== id))
        }).catch((err) => {
            Swal.fire({
                icon: 'error',
                title: `Error ${err.response.status}`,
                text: err.response.data.message,
                // footer: '<a href="">Why do I have this issue?</a>'
            })
        })
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
                        <Link to={`/${listPath}/update/${params.row.id}`} style={{textDecoration: "none"}}>
                            <div className="editButton">
                                <EditIcon className="edIcon"/> {t("Datatable.2")}
                            </div>
                        </Link>
                        <div className="deleteButton" onClick={() => handleDelete(params.row.id, listPath)}>
                            <DeleteForeverIcon /> {t("Datatable.3")}
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
                <Link to={`/${listPath}/new`} className="link">
                    {t("Datatable.0")}
                </Link>
            </div>

            <DataGrid 
            sx={{
                "& .MuiDataGrid-main": {
                    // remove overflow hidden overwise sticky does not work
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

export default Datatable;

