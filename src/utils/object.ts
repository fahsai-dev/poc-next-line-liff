export const isObjEmpty = (obj: any) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};

export const pickPropertiesByKeys = (keys: string[], obj: any) => {
  return keys.reduce((result: any, key) => {
    result[key] = obj[key];
    return result;
  }, {});
};
