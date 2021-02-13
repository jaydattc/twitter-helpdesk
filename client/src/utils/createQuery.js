import QueryString from "querystring";

export const isValidObject = (obj) =>
  obj &&
  typeof obj === "object" &&
  Object.keys(obj).length !== 0 &&
  obj.constructor === Object;

export const createQuery = (url, query) =>
  isValidObject(query) ? `${url}?${QueryString.stringify(query)}` : url;
