import React from "react";
import "../App.css";
const FormErrMsg = ({ errors, inputName }) => {
  return <span className="errorMessage">{errors[inputName]?.message}</span>;
};

export default FormErrMsg;
