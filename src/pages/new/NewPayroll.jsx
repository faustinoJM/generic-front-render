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



const NewPayroll = ({ inputs, title }) => {
    const navigate = useNavigate()
    const [errorPayroll, setErrorPayroll] = useState(false)

    useEffect(() => {
        setErrorPayroll(false)
    }, [])

     const onSubmit = async (values, actions) => {
        console.log(values)
        console.log(actions)
        console.log("submit")
        // setErrorPayroll(false)
        
        await new Promise((resolve) => setTimeout(resolve, 100))
        // actions.resetForm()

        try {
        const response = await api.post('payrolls', {
            month: values.mouth,
            year: values.year,
            month_total_workdays: 26,
            day_total_workhours: 8,
        })

        if (response.status === 201)
            Swal.fire(
                'Sucesso!',
                'Folha criada com sucesso!!',
                'success'
            )
            
            actions.resetForm()
            navigate("/payrolls/input")
        } catch (err) {
            if (err.response.status === 400)
                errors.mouth = "Mes ja cadastrado!"
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Mes ja Cadastrado...',
            //     text: 'Something went wrong!',
            //     footer: '<a href="">Why do I have this issue?</a>'
            //   })
            // console.log(err.response.status)
        }
     }

     const schema = Yup.object().shape({
        year: Yup.number().positive().min(2000).required('Ano Obrigatorio'),
        mouth: Yup.string().required("Mes obrigatorio"),

    })
    const { values, errors, handleChange, touched, isSubmitting, setFieldValue, handleBlur, handleSubmit} = useFormik({
        initialValues: {
            year: "",
            mouth: "",
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
                            <h2>Nova Folha de Salario</h2>
                            <div className="formInput1">
                                <label>Ano:</label>
                                    <input className="inputClass" type="number" id="year" 
                                            value={values.year} onChange={handleChange} onBlur={handleBlur}/>
                                    {errors.year && touched.year && <p>{errors.year}</p>}
                                <label>Mes</label>
                                    <select id="mouth" name="mouth" 
                                            onChange={e => setFieldValue("mouth", e.target.value)} onBlur={handleBlur}>
                                        <option value="">Selecione Mes</option>
                                        <option>Janeiro</option>
                                        <option>Fevereiro</option>
                                        <option>Marco</option>
                                        <option>Abril</option>
                                        <option>Maio</option>
                                        <option>Junho</option>
                                        <option>Julho</option>
                                        <option>Agosto</option>
                                        <option>Setembro</option>
                                        <option>Outubro</option>
                                        <option>Novembro</option>
                                        <option>Dezembro</option>
                                    </select>
                                    {errors.mouth && touched.mouth && <p>{errors.mouth}</p>} 
                                    {errorPayroll && <p>{"O mes ja esta pago"}</p>}
                                    {console.log(errorPayroll)}
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

export default NewPayroll


