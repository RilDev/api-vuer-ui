import dayjs from "dayjs";

export default function useTime() {
  function timeNow() {
    return dayjs().format("MM/DD/YYYY h:mm:ss A");
  }

  function yearNow() {
    return dayjs().format("YYYY");
  }

  return { timeNow, yearNow };
}
