import "./navbar.scss"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t, i18n } = useTranslation();

    function handleLanguage(language) {
        i18n.changeLanguage(language);
        // console.log("maumau")
    }

    return (
        <div className="navbar">
            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder="Pesquisar..." />
                    <SearchOutlinedIcon className="icon" />
                </div>
                <div className="image" style={{color: "green"}}>
                    {/* <img src={logo} /> */}
                    {/* <p>{t('Thanks.1')} {t('Why.1')}</p> */}
                </div>
                <div className="items">
                    <div className="item" onClick={() => handleLanguage("en")}>
                        <LanguageOutlinedIcon className="icon" />
                        English
                    </div>
                    {/* <div className="item" onClick={() => handleLanguage("ko")}>
                        <LanguageOutlinedIcon className="icon" />
                        Korean
                    </div>
                    <div className="item" onClick={() => handleLanguage("chi")}>
                        <LanguageOutlinedIcon className="icon" />
                        Chinese
                    </div> */}
                    <div className="item">
                        <DarkModeOutlinedIcon className="icon" />
                    </div>
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
                    <div className="item">
                        <ListOutlinedIcon className="icon" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar