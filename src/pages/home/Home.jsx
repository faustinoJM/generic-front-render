import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./home.scss"
import Sticky from 'react-stickynode';
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import { useEffect, useState } from "react";
import api from "../../services/api";



// function addToken() {
//     api.defaults.headers['Authorization'] = !!localStorage.getItem('@ConsulPayroll:refresh_token') ? `Bearer ${localStorage.getItem('@ConsulPayroll:refresh_token')}` : '';
//   }
// api.interceptors.request.use(req => {
//     // `req` is the Axios request config, so you can modify
//     // the `headers`.
//     req.headers.authorization = 'Bearer my secret token';
//     return req;
//   });

const Home = () => {
    // const local = localStorage.getItem('@ConsulPayroll:api')
    // addToken()
    const [employee, setEmployee] = useState(null);
    const [position, setPosition] = useState(null);
    const [department, setDepartment] = useState(null);
    const [payroll, setPayroll] = useState(null);

    //Fetch api in serie and wait
    // useEffect(() => {
    //     async function fetch() {
    //         const responseEmp = await api.get("employees")

    //         const responsePos = await api.get("positions")

    //         const responseDep = await api.get("departments")

    //         const responsePay = await api.get("payrolls")

    //         setEmployee(responseEmp.data)

    //         setPosition(responsePos.data)

    //         setDepartment(responseDep.data)

    //         setPayroll(responsePay.data)
            
    //     }
    //     fetch()
    // }, [])

    // Fetch Api Pararel resolve all
    useEffect(() => {
        async function fetchData() {
          try {
            const [responseEmp, responseDep, responsePos, responsePay] = await Promise.all([
              api.get("employees"),
              api.get("departments"),
              api.get("positions"),
              api.get("payrolls")
            ]);
      
            setEmployee(responseEmp.data);
            setDepartment(responseDep.data);
            setPosition(responsePos.data);
            setPayroll(responsePay.data);
          } catch (error) {
            console.error("Error fetching data:", error);
            // Optionally, you can set an error state variable or display an error message
          }
        }
      
        fetchData();
      }, []);

    //Fetch Api pararel individual not wait
    // useEffect(() => {
    //     async function fetch() {
    //         const response = await api.get("employees")
    //         // console.log(response.data)
            
    //         setEmployee(response.data)
    //     }
    //     fetch()
    // }, [])

    // useEffect(() => {
    //     async function fetch() {
    //         const response = await api.get("positions")
    //         // console.log(response.data)
            
    //         setPosition(response.data)
    //     }
    //     fetch()
    // }, [])

    // useEffect(() => {
    //     async function fetch() {
    //         const response = await api.get("departments")
    //         // console.log(response.data)
    //         setDepartment(response.data)
    //     }
    //     fetch()
    // }, [])

    // useEffect(() => {
    //     async function fetch() {
    //         const response = await api.get("payrolls")
    //         // console.log(response.data)
    //         setPayroll(response.data)
    //     }
    //     fetch()
    // }, [])

    return (
        <div className="home">
            <Sidebar/>
            <div className="homeContainer">
                <Navbar />
                {/* <div className="listContainer">
                    <div className="listTitle">Dashboard</div>
                        Bem vindo Admin
                </div> */}
                <div className="widgets">
                    <Widget type="employees" link="employees" dbData={employee}/>
                    <Widget type="positions" link="positions" dbData={position}/>
                    <Widget type="departments" link="departments" dbData={department}/>
                    <Widget type="payrolls" link="payrolls/output" dbData={payroll}/>
                </div>
                <div className="charts">
                    <Featured />
                    <Chart aspect={ 2 / 1} title="Total de Pagamentos (Mes)" dbData={payroll}/>
                </div>
            </div>
        </div>
    )
}

export default Home