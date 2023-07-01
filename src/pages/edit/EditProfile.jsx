import "./editProfile.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { useEffect, useState, useRef, useCallback } from "react"
import { useFormik } from "formik"
import { useField } from '@unform/core';
import getValidateErrors from "../../utils/getValidationErrors"
import * as Yup from "yup"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";


const EditProfile = ({ inputs, title }) => {
     const [data, setData] = useState("")
     const navigate = useNavigate()
     const params = useParams()
     const [setting, setSetting] = useState("")
     const { t, i18n } = useTranslation();

    useEffect(() => {
       async function fetch() {
           const response = await api.get("settings")
           if (response.data)
               setSetting(response.data)
       }
       fetch()
   }, [])

     useEffect(() => {
        api.get("users").then((response => {
            response.data.map(data => {
                if (data.id === params.profileId)
                    setData(data)
            })
        }))
        console.log(params)
     }, [])

     const onSubmit = async (values, actions) => {
        // console.log(values)
        // console.log(actions)
        // actions.resetForm()
        try {
            const response = await api.put(`users/company/${params.profileId}`, values)
            if (response.status === 204) {
                setting?.language_options === "pt" ?
                    Swal.fire(
                        'Sucesso!',
                        'Dados salvos com sucesso!',
                        'success'
                    ) : Swal.fire(
                        'Success!',
                        'Data successfully saved',
                        'success'
                    )
            }
            actions.resetForm()
            navigate("/profile")
        } catch (err) {
            if (err.response.status === 401) {
                errors.name = `Error ${err.response.status} ${err.response.data.message}`
                Swal.fire({
                    icon: 'error',
                    title: `Error ${err.response.status}`,
                    text: err.response.data.message,
                    // footer: '<a href="">Why do I have this issue?</a>'
                  })
            }
    
        }
     }

     const schema = Yup.object().shape({
        name: Yup.string().required('Nome Obrigatorio'),
        email: Yup.string().email('Email invalido').required('Email Obrigatorio'),
        password:  Yup.string().required('Password Obrigatorio'),
        // confirmPassword: Yup.string().required('Confirmar Password Obrigatorio'),

    })
    const { values, errors, handleChange, touched, isSubmitting, handleBlur, handleSubmit, setFieldValue} = useFormik({
        initialValues: {
            name: data.name,
            email: data.email,
            password: "",
            // confirmPassword: "",
        },
        enableReinitialize: true,
        validationSchema: schema,
        onSubmit 
    })
    console.log(errors)
    // formik.initialValues({nome:""})
    // formik.validationSchema(schema)

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="bottom">
                            <h2>{t("NewProfile.1")}</h2>
                            <div className="formInput00">
                                <div className="formInput111">
                                    <label>{t("NewProfile.2")}</label>
                                        <input className={`inputClass`} type="text" id="name" 
                                            defaultValue={data.name} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.name && touched.name && <p>{errors.name}</p>}
                                    <label>Email</label>
                                        <input className="inputClass" type="text" id="email"
                                            defaultValue={data.email} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.email && touched.email && <p>{errors.email}</p>} 
                                    <label>{t("NewProfile.6")}</label>
                                        <input className="inputClass" type="text" id="password"
                                            defaultValue={values.password} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.password && touched.password && <p>{errors.password}</p>}
                                 {/* <label>Confirmar Password</label>
                                        <input className="inputClass" type="text" id="confirmPassword"
                                            value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.confirmPassword && touched.confirmPassword && <p>{errors.confirmPassword}</p>} */}
                                </div>
                            </div>
                    </div>
                    <div className="bottomForm2">
                        <button disabled={isSubmitting} type="submit" className="buttonClass">{t("NewProfile.7")}</button>
                    </div>
                </form>  
            </div>
        </div>
    )
}

export default EditProfile


