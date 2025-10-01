export const formatString = (
  str: string | number | undefined,
  prefix: string = "",
  postfix: string = ""
) => {
  if (str === undefined || Number.isNaN(str) || str === "NaN") return "";
  return `${prefix}${str}${postfix}`;
};
