// https://material-table.com/#/docs/all-props
import React from "react";
import MaterialTable from "material-table";
import { convertDate } from "../../utils/dates";
const now = convertDate(new Date(), "Ymd-hhmmss");

const Table = (props) => {
  const { columns, data, title, options } = props;

  const optionsDefault = {
    ...options,
    grouping: true,
    exportButton: true,
    exportAllData: true,
    exportDelimiter: ";",
    exportFileName: `${title} ${now}`,
    isLoading: true,
    // filtering: true,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50],
    paginationType: "stepped",
    paginationPosition: "both",
    showFirstLastPageButtons: true,
    emptyRowsWhenPaging: false,
    search: true,
    searchFieldVariant: "outlined",
    searchFieldAlignment: "right",
    draggable: true,
    columnsButton: true,
    // headerStyle: {
    //   backgroundColor: "#eeeeee",
    // },
    filterCellStyle: {
      backgroundColor: "#eeeeee",
    },
  };

  return (
    <div style={{ maxWidth: "100%", marginTop: "10px" }}>
      <MaterialTable
        title={title || ""}
        columns={columns}
        data={data}
        options={optionsDefault}
        localization={localization}
      />
    </div>
  );
};

const localization = {
  body: {
    emptyDataSourceMessage: "Nenhum registro encontrado",
  },
  toolbar: {
    searchTooltip: "Pesquisar",
    searchPlaceholder: "Pesquisar",
    exportTitle: "Exportar",
    exportAriaLabel: "Exportar como CSV",
    showColumnsTitle: "Mostrar Colunas",
    showColumnsAriaLabel: "Mostrar Colunas",
  },
  grouping: {
    placeholder: "Arraste para agrupar",
    groupedBy: "Agrupado por:",
  },
  pagination: {
    labelRowsSelect: "linhas",
    labelDisplayedRows: "{from}-{to} de {count}",
    firstTooltip: "Primeira página",
    previousTooltip: "Página anterior",
    nextTooltip: "Próxima página",
    lastTooltip: "Última página",
  },
};

export default Table;
