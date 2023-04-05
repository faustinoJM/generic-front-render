import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./settingPayroll.scss"
import { useCallback, useEffect, useState } from "react"
import api from "../../services/api";
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const SettingPayroll = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [setting, setSetting] = useState("")
    const [day, setday] = useState("")
    const [hour, sethour] = useState("")

    useEffect(() => {
        console.log(setting)
    }, [setting])

    useEffect(() => {
        async function fetch() {
            const response = await api.get("settings")
            // response.data.payroll_total_workdays_month = response.data.payroll_total_workdays_month ?? 26
            // response.data.payroll_total_workhours_day =  response.data.payroll_total_workhours_day ?? 8
            if (response.data){
                setSetting(response.data)
                setday(response.data.payroll_total_workdays_month)
                sethour(response.data.payroll_total_workhours_day)
            } else {
                setday(26)
                sethour(8)
            }
   
        }
        fetch()
    }, [])

    const onSubmit = useCallback(async (values, actions) => {  
        console.log(values)
        actions.resetForm()   
        
        const response = await api.post("settings", values)
        if (response.status === 201)
        Swal.fire(
            'Sucesso!',
            'Dados salvos com sucesso!',
            'success'
          )
        actions.resetForm()
     }, [day, hour])

    //  const schema = Yup.object().shape({
    //     name: Yup.string().required('Nome Obrigatorio'),
    //     description: Yup.string().required("Descricao obrigatorio"),

    // })
    const { values, errors, handleChange, setFieldValue ,touched, isSubmitting, handleBlur, handleSubmit} = useFormik({
        initialValues: {
            payroll_total_workdays_month: day ?? "",
            payroll_total_workhours_day: hour ?? "",
            overtime: setting.overtime,
            absences: setting.absences,
            cash_advances: setting.cash_advances,
            bonus: setting.bonus,
            subsidy: setting.subsidy,
            backpay: setting.backpay  
        },
        // validationSchema: schema,
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
                        <li><Link className="a" to="..">Dados da Empresa</Link></li>
                        <li><Link className="a" to="../logo">Titulo e Logo</Link></li>
                        <li><Link className="b" >Folha de Salario</Link></li>
                    </ul>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="folhaDiv">
                        <h2>Tempo de trabalho</h2>
                        <div>
                            <label>Total dias de Trabalho por mes:</label>
                            <input type="number" id="payroll_total_workdays_month"
                                defaultValue={day} onChange={handleChange} onBlur={handleBlur}/>
                        </div>
                        <div>
                            <label>Total horas de Trabalho por dia:</label>
                            <input type="number" id="payroll_total_workhours_day"
                                defaultValue={hour} onChange={handleChange} onBlur={handleBlur}/>
                        </div>
                    </div>
                    <div className="folhaDiv">
                        <h2>Campos de Folha Salario</h2>
                        {/* <span>Seleciona campos activos ou inactivos</span> */}
                        <div className="divSelect">
                            <div>
                                <label>Horas Extras</label>
                                <select id="overtime" name="overtime"
                                        onChange={e => setFieldValue("overtime", e.target.value)} onBlur={handleBlur}>
                                    {setting.overtime === "true" ? <option value="true" selected>Activo</option> :
                                    <option value="true">Activo</option> 
                                    }
                                     {setting.overtime === "false" ? <option value="false" selected>Inactivo</option> :
                                    <option value="false">Inactivo</option> 
                                    }
                                </select>
                            </div>
                            <div>
                                <label>Faltas</label>
                                <select id="absences" name="absences"
                                        onChange={e => setFieldValue("absences", e.target.value)} onBlur={handleBlur}>
                                    {setting.absences === "true" ? <option value="true" selected>Activo</option> :
                                    <option value="true">Activo</option> 
                                    }
                                     {setting.absences === "false" ? <option value="false" selected>Inactivo</option> :
                                    <option value="false">Inactivo</option> 
                                    }
                                </select>
                            </div>
                            <div>
                                <label>Adiantamento</label>
                                <select id="cash_advances" name="cash_advances"
                                        onChange={e => setFieldValue("cash_advances", e.target.value)} onBlur={handleBlur}>
                                    {setting.cash_advances === "true" ? <option value="true" selected>Activo</option> :
                                    <option value="true">Activo</option> 
                                    }
                                     {setting.cash_advances === "false" ? <option value="false" selected>Inactivo</option> :
                                    <option value="false">Inactivo</option> 
                                    }
                                </select>
                            </div>
                            <div>
                                <label>Bonus</label>
                                <select id="bonus" name="bonus"
                                        onChange={e => setFieldValue("bonus", e.target.value)} onBlur={handleBlur}>
                                    {setting.bonus === "true" ? <option value="true" selected>Activo</option> :
                                    <option value="true">Activo</option> 
                                    }
                                     {setting.bonus === "false" ? <option value="false" selected>Inactivo</option> :
                                    <option value="false">Inactivo</option> 
                                    }
                                </select>
                            </div>
                            <div>
                                <label>Subsidio</label>
                                <select id="subsidy" name="subsidy"
                                        onChange={e => setFieldValue("subsidy", e.target.value)} onBlur={handleBlur}>
                                    {setting.subsidy === "true" ? <option value="true" selected>Activo</option> :
                                    <option value="true">Activo</option> 
                                    }
                                     {setting.subsidy === "false" ? <option value="false" selected>Inactivo</option> :
                                    <option value="false">Inactivo</option> 
                                    }
                                </select>
                            </div>
                            <div>
                                <label>Retroativo</label>
                                <select id="backpay" name="backpay"
                                        onChange={e => setFieldValue("backpay", e.target.value)} onBlur={handleBlur}>
                                    {setting.backpay === "true" ? <option value="true" selected>Activo</option> :
                                    <option value="true">Activo</option> 
                                    }
                                     {setting.backpay === "false" ? <option value="false" selected>Inactivo</option> :
                                    <option value="false">Inactivo</option> 
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="buttonDiv">
                        <button type="submit">Salvar</button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default SettingPayroll;