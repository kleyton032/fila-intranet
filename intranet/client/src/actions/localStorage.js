export const saveToken = (usuario) => {
    if (!usuario.token) return null;
    const [token1, token2, token3] = usuario.token.split('.');
    localStorage.setItem("token1", token1)
    localStorage.setItem("token2", token2)
    localStorage.setItem("token3", token3)
}

export const getToken = () => {
    const token1 = localStorage.getItem("token1");
    const token2 = localStorage.getItem("token2");
    const token3 = localStorage.getItem("token3");
    if (!token1 || !token2 || !token3) return null;
    return `${token1}.${token2}.${token3}`;
}

export const getHeader = () => {
    return {
        "headers": {
            "authorization": `Bearer ${getToken()}`
        }
    }
}