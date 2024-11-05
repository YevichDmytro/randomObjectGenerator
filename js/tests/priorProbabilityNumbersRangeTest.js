export const priorProbabilityNumbersRangeTest = (
  validationSchema,
  actualNumber,
  testName = 'Range numbers test'
) => {
  if (typeof validationSchema !== 'object' && Array.isArray(validationSchema)) {
    return console.error(`Incoming range must have type "object"`);
  } else if (
    !Object.keys(validationSchema).includes('minimum') ||
    !Object.keys(validationSchema).includes('maximum')
  ) {
    return console.error(
      'Validation schema doesn`t have required keys for testing.'
    );
  }

  if (actualNumber === undefined) {
    return;
  }

  if (actualNumber === null) {
    return console.log(`Result of test of ${testName}: ✅ Passed`);
  } else if (typeof actualNumber !== 'number') {
    return console.error(
      `Incoming data must have type "number" or "null", not a "${typeof actualNumber}"`
    );
  } else if (!Number.isInteger(actualNumber))
    return console.error(`Number must be integer, not a ${actualNumber}`);

  const { minimum, maximum } = validationSchema;
  const testRange = minimum <= actualNumber <= maximum;

  let testResult;

  testRange
    ? (testResult = '✅ Passed')
    : (testResult = '❌ Failed. Out of range numbers');

  console.log(`Result of test of ${testName}: ${testResult}`);
};
