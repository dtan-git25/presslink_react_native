export function create(
  types: any,
  key: string,
  path: string,
  data: {},
  success: () => void,
  failure: () => void,
) {
  return {
    types,
    data,
    success,
    failure,
  };
}
export function _delete(types: any, key: string, where: any) {
  const type = types.DELETE;
  return {
    type,
    key,
    where,
  };
}
export function update(types: any, key: string, path: string, data: {}) {
  const type = types.UPDATE;
  return {
    type,
    key,
    path,
    data,
  };
}
