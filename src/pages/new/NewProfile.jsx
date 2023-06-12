import "./newProfile.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import api from "../../services/api";
import "react-datepicker/dist/react-datepicker.css"
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';



const NewProfile = ({ inputs, title }) => {
     const [file, setFile] = useState("")
     const navigate = useNavigate()
     const [setting, setSetting] = useState("")

     useEffect(() => {
        async function fetch() {
            const response = await api.get("settings")
            if (response.data)
                setSetting(response.data)
        }
        fetch()
    }, [])

     const onSubmit = async (values, actions) => {
        // console.log(values)
        // console.log(actions)
        // console.log("submit")
        actions.resetForm()
        try {
            const response = await api.post('users', values)
            if (response.status === 201)
            Swal.fire(
                'Sucesso!',
                'Dados salvos com sucesso!',
                'success'
            )
            actions.resetForm()
            navigate("/profile")
        } catch (err) {
            if (err.response.status === 400)
            errors.name = setting?.language_options === "pt" ? "Perfil ja existe!!" : "Profile Already Exists!!"
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
            name: "",
            email: "",
            password: "",
            // confirmPassword: "",
        },
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
                                            value={values.name} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.name && touched.name && <p>{errors.name}</p>}
                                    <label>Email</label>
                                        <input className="inputClass" type="text" id="email"
                                            value={values.email} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.email && touched.email && <p>{errors.email}</p>} 
                                    <label>Password</label>
                                        <input className="inputClass" type="text" id="password"
                                            value={values.password} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.password && touched.password && <p>{errors.password}</p>}
                                 {/* <label>Confirmar Password</label>
                                        <input className="inputClass" type="text" id="confirmPassword"
                                            value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.confirmPassword && touched.confirmPassword && <p>{errors.confirmPassword}</p>} */}
                                </div>
                            </div>
                    </div>
                    <div className="bottomForm2">
                        <button disabled={isSubmitting} type="submit" className="buttonClass">Cadastrar</button>
                    </div>
                </form>  
            </div>
        </div>
    )
}

export default NewProfile


