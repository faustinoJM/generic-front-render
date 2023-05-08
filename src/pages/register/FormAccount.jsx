import { Input, VStack,} from "@chakra-ui/react"
import { useEffect } from "react"
import { useState } from "react"

const FormAccount = ({values, handleChange, handleBlur}) => {
    const [emal, setEma] = useState("")
    
    useEffect(() => {
        console.log(emal)
    }, [emal])
    
    return (
        <VStack spacing={5} h={200}>
            <Input type="name"  placeholder="Nome" borderColor="blue.700" 
            id="name" value={values.name} onChange={handleChange} onBlur={handleBlur}/>
            <Input type="email" placeholder="E-mail" borderColor="blue.700" 
            id="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
            {/* <Input type="email" placeholder="Confirme seu E-mail" borderColor="blue.700"/> */}
            <Input type="password" placeholder="Senha" borderColor="blue.700"
            id="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
        </VStack>
    )
}

export default FormAccount