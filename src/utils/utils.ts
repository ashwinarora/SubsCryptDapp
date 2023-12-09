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
