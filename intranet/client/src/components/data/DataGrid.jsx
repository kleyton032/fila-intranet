import React, { useState } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import { Template, TemplatePlaceholder } from "@devexpress/dx-react-core";
import {
  SortingState,
  IntegratedSorting,
  PagingState,
  IntegratedPaging,
  FilteringState,
  IntegratedFiltering,
  GroupingState,
  IntegratedGrouping,
  SummaryState,
  IntegratedSummary,
  RowDetailState,
  SearchState,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
  PagingPanel,
  TableGroupRow,
  GroupingPanel,
  DragDropProvider,
  Toolbar,
  TableColumnReordering,
  TableColumnResizing,
  ColumnChooser,
  TableColumnVisibility,
  TableSummaryRow,
  TableRowDetail,
  SearchPanel,
} from "@devexpress/dx-react-grid-material-ui";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";

const styles = (theme) => ({
  root: {
    fontSize: "0.8rem",
  },
});

const CellComponentBase = ({ classes, ...restProps }) => (
  <Table.Cell {...restProps} className={classes.root} />
);

const TableComponentBase = ({ classes, ...restProps }) => (
  <Table.Table {...restProps} />
);

const CustomGroupItem = (props) => (
  <GroupingPanel.EmptyMessage
    style={{ color: "rgba(0, 0, 0, 0.54)" }}
    {...props}
  />
);

export const TableComponent = withStyles(styles, { name: "TableComponent" })(
  TableComponentBase
);

export const CellComponent = withStyles(styles, { name: "CellComponent" })(
  CellComponentBase
);

const DataGrid = (props) => {
  const {
    columns,
    rows,
    options,
    details,
    summaryItens,
    summaryItensGroup,
    // expandedRowIds,
    // setExpandedRowIds,
  } = props;
  const {
    searching,
    sorting,
    paging,
    filtering,
    grouping,
    summary,
    hiddenColumns,
  } = options;

  const [showFiltros, setShowFiltros] = useState(false);

  const defaultSorting = options.defaultSorting || false;

  const [columnWidth] = useState(
    columns.map((value) => {
      return { columnName: value.name, width: value.width };
    })
  );

  const columnOrder =
    options.columnOrder ||
    columns.map((value) => {
      return value.name;
    });

  const [tableColumnExtensions] = useState(
    columns
      .map((value) => {
        const columnExtensions = {};

        if ("align" in value) {
          columnExtensions.align = value.align;
        }

        if (Object.keys(columnExtensions).length > 0) {
          columnExtensions.columnName = value.name;
          return columnExtensions;
        } else {
          return "";
        }
      })
      .filter((item) => item)
  );

  const [filteringStateColumnExtensions] = useState(
    columns
      .map((value) => {
        const columnExtensions = {};

        if ("filtering" in value) {
          columnExtensions.filteringEnabled = value.filtering;
        }

        if (Object.keys(columnExtensions).length > 0) {
          columnExtensions.columnName = value.name;
          return columnExtensions;
        } else {
          return "";
        }
      })
      .filter((item) => item)
  );

  const [totalSummaryItems] = useState(
    summaryItens ||
      columns
        .map((value) => {
          const columnExtensions = {};

          if ("summary" in value) {
            columnExtensions.type = value.summary;
            columnExtensions.columnName = value.name;
            return columnExtensions;
          } else {
            return "";
          }
        })
        .filter((item) => item)
  );

  const [groupSummaryItems] = useState(
    summaryItensGroup ||
      columns
        .map((value) => {
          const columnExtensions = {};

          if ("summary" in value) {
            columnExtensions.type = value.summary;
          }

          if (Object.keys(columnExtensions).length > 0) {
            columnExtensions.columnName = value.name;
            columnExtensions.showInGroupFooter = false;
            columnExtensions.alignByColumn = true;

            return columnExtensions;
          } else {
            return "";
          }
        })
        .filter((item) => item)
  );

  const [defaultHiddenColumnNames] = useState(hiddenColumns || []);

  const defaultPageSize = options.pageSize || 10;
  const [pageSizes] = useState([5, 10, 25, 50]);

  const RowDetail = details;

  const handleFiltros = () => {
    setShowFiltros(!showFiltros);
  };

  const teste = {
     name: "teste",
     title: "ok",
     getCellValue: ()=> <button>TESTE</button> 
  }

  return (
    <Paper>
      <Grid rows={rows} columns={[...columns, teste]}>
        
        {searching ? <SearchState /> : null}

        {sorting ? (
          <SortingState
            defaultSorting={[
              {
                columnName: defaultSorting.column,
                direction: defaultSorting.direction,
              },
            ]}
          />
        ) : null}
        
        
        {defaultSorting ? <IntegratedSorting /> : null}

        
        <DragDropProvider />

        
        {grouping ? <GroupingState /> : null}
        
        {grouping ? <IntegratedGrouping /> : null}

        {filtering ? (
          <FilteringState
            defaultFilters={[]}
            columnExtensions={filteringStateColumnExtensions}
          />
        ) : null}

        {filtering ? <IntegratedFiltering /> : null}

        {paging ? (
          <PagingState
            defaultCurrentPage={0}
            defaultPageSize={defaultPageSize}
          />
        ) : null}
        
        {paging ? <IntegratedPaging /> : null}

        {summary ? (
          <SummaryState
            totalItems={totalSummaryItems}
            groupItems={groupSummaryItems}
          />
        ) : null}
        {summary ? <IntegratedSummary /> : null}

        {/* {expandedRowIds ? (
          <RowDetailState
            expandedRowIds={expandedRowIds}
            onExpandedRowIdsChange={setExpandedRowIds}
          />
        ) : details ? (
          <RowDetailState />
        ) : null} */}

        {details ? <RowDetailState /> : null}

        <Table
          tableComponent={TableComponent}
          cellComponent={CellComponent}
          messages={localization.tableMessages}
          columnExtensions={tableColumnExtensions}
        />

        <TableColumnReordering defaultOrder={columnOrder} />
        
        <TableColumnResizing
          defaultColumnWidths={columnWidth}
          resizingMode="nextColumn"
        />

        <TableHeaderRow
          showSortingControls
          messages={localization.tableHeaderRowMessages}
        />

        {details ? <TableRowDetail contentComponent={RowDetail} /> : null}

        <TableColumnVisibility
          defaultHiddenColumnNames={defaultHiddenColumnNames}
          messages={localization.tableColumnVisibility}/>

        <Toolbar />

        {searching ? <SearchPanel messages={localization.searchPanel} /> : null}

        <Template name="toolbarContent">
          <TemplatePlaceholder />
          <Tooltip title="Exibir/Ocultar Filtros" aria-label="Exibir Filtros">
            <IconButton onClick={handleFiltros}>
              <FilterListOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Template>

        <ColumnChooser messages={localization.columnChooser} />

        {grouping ? <TableGroupRow messages={localization.grou} /> : null}
        {grouping ? (
          <GroupingPanel
            showSortingControls={true}
            showGroupingControls={true}
            messages={localization.groupingPanelMessages}
            emptyMessageComponent={CustomGroupItem}
          />
        ) : null}

        {filtering && showFiltros ? (
          <TableFilterRow messages={localization.filterRowMessages} />
        ) : null}

        {summary ? (
          <TableSummaryRow messages={localization.tableSummaryRow} />
        ) : null}

        {paging ? (
          <PagingPanel
            messages={localization.pagingPanelMessages}
            pageSizes={pageSizes}
          />
        ) : null}
      </Grid>
    </Paper>
  );
};

const localization = {
  tableMessages: {
    noData: "Nenhum registro encontrado",
  },

  groupingPanelMessages: {
    groupByColumn: "Agrupar Por",
  },

  filterRowMessages: {
    filterPlaceholder: "Filtrar...",
  },

  pagingPanelMessages: {
    showAll: "Todos",
    rowsPerPage: "Linhas por Página",
    info: "{from}-{to} de {count}",
  },

  tableHeaderRowMessages: {
    sortingHint: "Ordenar",
  },

  tableColumnVisibility: {
    noColumns: "Nada para exibir",
  },

  columnChooser: {
    showColumnChooser: "Exibir/Ocultar Colunas",
  },

  tableSummaryRow: {
    sum: "Total",
    count: "Contagem",
    avg: "Média",
  },

  searchPanel: {
    searchPlaceholder: "Procurar",
  },
};

DataGrid.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
};

export default DataGrid;
// https://devexpress.github.io/devextreme-reactive/react/grid/docs/guides/getting-started/
