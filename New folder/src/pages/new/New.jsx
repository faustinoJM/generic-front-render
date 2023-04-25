import "./new.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import { useEffect, useState } from "react"
import api from "../../services/api";


const New = ({ inputs, title }) => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    const [file, setFile] = useState("")

    // const ds = useEffect(() => {
    //     async function fetch() {
    //         await api.post('departments', {
    //             name
    //         })
    //     }

    //     fetch()
       
    // }, [name])

    
    const ds = (async (e) => {
        e.preventDefault()
        async function fetch() {
            await api.post('departments', {
                name
            })
        }

        fetch()
  
            //  await api.post('departments', {
            //     name
            // })
       
       
    })

    // const eTarget = (e) => {
    //     setName(e.target.value)
    // }

    // const eTarget = (e) => {
    //     setName(e.target.value)
    // }
    
    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img 
                            src={
                                file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            } 
                        alt="" />
                    </div>
                    <div className="right">
                        <form onSubmit={ds}>
                            <div className="formInput">
                                <label htmlFor="file">
                                    Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                </label>
                                <input type="file" id="file" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }}/>
                            </div>
                            {inputs.map(input => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input type={input.type} placeholder={input.placeholder} value={name} onChange={e => setName(e.target.value)}/>
                                </div>
                            ))}
                            <button>Cadastrar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default New




// const New = () => {
//     return (
//         <div className="new">
//             <Sidebar />
//             <div className="newContainer">
//                 <Navbar />
//                 <div className="top">
//                     <h1>Add New user</h1>
//                 </div>
//                 <div className="bottom">
//                     <div className="left">
//                         <img src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg" 
//                         alt="" />
//                     </div>
//                     <div className="right">
//                         <form>
//                             <div className="formInput">
//                                 <label htmlFor="file">
//                                     Image: <DriveFolderUploadOutlinedIcon className="icon" />
//                                 </label>
//                                 <input type="file" id="file" style={{ display: 'none' }}/>
//                             </div>
//                             <div className="formInput">
//                                 <label>Username</label>
//                                 <input type="text" name="name" placeholder="John Doe" />
//                             </div>
//                             <div className="formInput">
//                                 <label>Name and Surname</label>
//                                 <input type="text" name="name" placeholder="John Doe" />
//                             </div>
//                             <div className="formInput">
//                                 <label>Email</label>
//                                 <input type="email" name="email" placeholder="john@doe.com" />
//                             </div>
//                             <div className="formInput">
//                                 <label>Phone</label>
//                                 <input type="text" name="phone" placeholder="+258 23451226" />
//                             </div>
//                             <div className="formInput">
//                                 <label>Password</label>
//                                 <input type="password" name="password"  />
//                             </div>
//                             <div className="formInput">
//                                 <label>Address</label>
//                                 <input type="text" name="address" placeholder="Elton St. 216" />
//                             </div>
//                             <div className="formInput">
//                                 <label>Country</label>
//                                 <input type="text" name="name" placeholder="USA" />
//                             </div>
//                             <button>Send</button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default New