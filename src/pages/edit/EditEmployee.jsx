import "./editEmployee.scss"
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
import SettingPayroll from "../settings/SettingPayroll";


const EditEmployee = ({ inputs, title }) => {
     const [file, setFile] = useState("")
     const [listDepartment, setListDepartment] = useState([])
     const [listPosition, setListPosition] = useState([])
     const [data, setData] = useState({});
     const navigate = useNavigate()
     const params = useParams()


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
        actions.resetForm()
        await api.put(`employees/${params.employeeId}`, values)
        actions.resetForm()
        navigate("/employees")
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
        contact: Yup.string().required("Contacto Obrigatorio"),
        email: Yup.string().required("Email Obrigatorio").email("Insira endereco Email valido"),
        nuit: Yup.number().positive("NUIT deve ser numero positivo").integer("NUIT deve ser numero inteiro").required("NUIT obrigatorio"),
        dependents: Yup.number().min(0, "Deve ser numero maior ou igual a zero").integer("Deve ser numero inteiro").required("Numero de Dependentes obrigatorio"),
        vacation: Yup.number().min(0, "Deve ser numero maior ou igual a zero").integer("Deve ser numero inteiro"),
        syndicate_status: Yup.string().required("Sindicato Obrigatorio"),
        salary: Yup.number().positive("Deve ser numero positivo").required("Salario base obrigatorio"),
        subsidy: Yup.number().min(0, "Subsidio deve ser maior ou igual a zero"),
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
            name: data.name,
            birth_date: data.birth_date ? new Date(data.birth_date) : "",
            place_birth: data.place_birth,
            nationality: data.nationality,
            bi: data.bi,
            marital_status: data.marital_status,
            gender: data.gender,
            address: data.address,
            contact: data.contact,
            contact2: data.contact2,
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
                    <h1>{title}</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="bottom">
                        <div className="right">
                            <h2>Dados Pessoias</h2>
                            <div className="form" >
                                <div className="formInput">
                                    <div className="formInput1">
                                        <label>Nome</label>
                                            <input className={`inputClass ${errors.name && touched.name? "input-error" : ""}`} type="text" id="name" 
                                                    defaultValue={data.name} onChange={handleChange} onBlur={handleBlur}/>
                                            {errors.name && touched.name && <p>{errors.name}</p>}
                                        <label>Data de Nascimento</label>
                                            <DatePicker className="DatePicker" dateFormat="dd/MM/yyyy" selected={values.birth_date} 
                                                     id="birth_date"
                                                     onChange={birth_date => setFieldValue('birth_date', birth_date)}
                                                     onBlur={handleBlur}/>
                                                     {errors.birth_date && touched.birth_date && <p>{errors.birth_date}</p>}
                                                     {/* {console.log(data.birth_date) } */}
                                                     
                                        {/* <label>Idade</label>
                                            <input className="inputClass" type="number" id="idade"
                                                 defaultValue={values.idade} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.idade && touched.idade && <p>{errors.idade}</p>}  */}
                                        <label>Naturalidade</label>
                                            <input className="inputClass" type="text" id="place_birth"
                                                 defaultValue={data.place_birth} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.place_birth && touched.place_birth && <p>{errors.place_birth}</p>} 
                                        <label>Nacionalidade</label>
                                            <input className="inputClass" type="text" id="nationality"
                                                 defaultValue={data.nationality} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.nationality && touched.nationality && <p>{errors.nationality}</p>}
                                        <label>Numero de BI</label>
                                            <input className="inputClass" type="text" id="bi"
                                                 defaultValue={data.bi} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.bi && touched.bi && <p>{errors.bi}</p>}
                                        <label for="">Estado Civil:</label>
                                            <select id="marital_status" name="marital_status" 
                                                    onChange={e => setFieldValue("marital_status", e.target.value)} onBlur={handleBlur}>
                                                <option value="">Selecione Estado Civil</option>
                                                {data.marital_status === "Solteiro" ? <option value="Solteiro" selected>Solteiro</option>
                                                : <option value="Solteiro">Solteiro</option>
                                                }
                                                {data.marital_status === "Casado" ? <option value="Casado" selected>Casado</option>
                                                : <option value="Casado" selected>Casado</option>
                                                }
                                            </select>
                                            {errors.marital_status && touched.marital_status && <p>{errors.marital_status}</p>}
                                        <label for="">Sexo:</label>
                                            <select id="gender" name="gender" 
                                                    onChange={e => setFieldValue("gender", e.target.value)} onBlur={handleBlur}>
                                                <option value="">Selecione Sexo</option>
                                               {data.gender === "Masculino" ? <option value="Masculino" selected>Masculino</option> 
                                               : <option value="Masculino">Masculino</option> 
                                               }
                                                {data.gender === "Femenino" ? <option value="Femenino" selected>Femenino</option> 
                                                : <option value="Femenino">Femenino</option> 
                                                }
                                            </select>  
                                            {errors.gender && touched.gender && <p>{errors.gender}</p>}                                       
                                    </div>
                                    <div className="formInput2">
                                        <label>Residencia</label>
                                            <input className="inputClass" type="text" id="address"
                                                 defaultValue={data.address} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.address && touched.address && <p>{errors.address}</p>}
                                        <label>Contacto</label>
                                            <input className="inputClass" type="number" placeholder="contacto1" id="contact"
                                                 defaultValue={data.contact} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.contact && touched.contact && <p>{errors.contact}</p>}
                                            <input className="inputClass" type="number"  placeholder="contact2" id="contact2"
                                                defaultValue={data.contact2} onChange={handleChange} onBlur={handleBlur}/>
                                                {errors.contact2 && touched.contact2 && <p>{errors.contact2}</p>} 
                                        <label>Email</label>
                                            <input className="inputClass" type="text" id="email"
                                                 defaultValue={data.email} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.email && touched.email && <p>{errors.email}</p>}
                                        <label>NUIT</label>
                                            <input className="inputClass" type="number" id="nuit"
                                                 defaultValue={data.nuit} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.nuit && touched.nuit && <p>{errors.nuit}</p>}
                                        <label>Numero de Dependentes</label>
                                            <input className="inputClass" type="number" id="dependents"
                                                 defaultValue={data.dependents} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.dependents && touched.dependents && <p>{errors.dependents}</p>}
                                        <label>Total dias de ferias</label>
                                            <input className="inputClass" type="number" id="vacation"
                                                 value={values.vacation} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.vacation && touched.vacation && <p>{errors.vacation}</p>}
                                        <label>Sindicato</label>
                                            <select id="syndicate_status" name="syndicate_status"
                                                    onChange={e => setFieldValue("syndicate_status", e.target.value)} onBlur={handleBlur}>
                                            <option value="">Selecione Sindicato</option>
                                                {data.syndicate_status === "true" ? <option value="true" selected>Paga</option>
                                                : <option value="true" selected>Paga</option>}
                                                {data.syndicate_status === "false" ? <option value="false" selected>Nao Paga</option>
                                                : <option value="false" >Nao Paga</option>}
                                                
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
                            <h2>Dados da Empresa</h2>
                            <div className="form" >
                                <div className="formInput1">
                                    <label>Departamento</label>
                                        <select id="department_id" name="department_id" 
                                                    onChange={e => setFieldValue("department_id", e.target.value)} onBlur={handleBlur}>
                                            <option value="">Selecione Departemento</option>
                                            {listDepartment ? listDepartment.map((department) => {
                                                return data.department_id === department.id ?
                                                <option key={department.id} value={department.id} selected>{department.name}</option>
                                                :<option key={department.id} value={department.id} >{department.name}</option>
                                            })
                                            : null}
                                        </select>
                                        {errors.department_id && touched.department_id && <p>{errors.department_id}</p>}
                                    <label>Cargo</label>
                                        <select id="position_id" name="position_id" 
                                                    onChange={e => setFieldValue("position_id", e.target.value)} onBlur={handleBlur}>
                                            <option value="">Selecione Cargo</option>
                                            {listPosition ? listPosition.map((position) => {
                                                return (data.position_id === position.id ? 
                                                    <option key={position.id} value={position.id} selected>{position.name}</option>
                                                    :<option key={position.id} value={position.id} >{position.name}</option>)
                                            })
                                            : null}
                                        </select>   
                                        {errors.position_id && touched.position_id && <p>{errors.position_id}</p>}                                 
                                    <label>Data de inicio</label>
                                        <DatePicker className="DatePicker" dateFormat="dd/MM/yyyy"  selected={values.start_date} 
                                                     id="start_date"
                                                    //  name="data"
                                                    onChange={start_date => setFieldValue('start_date', start_date)}
                                                     onBlur={handleBlur}/>
                                                    {errors.start_date && touched.start_date && <p>{errors.start_date}</p>}
                                    <label>Data do fim</label>
                                        <DatePicker className="DatePicker" dateFormat="dd/MM/yyyy" selected={values.end_date} 
                                                     id="end_date"
                                                    //  name="data"
                                                    onChange={end_date => setFieldValue('end_date', end_date)}
                                                     onBlur={handleBlur}/>
                                                     {errors.end_date && touched.end_date && <p>{errors.end_date}</p>}  
                                    <label>Estado do funcionario</label>
                                        <select id="employee_status" name="employee_status" 
                                                    onChange={e => setFieldValue("employee_status", e.target.value)} onBlur={handleBlur}>
                                            <option value="">Selecione Estado</option>
                                            {data.employee_status === "Activo" ? <option value="Activo" selected>Ativo</option> 
                                            : <option value="Activo">Ativo</option>
                                            }
                                            {data.employee_status === "Inactivo" ? <option value="Inactivo">Inactivo</option>
                                            : <option value="Inactivo">Inactivo</option>
                                            }
                                        </select>  
                                        {errors.employee_status && touched.employee_status && <p>{errors.employee_status}</p>}
                                </div>
                                <div className="formInput2">
                                    <label>Salario Base</label>
                                        <input className="inputClass" type="number" id="salary"
                                                 defaultValue={data.salary} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.salary && touched.salary && <p>{errors.salary}</p>}   
                                    <label>Subsidio</label>
                                        <input className="inputClass" type="number"  id="subsidy"
                                                 defaultValue={data.subsidy} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.subsidy && touched.subsidy && <p>{errors.subsidy}</p>}
                                </div>                            
                            </div>
                        </div>
                        <div className="bottomForm12">
                            <h2>Dados Financeiro</h2>
                            <div className="divForm12" >
                                <label>Nome do Banco</label>
                                    <input className="inputClass" type="text" id="bank_name"
                                                 defaultValue={data.bank_name} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.bank_name && touched.bank_name && <p>{errors.bank_name}</p>}
                                <label>Numero da Conta Bancaria</label>
                                    <input className="inputClass" type="number" id="bank_account"
                                                 defaultValue={data.bank_account} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.bank_account && touched.bank_account && <p>{errors.bank_account}</p>}
                                <label>NIB</label>
                                    <input className="inputClass" type="number" id="nib"
                                                 defaultValue={data.nib} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.nib && touched.nib && <p>{errors.nib}</p>}
                                <label>Numero de Seg. Social</label>   
                                <input className="inputClass" type="number" id="social_security"
                                                 defaultValue={data.social_security} onChange={handleChange} onBlur={handleBlur}/>
                                                  {errors.social_security && touched.social_security && <p>{errors.social_security}</p>}
                                                  <label>Estado INSS</label>
                                <select id="inss_status" name="inss_status" 
                                            onChange={e => setFieldValue("inss_status", e.target.value)} onBlur={handleBlur}>
                                    <option value="">Selecione INSS</option>
                                        {data.inss_status === "true" ? <option value="true" selected>Paga</option>
                                        : <option value="true">Paga</option>}
                                        {data.inss_status === "false" ? <option value="false" selected>Nao Paga</option>
                                        : <option value="false">Nao Paga</option>}
                                </select>            
                                {errors.inss_status && touched.inss_status && <p>{errors.inss_status}</p>}
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

export default EditEmployee


