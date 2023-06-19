import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import "./dropdownLang.scss"
import api from '../../services/api';

const DropDownLang = ({setOpenLang, setLangOption}) => {
    const { t, i18n } = useTranslation();

    async function handleLanguage(language) {
        i18n.changeLanguage(language);
        // setOpenLang((prev) => !prev)
        // console.log("maumau")
        setOpenLang(false)

        language === "pt" ? setLangOption("PT") : setLangOption("EN")
        await api.post("settings", { language_options: language })
        window.location.reload(true)
        
    }

    return (
        <div className='flex flex-col dropDownLang'>
            <span onClick={() => handleLanguage("pt")} >Portugues</span>
            <span onClick={() => handleLanguage("en")} >English</span>
            {/* <ul>
                <li>Profile</li>
                <li>Setting</li>
                <li>Logout</li>
            </ul> */}

        </div>

    )
}

export default DropDownLang