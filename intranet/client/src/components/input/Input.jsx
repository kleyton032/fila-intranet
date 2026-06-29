import React from "react";
import TextField from "@material-ui/core/TextField";
import InputMask from "react-input-mask";

const Input = (props) => {
  const { value, onChange, mask, id, label } = props;

  return (
    <InputMask value={value} onChange={onChange} mask={mask} maskChar={null}>
      {() => <TextField id={id} label={label} variant="outlined" fullWidth />}
    </InputMask>
  );
};

export default Input;
