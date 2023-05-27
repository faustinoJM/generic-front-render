import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "./dropdownProfile.scss"

const DropDownProfile = () => {
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
                            <AccountCircleIcon/>
                            <h2>Zabuza</h2>
                        </div>
                        <hr />

                        <a href="#" className="sub-menu-link">
                            <AccountCircleIcon/>
                            <p>Edit Profile</p>
                            <span>{">"}</span>
                        </a>
                        <a href="#" className="sub-menu-link">
                            <AccountCircleIcon/>
                            <p>Settings & Privacy</p>
                            <span>{">"}</span>
                        </a>
                        <a href="#" className="sub-menu-link">
                            <AccountCircleIcon/>
                            <p>Help & Support</p>
                            <span>{">"}</span>
                        </a>
                        <a href="#" className="sub-menu-link">
                            <AccountCircleIcon/>
                            <p>Logout</p>
                            <span>{">"}</span>
                        </a>
                    </div>
                </div>
    )
}

export default DropDownProfile