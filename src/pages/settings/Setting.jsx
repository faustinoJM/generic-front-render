import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./settingCompany.scss"
import { useEffect, useState } from "react"
import api from "../../services/api";
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';

const Setting = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [setting, setSetting] = useState("");
    const { t, i18n } = useTranslation();

    useEffect(() => {
        async function fetch() {
            const respose = await api.get("settings")
            
            if (respose.data)
                setSetting(respose.data)
        }
        fetch()
    }, [])

    
    const onSubmit = async (values, actions) => {  
        console.log("submit")
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
     }

    //  const schema = Yup.object().shape({
    //     name: Yup.string().required('Nome Obrigatorio'),
    //     description: Yup.string().required("Descricao obrigatorio"),

    // })
    const { values, errors, handleChange, touched, isSubmitting, handleBlur, handleSubmit} = useFormik({
        initialValues: {
            company_name: setting.company_name,
            company_telephone: setting.company_telephone,
            company_contact: setting.company_contact,
            company_email: setting.company_email,
            company_website: setting.company_website,
            company_fax: setting.company_fax,
            company_address: setting.company_address,
            company_province: setting.company_province,
            company_city: setting.company_city,
            postal_code: setting.postal_code,
            company_country: setting.company_country,
            company_avatar: setting.company_avatar,
            payroll_total_workdays_month: setting.payroll_total_workdays_month,
            payroll_total_workhours_day: setting.payroll_total_workhours_day
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
                    <DatePicker className="settings" selected={startDate} onChange={(date) => setStartDate(date)}/> */}
                    <ul>
                        <li><Link className="b">{t("SettingCompany.1")}</Link></li>
                        <li><Link className="a" to="logo">{t("SettingLogo.1")}</Link></li>
                        <li><Link className="a" to="payroll">{t("SettingPayroll.1")}</Link></li>
                    </ul>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="dadosDiv">
                        {/* <form onSubmit={handleSubmit}> */}
                        <div className="formDiv">
                            <div>
                                <label>{t("SettingCompany.2")}</label>
                                <input type="text"  id="company_name"
                                    defaultValue={setting.company_name} onChange={handleChange} onBlur={handleBlur}/>
                            </div>
                            <div>
                                <label>{t("SettingCompany.3")}</label>
                                <input type="number" value={setting.company_telephone} id="company_telephone"
                                    defaultValue={setting.company_telephone} onChange={handleChange} onBlur={handleBlur}/>
                            </div>
                            <div>
                                <label>{t("SettingCompany.4")}</label>
                                <input type="number" value={setting.company_contact} id="company_contact"
                                    defaultValue={setting.company_contact} onChange={handleChange} onBlur={handleBlur}/>
                            </div>
                            <div>
                                <label>{t("SettingCompany.5")}</label>
                                <input type="text" value={setting.company_email} id="company_email"
                                    defaultValue={setting.company_email} onChange={handleChange} onBlur={handleBlur}/>
                            </div>
                            <div>
                                <label>{t("SettingCompany.6")}</label>
                                <input type="text" value={setting.company_website} id="company_website"
                                    defaultValue={setting.company_website} onChange={handleChange} onBlur={handleBlur}/>
                            </div>
                            <div>
                                <label>{t("SettingCompany.7")}</label>
                                <input type="text" value={setting.company_fax} id="company_fax"
                                    defaultValue={setting.company_fax} onChange={handleChange} onBlur={handleBlur}/>
                            </div>
                            <div>
                                <label>{t("SettingCompany.8")}</label>
                                <input type="text" value={setting.company_address} id="company_address"
                                    defaultValue={setting.company_address} onChange={handleChange} onBlur={handleBlur}/>
                            </div>
                            <div>
                                <label>{t("SettingCompany.9")}</label>
                                <input type="text" value={setting.company_province} id="company_province"
                                    defaultValue={setting.company_province} onChange={handleChange} onBlur={handleBlur}/>
                            </div>
                            <div>
                                <label>{t("SettingCompany.10")}</label>
                                <input type="text" value={setting.company_city} id="company_city"
                                    defaultValue={setting.company_city} onChange={handleChange} onBlur={handleBlur}/>
                            </div>
                            <div>
                                <label>{t("SettingCompany.11")}</label>
                                <input type="text" value={setting.postal_code} id="postal_code"
                                    defaultValue={setting.postal_code} onChange={handleChange} onBlur={handleBlur}/>
                            </div>
                            <div>
                                <label>{t("SettingCompany.12")}</label>
                                <input type="text" value={setting.company_country} id="company_country"
                                    defaultValue={setting.company_country} onChange={handleChange} onBlur={handleBlur}/>
                            </div>
                        </div>
                        {/* </form> */}
                    </div>
                    <div className="buttonDiv">
                        <button type="submit">{t("Save.1")}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Setting;