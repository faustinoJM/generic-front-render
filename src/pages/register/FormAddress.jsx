import { Input, VStack,} from "@chakra-ui/react"

const FormAddress = ({step2, setStep2, values, handleChange, handleBlur}) => {
    return (
        <VStack spacing={5} h={200}>
            <Input type="text" placeholder="Provincia" borderColor="blue.700" 
                id="company_province" value={values.company_province} onChange={handleChange} onBlur={handleBlur} />
            <Input type="text" placeholder="Cidade" borderColor="blue.700"
                id="company_city" value={values.company_city} onChange={handleChange} onBlur={handleBlur} />
            <Input type="text" placeholder="Endereco" borderColor="blue.700"
                id="company_address" value={values.company_address} onChange={handleChange} onBlur={handleBlur} />
        </VStack>
    )
}

export default FormAddress