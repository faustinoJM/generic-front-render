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


const EditProfile = ({ inputs, title }) => {
     const [data, setData] = useState("")
     const navigate = useNavigate()
     const params = useParams()

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
        actions.resetForm()
        await api.put(`users/${params.profileId}`, values)
        actions.resetForm()
        navigate("/profile")
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
                            <h2>Dados Pessoias</h2>
                            <div className="formInput00">
                                <div className="formInput111">
                                    <label>Nome</label>
                                        <input className={`inputClass`} type="text" id="name" 
                                            defaultValue={data.name} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.name && touched.name && <p>{errors.name}</p>}
                                    <label>Email</label>
                                        <input className="inputClass" type="text" id="email"
                                            defaultValue={data.email} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.email && touched.email && <p>{errors.email}</p>} 
                                    <label>Novo Password</label>
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
                        <button disabled={isSubmitting} type="submit" className="buttonClass">Actualizar</button>
                    </div>
                </form>  
            </div>
        </div>
    )
}

export default EditProfile


