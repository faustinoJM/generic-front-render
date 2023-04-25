import "./chart.scss";
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";


const months = {
    "Janeiro": "Jan",
    "Fevereiro": "Fev",
    "Marco": "Mar",
    "Abril": "Abr",
    "Maio": "Mai",
    "Junho": "Jun",
    "Julho": "Jul",
    "Agosto": "Ago",
    "Setembro": "Set",
    "Outubro": "Out",
    "Novembro": "Nov",
    "Dezembro": "Dez"
};
  
const Chart = ({ aspect, title, dbData }) => {
    const [data, setData] = useState([])
    const formatSalary = new Intl.NumberFormat("de-DE", {maximumFractionDigits: 2, minimumFractionDigits: 2})

    let chartData = [
        { name: "Jan", Total: 0 },
        { name: "Fev", Total: 0 },
        { name: "Mar", Total: 0 },
        { name: "Abr", Total: 0 },
        { name: "Mai", Total: 0 },
        { name: "Jun", Total: 0 },
        { name: "Jul", Total: 0 },
        { name: "Ago", Total: 0 },
        { name: "Set", Total: 0 },
        { name: "Out", Total: 0 },
        { name: "Nov", Total: 0 },
        { name: "Dez", Total: 0 },
    ]
   
    useEffect(() => {
        dbData && dbData.forEach((payroll) => {
            const month = months[payroll.month];
            console.log("150",dbData)
            const data = chartData.find(data => data.name === month)
            if (data)
                data.Total += payroll.total_income;
        })
        
        setData(chartData)
        console.log(dbData)

    }, [dbData])
    return (
        <div className="chart">
            <div className="title">{title}</div>
           <ResponsiveContainer width="100%" aspect={aspect}>
                <AreaChart width={730} height={250} data={data}
                    margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                    <defs>
                        <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="gray" />
                    <CartesianGrid strokeDasharray="3 3" className="chartGrid"/>
                    <Tooltip />
                    <Area type="monotone" dataKey="Total" stroke="#8884d8" fillOpacity={1} fill="url(#total)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Chart;


// const data = [
//     { name: "Jan", Total: 1200 },
//     { name: "Fev", Total: 2100 },
//     { name: "Mar", Total: 800 },
//     { name: "Abr", Total: 1600 },
//     { name: "Mai", Total: 900 },
//     { name: "Jun", Total: 2000 },
//     { name: "Jul", Total: 1000 },
//     { name: "Ago", Total: 1700 },
//     { name: "Set", Total: 1500 },
//     { name: "Out", Total: 1200 },
//     { name: "Nov", Total: 3700 },
//     { name: "Dez", Total: 1900 },
//   ];


// const Chart = ({ aspect, title }) => {
//     return (
//         <div className="chart">
//             <div className="title">{title}</div>
//            <ResponsiveContainer width="100%" aspect={aspect}>
//                 <AreaChart width={730} height={250} data={data}
//                     margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                     <defs>
//                         <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
//                         <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
//                         </linearGradient>
//                     </defs>
//                     <XAxis dataKey="name" stroke="gray" />
//                     <CartesianGrid strokeDasharray="3 3" className="chartGrid"/>
//                     <Tooltip />
//                     <Area type="monotone" dataKey="Total" stroke="#8884d8" fillOpacity={1} fill="url(#total)" />
//                 </AreaChart>
//             </ResponsiveContainer>
//         </div>
//     )
// }


// useEffect(() => {
//     dbData && dbData.map((payroll) => {
//         if (payroll.month === "Janeiro")
//             chartData.map(data => {
//                 if (data.name === "Jan")
//                 data.Total = data.Total + payroll.total_income
//             })
//         if (payroll.month === "Fevereiro")
//             chartData.map(data => {
//                 if (data.name === "Fev")
//                 data.Total = data.Total + payroll.total_income
//             })
//         if (payroll.month === "Marco")
//             chartData.map(data => {
//                 if (data.name === "Mar")
//                 data.Total = data.Total + payroll.total_income
//             })
//         if (payroll.month === "Abril")
//             chartData.map(data => {
//                 if (data.name === "Abr")
//                 data.Total = data.Total + payroll.total_income
//             })
//         if (payroll.month === "Maio")
//             chartData.map(data => {
//                 if (data.name === "Mai")
//                 data.Total = data.Total + payroll.total_income
//             })
//         if (payroll.month === "Junho")
//             chartData.map(data => {
//                 if (data.name === "Jun")
//                 data.Total = data.Total + payroll.total_income
//             })
//         if (payroll.month === "Julho")
//         chartData.map(data => {
//             if (data.name === "Jul")
//             data.Total = data.Total + payroll.total_income
//         })
//         if (payroll.month === "Ago")
//             chartData.map(data => {
//                 if (data.name === "Ago")
//                 data.Total = data.Total + payroll.total_income
//             })
//         if (payroll.month === "Setembro")
//             chartData.map(data => {
//                 if (data.name === "Set")
//                 data.Total = data.Total + payroll.total_income
//             })
//         if (payroll.month === "Outubro")
//             chartData.map(data => {
//                 if (data.name === "Out")
//                 data.Total = data.Total + payroll.total_income
//             })
//         if (payroll.month === "Novembro")
//             chartData.map(data => {
//                 if (data.name === "Nov")
//                 data.Total = data.Total + payroll.total_income
//             })
//         if (payroll.month === "Dezembro")
//             chartData.map(data => {
//                 if (data.name === "Dez")
//                 data.Total = data.Total + payroll.total_income
//             })
//     })
    
//     setData(chartData)
//     console.log(dbData)

// }, [dbData])