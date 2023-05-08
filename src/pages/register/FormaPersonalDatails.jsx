// import * as C from "@chakra-ui/react"
import { Input, VStack,} from "@chakra-ui/react"


const FormPersonalData = ({step3, setStep3, values, handleChange, handleBlur}) => {
    return (
        <VStack spacing={5} h={200}>
            <Input type="text" placeholder="Nome da Empresa" borderColor="blue.700"
                id="company_name" value={values.company_name} onChange={handleChange} onBlur={handleBlur} />
            <Input type="text" placeholder="E-mail da Empresa" borderColor="blue.700"
                id="company_email" value={values.company_email} onChange={handleChange} onBlur={handleBlur} />
            <Input type="text" placeholder="NUIT da Empresa" borderColor="blue.700"
                id="company_nuit" value={values.company_nuit} onChange={handleChange} onBlur={handleBlur} />
            <Input type="text" placeholder="Contacto" borderColor="blue.700"
                id="company_contact" value={values.company_contact} onChange={handleChange} onBlur={handleBlur} />


        </VStack>
    )
}

export default FormPersonalData