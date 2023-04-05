import "./newPosition.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { useEffect, useState, useRef, useCallback } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import api from "../../services/api";
import "react-datepicker/dist/react-datepicker.css"
import Swal from "sweetalert2";


const NewPosition = ({ inputs, title }) => {
    const navigate = useNavigate()
     const onSubmit = async (values, actions) => {
        console.log(values)
        console.log(actions)
        const { name } = values
        console.log("submit")
        
        try {
        const response = await api.post('positions', {name})
        
        if (response.status === 201)
        Swal.fire(
            'Sucesso!',
            'Dados salvos com sucesso!',
            'success'
          )
        actions.resetForm()
        navigate("/positions")
        } catch (err) {
        if (err.response.status === 400)
        Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Cargo ja existe!!',
                // footer: '<a href="">Why do I have this issue?</a>'
              })
        }
     }

     const schema = Yup.object().shape({
        name: Yup.string().required('Nome Obrigatorio'),
        description: Yup.string().required("Descricao obrigatorio"),

    })
    const { values, errors, handleChange, touched, isSubmitting, handleBlur, handleSubmit} = useFormik({
        initialValues: {
            name: "",
            description: "",
        },
        validationSchema: schema,
        onSubmit 
    })
    console.log(errors)
  
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
                        <div className="form" >
                            <h2>Dados do Cargo</h2>
                            <div className="formInput1">
                                <label>Nome do Cargo</label>
                                    <input className={`inputClass ${errors.name && touched.name? "input-error" : ""}`} type="text" id="name" 
                                            value={values.name} onChange={handleChange} onBlur={handleBlur}/>
                                    {errors.name && touched.name && <p>{errors.name}</p>}
                                <label>Descricao</label>
                                    <input className="inputClass" type="text" id="description"
                                            value={values.description} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.description && touched.description && <p>{errors.description}</p>} 
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

export default NewPosition


