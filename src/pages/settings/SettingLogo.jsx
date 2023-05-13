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
    const [urlLogo, setUrlLogo] = useState("");
    const [setting, setSetting] = useState("")

    useEffect(() => {
        async function fetch() {
            const response = await api.get("settings")
            if (response.data){
                setSetting(response.data)
                response.data.companyLogoURL ? setUrlLogo(response.data.companyLogoURL)
                : setUrlLogo("https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg")
            }
        }
        fetch()
    }, [])

    const onSubmit = async (values, actions) => {  
        console.log("submit")
        // values.logo = values.file
        // console.log(file)
        console.log(values.logo.name)
        // console.log(values)


        // actions.resetForm()   
        const formData = new FormData()
        formData.append("logo", values.logo)
        formData.append("company_name", values.company_name)

        // const response = await api.post("settings", values)
        let response = ""
        if (values.logo.name && values.company_name) {
            response = await api.post("settings", formData, {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
        })} 
        else {
            response = await api.post("settings", { company_name: values.company_name})
        }
        if (response.status === 201)
        Swal.fire(
            'Sucesso!',
            'Dados salvos com sucesso!',
            'success'
          )
        // actions.resetForm()
     }

     const schema = Yup.object().shape({
        company_name: Yup.string().required('Nome Obrigatorio'),
        logo: Yup.mixed()
                // .required("You need to provide a file")
                // .test("fileSize", "The file is too large", (value) => {
                //     return value && value.sienter <= 2000000;
                // })
                .test("type", "Formato invalido somente: .jpeg, .jpg, .png", (value) => {
                    console.log(value)
                    if (!value) return true
                    return value && (
                        value.type === "image/jpeg" ||
                        value.type === "image/bmp" ||
                        value.type === "image/png" 
                    );
                }),

    })
    const { values, errors, handleChange, touched, isSubmitting, handleBlur, handleSubmit, setFieldValue} = useFormik({
        initialValues: {
            company_name: setting.company_name,
            logo: ""
        },
        validationSchema: schema,
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
                                {errors.company_name && touched.company_name && <p style={{color: "crimson"}}>{errors.company_name}</p>} 
                        </div>
                        <div className="upload">
                            <div className="labelIcon">
                                <label htmlFor="file">Logo da Empresa: <DriveFolderUploadOutlinedIcon className="icon" /></label>
                                <input  type="file" id="file" name="logo" style={{ display: 'none' }} onChange={(e) => {
                                    setFieldValue("logo", e.target.files[0])
                                    setFile(e.target.files[0])
                                }}/>
                            </div> 
                            <div className="imgDiv">
                                <img 
                                    src={
                                    file ? URL.createObjectURL(file) : urlLogo
                                    } 
                                    alt="" />
                            </div>
                        </div>
                        {errors.logo && touched.logo && <p style={{color: "crimson"}}>{errors.logo}</p>} 
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