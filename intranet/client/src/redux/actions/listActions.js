import * as types from "../constants";
import Axios from "axios";

export function getSuccess(type, value) {
  return {
    type: type,
    payload: value,
  };
}

export function getListUser() {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`http://192.168.4.28:5000/api/usuarios/listUsers`);
      dispatch(getSuccess(types.GET_LIST_USER, res.data));
    } catch (err) {
      throw err;
    }
  };
}


export function getListEmpresa() {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`http://192.168.4.28:5000/api/empresas/listar`);
      dispatch(getSuccess(types.GET_LIST_EMPRESA, res.data));
    } catch (err) {
      throw err;
    }
  };
}

export function getListItemAgendamento() {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`http://192.168.4.28:5000/api/item_agendamento/listar`);
      dispatch(getSuccess(types.GET_LIST_ITEM_AGENDAMENTO, res.data));
    } catch (err) {
      throw err;
    }
  };
};

export function getListItemRetorno() {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`http://192.168.4.28:5000/api/item_agendamento/listar`);
      dispatch(getSuccess(types.GET_LIST_ITEM_RETORNO, res.data));
    } catch (err) {
      throw err;
    }
  };
};

export function getListCidade() {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`http://192.168.4.28:5000/api/cidade/listar`);
      dispatch(getSuccess(types.GET_LIST_CIDADE, res.data));
    } catch (err) {
      throw err;
    }
  };
};


export function getListRegistro() {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`http://192.168.4.28:5000/api/contato/getRegistro`);
      dispatch(getSuccess(types.GET_LIST_REGISTRO, res.data));
    } catch (err) {
      throw err;
    }
  }
};


export function getListOrigem() {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`http://192.168.4.28:5000/api/fila_espera/origens/listar`);
      dispatch(getSuccess(types.GET_LIST_ORGIEM, res.data));
    } catch (err) {
      throw err;
    }
  };
};


export function getListItemCer() {
  return async (dispatch) => {
    try {
      const res = await Axios.get(`http://192.168.4.28:5000/api/fila_espera/itens_cer/listar`);
      dispatch(getSuccess(types.GET_LIST_ITEM_CERIV, res.data));
    } catch (err) {
      throw err;
    }
  }
};

  export function getListItensRetina() {
    return async (dispatch) => {
      try {
        const res = await Axios.get(`http://192.168.4.28:5000/api/portalRetina/itens_retina/listar`);
        dispatch(getSuccess(types.GET_LIST_ITENS_RETINA, res.data));
      } catch (err) {
        throw err;
      }
    }
  };

  export function getListPrestador() {
    return async (dispatch) => {
      try {
        const res = await Axios.get(`http://192.168.4.28:5000/api/prestador/listar`);
        dispatch(getSuccess(types.GET_LIST_PRESTADOR, res.data));
      } catch (err) {
        throw err;
      }
    }
  };