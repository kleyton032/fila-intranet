import { grey } from "@material-ui/core/colors";

const overrides = {
  MuiCardHeader: {
    action: {
      marginTop: "-4px",
      marginRight: "-4px",
    },
  },
  MuiPickersDay: {
    day: {
      fontWeight: "300",
    },
  },
  MuiPickersYear: {
    root: {
      height: "64px",
    },
  },
  MuiPickersCalendar: {
    transitionContainer: {
      marginTop: "6px",
    },
  },
  MuiPickersCalendarHeader: {
    iconButton: {
      backgroundColor: "transparent",
      "& > *": {
        backgroundColor: "transparent",
      },
    },
    switchHeader: {
      marginTop: "2px",
      marginBottom: "4px",
    },
  },
  MuiPickersClock: {
    container: {
      margin: `32px 0 4px`,
    },
  },
  MuiPickersClockNumber: {
    clockNumber: {
      left: `calc(50% - 16px)`,
      width: "32px",
      height: "32px",
    },
  },
  MuiPickerDTHeader: {
    dateHeader: {
      "& h4": {
        fontSize: "2.125rem",
        fontWeight: 400,
      },
    },
    timeHeader: {
      "& h3": {
        fontSize: "3rem",
        fontWeight: 400,
      },
    },
  },
  MuiPickersTimePicker: {
    hourMinuteLabel: {
      "& h2": {
        fontSize: "3.75rem",
        fontWeight: 300,
      },
    },
  },
  MuiPickersToolbar: {
    toolbar: {
      "& h4": {
        fontSize: "2.125rem",
        fontWeight: 400,
      },
    },
  },
  MuiTable: {
    root: {
      // width: "99.99%",
      // fontSize: "0.80rem",
    },
  },
  MuiTableRow: {
    root: {
      "&:nth-child(odd)": {
        backgroundColor: grey[100],
      },
      "&:hover": {
        backgroundColor: grey[300],
      },
    },
  },
  MuiTableCell: {
    footer: {
      backgroundColor: "#FFF",
    },
  },
};

export default overrides;
