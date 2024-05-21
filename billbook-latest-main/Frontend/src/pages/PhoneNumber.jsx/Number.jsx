import React, { useState } from "react";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import {  isValidPhoneNumber  } from 'react-phone-number-input';

const Number = () => {
    const [value, setValue] = useState(); 
    const number = value ? value.toString() : "";
    console.log("value", value);
    console.log("number", number);
    //const validateNum = value ? isPossiblePhoneNumber(number) : false;
    const validateNum = value ? isValidPhoneNumber(number) : false;
    
    console.log("validateNum", validateNum);

    return (
        <>
          <h1>Number Input</h1>
          <PhoneInput
            international
            defaultCountry="US"
            value={value}
            onChange={setValue}
          />
        </>
    );
};

export default Number;
