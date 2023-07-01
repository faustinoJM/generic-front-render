import "./editEmployee.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { useEffect, useState, useRef, useCallback } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';


const EditEmployee = ({ inputs, title }) => {
    const { t, i18n } = useTranslation();
     const [file, setFile] = useState("")
     const [listDepartment, setListDepartment] = useState([])
     const [listPosition, setListPosition] = useState([])
     const [data, setData] = useState({});
     const navigate = useNavigate()
     const params = useParams()
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
        const response = await api.get('positions')
        setListPosition(response.data)
       } 
       fetch()
     }, [])

     useEffect(() => {
        async function fetch() {
         const response = await api.get('departments')
         setListDepartment(response.data)
        } 
        fetch()
      }, [])

    useEffect(() => {
        async function fetch() {
         const response = await api.get(`employees/${params.employeeId}`)

         if (response.data)
            setData(response.data)
         
        } 
        fetch()
      }, [params])
      
     const onSubmit = async (values, actions) => {
        // actions.resetForm()
        try {
            const response = await api.put(`employees/${params.employeeId}`, values)
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
            navigate("/employees")
        } catch (err) {
            // if (err.response.status === 400)
            // errors.name = setting?.language_options === "pt" ? "Erro!!" : "Erro!!"
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
        contact_1: Yup.string().required("Contacto Obrigatorio"),
        email: Yup.string().required("Email Obrigatorio").email("Insira endereco Email valido"),
        nuit: Yup.number().positive("NUIT deve ser numero positivo").integer("NUIT deve ser numero inteiro").required("NUIT obrigatorio"),
        dependents: Yup.number().min(0, "Deve ser numero maior ou igual a zero").integer("Deve ser numero inteiro").required("Numero de Dependentes obrigatorio"),
        vacation: Yup.number().min(0, "Deve ser numero maior ou igual a zero").integer("Deve ser numero inteiro"),
        syndicate_status: Yup.string().required("Sindicato Obrigatorio"),
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
        employee_loan: Yup.number().typeError("Emprestimo deve ser um numero").min(0, "Emprestimo deve ser maior ou igual  zero"),
        loan_deduction: Yup.number().typeError("Deducao deve ser um numero").min(0, "Deducao deve ser maior ou igual a zero")

    })
    const { values, errors, handleChange, touched, isSubmitting, handleBlur, handleSubmit, setFieldValue} = useFormik({
        initialValues: {
            name: data.name,
            birth_date: data.birth_date ? new Date(data.birth_date) : "",
            place_birth: data.place_birth,
            nationality: data.nationality,
            bi: data.bi,
            marital_status: data.marital_status,
            gender: data.gender,
            address: data.address,
            contact_1: data.contact_1,
            contact_2: data.contact_2,
            email: data.email,
            nuit: data.nuit,
            vacation: data.vacation,
            syndicate_status: data.syndicate_status,
            dependents: data.dependents,
            salary: data.salary,
            subsidy: data.subsidy,
            department_id: data.department_id,
            position_id: data.position_id,
            start_date: data.start_date ? new Date(data.start_date) : "",
            end_date: "",
            employee_status: data.employee_status,
            bank_name: data.bank_name,
            bank_account: data.bank_account,
            nib: data.nib,
            social_security: data.social_security,
            inss_status: data.inss_status,
            employee_loan: data.employee_loan,
            loan_deduction: data.loan_deduction
        },
        validationSchema: schema,
        enableReinitialize: true,
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
                    <h1>{t("EditEmployee.1")}</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="bottom">
                        <div className="right">
                            <h2>{t("PersonalData.0")}</h2>
                            <div className="form" >
                                <div className="formInput">
                                    <div className="formInput1">
                                        <label>{t("PersonalData.1")}</label>
                                            <input className={`inputClass ${errors.name && touched.name? "input-error" : ""}`} type="text" id="name" 
                                                    defaultValue={data.name} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.name && touched.name && <p>{errors.name}</p>}
                                        <label>{t("PersonalData.2")}</label>
                                            <DatePicker className="DatePicker" dateFormat="dd/MM/yyyy" selected={values.birth_date} 
                                                     id="birth_date"
                                                     onChange={birth_date => setFieldValue('birth_date', birth_date)}
                                                     onBlur={handleBlur}/>
                                                     {errors.birth_date && touched.birth_date && <p>{errors.birth_date}</p>}
                                        {/* <label>Idade</label>
                                            <input className="inputClass" type="number" id="idade"
                                                 defaultValue={values.idade} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.idade && touched.idade && <p>{errors.idade}</p>}  */}
                                        <label>{t("PersonalData.3")}</label>
                                            <input className="inputClass" type="text" id="place_birth"
                                                 defaultValue={data.place_birth} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.place_birth && touched.place_birth && <p>{errors.place_birth}</p>} 
                                        <label>{t("PersonalData.4")}</label>
                                            <input className="inputClass" type="text" id="nationality"
                                                 defaultValue={data.nationality} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.nationality && touched.nationality && <p>{errors.nationality}</p>}
                                        <label>{t("PersonalData.5")}</label>
                                            <input className="inputClass" type="text" id="bi"
                                                 defaultValue={data.bi} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.bi && touched.bi && <p>{errors.bi}</p>}
                                        <label for="">{t("PersonalData.6")}:</label>
                                            <select id="marital_status" name="marital_status" 
                                                    onChange={e => setFieldValue("marital_status", e.target.value)} onBlur={handleBlur}>
                                                <option value="">{t("PersonalData.7")}</option>
                                                {data.marital_status === "Solteiro" ? <option value="Solteiro" selected>{t("PersonalData.20")}</option>
                                                : <option value="Solteiro">{t("PersonalData.20")}</option>
                                                }
                                                {data.marital_status === "Casado" ? <option value="Casado" selected>{t("PersonalData.21")}</option>
                                                : <option value="Casado" selected>{t("PersonalData.21")}</option>
                                                }
                                            </select>
                                            {errors.marital_status && touched.marital_status && <p>{errors.marital_status}</p>}
                                        <label for="">{t("PersonalData.8")}:</label>
                                            <select id="gender" name="gender" 
                                                    onChange={e => setFieldValue("gender", e.target.value)} onBlur={handleBlur}>
                                                <option value="">{t("PersonalData.9")}</option>
                                               {data.gender === "Masculino" ? <option value="Masculino" selected>{t("PersonalData.22")}</option> 
                                               : <option value="Masculino">{t("PersonalData.22")}</option> 
                                               }
                                                {data.gender === "Femenino" ? <option value="Femenino" selected>{t("PersonalData.23")}</option> 
                                                : <option value="Femenino">{t("PersonalData.23")}</option> 
                                                }
                                            </select>  
                                            {errors.gender && touched.gender && <p>{errors.gender}</p>}                                       
                                    </div>
                                    <div className="formInput2">
                                        <label>{t("PersonalData.10")}</label>
                                            <input className="inputClass" type="text" id="address"
                                                 defaultValue={data.address} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.address && touched.address && <p>{errors.address}</p>}
                                        <label>{t("PersonalData.11")}</label>
                                            <input className="inputClass" type="number" placeholder="contacto1" id="contact_1"
                                                 defaultValue={data.contact_1} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.contact_1 && touched.contact_1 && <p>{errors.contact_1}</p>}
                                            <input className="inputClass" type="number"  placeholder="contact2" id="contact_2"
                                                defaultValue={data.contact_2} onChange={handleChange} onBlur={handleBlur}/>
                                                {errors.contact_2 && touched.contact_2 && <p>{errors.contact_2}</p>} 
                                        <label>{t("PersonalData.14")}</label>
                                            <input className="inputClass" type="text" id="email"
                                                 defaultValue={data.email} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.email && touched.email && <p>{errors.email}</p>}
                                        <label>{t("PersonalData.15")}</label>
                                            <input className="inputClass" type="number" id="nuit"
                                                 defaultValue={data.nuit} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.nuit && touched.nuit && <p>{errors.nuit}</p>}
                                        <label>{t("PersonalData.16")}</label>
                                            <input className="inputClass" type="number" id="dependents"
                                                 defaultValue={data.dependents} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.dependents && touched.dependents && <p>{errors.dependents}</p>}
                                        <label>{t("PersonalData.17")}</label>
                                            <input className="inputClass" type="number" id="vacation"
                                                 value={values.vacation} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.vacation && touched.vacation && <p>{errors.vacation}</p>}
                                        <label>{t("PersonalData.18")}</label>
                                            <select id="syndicate_status" name="syndicate_status"
                                                    onChange={e => setFieldValue("syndicate_status", e.target.value)} onBlur={handleBlur}>
                                            <option value="">{t("PersonalData.19")}</option>
                                                {data.syndicate_status === "true" ? <option value="true" selected>{t("PersonalData.24")}</option>
                                                : <option value="true" selected>{t("PersonalData.24")}</option>}
                                                {data.syndicate_status === "false" ? <option value="false" selected>{t("PersonalData.25")}</option>
                                                : <option value="false" >{t("PersonalData.25")}</option>}
                                                
                                        </select>
                                        {errors.syndicate_status && touched.syndicate_status && <p>{errors.syndicate_status}</p>}
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
                                                return data.department_id === department.id ?
                                                <option key={department.id} value={department.id} selected>{department.name}</option>
                                                :<option key={department.id} value={department.id} >{department.name}</option>
                                            })
                                            : null}
                                        </select>
                                        {errors.department_id && touched.department_id && <p>{errors.department_id}</p>}
                                    <label>{t("CompanyData.3")}</label>
                                        <select id="position_id" name="position_id" 
                                                    onChange={e => setFieldValue("position_id", e.target.value)} onBlur={handleBlur}>
                                            <option value="">{t("CompanyData.4")}</option>
                                            {listPosition ? listPosition.map((position) => {
                                                return (data.position_id === position.id ? 
                                                    <option key={position.id} value={position.id} selected>{position.name}</option>
                                                    :<option key={position.id} value={position.id} >{position.name}</option>)
                                            })
                                            : null}
                                        </select>   
                                        {errors.position_id && touched.position_id && <p>{errors.position_id}</p>}                                 
                                    <label>{t("CompanyData.5")}</label>
                                        <DatePicker className="DatePicker" dateFormat="dd/MM/yyyy"  selected={values.start_date} 
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
                                            {data.employee_status === "Activo" ? <option value="Activo" selected>{t("CompanyData.11")}</option> 
                                            : <option value="Activo">{t("CompanyData.11")}</option>
                                            }
                                            {data.employee_status === "Inactivo" ? <option value="Inactivo">{t("CompanyData.12")}</option>
                                            : <option value="Inactivo">{t("CompanyData.12")}</option>
                                            }
                                        </select>  
                                        {errors.employee_status && touched.employee_status && <p>{errors.employee_status}</p>}
                                </div>
                                <div className="formInput2">
                                    <label>{t("CompanyData.9")}</label>
                                        <input className="inputClass" type="text" id="salary"
                                                 defaultValue={data.salary} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.salary && touched.salary && <p>{errors.salary}</p>}   
                                    <label>{t("CompanyData.10")}</label>
                                        <input className="inputClass" type="text"  id="subsidy"
                                                 defaultValue={data.subsidy} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.subsidy && touched.subsidy && <p>{errors.subsidy}</p>}
                                </div>
                                <div className="formInput2">
                                    <label>{t("CompanyData.13")}</label>
                                        <input className="inputClass" type="text" id="employee_loan"
                                                 defaultValue={data.employee_loan} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.employee_loan && touched.employee_loan && <p>{errors.employee_loan}</p>}   
                                    <label>{t("CompanyData.14")}</label>
                                        <input className="inputClass" type="text"  id="loan_deduction"
                                                 defaultValue={data.loan_deduction} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.loan_deduction && touched.loan_deduction && <p>{errors.loan_deduction}</p>}
                                </div>                              
                            </div>
                        </div>
                        <div className="bottomForm12">
                            <h2>{t("FinancialData.0")}</h2>
                            <div className="divForm12" >
                                <label>{t("FinancialData.1")}</label>
                                    <input className="inputClass" type="text" id="bank_name"
                                                 defaultValue={data.bank_name} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.bank_name && touched.bank_name && <p>{errors.bank_name}</p>}
                                <label>{t("FinancialData.2")}</label>
                                    <input className="inputClass" type="number" id="bank_account"
                                                 defaultValue={data.bank_account} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.bank_account && touched.bank_account && <p>{errors.bank_account}</p>}
                                <label>{t("FinancialData.3")}</label>
                                    <input className="inputClass" type="number" id="nib"
                                                 defaultValue={data.nib} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.nib && touched.nib && <p>{errors.nib}</p>}
                                <label>{t("FinancialData.4")}</label>   
                                <input className="inputClass" type="number" id="social_security"
                                                 defaultValue={data.social_security} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.social_security && touched.social_security && <p>{errors.social_security}</p>}
                                <label>{t("FinancialData.5")}</label>
                                <select id="inss_status" name="inss_status" 
                                            onChange={e => setFieldValue("inss_status", e.target.value)} onBlur={handleBlur}>
                                    <option value="">{t("FinancialData.6")}</option>
                                        {data.inss_status === "true" ? <option value="true" selected>{t("FinancialData.7")}</option>
                                        : <option value="true">{t("FinancialData.7")}</option>}
                                        {data.inss_status === "false" ? <option value="false" selected>{t("FinancialData.8")}</option>
                                        : <option value="false">{t("FinancialData.8")}</option>}
                                </select>            
                                {errors.inss_status && touched.inss_status && <p>{errors.inss_status}</p>}
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

export default EditEmployee


