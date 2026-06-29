import React from "react";
import axios from "axios";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Helmet from 'react-helmet';
import { login, setCdUsuario, setPerfis } from '../../services/auth';


import {
  FormControl,
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { useState } from "react";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
 
  width: ${props => props.theme.spacing(100)}px; 
  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(30)}px;
  }
  margin-top: ${props => props.theme.spacing(100)}px;
   
`;

const SignIn = () => {

  const [details, setDetails] = useState({ user: "", senha: "" });

  const history = useHistory();

  const handleLogin = async (user, senha) => {

    console.log(details);
    console.log(details.user)

    if (!details.user || !details.senha) {
     alert("FAVOR PREENCHER OS DADOS");
    } else {
      //192.168.8.22
      await axios.post(`http://192.168.4.28:5000/api/usuarios/login`, { user, senha })
        .then((response) => {
          console.log(response.data);
          login(response.data.token);
          setCdUsuario(response.data.usuario);
          setPerfis(response.data.perfis);

          if (response.status === 200) {
            history.push("/home");
          }
        })
        .catch((e) => {
          const { data } = e.response
          console.log(data);
          console.log(data.error);
          alert(data.error);

        });
    }
}

  return (
    <div>
      {/* {!details.user && <Alert severity="error">Favor Preencher o Usuário</Alert>} */}
      <Wrapper style={{ margin: "auto", marginTop: "5%" }}>
        <Helmet title="Sign In" />
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Fundação Altino Ventura
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          Entre para ter acesso ao portal Intranet
        </Typography>
        <form>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Usuário</InputLabel>
            <Input

              id="usuario"
              name="usuario"
              autoComplete="usuario"
              onChange={e => setDetails({ ...details, user: e.target.value })}
              autoFocus />
          </FormControl>

          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Senha</InputLabel>
            <Input

              name="senha"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={e => setDetails({ ...details, senha: e.target.value })}
            />
          </FormControl>
          <Button

            fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleLogin(details.user, details.senha)}
            mb={2}
          >
            Entrar
          </Button>
        </form>
      </Wrapper>
    </div>
  )
}


// <Alert severity="error">
// <AlertTitle>Error</AlertTitle>
// This is an error alert — <strong>check it out!</strong>
// </Alert>
// <Alert severity="warning">
// <AlertTitle>Warning</AlertTitle>
// This is a warning alert — <strong>check it out!</strong>
// </Alert>
// <Alert severity="info">
// <AlertTitle>Info</AlertTitle>
// This is an info alert — <strong>check it out!</strong>
// </Alert>
// <Alert severity="success">
// <AlertTitle>Success</AlertTitle>
// This is a success alert — <strong>check it out!</strong>
// </Alert>

export default SignIn;
