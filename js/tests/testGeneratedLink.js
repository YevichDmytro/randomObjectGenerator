export const testGeneratedLink = (schema, link, testName) => {
  if (typeof schema !== 'object') {
    console.warn(`Schema must have an "object" type, not "${typeof schema}"`);
    return;
  }
  if (Array.isArray(schema)) {
    console.warn(`Schema must have an "object" type, not "array"`);
    return;
  }
  if (typeof link !== 'string') {
    console.warn(`Link must have a "string" type, not "${typeof link}"`);
    return;
  }

  const regexp = new RegExp(schema.pattern);
  const test = regexp.test(link);

  let testResult;

  test
    ? (testResult = '✅ Passed')
    : (testResult = '❌ Failed. Link doesn`t match the pattern');

  console.log(`Result of test of ${testName}: ${testResult}`);
};
