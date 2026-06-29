import * as types from "../constants";

const initialState = {
  empresa: [],
  itemAgendamento: [],
  itemRetorno: [],
  cidade: [],
  registro: [],
  origem: [],
  itemAgendamentoCer: [],
  itensRetina: [],
  prestador: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_LIST_EMPRESA:
      return {
        ...state,
        empresa: action.payload,
      };
    case types.GET_LIST_ITEM_AGENDAMENTO:
      return {
        ...state,
        itemAgendamento: action.payload,
      };
    case types.GET_LIST_ITEM_RETORNO:
      return {
        ...state,
        itemRetorno: action.payload,
      };
    case types.GET_LIST_CIDADE:
      return {
        ...state,
        cidade: action.payload,
      };
    case types.GET_LIST_REGISTRO:
      return{
        ...state,
        registro: action.payload
      }
    case types.GET_LIST_ORGIEM: {
      return {
        ...state,
        origem: action.payload
      }
    }
    case types.GET_LIST_ITEM_CERIV:{
      return {
        ...state,
        itemAgendamentoCer: action.payload
      }
    }
    case types.GET_LIST_ITENS_RETINA:{
      return {
        ...state,
        itensRetina: action.payload
      }
    }
    case types.GET_LIST_PRESTADOR:{
      return {
        ...state,
        prestador: action.payload
      }
    }  

    default:
      return state;
  }
}
