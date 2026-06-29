const addDays = (date, days) => {
  const cloneDate = new Date(date);
  cloneDate.setDate(cloneDate.getDate() + days);

  return cloneDate;
};

const addMonths = (date, months) => {
  const cloneDate = new Date(date);
  cloneDate.setMonth(cloneDate.getMonth() + months);

  return cloneDate;
};

const getWeek = (date) => {
  const cloneDate = new Date(date);
  const weekDay = cloneDate.getDay();

  const weekStart = addDays(cloneDate, -weekDay);
  const weekEnd = addDays(weekStart, 6);

  return { inicio: weekStart, fim: weekEnd };
};

const getMonth = (date) => {
  const cloneDate = new Date(date);

  const monthStart = new Date(cloneDate.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(cloneDate.getFullYear(), date.getMonth() + 1, 0);

  return { inicio: monthStart, fim: monthEnd };
};

const convertDate = (Date, format) => {
  const day = Date.getDate() < 10 ? `0${Date.getDate()}` : Date.getDate();
  const month =
    Date.getMonth() + 1 < 10 ? `0${Date.getMonth() + 1}` : Date.getMonth() + 1;
  let Month = "";
  const year = Date.getFullYear();
  const hours = Date.getHours();
  const minutes = Date.getMinutes();
  const seconds = Date.getSeconds();

  switch (month) {
    case "01":
      Month = "Janeiro";
      break;
    case "02":
      Month = "Fevereiro";
      break;
    case "03":
      Month = "Março";
      break;
    case "04":
      Month = "Abril";
      break;
    case "05":
      Month = "Maio";
      break;
    case "06":
      Month = "Junho";
      break;
    case "07":
      Month = "Julho";
      break;
    case "08":
      Month = "Agosto";
      break;
    case "09":
      Month = "Setembro";
      break;
    case "10":
      Month = "Outubro";
      break;
    case "11":
      Month = "Novembro";
      break;
    case "12":
      Month = "Dezembro";
      break;
    default:
      Month = "";
      break;
  }

  switch (format) {
    case "M Y":
      return `${Month}, ${year}`;
    case "d M":
      return `${day} de ${Month}`;
    case "d/m":
      return `${day}/${month}`;
    case "Ymd-hhmmss":
      return `${year}${month}${day}-${hours}${minutes}${seconds}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

export { addDays, addMonths, convertDate, getWeek, getMonth };
