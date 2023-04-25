import { useRef } from "react"
import { useReactToPrint } from "react-to-print";
import { mock } from "../../assets/mockData";

export const PrintButton = (componentRef) => {
    // const data = mock
    // const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'emp-data',
        onAfterPrint: () => alert('Print sucess')
    })

    return handlePrint
}