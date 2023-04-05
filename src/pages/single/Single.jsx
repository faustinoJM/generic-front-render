import "./single.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Chart from "../../components/chart/Chart"
import Table from "../../components/table/Table"
import api from "../../services/api"
import { useParams, useLocation} from 'react-router-dom';
import { useEffect, useState } from "react"


const Single = () => {
    const [data, setData] = useState({});
    // const params = useParams();
    // const location = useLocation()
    // console.log(params)
    //  console.log(Object.values(params)[0])
    //  const id = Object.values(params)[0];
    // console.log(location)
    // console.log(location.pathname.split("/")[2])
    useEffect(() => {
        async function fetch() {
            // const str = "/employees/3d6c8e94-cfae-416c-942a-822f21c2702d"
            const [ , , id] = window.location.pathname.split("/")
            // const response = await api.get("employees/3d6c8e94-cfae-416c-942a-822f21c2702d")
            const response = await api.get(`employees/${id}`)
            // console.log(response)
            setData(response.data)
            // console.log(window.location.pathname); //yields: "/js" (where snisppets run)
            // console.log(window.location.href); //yields: "https://stacksnippets.net/js
            // console.log(window.location.href.split("/"))
        }
        fetch()
    }, [])
    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <div className="editButton">Editar</div>
                        <h1 className="title">Informacoes</h1>
                        <div className="item">
                            <img className="itemImg" 
                                    src="https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" 
                                    alt=""
                             />
                             <div className="details">
                                <h1 className="itemTitle">{data.name}</h1>
                                <div className="detailItem">
                                    <span className="ItemKey">Email:</span>
                                    <span className="itemValue">{data.name}@gmail.com</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Phone:</span>
                                    <span className="itemValue">+ {data.id} 12 14</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Address:</span>
                                    <span className="itemValue">Elton St. {data.updated_at}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="ItemKey">Country:</span>
                                    <span className="itemValue">USA {data.salary}</span>
                                </div>
                             </div>
                        </div>
                    </div>
                    <div className="right">
                        <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
                    </div>
                </div>
                <div className="bottom">
                    <h1 className="title">Last Transactions</h1>
                    <Table />
                </div>
            </div>
        </div>        
    )
}

export default Single
