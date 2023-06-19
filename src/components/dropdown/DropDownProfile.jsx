import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import "./dropdownProfile.scss"
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DropDownProfile = ({ setting }) => {
    const { signOut } = useAuth();
    let user = localStorage.getItem("@ConsulPayroll:user")
    user = JSON.parse(user)
    console.log("77",user.email)
    return (
        // <div className='flex flex-col dropDownProfile'>
        //     <ul>
        //         <li>Profile</li>
        //         <li>Setting</li>
        //         <li>Logout</li>
        //     </ul>
        // </div>
                
                <div className="sub-menu-wrap" id="subMenu">
                    <div className="sub-menu">
                        <div className="user-info">
                            {/* <AccountCircleIcon/> */}
                            <h2>{user.name}</h2>
                            <span>{user.email}</span>
                        </div>
                        <hr />
                        <Link to={"/profile"} className="sub-menu-link">
                            <AccountCircleIcon className="icon-drop"/>
                            <p>Profile</p>
                            {/* <span>{">"}</span> */}
                        </Link>
                        <Link to={"/settings"} className="sub-menu-link">
                            <SettingsIcon className="icon-drop"/>
                            <p>Settings</p>
                            {/* <span>{">"}</span> */}
                        </Link>
                        <Link to="https://www.elint-systems.com/aboutus" className="sub-menu-link">
                            <HelpIcon className="icon-drop"/>
                            <p>Support</p>
                            {/* <span>{">"}</span> */}
                        </Link>
                        <Link to="/login" className="sub-menu-link" onClick={signOut}>
                            <ExitToAppIcon className="icon-drop"/>
                            <p>Logout</p>
                            {/* <span>{">"}</span> */}
                        </Link>
                    </div>
                </div>
    )
}

export default DropDownProfile