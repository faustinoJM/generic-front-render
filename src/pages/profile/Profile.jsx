import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./profile.scss"
import { useEffect, useState } from "react"
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useTranslation } from "react-i18next";

const Profile = () => {
    const [profile, setProfile] = useState([]);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        api.get("users/company").then((response) => setProfile(response.data))
    }, [])

    function handleDelete(id) {
        api.delete(`users/company/${id}`).then(() => {
            setProfile(() => profile.filter((data) => data.id !== id))
        }).catch(err => {
            console.log("sd09s", err)
        }) 
        
    }

    return (
        <div className="setting">
            <Sidebar />
            <div className="settingContainer">
                <Navbar />
                <div className="settingDiv">
                    <div className="title">
                        {t("Profile.1")}
                        <Link to={'new'} className="link">
                            {t("Profile.2")}
                        </Link>
                    </div>
                </div>
                <div className="profileDiv">
                    <div className="title">
                        {t("Profile.3")}
                    </div>
                    <table className="profileTab">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>{t("Profile.4")}</th>
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
                                            <div className="editButton">{t("Profile.6")}</div>
                                        </Link>
                                        <div onClick={() => handleDelete(data.id)} className="deleteButton">{t("Profile.7")}</div>
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