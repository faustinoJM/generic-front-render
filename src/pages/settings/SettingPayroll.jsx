import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./settingPayroll.scss"
import { useCallback, useEffect, useState } from "react"
import api from "../../services/api";
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';

const SettingPayroll = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [setting, setSetting] = useState("")
    const [day, setday] = useState("")
    const [hour, sethour] = useState("")
    const { t, i18n } = useTranslation();

    useEffect(() => {
        console.log(setting)
    }, [setting])

    useEffect(() => {
        async function fetch() {
            const response = await api.get("settings")
            // response.data.payroll_month_total_workdays = response.data.payroll_month_total_workdays ?? 26
            // response.data.payroll_day_total_workhours =  response.data.payroll_day_total_workhours ?? 8
            if (response.data){
                setSetting(response.data)
                setday(response.data.payroll_month_total_workdays)
                sethour(response.data.payroll_day_total_workhours)
            } else {
                setday(30)
                sethour(8)
            }
   
        }
        fetch()
    }, [])

    const onSubmit = useCallback(async (values, actions) => {  
        console.log(values)
        actions.resetForm()   
        
        const response = await api.post("settings", values)
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
     }, [day, hour])

     const schema = Yup.object().shape({
        payroll_month_total_workdays: Yup.number().typeError("Deve ser um numero").integer("Deve ser um numero inteiro").min(1, "Deve ser maior que zero").required("Dias de Trabalho por mes obrigatorio"),
        payroll_day_total_workhours: Yup.number().typeError("Deve ser um numero").min(1, "Deve ser maior que zero").required("Horas de Trabalho por mes obrigatorio"),
    })
    const { values, errors, handleChange, setFieldValue ,touched, isSubmitting, handleBlur, handleSubmit} = useFormik({
        initialValues: {
            payroll_month_total_workdays: day ?? "",
            payroll_day_total_workhours: hour ?? "",
            column_position_name: setting.column_position_name,
            column_department_name: setting.column_department_name,
            column_overtime: setting.column_overtime,
            column_absences: setting.column_absences,
            column_cash_advances: setting.column_cash_advances,
            column_backpay: setting.column_backpay,
            column_bonus: setting.column_bonus,
            column_subsidy: setting.column_subsidy,
            column_syndicate: setting.column_syndicate,
            column_subsidy_transport: setting.column_subsidy_transport,
            column_subsidy_food: setting.column_subsidy_food,
            column_subsidy_residence: setting.column_subsidy_residence,
            column_subsidy_medical: setting.column_subsidy_medical,
            column_subsidy_vacation: setting.column_subsidy_vacation,
            column_salary_thirteenth: setting.column_salary_thirteenth,
            column_salary_fourteenth: setting.column_salary_fourteenth,
            payslip_comment: setting.payslip_comment,
            column_loan: setting.column_loan
        },
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit 
    })

    return (
        <div className="setting">
            <Sidebar />
            <div className="settingContainer">
                <Navbar />
                <div className="settingDiv">
                    {/* Settings
                    <DatePicker className="datas" selected={startDate} onChange={(date) => setStartDate(date)}/> */}
                    <ul>
                        <li><Link className="a" to="..">{t("SettingCompany.1")}</Link></li>
                        <li><Link className="a" to="../logo">{t("SettingLogo.1")}</Link></li>
                        <li><Link className="b" >{t("SettingPayroll.1")}</Link></li>
                    </ul>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="payroll-worktime">
                        <h2>{t("SettingPayroll.2")}</h2>
                        <div>
                            <label>{t("SettingPayroll.3")}:</label>
                            <input type="text" id="payroll_month_total_workdays"
                                defaultValue={day} onChange={handleChange} onBlur={handleBlur}/>
                                {errors.payroll_month_total_workdays && touched.payroll_month_total_workdays && <p>{errors.payroll_month_total_workdays}</p>} 
                        </div>
                        <div>
                            <label>{t("SettingPayroll.4")}:</label>
                            <input type="text" id="payroll_day_total_workhours"
                                defaultValue={hour} onChange={handleChange} onBlur={handleBlur}/>
                                {errors.payroll_day_total_workhours && touched.payroll_day_total_workhours && <p>{errors.payroll_day_total_workhours}</p>} 
                        </div>
                    </div>
                    <div className="wrapper-folhaDiv">
                        <div className="folhaDiv">
                            <h2>{t("SettingPayroll.5")}</h2>
                            {/* <span>Seleciona campos activos ou inactivos</span> */}
                            <div className="divSelect">
                                <div>
                                    <label>{t("SettingPayroll.6")}</label>
                                    <select id="column_position_name" name="column_position_name"
                                            onChange={e => setFieldValue("column_position_name", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_position_name === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_position_name === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.7")}</label>
                                    <select id="column_department_name" name="column_department_name"
                                            onChange={e => setFieldValue("column_department_name", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_department_name === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_department_name === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.8")}</label>
                                    <select id="column_overtime" name="column_overtime"
                                            onChange={e => setFieldValue("column_overtime", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_overtime === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_overtime === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.9")}</label>
                                    <select id="column_absences" name="column_absences"
                                            onChange={e => setFieldValue("column_absences", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_absences === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_absences === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.10")}</label>
                                    <select id="column_cash_advances" name="column_cash_advances"
                                            onChange={e => setFieldValue("column_cash_advances", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_cash_advances === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_cash_advances === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.11")}</label>
                                    <select id="column_bonus" name="column_bonus"
                                            onChange={e => setFieldValue("column_bonus", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_bonus === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_bonus === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.12")}</label>
                                    <select id="column_backpay" name="column_backpay"
                                            onChange={e => setFieldValue("column_backpay", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_backpay === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_backpay === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.13")}</label>
                                    <select id="column_syndicate" name="column_syndicate"
                                            onChange={e => setFieldValue("column_syndicate", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_syndicate === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_syndicate === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.25")}</label>
                                    <select id="column_loan" name="column_loan"
                                            onChange={e => setFieldValue("column_loan", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_loan === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_loan === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.14")}</label>
                                    <select id="column_subsidy" name="column_subsidy"
                                            onChange={e => setFieldValue("column_subsidy", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_subsidy === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_subsidy === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.15")}</label>
                                    <select id="column_subsidy_transport" name="column_subsidy_transport"
                                            onChange={e => setFieldValue("column_subsidy_transport", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_subsidy_transport === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_subsidy_transport === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.16")}</label>
                                    <select id="column_subsidy_food" name="column_subsidy_food"
                                            onChange={e => setFieldValue("column_subsidy_food", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_subsidy_food === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_subsidy_food === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.17")}</label>
                                    <select id="column_subsidy_residence" name="column_subsidy_residence"
                                            onChange={e => setFieldValue("column_subsidy_residence", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_subsidy_residence === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_subsidy_residence === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.18")}</label>
                                    <select id="column_subsidy_medical" name="column_subsidy_medical"
                                            onChange={e => setFieldValue("column_subsidy_medical", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_subsidy_medical === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_subsidy_medical === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.19")}</label>
                                    <select id="column_subsidy_vacation" name="column_subsidy_vacation"
                                            onChange={e => setFieldValue("column_subsidy_vacation", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_subsidy_vacation === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_subsidy_vacation === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.20")}</label>
                                    <select id="column_salary_thirteenth" name="column_salary_thirteenth"
                                            onChange={e => setFieldValue("column_salary_thirteenth", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_salary_thirteenth === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_salary_thirteenth === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label>{t("SettingPayroll.21")}</label>
                                    <select id="column_salary_fourteenth" name="column_salary_fourteenth"
                                            onChange={e => setFieldValue("column_salary_fourteenth", e.target.value)} onBlur={handleBlur}>
                                        {setting.column_salary_fourteenth === "true" ? <option value="true" selected>{t("SettingPayroll.22")}</option> :
                                        <option value="true">{t("SettingPayroll.22")}</option> 
                                        }
                                        {setting.column_salary_fourteenth === "false" ? <option value="false" selected>{t("SettingPayroll.23")}</option> :
                                        <option value="false">{t("SettingPayroll.23")}</option> 
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="folhaDiv2">
                            <div>
                                <h2>{t("SettingPayroll.24")}</h2>
                                <input type="text" id="payslip_comment"
                                    defaultValue={values.payslip_comment} onChange={handleChange} onBlur={handleBlur}/>
                            </div>
                        </div>
                    </div>
                    
                    <div className="buttonDiv">
                        <button type="submit">{t("Save.1")}</button>
                    </div>
                </form>

            </div>
        </div>
    )
}

// const SettingPayroll = () => {
//     const [startDate, setStartDate] = useState(new Date());
//     const [setting, setSetting] = useState("")
//     const [day, setday] = useState("")
//     const [hour, sethour] = useState("")

//     useEffect(() => {
//         console.log(setting)
//     }, [setting])

//     useEffect(() => {
//         async function fetch() {
//             const response = await api.get("settings")
//             // response.data.payroll_total_workdays_month = response.data.payroll_total_workdays_month ?? 26
//             // response.data.payroll_total_workhours_day =  response.data.payroll_total_workhours_day ?? 8
//             if (response.data){
//                 setSetting(response.data)
//                 setday(response.data.payroll_total_workdays_month)
//                 sethour(response.data.payroll_total_workhours_day)
//             } else {
//                 setday(30)
//                 sethour(8)
//             }
   
//         }
//         fetch()
//     }, [])

//     const onSubmit = useCallback(async (values, actions) => {  
//         console.log(values)
//         actions.resetForm()   
        
//         const response = await api.post("settings", values)
//         if (response.status === 201)
//         Swal.fire(
//             'Sucesso!',
//             'Dados salvos com sucesso!',
//             'success'
//           )
//         actions.resetForm()
//      }, [day, hour])

//     //  const schema = Yup.object().shape({
//     //     name: Yup.string().required('Nome Obrigatorio'),
//     //     description: Yup.string().required("Descricao obrigatorio"),

//     // })
//     const { values, errors, handleChange, setFieldValue ,touched, isSubmitting, handleBlur, handleSubmit} = useFormik({
//         initialValues: {
//             payroll_month_total_workdays: day ?? "",
//             payroll_day_total_workhours: hour ?? "",
//             column_position_name: setting.column_position_name,
//             column_department_name: setting.column_department_name,
//             column_overtime: setting.column_overtime,
//             column_absences: setting.column_absences,
//             column_cash_advances: setting.column_cash_advances,
//             column_bonus: setting.column_bonus,
//             column_backpay: setting.column_backpay,
//             column_syndicate: setting.column_syndicate,
//             column_subsidy: setting.column_subsidy,
//             column_subsidy_transport: setting.column_subsidy_transport,
//             column_subsidy_food: setting.column_subsidy_food,
//             column_subsidy_residence: setting.column_subsidy_residence,
//             column_subsidy_medical: setting.column_subsidy_medical,
//             column_subsidy_vacation: setting.column_subsidy_vacation,
//             column_salary_thirteenth: setting.column_salary_thirteenth
//             // overtime: setting.overtime,
//             // absences: setting.absences,
//             // cash_advances: setting.cash_advances,
//             // bonus: setting.bonus,
//             // subsidy: setting.subsidy,
//             // backpay: setting.backpay,
//             // syndicate_status: setting.syndicate_status
            
//         },
//         // validationSchema: schema,
//         enableReinitialize: true,
//         onSubmit 
//     })

//     return (
//         <div className="setting">
//             <Sidebar />
//             <div className="settingContainer">
//                 <Navbar />
//                 <div className="settingDiv">
//                     {/* Settings
//                     <DatePicker className="datas" selected={startDate} onChange={(date) => setStartDate(date)}/> */}
//                     <ul>
//                         <li><Link className="a" to="..">Dados da Empresa</Link></li>
//                         <li><Link className="a" to="../logo">Titulo e Logo</Link></li>
//                         <li><Link className="b" >Folha de Salario</Link></li>
//                     </ul>
//                 </div>
//                 <form onSubmit={handleSubmit}>
//                     <div className="folhaDiv">
//                         <h2>Tempo de trabalho</h2>
//                         <div>
//                             <label>Total dias de Trabalho por mes:</label>
//                             <input type="number" id="payroll_total_workdays_month"
//                                 defaultValue={day} onChange={handleChange} onBlur={handleBlur}/>
//                         </div>
//                         <div>
//                             <label>Total horas de Trabalho por dia:</label>
//                             <input type="number" id="payroll_total_workhours_day"
//                                 defaultValue={hour} onChange={handleChange} onBlur={handleBlur}/>
//                         </div>
//                     </div>
//                     <div className="folhaDiv">
//                         <h2>Campos de Folha Salario</h2>
//                         {/* <span>Seleciona campos activos ou inactivos</span> */}
//                         <div className="divSelect">
//                             <div>
//                                 <label>Horas Extras</label>
//                                 <select id="column_overtime" name="column_overtime"
//                                         onChange={e => setFieldValue("column_overtime", e.target.value)} onBlur={handleBlur}>
//                                     {setting.column_overtime === "true" ? <option value="true" selected>Activo</option> :
//                                     <option value="true">Activo</option> 
//                                     }
//                                      {setting.column_overtime === "false" ? <option value="false" selected>Inactivo</option> :
//                                     <option value="false">Inactivo</option> 
//                                     }
//                                 </select>
//                             </div>
//                             <div>
//                                 <label>Faltas</label>
//                                 <select id="column_absences" name="column_absences"
//                                         onChange={e => setFieldValue("column_absences", e.target.value)} onBlur={handleBlur}>
//                                     {setting.column_absences === "true" ? <option value="true" selected>Activo</option> :
//                                     <option value="true">Activo</option> 
//                                     }
//                                      {setting.column_absences === "false" ? <option value="false" selected>Inactivo</option> :
//                                     <option value="false">Inactivo</option> 
//                                     }
//                                 </select>
//                             </div>
//                             <div>
//                                 <label>Emprestimos</label>
//                                 <select id="column_cash_advances" name="column_cash_advances"
//                                         onChange={e => setFieldValue("column_cash_advances", e.target.value)} onBlur={handleBlur}>
//                                     {setting.column_cash_advances === "true" ? <option value="true" selected>Activo</option> :
//                                     <option value="true">Activo</option> 
//                                     }
//                                      {setting.column_cash_advances === "false" ? <option value="false" selected>Inactivo</option> :
//                                     <option value="false">Inactivo</option> 
//                                     }
//                                 </select>
//                             </div>
//                             <div>
//                                 <label>Bonus</label>
//                                 <select id="column_bonus" name="column_bonus"
//                                         onChange={e => setFieldValue("column_bonus", e.target.value)} onBlur={handleBlur}>
//                                     {setting.column_bonus === "true" ? <option value="true" selected>Activo</option> :
//                                     <option value="true">Activo</option> 
//                                     }
//                                      {setting.column_bonus === "false" ? <option value="false" selected>Inactivo</option> :
//                                     <option value="false">Inactivo</option> 
//                                     }
//                                 </select>
//                             </div>
//                             <div>
//                                 <label>Subsidio</label>
//                                 <select id="column_subsidy" name="column_subsidy"
//                                         onChange={e => setFieldValue("column_subsidy", e.target.value)} onBlur={handleBlur}>
//                                     {setting.column_subsidy === "true" ? <option value="true" selected>Activo</option> :
//                                     <option value="true">Activo</option> 
//                                     }
//                                      {setting.column_subsidy === "false" ? <option value="false" selected>Inactivo</option> :
//                                     <option value="false">Inactivo</option> 
//                                     }
//                                 </select>
//                             </div>
//                             <div>
//                                 <label>Retroativo</label>
//                                 <select id="column_backpay" name="column_backpay"
//                                         onChange={e => setFieldValue("column_backpay", e.target.value)} onBlur={handleBlur}>
//                                     {setting.column_backpay === "true" ? <option value="true" selected>Activo</option> :
//                                     <option value="true">Activo</option> 
//                                     }
//                                      {setting.column_backpay === "false" ? <option value="false" selected>Inactivo</option> :
//                                     <option value="false">Inactivo</option> 
//                                     }
//                                 </select>
//                             </div>
//                             {/* <div>
//                                 <label>Sindicato</label>
//                                 <select id="syndicate_status" name="syndicate_status"
//                                         onChange={e => setFieldValue("syndicate_status", e.target.value)} onBlur={handleBlur}>
//                                     {setting.syndicate_status === "true" ? <option value="true" selected>Activo</option> :
//                                     <option value="true">Activo</option> 
//                                     }
//                                      {setting.syndicate_status === "false" ? <option value="false" selected>Inactivo</option> :
//                                     <option value="false">Inactivo</option> 
//                                     }
//                                 </select>
//                             </div>
//                             <div>
//                                 <label>Sindicato</label>
//                                 <select id="syndicate_status" name="syndicate_status"
//                                         onChange={e => setFieldValue("syndicate_status", e.target.value)} onBlur={handleBlur}>
//                                     {setting.syndicate_status === "true" ? <option value="true" selected>Activo</option> :
//                                     <option value="true">Activo</option> 
//                                     }
//                                      {setting.syndicate_status === "false" ? <option value="false" selected>Inactivo</option> :
//                                     <option value="false">Inactivo</option> 
//                                     }
//                                 </select>
//                             </div>
//                             <div>
//                                 <label>Sindicato</label>
//                                 <select id="syndicate_status" name="syndicate_status"
//                                         onChange={e => setFieldValue("syndicate_status", e.target.value)} onBlur={handleBlur}>
//                                     {setting.syndicate_status === "true" ? <option value="true" selected>Activo</option> :
//                                     <option value="true">Activo</option> 
//                                     }
//                                      {setting.syndicate_status === "false" ? <option value="false" selected>Inactivo</option> :
//                                     <option value="false">Inactivo</option> 
//                                     }
//                                 </select>
//                             </div>
//                             <div>
//                                 <label>Sindicato</label>
//                                 <select id="syndicate_status" name="syndicate_status"
//                                         onChange={e => setFieldValue("syndicate_status", e.target.value)} onBlur={handleBlur}>
//                                     {setting.syndicate_status === "true" ? <option value="true" selected>Activo</option> :
//                                     <option value="true">Activo</option> 
//                                     }
//                                      {setting.syndicate_status === "false" ? <option value="false" selected>Inactivo</option> :
//                                     <option value="false">Inactivo</option> 
//                                     }
//                                 </select>
//                             </div>
//                             <div>
//                                 <label>Sindicato</label>
//                                 <select id="syndicate_status" name="syndicate_status"
//                                         onChange={e => setFieldValue("syndicate_status", e.target.value)} onBlur={handleBlur}>
//                                     {setting.syndicate_status === "true" ? <option value="true" selected>Activo</option> :
//                                     <option value="true">Activo</option> 
//                                     }
//                                      {setting.syndicate_status === "false" ? <option value="false" selected>Inactivo</option> :
//                                     <option value="false">Inactivo</option> 
//                                     }
//                                 </select>
//                             </div> */}
//                         </div>
//                     </div>
//                     <div className="buttonDiv">
//                         <button type="submit">Salvar</button>
//                     </div>
//                 </form>

//             </div>
//         </div>
//     )
// }

export default SettingPayroll;