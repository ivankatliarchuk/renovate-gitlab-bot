let rtf;
export function minAgo(date) {
  if (!rtf) {
    rtf = new Intl.RelativeTimeFormat("en");
  }
  return rtf.format(Math.round((date - Date.now()) / 60 / 1000), "minutes");
}
