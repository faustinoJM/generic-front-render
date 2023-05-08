import  * as C from "@chakra-ui/react"



const Step = ({ index, active }) => {
    function returnName (index) {
        if (index === 1)
            return "Dados usuario"
        if (index === 2)
            return "Dados Empresa"
        if (index === 3)
            return "Endereco"
    }
    return (
        <C.Center>
            <C.Box
            py={1}
            px={4}
            borderRadius={2}
            bg={active ? "sidebar_color.500" : "gray.300"}
            color={active ? "white" : "blackAlpha"}
            style={{scale: active ? "1.2" : "none"}}
            >
            {/* {index} */}
            {returnName(index)}
            </C.Box>
        </C.Center>
    )
}

export default Step