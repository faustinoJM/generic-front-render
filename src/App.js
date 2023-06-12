import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext";
import Routers from "./routes";
import { QueryClient, QueryClientProvider } from "react-query";
import "./theme/dark.scss"


const queryClient = new QueryClient()

function App() {
 
  return (
    <div className="App dark">
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
