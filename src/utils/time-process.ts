import { date } from "quasar";

const OFFSET = 8 * 60 * 60 * 1000;

export function getTimeString(timestamp = Date.now()) {
  return date.formatDate(timestamp, "YYYY/MM/DD HH:mm:ss");
}

export function getCreateUpdateTimeString(createTime: string, updateTime: string) {
  const create = new Date(createTime);
  let update = new Date(updateTime);
  if (update.valueOf() < create.valueOf()) {
    update = create;
  }
  return [getTimeString(create.valueOf() + OFFSET), getTimeString(update.valueOf() + OFFSET)];
}

export function getDurationString(duration: number) {
  if (duration > 0) {
    const s = Math.floor(duration);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    return `${h > 9 ? "" : "0"}${h} : ${m % 60 > 9 ? "" : "0"}${m % 60} : ${s % 60 > 9 ? "" : "0"}${s % 60}`;
  } else {
    return "00 : 00 : 00";
  }
}
