import dayjs from "dayjs";

export default function useTime() {
  function timeNow() {
    return dayjs().format("MM/DD/YYYY h:mm:ss A");
  }

  return { timeNow };
}
