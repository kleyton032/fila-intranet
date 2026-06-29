import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { convertDate } from "../utils/dates";

const DashboardContext = createContext();

const DashboardProvider = ({ children }) => {
  const [dashboard, setDashboard] = useState({});

  const [listas, setListas] = useState({
    empresas: [],
    setores: [],
    cirurgia: [],
    prestador: [],
    lente: [],
    cidade: [],
  });

  const [dashboardEmergencia, setDashboardEmergencia] = useState({
    relatorioClassificacao: {
      filtros: {
        dataInicio: convertDate(new Date()),
        dataFim: convertDate(new Date()),
      },
      data: [],
      loading: false,
    },
    relatorioEvasoes: {
      filtros: {
        dataInicio: convertDate(new Date()),
        dataFim: convertDate(new Date()),
      },
      data: [],
      loading: false,
    },
  });

  const [dashboardAtendimentos, setDashboardAtendimentos] = useState({
    filtros: {
      dataInicio: convertDate(new Date()),
      dataFim: convertDate(new Date()),
      empresas: [],
      setores: [],
    },
    data: [],
    loading: false,
  });

  const [dashboardBlocoCirurgico, setDashboardBlocoCirurgico] = useState({
    filtros: {
      dataInicio: convertDate(new Date()),
      dataFim: convertDate(new Date()),
      cirurgia: [],
    },
    data: [],
    loading: false,
  });

  const [dashboardCovid19, setDashboardCovid19] = useState({
    filtros: {
      dataInicio: convertDate(new Date()),
      dataFim: convertDate(new Date()),
      cirurgias: [],
    },
    data: [],
    loading: false,
  });

  const [dashboardMarcacao, setDashboardMarcacao] = useState({
    filtros: {
      dataInicio: convertDate(new Date()),
      dataFim: convertDate(new Date()),
      dataExameInicio: null,
      dataExameFIm: null,
      idadeMin: null,
      idadeMax: null,
      medicoSolicitante: [],
      medicoCirurgia: [],
      cirurgia: [],
      cidade: [],
      lente: [],
      ret: "",
    },
    data: [],
    loading: false,
  });

  return (
    <DashboardContext.Provider
      value={{
        dashboard,
        setDashboard,
        listas,
        setListas,
        dashboardEmergencia,
        setDashboardEmergencia,
        dashboardAtendimentos,
        setDashboardAtendimentos,
        dashboardBlocoCirurgico,
        setDashboardBlocoCirurgico,
        dashboardCovid19,
        setDashboardCovid19,
        dashboardMarcacao,
        setDashboardMarcacao,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const { dashboard, setDashboard, listas, setListas } = useContext(
    DashboardContext
  );
  const { isFiltrosExpanded } = dashboard;

  const handleFiltrosExpanded = () => {
    setDashboard({ ...dashboard, isFiltrosExpanded: !isFiltrosExpanded });
  };

  const getListas = async (lista) => {
    if (listas[lista].length === 0) {
      let result = await axios.get(`/api/${lista}/listar`);

      const listasState = { ...listas, [lista]: result.data };
      setListas(listasState);
    }
  };

  return {
    isFiltrosExpanded,
    handleFiltrosExpanded,
    listas,
    getListas,
  };
};

export const useDashboardEmergencia = () => {
  const { dashboardEmergencia, setDashboardEmergencia } = useContext(
    DashboardContext
  );
  const { relatorioClassificacao, relatorioEvasoes } = dashboardEmergencia;

  const loadRelatorioClassificacao = async () => {
    setDashboardEmergencia({
      ...dashboardEmergencia,
      relatorioClassificacao: { ...relatorioClassificacao, loading: true },
    });

    const params = {
      dataInicio: relatorioClassificacao.filtros.dataInicio,
      dataFim: relatorioClassificacao.filtros.dataFim,
    };

    let result = await axios.get(
      "http://192.168.4.28:5000/api/atendimentos/relatorios/por-classificacao",
      {
        params: params,
      }
    );

    result.status === 200
      ? setDashboardEmergencia({
          ...dashboardEmergencia,
          relatorioClassificacao: {
            ...relatorioClassificacao,
            data: result.data,
            loading: false,
          },
        })
      : setDashboardEmergencia({
          ...dashboardEmergencia,
          relatorioClassificacao: {
            ...relatorioClassificacao,
            data: result.data,
            loading: false,
          },
        });
  };

  const loadRelatorioEvasoes = async () => {
    setDashboardEmergencia({
      ...dashboardEmergencia,
      relatorioEvasoes: { ...relatorioEvasoes, loading: true },
    });

    const filtros = relatorioEvasoes.filtros;

    const params = {
      ...filtros,
    };

    let result = await axios.get("http://192.168.8.22:4000/api/atendimentos/relatorios/evasoes", {
      params: params,
    });

    result.status === 200
      ? setDashboardEmergencia({
          ...dashboardEmergencia,
          relatorioEvasoes: {
            ...relatorioEvasoes,
            data: result.data,
            loading: false,
          },
        })
      : setDashboardEmergencia({
          ...dashboardEmergencia,
          relatorioEvasoes: {
            ...relatorioEvasoes,
            data: [],
            loading: false,
          },
        });
  };

  const setFiltros = async (objectName, filtroName, value) => {
    await setDashboardEmergencia({
      ...dashboardEmergencia,
      [objectName]: {
        ...[objectName],
        filtros: {
          ...dashboardEmergencia[objectName].filtros,
          [filtroName]: value,
        },
      },
      // [objectName]: { ...[objectName], [filtroName]: value },
    });

    console.log(dashboardEmergencia);
  };

  return {
    relatorioClassificacao,
    loadRelatorioClassificacao,
    relatorioEvasoes,
    loadRelatorioEvasoes,
    setFiltros,
  };
};

export const useDashboardAtendimentos = () => {
  const { dashboardAtendimentos, setDashboardAtendimentos } = useContext(DashboardContext);
  
  const { data, loading, filtros } = dashboardAtendimentos;

  const loadDataAtendimentosPorHora = async () => {
    setDashboardAtendimentos({ ...dashboardAtendimentos, loading: true });

    const params = {
      dataInicio: filtros.dataInicio,
      dataFim: filtros.dataFim,
    };

    if (filtros.empresas.length > 0) {
      params.empresas = filtros.empresas.map((value) => {
        return value.id;
      });
    }

    if (filtros.setores.length > 0) {
      params.setores = filtros.setores.map((value) => {
        return value.id;
      });
    }

    let result = await axios.get("http://192.168.4.28:5000/api/atendimentos/relatorios/por-hora", {
      params: params,
    });

    result.status === 200
      ? setDashboardAtendimentos({
          ...dashboardAtendimentos,
          data: result.data,
          loading: false,
        })
      : setDashboardAtendimentos({
          ...dashboardAtendimentos,
          data: [],
          loading: false,
        });
  };

  const setFiltros = (filtroName, value) => {
    setDashboardAtendimentos({
      ...dashboardAtendimentos,
      filtros: { ...filtros, [filtroName]: value },
    });
  };

  return {
    filtros,
    data,
    loadDataAtendimentosPorHora,
    loading,
    setFiltros,
  };
};

export const useDashboardBlocoCirurgico = () => {
  const { dashboardBlocoCirurgico, setDashboardBlocoCirurgico } = useContext(
    DashboardContext
  );
  const { data, loading, filtros } = dashboardBlocoCirurgico;

  const loadDataCirurgiasRealizadas = async () => {
    setDashboardBlocoCirurgico({ ...dashboardBlocoCirurgico, loading: true });

    const params = {
      dataInicio: filtros.dataInicio,
      dataFim: filtros.dataFim,
    };

    if (filtros.cirurgia.length > 0) {
      params.cirurgia = filtros.cirurgia.map((value) => {
        return value.id;
      });
    }

    let result = await axios.get("http://192.168.4.28:5000/api/cirurgia/relatorios/sintetico", {
      params: params,
    });

    result.status === 200
      ? setDashboardBlocoCirurgico({
          ...dashboardBlocoCirurgico,
          data: result.data,
          loading: false,
        })
      : setDashboardBlocoCirurgico({
          ...dashboardBlocoCirurgico,
          data: [],
          loading: false,
        });
  };

  const setFiltros = (filtroName, value) => {
    setDashboardBlocoCirurgico({
      ...dashboardBlocoCirurgico,
      filtros: { ...filtros, [filtroName]: value },
    });
  };

  return {
    filtros,
    data,
    loadDataCirurgiasRealizadas,
    loading,
    setFiltros,
  };
};

export const useDashboardCovid19 = () => {
  const { dashboardCovid19, setDashboardCovid19 } = useContext(
    DashboardContext
  );
  const { data, loading, filtros } = dashboardCovid19;

  const loadDataCasosSuspeitos = async () => {
    setDashboardCovid19({ ...dashboardCovid19, loading: true });

    const params = {
      dataInicio: filtros.dataInicio,
      dataFim: filtros.dataFim,
    };

    let result = await axios.get("http://192.168.4.28:5000/api/atendimentos/relatorios/covid19/casos", {
      params: params,
    });

    result.status === 200
      ? setDashboardCovid19({
          ...dashboardCovid19,
          data: result.data,
          loading: false,
        })
      : setDashboardCovid19({
          ...dashboardCovid19,
          data: [],
          loading: false,
        });
  };

  const setFiltros = (filtroName, value) => {
    setDashboardCovid19({
      ...dashboardCovid19,
      filtros: { ...filtros, [filtroName]: value },
    });
  };

  return {
    filtros,
    data,
    loadDataCasosSuspeitos,
    loading,
    setFiltros,
  };
};

export const useDashboardMarcacao = () => {
  const { dashboardMarcacao, setDashboardMarcacao } = useContext(
    DashboardContext
  );
  const { data, loading, filtros } = dashboardMarcacao;

  const loadDataPreAgendamento = async () => {
    setDashboardMarcacao({ ...dashboardMarcacao, loading: true });

    const params = {
      ...filtros,
    };

    if (filtros.medicoSolicitante.length > 0) {
      params.medicoSolicitante = filtros.medicoSolicitante.map((value) => {
        return value.id;
      });
    } else {
      delete params.medicoSolicitante;
    }

    if (filtros.medicoCirurgia.length > 0) {
      params.medicoCirurgia = filtros.medicoCirurgia.map((value) => {
        return value.id;
      });
    } else {
      delete params.medicoCirurgia;
    }

    if (filtros.cirurgia.length > 0) {
      params.cirurgia = filtros.cirurgia.map((value) => {
        return value.id;
      });
    } else {
      delete params.cirurgia;
    }

    if (filtros.cidade.length > 0) {
      params.cidade = filtros.cidade.map((value) => {
        return value.id;
      });
    } else {
      delete params.cidade;
    }

    if (filtros.lente.length > 0) {
      params.lente = filtros.lente.map((value) => {
        return value.id;
      });
    } else {
      delete params.lente;
    }

    let result = await axios.get(
      "http://192.168.4.28:5000/api/marcacao/relatorios/pre-agendamento-cirurgico",
      {
        params: params,
      }
    );

    result.status === 200
      ? setDashboardMarcacao({
          ...dashboardMarcacao,
          data: result.data,
          loading: false,
        })
      : setDashboardMarcacao({
          ...dashboardMarcacao,
          data: [],
          loading: false,
        });
  };

  const setFiltros = (filtroName, value) => {
    setDashboardMarcacao({
      ...dashboardMarcacao,
      filtros: { ...filtros, [filtroName]: value },
    });
  };

  return {
    filtros,
    data,
    loadDataPreAgendamento,
    loading,
    setFiltros,
  };
};

export default DashboardProvider;
