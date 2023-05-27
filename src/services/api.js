import axios from "axios"
import { url } from "../context/AuthContext";


// console.log(url)
const api = axios.create({
  baseURL: "https://generic-render-production.up.railway.app" //"http://localhost:3333"  //"https://outrageous-slug-windbreaker.cyclic.app"
})

export let api2 = axios.create({
  baseURL: "http://localhost:3333"
})

// if (true){
// const api = axios.create({
//   baseURL: "http://192.168.1.112:3333" //'http://localhost:3333'
// })}

//https://poised-pants-dove.cyclic.app

//https://generic-render-production.up.railway.app


// const api = axios.create({
//   baseURL: "http://192.168.1.112:3333" //'http://localhost:3333'
// })

export default api;

//"https://quaint-jewelry-elk.cyclic.app" 

//user: mailto:carlos@mozfib.biz
//user: mailto:admin@mozfib.biz
// admin@ifmoz.biz
// user: isra@123.com