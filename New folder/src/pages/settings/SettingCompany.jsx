import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./settingCompany.scss"
import { useEffect, useState } from "react"
import DatePicker from "react-datepicker";

const SettingCompany = () => {
    const [startDate, setStartDate] = useState(new Date());

    return (
        <div className="setting">
            <Sidebar />
            <div className="settingContainer">
                <Navbar />
                <div className="settingDiv">
                    <ul>
                        <li><a >Dados da Empresa</a></li>
                        <li><a href="logo">Titulo e Logo</a></li>
                        <li><a href="payroll">Folha de Salario</a></li>
                    </ul>
                </div>
                <div className="dadosDiv">
                    <form>
                        <div>
                            <label>Nome da Empresa</label>
                            <input type="text" />
                        </div>
                        <div>
                            <label>Telefone</label>
                            <input type="number" />
                        </div>
                        <div>
                            <label>Contacto</label>
                            <input type="number" />
                        </div>
                        <div>
                            <label>Email</label>
                            <input type="text" />
                        </div>
                        <div>
                            <label>website URL</label>
                            <input type="text" />
                        </div>
                        <div>
                            <label>Fax</label>
                            <input type="text" />
                        </div>
                        <div>
                            <label>Endereco da Empresa</label>
                            <input type="text" />
                        </div>
                        <div>
                            <label>Provincia</label>
                            <input type="text" />
                        </div>
                        <div>
                            <label>Cidade</label>
                            <input type="text" />
                        </div>
                        <div>
                            <label>Codigo Postal</label>
                            <input type="text" />
                        </div>
                        <div>
                            <label>Pais</label>
                            <input type="text" />
                        </div>
                    </form>
                </div>
                <div className="buttonDiv">
                    <button type="submit">Salvar</button>
                </div>
            </div>
        </div>
    )
}

export default SettingCompany;