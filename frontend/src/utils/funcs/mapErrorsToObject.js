export const mapErrorsToObject = errors => {
  const object = {};
  errors.forEach(({ field, message }) => {
    object[field] = message;
  });
  return object;
};
