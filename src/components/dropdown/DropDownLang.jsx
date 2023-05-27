import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import "./dropdownLang.scss"

const DropDownLang = ({setOpenLang, setLangOption}) => {
    const { t, i18n } = useTranslation();

    function handleLanguage(language) {
        i18n.changeLanguage(language);
        // setOpenLang((prev) => !prev)
        // console.log("maumau")
        setOpenLang(false)

        language === "pt" ? setLangOption("PT") : setLangOption("EN")

    }

    return (
        <div className='flex flex-col dropDownLang'>
            <span onClick={() => handleLanguage("pt")} >Portugues</span>
            <span onClick={() => handleLanguage("en")} >Ingles</span>
            {/* <ul>
                <li>Profile</li>
                <li>Setting</li>
                <li>Logout</li>
            </ul> */}

        </div>

    )
}

export default DropDownLang