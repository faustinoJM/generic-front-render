import "./login.scss"
import { useAuth } from "../../context/AuthContext"
import { Form } from "@unform/web"
import getValidateErrors from "../../utils/getValidationErrors"
import * as Yup from "yup"
import { Link, useNavigate } from "react-router-dom"
import React, { useCallback, useRef, useState} from "react"
import Input from "../../components/input/Input"
import logo from "../../assets/elint-color.png"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const Login = () => {
    const formRef = useRef(null);
    const [loginError, setLoginError] = useState(null);

    const navigate = useNavigate();
  
    const { signIn } = useAuth();
    // const { addToast } = useToast();
  
    const handleSubmit = useCallback(async (data) => {
      // console.log(data)
      formRef.current?.setErrors({});
  
      try {  
        const schema = Yup.object().shape({
          email: Yup.string().required('E-mail Obrigatorio').email("Digite um email valido"),
          password: Yup.string().required('Senha Obrigatoria')
        })
        
        await schema.validate(data, {
          abortEarly: false,
        })
  
         await signIn({
          email: data.email,
          password: data.password
        })
  
        navigate('/')
  
      } catch (err) {
        //  console.log({err})
        if(err instanceof Yup.ValidationError) {
          const errors = getValidateErrors(err)
          formRef.current?.setErrors(errors)  
  
          return;
        }
        //add toast msg
        console.log("ODs", err)
         setLoginError(true)
  
        // addToast({
        //   type: "error",
        //   title: "Erro na Autenticacao",
        //   description: "Ocorreu um erro ao fazer login, cheque as Credenciais"
        // })
      } 
    }, [signIn, navigate]) 


    return (
        <div className="login">
            <Link className="link" to="https://www.elint-systems.com/aboutus">
              Fale conosco
              <OpenInNewIcon />
              </Link>
            {/* <Link className="image" to="https://www.elint-systems.com">
              <div className="">
                <img src={logo} />
              </div>
            </Link> */}
            <div className="formContainer2">
            <div className="image2">
                <img src={logo} />
                Elint Payroll
              </div>
           
            <Form className="formContainer" ref={formRef} onSubmit={handleSubmit} >
                <div className="formInput">
                    <Input type="text" name="email" label="Usuario" loginError={loginError} />
                </div>
                <div className="formInput">
                    <Input type="password" name="password" label="Senha" loginError={loginError} />
                    {loginError && (<div className="error">Email or Password incorrect</div>)}
                </div>
                <button type="submnit">Login</button>
                <div className="register">
                  {/* <span>Esqueci senha <a href="home">Criar</a></span> */}
                  <span className="newAccount"><Link to="/register">Criar nova conta?</Link></span>
                </div>
            </Form>
            </div>
        </div>
    )
}

export default Login