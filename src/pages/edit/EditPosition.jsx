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

const EditPosition = ({ inputs, title }) => {
    const navigate = useNavigate()
    const params = useParams()
    const id = Object.values(params)[0]
    const [data, setData] = useState({});
    const { t, i18n } = useTranslation();

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
        actions.resetForm()
        await api.put(`positions/${id}`, {name})
        actions.resetForm()
        navigate("/positions")
     }

     const schema = Yup.object().shape({
        name: Yup.string().required('Nome Obrigatorio'),
        description: Yup.string().required("Descricao obrigatorio"),

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


