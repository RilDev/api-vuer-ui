import moment from "moment";

export default function timeNow() {
  return moment().format("MMMM Do YYYY, h:mm:ss a");
}
