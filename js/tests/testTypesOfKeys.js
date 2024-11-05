export const testTypesOfKeys = (
  validationSchema,
  requiredKeys,
  actual,
  testName = 'all keys validation by type'
) => {
  let testResult;
  let allTestsPassed = true;

  const isInteger = value => {
    if (typeof value === 'number' && Number.isInteger(value)) return true;
  };

  const testAnyOf = (anyOfTypes, actualValue) => {
    return anyOfTypes.some(object => testType(object.type, actualValue));
  };

  const testEnum = (enumValues, actualValue) => {
    return enumValues.includes(actualValue);
  };

  const testType = (expectedType, actualValue) => {
    switch (expectedType) {
      case 'string':
        return 'string' === typeof actualValue;
      case 'integer':
        return isInteger(actualValue);
      case 'boolean':
        return 'boolean' === typeof actualValue;
      case 'array':
        return Array.isArray(actualValue);
      case 'object':
        return 'object' === typeof actualValue;
      case 'null':
        return 'null' === expectedType;
      default:
        return false;
    }
  };

  for (let key in validationSchema) {
    const schemaOfExpectedTypes = validationSchema[key];

    let actualValue;

    if (Array.isArray(actual)) {
      if (actual.length === 0) {
        return console.log(
          `Result of testing of "${testName}": '✅ All tests passed.'`
        );
      } else {
        actual.forEach(element => {
          actualValue = element[key];
        });
      }
    } else if (typeof actual === 'object') {
      if (Object.keys(actual).length === 0) {
        return console.error('Incoming object is empty.');
      } else {
        actualValue = actual[key];
      }
    } else {
      return console.error('Wrong type of incoming data.');
    }

    if (actualValue === undefined && !requiredKeys?.includes(key)) {
      continue;
    }

    if (schemaOfExpectedTypes.anyOf) {
      if (!testAnyOf(schemaOfExpectedTypes.anyOf, actualValue)) {
        console.error(`Key '${key}' does not match any of the expected types.`);
        allTestsPassed = false;
      }
    } else if (schemaOfExpectedTypes.type) {
      if (!testType(schemaOfExpectedTypes.type, actualValue)) {
        console.error(
          `Key '${key}' should be of type '${
            schemaOfExpectedTypes.type
          }', but got '${typeof actualValue}'.`
        );
        allTestsPassed = false;
      }
    } else if (schemaOfExpectedTypes.enum) {
      if (!testEnum(schemaOfExpectedTypes.enum, actualValue)) {
        console.error(
          `Key '${key}' should be one of [${schemaOfExpectedTypes.enum.join(
            ', '
          )}], but got '${actualValue}'.`
        );
        allTestsPassed = false;
      }
    } else {
      console.error(`Key '${key}' is missing 'type' or 'anyOf' definition.`);
      allTestsPassed = false;
    }
  }
  allTestsPassed
    ? (testResult = '✅ All tests passed.')
    : (testResult = '❌ Failed. Some keys were not type validated.');

  console.log(`Result of testing of "${testName}": ${testResult}`);
};
