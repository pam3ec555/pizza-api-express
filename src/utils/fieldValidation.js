const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Return "undefined" if field is correct, otherwise return an error message
 * @param {*} field
 * @param {string?} [type=string]
 * @param {boolean?} [requiredField=false]
 * @param {boolean?} [email=false]
 * @param {number?} minLength
 * @param {number?} [maxLength=255]
 * @param {boolean?} [naturalNumber=true]
 * @param {number?} minValue
 * @param {number?} maxValue
 * @param {boolean?} [emptyIsValid=true]
 * @return {string | undefined}
 */
const fieldValidation = (field, {
  type = 'string',
  requiredField = false,
  email = false,
  minLength,
  maxLength = 255,
  naturalNumber = true,
  minValue,
  maxValue,
  emptyIsValid = true,
}) => {
  switch (type) {
    case 'string':
      if (requiredField) {
        if (!field || field.length === 0) {
          return 'Field is required';
        }
      }

      if (email && !emailReg.test(field.toLowerCase())) {
        return 'Invalid email address';
      }

      if (typeof field !== type) {
        return 'Invalid type';
      }

      if (typeof minLength === 'number' && field.length < minLength) {
        return `Min field length is ${minLength}`;
      }

      if (typeof maxLength === 'number' && field.length >= maxLength) {
        return `Max field length is ${maxLength}`;
      }

      return undefined;
    case 'number':
      if (requiredField && typeof field === 'undefined') {
        return 'Field is required';
      }

      if (typeof field !== type) {
        return 'Invalid type';
      }

      if (naturalNumber && field < 1) {
        return 'Field must be natural number.';
      }

      if (typeof minValue === 'number' && field < minValue) {
        return `Field value must be more than ${minValue} or equal it.`;
      }

      if (typeof maxValue === 'number' && field > maxValue) {
        return `Field value must be less than ${maxValue} or equal it.`;
      }

      return undefined;
    case 'array':
      if (requiredField && typeof field === 'undefined') {
        return 'Field is required';
      }

      if (!Array.isArray(field)) {
        return 'Invalid type';
      }

      if (!emptyIsValid && field.length === 0) {
        return 'Array is empty';
      }

      return undefined;
    default:
      return `Type ${type} does not exist`;
  }
};

module.exports = fieldValidation;
