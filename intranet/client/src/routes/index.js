import React from "react";
import async from "../components/Async";

import {
  Home as HomeIcon,
  ExternalLink as ExternalLinkIcon,
  Sliders as DashboardIcon,
  List as ListIcon,
} from "react-feather";

const Home = async(() => import("../pages/Home"));

const BlocoCirurgicoDashboard = async(() =>
  import("../pages/dashboards/BlocoCirurgico")
);

const Covid19Dashboard = async(() => import("../pages/dashboards/Covid19"));

const AtendimentoDashboard = async(() =>
  import("../pages/dashboards/Atendimento")
);

const MarcacaoDashboard = async(() => import("../pages/dashboards/Marcacao"));

const EmergenciaDashboard = async(() =>
  import("../pages/dashboards/Emergencia")
);

const PortalVer = async(() => import("../pages/ver/Ver"))

const PortalDP = async(
  // eslint-disable-next-line
  () => (
    window.open("http://portaldpfav/", "_blank"), import("../pages/Home"))
);

const FilaEspera = async(
  () => (
    // eslint-disable-next-line
    window.open("http://192.168.250.30:8090/secreataria_novo/", "_blank"),
    import("../pages/Home")
  )
);

const Census = async(
  () => (
    // eslint-disable-next-line
    window.open("http://192.168.250.30:8090/census/", "_blank"),
    import("../pages/Home")
  )
);

const NovoCensus = async(
  () => (
    // eslint-disable-next-line
    window.open("http://192.168.250.30:8090/novo_census/", "_blank"),
    import("../pages/Home")
  )
);

const PortalMV = async(
  () => (
    // eslint-disable-next-line
    window.open("http://192.168.8.2:8084/portal", "_blank"),
    import("../pages/Home")
  )
);

const Webmail = async(
  () => (
    // eslint-disable-next-line
    window.open("http://webmail.doefav.com", "_blank"), import("../pages/Home")
  )
);

const FilaConsultas = async(() => import("../pages/FilaEspera/Consultas"));
const PreAgendCirurgico = async(() => import("../pages/Cirurgia/FilaCirurgica"));
const FilaCerIv = async(()=> import("../pages/FilaEsperaCerIV/ConsultaExames"));
const PortalRetina = async(()=> import("../pages/Retina/portaRetina"));
const Arquivo = async(()=> import("../pages/Arquivo/GetImages"));

const mainRoutes = {
  id: "Início",
  path: "/home",
  header: "",
  icon: <HomeIcon />,
  containsHome: false,
  component: Home
};

const dashboardRoutes = {
  id: "Dashboards",
  path: "/dashboards",
  icon: <DashboardIcon />,
  children: [
    {
      path: "/dashboards/PortaRetina",
      name: "Portal Retina",
      component: PortalRetina,
      
    },
    {
      path: "/dashboards/Atendimento",
      name: "Atendimento",
      component: AtendimentoDashboard,
    },
    {
      path: "/dashboards/BlocoCirurgico",
      name: "Bloco Cirúrgico",
      component: BlocoCirurgicoDashboard,
    },
    {
      path: "/dashboards/Covid19",
      name: "Covid 19",
      component: Covid19Dashboard,
    },
    {
      path: "/dashboards/Emergencia",
      name: "Emergência",
      component: EmergenciaDashboard,
    },
    {
      path: "/dashboards/Marcacao",
      name: "Marcação",
      component: MarcacaoDashboard,
    },
  ],
};

const filaEsperaRoutes = {
  id: "Fila de Espera",
  path: "/filaEspera",
  icon: <ListIcon />,
  children: [
    {
      path: "/filaEspera/consultas",
      name: "Fila Consultas/Exames",
      component: FilaConsultas,
    },
    {
      path: "/cirurgia/preAgendamento",
      name: "Fila Cirurgica",
      component: PreAgendCirurgico,
    },
    {
      path: "/filaEspera/ceriv",
      name: "Fila CERIV",
      component: FilaCerIv
    }
  ],
};

const extRoutes = {
  id: "Outros Sistemas",
  path: "/pages/Systems",
  icon: <ExternalLinkIcon />,
  children: [
    {
      path: "/systems/census",
      name: "Census",
      component: Census,
    },
    {
      path: "/systems/fila",
      name: "Fila de Espera",
      component: FilaEspera,
    },
    {
      path: "/systems/novo_census",
      name: "Pesquisa de Satisfação",
      component: NovoCensus,
    },
    {
      path: "/systems/PortalDP",
      name: "Portal do Colaborador",
      component: PortalDP,
    },
    {
      path: "/systems/portalMV",
      name: "Acesso Portal MV",
      component: PortalMV,
    },
    {
      path: "/systems/webmail",
      name: "Webmail",
      component: Webmail,
    },
    
    {
      path: "/systems/ver",
      name: "V.E.R",
      component: PortalVer
    },

    {
      path: "/systems/arquivo",
      name: "Arquivo",
      component: Arquivo
    }
    
  ],
};

export const dashboard = [
  mainRoutes,
  dashboardRoutes,
  filaEsperaRoutes,
  extRoutes,
  
];
export default [mainRoutes, dashboardRoutes, filaEsperaRoutes, extRoutes];

