export const verificaAcessoFilaEspera = () => {
  const isAuth = localStorage.getItem('token');
  const perfis = localStorage.getItem('perfis')
  if (!isAuth) {
    window.location.href = "/"
  }
  if (!perfis.includes(1)) {
    console.log(isAuth);
    alert("Você não tem acesso a essa Página");
    window.location.href = "/home"
  }
}
export const verificarAcessoAtendimento = () => {
  const isAuth = localStorage.getItem('token');
  const perfis = localStorage.getItem('perfis')
  if (!isAuth) {
    window.location.href = "/"
  }
  if (!perfis.includes(6)) {
    console.log(isAuth);
    alert("Você não tem acesso a essa Página");
    window.location.href = "/home"
  }
}

export const verificarAcessoArquivo = () => {
  const isAuth = localStorage.getItem('token');
  const perfis = localStorage.getItem('perfis')
  if (!isAuth) {
    window.location.href = "/"
  }
  if (!perfis.includes(5)) {
    console.log(isAuth);
    alert("Você não tem acesso a essa Página");
    window.location.href = "/home"
  }
}
