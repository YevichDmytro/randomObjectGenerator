export const testTypeOfResult = (
  actual,
  expectedType = 'object',
  testName = 'variable type checking'
) => {
  let testResult;

  if (typeof actual === expectedType) {
    testResult = '✅ Passed';
  } else {
    testResult = `❌ Failed. Expected type ${expectedType}, but got ${typeof actual}`;
  }

  console.log(`Result of testing of "${testName}": ${testResult}`);
};





