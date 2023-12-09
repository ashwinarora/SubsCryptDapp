import BigNumber from "bignumber.js";

export const toHumanNumber = (
  value: BigNumber,
  decimals: number = 18
): string => {
  const numString = value.dividedBy(new BigNumber(10).pow(decimals)).toString();
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 18,
  }).format(parseFloat(numString));
};

export const toRealNumber = (
  value: string,
  decimals: number = 18
): BigNumber => {
  return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals));
};


export const secondsToString = (numberOfSeconds: number): string => {
  const secondsPerMinute = 60;
  const secondsPerHour = 3600;
  const secondsPerDay = 86400;
  const secondsPerWeek = 604800;
  const secondsPerMonth = 30 * secondsPerDay;
  const secondsPerYear = 365 * secondsPerDay;

  let remainingSeconds = numberOfSeconds;

  const years = Math.floor(remainingSeconds / secondsPerYear);
  remainingSeconds %= secondsPerYear;

  const months = Math.floor(remainingSeconds / secondsPerMonth);
  remainingSeconds %= secondsPerMonth;

  const weeks = Math.floor(remainingSeconds / secondsPerWeek);
  remainingSeconds %= secondsPerWeek;

  const days = Math.floor(remainingSeconds / secondsPerDay);
  remainingSeconds %= secondsPerDay;

  const hours = Math.floor(remainingSeconds / secondsPerHour);
  remainingSeconds %= secondsPerHour;

  const minutes = Math.floor(remainingSeconds / secondsPerMinute);
  const seconds = remainingSeconds % secondsPerMinute;

  const parts = [
      years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '',
      months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '',
      weeks > 0 ? `${weeks} week${weeks > 1 ? 's' : ''}` : '',
      days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '',
      hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '',
      minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '',
      seconds > 0 ? `${seconds} second${seconds > 1 ? 's' : ''}` : ''
  ].filter(part => part.length > 0);

  return parts.join(' ') || '0 seconds';
}


export const UINT_MINUS_ONE = "115792089237316195423570985008687907853269984665640564039457584007913129639935"