import dayjs from "dayjs";

export default function timeNow() {
  return dayjs().format("MM/DD/YYYY h:mm:ss A");
}
