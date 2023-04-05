import React, { useEffect } from 'react';
import { useRef } from 'react';
import { useField } from '@unform/core';
import "./input.scss"

const Input = ({ name, label, loginError,...props }) => {
    const inputRef = useRef(null)

  
    const { fieldName, defaultValue, registerField, error} = useField(name);
  
    useEffect(() => {
      registerField({
        name: fieldName,
        ref: inputRef.current,
        path: 'value'
      })
    }, [fieldName, registerField])


    return (
        <>
            <label>{label}</label>
            <input ref={inputRef} {...props}/>
            {error && (<div className="error">{error}</div>)}
            {/* {loginError && (<div className="error">Email or Password incorrect</div>)} */}
            {console.log(loginError)}
        </>
    )
}


export default Input;