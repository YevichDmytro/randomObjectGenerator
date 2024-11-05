export const testRequiredKeys = (
  validationSchema,
  actual,
  testName = 'Validation of required keys '
) => {
  let testResult;
  let allTestsPassed = true;

  const { required, definitions } = validationSchema;
  const attendeesArray = actual.attendees;
  const actualKeys = Object.keys(actual);

  required.every(key => {
    if (!actualKeys.includes(key)) {
      allTestsPassed = false;
      testResult = `❌ Failed. Required key:${key} are missing.`;
    }
  });

  if (attendeesArray.length === 0) {
  } else if (attendeesArray.length > 0) {
    attendeesArray.forEach((element, index) => {
      const { required } = definitions.attendees;
      const actualAttendeesKeys = Object.keys(element);

      required.every(key => {
        if (!actualAttendeesKeys.includes(key)) {
          allTestsPassed = false;
          testResult = `❌ Failed. Required key:${key} in element ${element} with index:${index} are missing.`;
        }
      });
    });
  }

  allTestsPassed
    ? (testResult = '✅ All tests passed.')
    : (testResult = `❌ Failed. Some required keys are missing.`);

  console.log(`Result of testing of "${testName}": ${testResult}`);
};
