import "./NewEmployee.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { useEffect, useState, useRef, useCallback } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import api from "../../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';



const NewEmployee = ({ inputs, title }) => {
     const [file, setFile] = useState("")
     const [listDepartment, setListDepartment] = useState([])
     const [listPosition, setListPosition] = useState([])
     const navigate = useNavigate()
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
        const response = await api.get("departments")
        setListDepartment(response.data)
       } 
       fetch()
    }, [])

    useEffect(() => {
        async function fetch() {
         const response = await api.get("positions")
         setListPosition(response.data)
        } 
        fetch()
    }, [])

    const onSubmit = async (values, actions) => {
        console.log(values)
        console.log(actions)
        console.log("submit")
        // actions.resetForm()

        try {
            const response = await api.post('employees', values)

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
            navigate("/employees")
        } catch (err) {
            if (err.response.status === 400)
                errors.name = setting?.language_options === "pt" ? "Funcionario ja existe!!" : "Employee Already Exists!!"

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
        birth_date: Yup.date().required("selecione data"),
        place_birth: Yup.string().required('Naturalidade Obrigatorio'),
        nationality:  Yup.string().required('Nacionalidade Obrigatorio'),
        bi: Yup.string().required('Bilhete de Identidade Obrigatorio'),
        marital_status: Yup.string().required("Selecione Estado Civil"),
        gender: Yup.string().required("Selecione Sexo"),
        address: Yup.string().required("Endereco Obrigatorio"),
        contact_1: Yup.number().positive("Deve ser numero positivo").integer("Deve ser numero inteiro").required("Contacto 1 Obrigatorio"),
        contact_2: Yup.number().positive("Deve ser numero positivo").integer("Deve ser numero inteiro"),
        email: Yup.string().required("Email Obrigatorio").email("Insira endereco Email valido"),
        nuit: Yup.number().positive("NUIT deve ser numero positivo").integer("NUIT deve ser numero inteiro").required("NUIT obrigatorio"),
        dependents: Yup.number().integer("Deve ser numero inteiro").required("Numero de Dependentes obrigatorio"),
        vacation: Yup.number().min(0, "Deve ser numero maior ou igual a zero").integer("Deve ser numero inteiro"),
        syndicate: Yup.string().required("Sindicato Obrigatorio"),
        salary: Yup.number().typeError("Salario deve ser um numero").min(1, "Salario deve ser maior que zero").required("Salario base obrigatorio"),
        subsidy: Yup.number().typeError("Subsidio deve ser um numero").min(0, "Subsidio deve ser maior ou igual a zero"),
        department_id: Yup.string().required("Endereco Obrigatorio"),
        position_id: Yup.string().required("Endereco Obrigatorio"),
        start_date: Yup.date().required("selecione data de Inicio"),
        employee_status: Yup.string().required("Estado obrigatorio"),
        bank_name: Yup.string().required("Nome do banco Obrigatorio"),
        bank_account: Yup.number().positive("Deve ser numero positivo").integer("Deve ser numero inteiro").required("Numero da conta bancaria obrigatorio"),
        nib: Yup.number().positive("Deve ser numero positivo").integer("Deve ser numero inteiro").required("Numero de NIB obrigatorio"),
        social_security: Yup.number().positive("Deve ser numero positivo").integer("Deve ser numero inteiro").required("Numero de INSS obrigatorio"),
        inss_status: Yup.string().required("Estado INSS Obrigatorio"),

    })
    const { values, errors, handleChange, touched, isSubmitting, handleBlur, handleSubmit, setFieldValue} = useFormik({
        initialValues: {
            name: "",
            birth_date: new Date(),// new Date(),
            place_birth: "",
            nationality: "",
            bi: "",
            marital_status: "",
            gender: "",
            address: "",
            contact_1: "",
            contact_2: "",
            email: "",
            nuit: "",
            dependents: "",
            vacation: 0,
            syndicate: "",
            salary: 0,
            subsidy: 0,
            department_id: "",
            position_id: "",
            start_date: new Date(),
            end_date: "",
            employee_status: "",
            bank_name: "",
            bank_account: "",
            nib: "",
            social_security: "",
            inss_status: ""
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
                    <h1>{t("NewEmployee.1")}</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="bottom">
                        <div className="right">
                            <h2>{t("PersonalData.0")}</h2>
                            <div className="form" >
                                <div className="formInput">
                                    <div className="formInput1">
                                        <label>{t("PersonalData.1")}</label>
                                            <input className={`inputClass ${errors.name && touched.name ? "input-error" : ""}`} type="text" id="name" 
                                                    value={values.name} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.name && touched.name && <p>{errors.name}</p>}
                                        <label>{t("PersonalData.2")}</label>
                                            <DatePicker className="DatePicker" dateFormat="dd/MM/yyyy" selected={values.birth_date} 
                                                     id="birth_date"
                                                    //  name="data"
                                                    onChange={birth_date => setFieldValue('birth_date', birth_date)}
                                                     onBlur={handleBlur}/>
                                                     {errors.birth_date && touched.birth_date && <p>{errors.birth_date}</p>}
                                        {/* <label>Idade</label>
                                            <input className="inputClass" type="number" id="idade"
                                                 value={values.idade} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.idade && touched.idade && <p>{errors.idade}</p>}  */}
                                        <label>{t("PersonalData.3")}</label>
                                            <input className="inputClass" type="text" id="place_birth"
                                                 value={values.place_birth} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.place_birth && touched.place_birth && <p>{errors.place_birth}</p>} 
                                        <label>{t("PersonalData.4")}</label>
                                            <input className="inputClass" type="text" id="nationality"
                                                 value={values.nationality} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.nationality && touched.nationality && <p>{errors.nationality}</p>}
                                        <label>{t("PersonalData.5")}</label>
                                            <input className="inputClass" type="text" id="bi"
                                                 value={values.bi} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.bi && touched.bi && <p>{errors.bi}</p>}
                                        <label for="">{t("PersonalData.6")}:</label>
                                            <select id="marital_status" name="marital_status" 
                                                    onChange={e => setFieldValue("marital_status", e.target.value)} onBlur={handleBlur}>
                                                <option value="">{t("PersonalData.7")}</option>
                                                <option value="Solteiro">{t("PersonalData.20")}</option>
                                                <option value="Casado">{t("PersonalData.21")}</option>
                                            </select>
                                            {errors.marital_status && touched.marital_status && <p>{errors.marital_status}</p>}
                                        <label for="">{t("PersonalData.8")}:</label>
                                            <select id="gender" name="gender" 
                                                    onChange={e => setFieldValue("gender", e.target.value)} onBlur={handleBlur}>
                                                <option value="">{t("PersonalData.9")}</option>
                                                <option value="Masculino">{t("PersonalData.22")}</option>
                                                <option value="Femenino">{t("PersonalData.23")}</option>
                                            </select>  
                                            {errors.gender && touched.gender && <p>{errors.gender}</p>}                                       
                                    </div>
                                    <div className="formInput2">
                                        <label>{t("PersonalData.10")}</label>
                                            <input className="inputClass" type="text" id="address"
                                                 value={values.address} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.address && touched.address && <p>{errors.address}</p>}
                                        <label>{t("PersonalData.11")}</label>
                                            <input className="inputClass" type="number" placeholder="contacto1" id="contact_1"
                                                 value={values.contact_1} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.contact_1 && touched.contact_1 && <p>{errors.contact_1}</p>}
                                            <input className="inputClass" type="number"  placeholder="contacto2" id="contact_2"
                                                value={values.contact_2} onChange={handleChange} onBlur={handleBlur}/>
                                                {errors.contact_2 && touched.contact_2 && <p>{errors.contact_2}</p>}
                                        <label>{t("PersonalData.14")}</label>
                                            <input className="inputClass" type="text" id="email"
                                                 value={values.email} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.email && touched.email && <p>{errors.email}</p>}
                                        <label>{t("PersonalData.15")}</label>
                                            <input className="inputClass" type="number" id="nuit"
                                                 value={values.nuit} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.nuit && touched.nuit && <p>{errors.nuit}</p>}
                                        <label>{t("PersonalData.16")}</label>
                                            <input className="inputClass" type="number" id="dependents"
                                                 value={values.dependents} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.dependents && touched.dependents && <p>{errors.dependents}</p>}
                                        <label>{t("PersonalData.17")}</label>
                                            <input className="inputClass" type="number" id="vacation"
                                                 value={values.vacation} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.vacation && touched.vacation && <p>{errors.vacation}</p>}
                                        <label>{t("PersonalData.18")}</label>
                                        <select id="syndicate" name="syndicate" 
                                                    onChange={e => setFieldValue("syndicate", e.target.value)} onBlur={handleBlur}>
                                            <option value="">{t("PersonalData.19")}</option>
                                                <option value="true">{t("PersonalData.24")}</option>
                                                <option value="false">{t("PersonalData.25")}</option>
                                        </select>
                                        {errors.syndicate && touched.syndicate && <p>{errors.syndicate}</p>}
                                    </div>
                                    <div className="formInput3">
                                        <img 
                                        src={
                                            file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                            } 
                                        alt="" />
                                        <label htmlFor="file">
                                            Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                        </label>
                                        <input type="file" id="file" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                    <div className="bottomForm1">
                        <div className="bottomForm11">
                            <h2>{t("CompanyData.0")}</h2>
                            <div className="form" >
                                <div className="formInput1">
                                    <label>{t("CompanyData.1")}</label>
                                        <select id="department_id" name="department_id" 
                                                    onChange={e => setFieldValue("department_id", e.target.value)} onBlur={handleBlur}>
                                            <option value="">{t("CompanyData.2")}</option>
                                            {listDepartment ? listDepartment.map((department) => {
                                                return <option key={department.id} value={department.id}>{department.name}</option>
                                            })
                                            : null}
                                            {/* <option value="Contabilidade">Contabilidade</option>
                                            <option value="Recursos Humano">RH</option> */}
                                        </select>
                                        {errors.department_id && touched.department_id && <p>{errors.department_id}</p>}
                                    <label>{t("CompanyData.3")}</label>
                                        <select id="position_id" name="position_id" 
                                                    onChange={e => setFieldValue("position_id", e.target.value)} onBlur={handleBlur}>
                                            <option value="">{t("CompanyData.4")}</option>
                                            {listPosition ? listPosition.map((position) => {
                                                return <option key={position.id} value={position.id}>{position.name}</option>
                                            })
                                            : null}
                                            {/* <option value="Contabilista">Contabilista</option>
                                            <option value="Recursos Humanos">Rh</option> */}
                                        </select>   
                                        {errors.position_id && touched.position_id && <p>{errors.position_id}</p>}                                 
                                    <label>{t("CompanyData.5")}</label>
                                        <DatePicker className="DatePicker" dateFormat="dd/MM/yyyy" selected={values.start_date} 
                                                     id="start_date"
                                                    //  name="data"
                                                    onChange={start_date => setFieldValue('start_date', start_date)}
                                                     onBlur={handleBlur}/>
                                                    {errors.start_date && touched.start_date && <p>{errors.start_date}</p>}
                                    <label>{t("CompanyData.6")}</label>
                                        <DatePicker className="DatePicker" dateFormat="dd/MM/yyyy" selected={values.end_date} 
                                                     id="end_date"
                                                    //  name="data"
                                                    onChange={end_date => setFieldValue('end_date', end_date)}
                                                     onBlur={handleBlur}/>
                                                     {errors.end_date && touched.end_date && <p>{errors.end_date}</p>}  
                                    <label>{t("CompanyData.7")}</label>
                                        <select id="employee_status" name="employee_status" 
                                                    onChange={e => setFieldValue("employee_status", e.target.value)} onBlur={handleBlur}>
                                            <option value="">{t("CompanyData.8")}</option>
                                            <option value="Activo">{t("CompanyData.11")}</option>
                                            <option value="Inactivo">{t("CompanyData.12")}</option>
                                        </select>  
                                        {errors.employee_status && touched.employee_status && <p>{errors.employee_status}</p>}
                                </div>
                                <div className="formInput2">
                                    <label>{t("CompanyData.9")}</label>
                                        <input className="inputClass" type="text" id="salary"
                                                 value={values.salary} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.salary && touched.salary && <p>{errors.salary}</p>}   
                                    <label>{t("CompanyData.10")}</label>
                                        <input className="inputClass" type="text" defaultValue={0} id="subsidy"
                                                 value={values.subsidy} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.subsidy && touched.subsidy && <p>{errors.subsidy}</p>}
                                </div>                            
                            </div>
                        </div>
                        <div className="bottomForm12">
                            <h2>{t("FinancialData.0")}</h2>
                            <div className="divForm12" >
                                <label>{t("FinancialData.1")}</label>
                                    <input className="inputClass" type="text" id="bank_name"
                                                 value={values.bank_name} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.bank_name && touched.bank_name && <p>{errors.bank_name}</p>}
                                <label>{t("FinancialData.2")}</label>
                                    <input className="inputClass" type="number" id="bank_account"
                                                 value={values.bank_account} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.bank_account && touched.bank_account && <p>{errors.bank_account}</p>}
                                <label>{t("FinancialData.3")}</label>
                                    <input className="inputClass" type="number" id="nib"
                                                 value={values.nib} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.nib && touched.nib && <p>{errors.nib}</p>}
                                <label>{t("FinancialData.4")}</label>   
                                <input className="inputClass" type="number" id="social_security"
                                                 value={values.social_security} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.social_security && touched.social_security && <p>{errors.social_security}</p>}  
                                <label>{t("FinancialData.5")}</label>
                                    <select id="inss_status" name="inss_status" 
                                                onChange={e => setFieldValue("inss_status", e.target.value)} onBlur={handleBlur}>
                                        <option value="">{t("FinancialData.6")}</option>
                                            <option value="true">{t("FinancialData.7")}</option>
                                            <option value="false">{t("FinancialData.8")}</option>
                                    </select>            
                                    {errors.inss_status && touched.inss_status && <p>{errors.inss_status}</p>}
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

export default NewEmployee


