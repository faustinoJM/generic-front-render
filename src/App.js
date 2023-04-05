import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import NewEmployee from "./pages/new/NewEmployee";
import NewDepartment from "./pages/new/NewDepartment"
import NewPosition from "./pages/new/NewPosition";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { productInputs, productInputs1, userInputs } from "./formSource";
import Setting from "./pages/settings/Setting";
import { AuthProvider } from "./context/AuthContext";
import SingleEmployee from "./pages/single/SingleEmployee";
import ListPosition from "./pages/list/ListPosition";
import ListDepartment from "./pages/list/ListDepartment";
import ListPayroll from "./pages/list/ListPayroll";
import ListEmployee from "./pages/list/ListEmployee";
import NewPayroll from "./pages/new/NewPayroll";
import Routers from "./routes";
import RequireAuth from "./routes/RequireAuth";
import { QueryClient, QueryClientProvider } from "react-query";


const queryClient = new QueryClient()

function App() {
 
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routers />
          </AuthProvider>    
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
