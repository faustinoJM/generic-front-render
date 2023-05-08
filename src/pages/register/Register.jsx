import { Box, Button, Center, Flex, HStack, Divider, FormControl} from "@chakra-ui/react"
// import * as C from "@chakra-ui/react"
import { useState } from "react"
import Step from "./Step";
import FormAccount from "./FormAccount";
import FormPersonalData from "./FormaPersonalDatails";
import FormAddress from "./FormAddress";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
    const [step, setStep] = useState(1)
    const [step2, setStep2] = useState()
    const [step3, setStep3] = useState()
    const navigate = useNavigate()

    const { signIn } = useAuth();



    const onSubmit = async (values, actions) => {
        console.log(values)
        console.log(actions)
        console.log("submit")
        // actions.resetForm()
        const response = await api.post('company/user-company', values)
        
        if (response.status === 201) {
            Swal.fire(
                'Sucesso!',
                'Conta criada com sucesso!',
                'success'
            )
        await signIn({
            email: values.email,
            password: values.password
        })
        navigate("/")
        actions.resetForm()
        } else {
            console.log("erro")
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Oops...',
            //     text: 'Something went wrong!',
            //     footer: '<a href="">Why do I have this issue?</a>'
            // })
        }

     }

     const schema = Yup.object().shape({
        name: Yup.string().required('Nome Obrigatorio'),
        email: Yup.string().required("Descricao obrigatorio"),

    })
    const { values, errors, handleChange, touched, isSubmitting, handleBlur, handleSubmit} = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            company_province: "",
            company_city: "",
            company_address: "",
            company_name: "",
            company_email: "",
            company_nuit: "",
            company_contact: "",
        },
        validationSchema: schema,
        onSubmit 
    })

    const getCompStep = (values, handleChange, handleBlur) => {
        switch (step) {
            case 1:
                return <FormAccount values={values} handleChange={handleChange} handleBlur={handleBlur}/>
            case 2:
                return <FormPersonalData step3={step3} setStep3={setStep3} 
                    values={values} handleChange={handleChange} handleBlur={handleBlur}/>
            case 3: 
                return <FormAddress step2={step2} setStep2={setStep2} 
                    values={values} handleChange={handleChange} handleBlur={handleBlur}/>
            default: 
                return <FormAccount />
        }
    }

    const handleOnclick = () => {
        step < 3 && setStep(step + 1)
        if (step === 3)
            handleSubmit()
        if (errors) 
        console.log(errors)
        // Swal.fire({
        //     icon: 'error',
        //     title: 'Oops...',
        //     text: 'Something went wrong!',
        //     footer: '<a href="">Why do I have this issue?</a>'
        //   })
          
        //  onSubmit()
    }

    const Steps = [1, 2, 3];

    return (
       <Flex h="100vh" align="center" justify="center">
            <Center boxShadow='dark-lg' p='6' rounded='md' bg='white' height={400} maxW={500} w="100%" py={10} px={2} flexDir="column">
                <HStack spacing={4}>
                    {Steps.map(item => (
                        <Step key={item} index={item} active={step === item} />
                    ))}
                </HStack>
                <Divider my={4} borderColor={"blackAlpha.700"}/>
                <FormControl onSubmit={handleSubmit} w="80%" >{getCompStep(values, handleChange, handleBlur)}</FormControl>
                <HStack spacing={10} mt={4}>
                    <Button 
                        bg="gray.300" 
                        onClick={() => step > 1 && setStep(step - 1)}
                        disabled={step === 1}
                        >
                         Voltar
                    </Button>
                    <Button 
                        colorScheme="sidebar_color"
                        onClick={() => handleOnclick()}
                        >
                         {step === 3 ? "Enviar" : "Proximo"}
                    </Button>
                </HStack>
            </Center>
       </Flex>
    )
}

export default Register