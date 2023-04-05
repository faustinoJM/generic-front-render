import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./profile.scss"
import { useEffect, useState } from "react"
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Profile = () => {
    const [profile, setProfile] = useState([]);
    useEffect(() => {
        api.get("users").then((response) => setProfile(response.data))
    }, [])

    function handleDelete(id) {
        api.delete(`users/${id}`).then(() => {})
        setProfile(() => profile.filter((data) => data.id !== id))
    }

    return (
        <div className="setting">
            <Sidebar />
            <div className="settingContainer">
                <Navbar />
                <div className="settingDiv">
                    <div className="title">
                        Perfil
                        <Link to={'new'} className="link">
                            Adicionar Novo
                        </Link>
                    </div>
                </div>
                <div className="profileDiv">
                    <div className="title">
                        Lista de Usuario
                    </div>
                    <table className="profileTab">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nome</th>
                                <th>Email</th>
                                {/* <th>Password</th> */}
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {profile.length > 0 ? profile.map((data, index) => 
                             <tr>
                                <td >{index}</td>
                                <td >{data.name}</td>
                                <td >{data.email}</td>
                                {/* <td style={{minWidth: "120px"}}></td> */}
                                <td>
                                    <div className="cellAction">
                                        <Link to={`${data.id}`}>
                                            <div className="editButton">Editar</div>
                                        </Link>
                                        <div onClick={() => handleDelete(data.id)} className="deleteButton">Remover</div>
                                    </div>
                                </td>
                            </tr>
                        ) : null}
                        </tbody>
                    </table>
                </div>    
            </div>
        </div>
    )
}

export default Profile;