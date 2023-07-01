import "./editPosition.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { useEffect, useState, useRef, useCallback } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../services/api";
import "react-datepicker/dist/react-datepicker.css"
import { useTranslation } from 'react-i18next';
import Swal from "sweetalert2";

const EditPosition = ({ inputs, title }) => {
    const navigate = useNavigate()
    const params = useParams()
    const id = Object.values(params)[0]
    const [data, setData] = useState({});
    const { t, i18n } = useTranslation();

    const [setting, setSetting] = useState("")

    useEffect(() => {
       async function fetch() {
           const response = await api.get("settings")
           if (response.data)
               setSetting(response.data)
       }
       fetch()
   }, [])

    useEffect(() => {
        async function fetch() {
            const response = await api.get(`positions/${id}`)
            console.log(response.data)
            setData(response.data)
        }

        fetch()
    }, [id])

     const onSubmit = async (values, actions) => {
        const { name } = values
        console.log("submit")
        // actions.resetForm()
        try {
            const response = await api.put(`positions/${id}`, {name})
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
            navigate("/positions")
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
        description: Yup.string(),

    })
    const { values, errors, handleChange, touched, isSubmitting, handleBlur, handleSubmit} = useFormik({
        initialValues: {
            name: data.name,
            description: "",
        },
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit 
    })
    console.log(errors)
  
    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{t("Position.6")}</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="bottom">
                        <div className="form" >
                            <h2>{t("Position.3")}</h2>
                            <div className="formInput1">
                                <label>{t("Position.4")}</label>
                                    <input className="inputClass" type="text" id="name" 
                                            defaultValue={data.name} onChange={handleChange} onBlur={handleBlur}/>
                                    {errors.name && touched.name && <p>{errors.name}</p>}
                                <label>{t("Position.5")}</label>
                                    <input className="inputClass" type="text" id="description"
                                            value={values.description} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.description && touched.description && <p>{errors.description}</p>} 
                            </div>
                        </div> 
                    </div>
                    <div className="bottomForm2">
                        <button disabled={isSubmitting} type="submit" className="buttonClass">{t("Update.1")}</button>
                    </div>
                </form>  
            </div>
        </div>
    )
}

export default EditPosition


