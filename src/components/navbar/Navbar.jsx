import "./navbar.scss"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import { useTranslation } from 'react-i18next';
import DropDownProfile from "../dropdown/DropDownProfile";
import { useState, useEffect, useRef } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DropDownLang from "../dropdown/DropDownLang";
import api from "../../services/api";
// import "/node_modules/flag-icons/css/flag-icons.min.css";


const Navbar = ({searchName, setSearchName, loadLang, SetLoadLang}) => {
    const { t, i18n } = useTranslation();
    const [openProfile, setOpenProfile] = useState(false)
    const [openLang, setOpenLang] = useState(false)
    const menuRef = useRef()
    const [langOption, setLangOption] = useState("PT")

    function handleLanguage(language) {
        // i18n.changeLanguage(language);
        setOpenLang((prev) => !prev)
        // console.log("maumau")
        // document.addEventListener("mouseenter", () => {
        //     setOpenLang((prev) => !prev)
        // })
    }

    useEffect(() => {
        const fetch = async () => {
            const response = await api.get("settings")
            if (response.data) {
                response.data.language_options === "pt" ? setLangOption("PT") : setLangOption("EN")
                i18n.changeLanguage(response.data.language_options)
            }
        }
        fetch()
    }, [])

    useEffect(() => {
        let handler = (e) => {
            if (!menuRef.current.contains(e.target)) {
                setOpenLang(false)
                setOpenProfile(false)
                console.log(e)
                console.log(menuRef.current)
            }
            console.log(e)
                console.log(menuRef.current)
        }
        document.addEventListener("mousedown", handler)
    }, [])

    return (
        <div className="navbar" ref={menuRef}>
            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder="Pesquisar..." onChange={e => {setSearchName(e.target.value)}}/>
                    {/* {console.log(searchName)} */}
                    <SearchOutlinedIcon className="icon" />
                </div>
                <div className="image" style={{color: "green"}}>
                    {/* <img src={logo} /> */}
                    {/* <p>{t('Thanks.1')} {t('Why.1')}</p> */}
                </div>
                <div className="items">
                    <div className="item" >
                        <LanguageOutlinedIcon className="icon" onClick={() => handleLanguage("en")}/>
                        {langOption} {/* EN */}
                        {openLang && <DropDownLang setOpenLang={setOpenLang} setLangOption={setLangOption} SetLoadLang={SetLoadLang}/>}
                    </div>
                    {/* <div className="item" onClick={() => handleLanguage("ko")}>
                        <LanguageOutlinedIcon className="icon" />
                        Korean
                    </div>
                    <div className="item" onClick={() => handleLanguage("chi")}>
                        <LanguageOutlinedIcon className="icon" />
                        Chinese
                    </div> */}
                    {/* <div className="item" onClick={() => setOpenProfile((prev) => !prev)}>
                       { openProfile ? <DarkModeOutlinedIcon className="icon" /> :
                       <FullscreenExitOutlinedIcon className="icon" />
                       } 
                    </div> */}
                    {/* <div className="item">
                        <FullscreenExitOutlinedIcon className="icon" />
                    </div> */}
                    {/* <div className="item">
                        <NotificationsNoneOutlinedIcon className="icon" />
                        <div className="counter">1</div>
                    </div>
                    <div className="item">
                        <ChatBubbleOutlineOutlinedIcon className="icon" />
                        <div className="counter">2</div>
                    </div> */}
                    <div className="item dropdown" onClick={() => setOpenProfile(prev => !prev)}>
                        <AccountCircleIcon className="icon"/>
                        {openProfile ? <DropDownProfile/>  : ""}
                    </div>
                    
                   
                </div>
            </div>
        </div>
    )
}

export default Navbar