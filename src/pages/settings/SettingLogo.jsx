import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./settingLogo.scss"
import { useEffect, useState } from "react"
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import api from "../../services/api";
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link } from "react-router-dom";
import Swal from "sweetalert2";



const SettingLogo = () => {
    const [file, setFile] = useState("");
    const [setting, setSetting] = useState("")

    useEffect(() => {
        async function fetch() {
            const respose = await api.get("settings")
            if (respose.data)
                setSetting(respose.data)
        }
        fetch()
    }, [])

    const onSubmit = async (values, actions) => {  
        console.log("submit")
        actions.resetForm()   
        const response = await api.post("settings", values)
        if (response.status === 201)
        Swal.fire(
            'Sucesso!',
            'Dados salvos com sucesso!',
            'success'
          )
        actions.resetForm()
     }

    //  const schema = Yup.object().shape({
    //     name: Yup.string().required('Nome Obrigatorio'),
    //     description: Yup.string().required("Descricao obrigatorio"),

    // })
    const { values, errors, handleChange, touched, isSubmitting, handleBlur, handleSubmit} = useFormik({
        initialValues: {
            company_name: setting.company_name,
        },
        // validationSchema: schema,
        enableReinitialize: true,
        onSubmit 
    })
    return (
        <div className="setting">
            <Sidebar />
            <div className="settingContainer">
                <Navbar />
                <div className="settingDiv">
                    {/* Settings
                    <DatePicker className="datas" selected={startDate} onChange={(date) => setStartDate(date)}/> */}
                    <ul>
                        <li><Link className="a" to="..">Dados da Empresa</Link></li>
                        <li><Link className="b" >Titulo e Logo</Link></li>
                        <li><Link className="a" to="../payroll">Folha de Salario</Link></li>
                    </ul>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="logoDiv">
                        <div className="company">
                            <label>Titulo/Nome da Empresa</label>
                            <input type="text" id="company_name"
                                defaultValue={setting.company_name} onChange={handleChange} onBlur={handleBlur}/>
                        </div>
                        <div className="upload">
                            <div className="labelIcon">
                                <label htmlFor="file">Logo da Empresa: <DriveFolderUploadOutlinedIcon className="icon" /></label>
                                <input   type="file" id="file" style={{ display: 'none' }}/>
                            </div> 
                            <div className="imgDiv">
                                <img 
                                    src={
                                    file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                    } 
                                    alt="" />
                            </div>
                            
                        </div>
                    </div>
                    <div className="buttonDiv">
                        <button type="submit">Salvar</button>
                    </div>
                </form>
                
            </div>
        </div>
    )
}

export default SettingLogo;