export const convertEpochtoString = (epoch, timezone = 'Asia/Jakarta') => {
  if (epoch === undefined || epoch === null) return null;
  return epoch.toString();
};
