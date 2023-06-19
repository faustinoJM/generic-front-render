import "./newPayroll.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { useEffect, useState, useRef, useCallback } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import api from "../../services/api";
import "react-datepicker/dist/react-datepicker.css"
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import {useQuery} from 'react-query'

async function fetchSettings(){
    const {data} = await api.get("settings") 
    return data
}

const NewPayroll = ({ inputs, title }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()
    const [errorPayroll, setErrorPayroll] = useState(false)
    const [setting, setSetting] = useState(null)

    const {data, error, isError, isLoading } = useQuery('settings', fetchSettings)

    useEffect(() => {
        // if (!isLoading) {
            async function fetchSettings(){
                const response = await api.get("settings") 
                if (response)
                setSetting(response.data)
            }
            fetchSettings()
        // }
    }, [])

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
            month: values.month,
            year: values.year,
            month_total_workdays: 26,
            day_total_workhours: 8,
        })

        if (response.status === 201) {
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
            navigate("/payrolls/input")
        } catch (err) {
            if (err.response.status === 400)
                errors.month = setting?.language_options === "pt" ? "Mes ja cadastrado!!" : "Month already registered!!!"
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
        month: Yup.string().required("Mes obrigatorio"),

    })
    const { values, errors, handleChange, touched, isSubmitting, setFieldValue, handleBlur, handleSubmit} = useFormik({
        initialValues: {
            year: "",
            month: "",
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
                    <h1>{t("NewPayroll.1")}</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="bottom">
                        <div className="form" >
                            <h2>{t("NewPayroll.2")}</h2>
                            <div className="formInput1">
                                <label>{t("NewPayroll.3")}:</label>
                                    {/* <input className="inputClass" type="text" id="year" 
                                            value={2023 } onChange={handleChange} onBlur={handleBlur}/>
                                    {errors.year && touched.year && <p>{errors.year}</p>} */}
                                    <select id="year" name="year" className="yearClass"
                                            onChange={e => setFieldValue("year", e.target.value)} onBlur={handleBlur}>
                                        <option value="">{t("NewPayroll.5")}</option>
                                        <option>2023</option>
                                    </select>
                                {errors.year && touched.year && <p>{errors.year}</p>} 
                                <label>{t("NewPayroll.4")}:</label>
                                    <select id="month" name="month" className="monthClass"
                                            onChange={e => setFieldValue("month", e.target.value)} onBlur={handleBlur}>
                                        <option value="">{t("NewPayroll.6")}</option>
                                        <option value={"Janeiro"}>{t("Month.1")}</option>
                                        <option value={"Fevereiro"}>{t("Month.2")}</option>
                                        <option value={"Marco"}>{t("Month.3")}</option>
                                        <option value={"Abril"}>{t("Month.4")}</option>
                                        <option value={"Maio"}>{t("Month.5")}</option>
                                        <option value={"Junho"}>{t("Month.6")}</option>
                                        <option value={"Julho"}>{t("Month.7")}</option>
                                        <option value={"Agosto"}>{t("Month.8")}</option>
                                        <option value={"Setembro"}>{t("Month.9")}</option>
                                        <option value={"Outubro"}>{t("Month.10")}</option>
                                        <option value={"Novembro"}>{t("Month.11")}</option>
                                        <option value={"Dezembro"}>{t("Month.12")}</option>
                                        {setting?.column_salary_thirteenth === "true" ?
                                        <option value={"Decimo Terceiro Salario"}>{t("Month.13")}</option>  
                                        : ""  
                                        }
                                        {setting?.column_salary_fourteenth === "true" ?
                                        <option value={"Decimo Quarto Salario"}>{t("Month.14")}</option>  
                                        : ""  
                                        }
                                    </select>
                                    {errors.month && touched.month && <p>{errors.month}</p>} 
                                    {errorPayroll && <p>{"O mes ja esta pago"}</p>}
                                    {console.log(errorPayroll)}
                            </div>
                        </div> 
                    </div>
                    <div className="bottomForm2">
                        <button disabled={isSubmitting} type="submit" className="buttonClass">{t("Save.1")}</button>
                    </div>
                </form>  
            </div>
        </div>
    )
}

export default NewPayroll


