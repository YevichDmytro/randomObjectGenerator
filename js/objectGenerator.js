import schema from '../schema.json';

import { testGeneratedLink } from './tests/testGeneratedLink.js';
import { testRequiredKeys } from './tests/testRequiredKeys.js';
import { testTypesOfKeys } from './tests/testTypesOfKeys.js';
import { tags as tagsCollection } from './constants/tags.js';
import { testTypeOfResult } from './tests/testTypeOfResult.js';
import { priorProbabilityNumbersRangeTest } from './tests/priorProbabilityNumbersRangeTest.js';

const { required, definitions, properties } = schema;

const randomObjBySchemaGenerator = schema => {
  const data = {};

  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const randomString = () => Math.random().toString(36).substring(2, 16);
  const randomBoolean = () => Math.random() < 0.5;

  const randomId = (...args) => {
    const randomIndex = randomInt(0, args.length - 1);
    const randomType = args[randomIndex];

    switch (randomType) {
      case 'null':
        return null;
      case 'string':
        return randomString();
      case 'integer':
        return randomInt(0, 99999);
      default:
        return undefined;
    }
  };

  const randomDateGenerator = () => {
    const date = new Date();

    date.setMinutes(date.getMinutes() + randomInt(0, 60));
    date.setHours(date.getHours() + randomInt(0, 24));
    date.setDate(date.getDate() + randomInt(0, 31));
    date.setMonth(date.getMonth() + randomInt(0, 12));
    date.setFullYear(date.getFullYear() + randomInt(0, 3));

    return Date.parse(date);
  };

  const checkEndData = startDate => {
    do {
      data.endDate = randomDateGenerator();
    } while (startDate > data.endDate);

    return data.endDate;
  };

  const attendeesGenerator = ({ attendees }, max, min = 0) => {
    const count = randomInt(min, max);

    const arrOfAttendees = [];

    const { properties, required } = attendees;
    const { access, formAccess } = properties;

    for (let i = 0; i < count; i++) {
      const attendItem = {};

      required.forEach(item => {
        switch (item) {
          case 'userId': {
            attendItem.userId = randomInt(1, 99999);
            break;
          }
          case 'access': {
            const enumList = access.enum;
            const accessItem = enumList[randomInt(0, 3)];
            attendItem.access = accessItem;
            break;
          }
          default:
            break;
        }
      });

      randomBoolean()
        ? (attendItem.formAccess = formAccess.enum[randomInt(0, 2)])
        : null;

      arrOfAttendees.push(attendItem);
    }

    return arrOfAttendees;
  };

  const requiredFieldsGenerator = requiredFields => {
    requiredFields.forEach(item => {
      switch (item) {
        case 'id': {
          data.id = randomId('string', 'integer');
          break;
        }
        case 'title': {
          data.title = 'Product name';
          break;
        }
        case 'description': {
          data.description = 'Product description';
          break;
        }
        case 'startDate': {
          data.startDate = randomDateGenerator();
          break;
        }
        case 'endDate': {
          data.endDate = checkEndData(data.startDate);
          break;
        }
        case 'attendees': {
          data.attendees = attendeesGenerator(definitions, 0);
          break;
        }
        default: {
          break;
        }
      }
    });
  };

  const stringByPatternGenerator = template => {
    const { protocol, domain, separator } = template;

    let result = protocol;

    let ABCinLowerCase = 'abcdefghijklmnopqrstuvwxyz';
    let stringForRandom =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let length;
    let subdomain = '';
    let idInUrl = '';
    let randomString = '';

    length = randomInt(3, 12);
    for (let i = 0; i < length; i++) {
      const randomIndex = randomInt(0, ABCinLowerCase.length - 1);
      subdomain += ABCinLowerCase[randomIndex];
    }
    result += subdomain + domain;

    length = randomInt(1, 5);
    for (let i = 0; i < length; i++) {
      idInUrl += randomInt(0, 9);
    }
    result += idInUrl + separator;

    length = randomInt(5, 15);
    for (let i = 0; i < length; i++) {
      const randomIndex = randomInt(0, stringForRandom.length - 1);
      randomString += stringForRandom[randomIndex];
    }

    result += randomString;

    return result;
  };

  const template = {
    protocol: 'https://',
    domain: '.corezoid.com/api/1/json/public/',
    separator: '/',
  };

  const { anyOf } = properties.process;
  const stringPatternSchema = anyOf.filter(item => item.pattern);

  testGeneratedLink(
    ...stringPatternSchema,
    stringByPatternGenerator(template),
    'Generated link test'
  );

  const tagsGenerator = arrayOfTags => {
    const tags = [];
    const count = randomInt(0, 20);

    for (let i = 0; i < count; i++) {
      const index = randomInt(0, arrayOfTags.length - 1);
      tags.push(arrayOfTags[index]);
    }

    return tags.filter((tag, index) => tags.indexOf(tag) === index);
  };

  const formGenerator = validationSchema => {
    const { required, properties } = validationSchema;
    const formObject = {};

    required.forEach(key => (formObject[key] = null));

    const allProperties = Object.keys(properties);
    const nonRequiredKeys = allProperties.filter(
      key => !required.includes(key)
    );

    randomBoolean()
      ? nonRequiredKeys.forEach(key => (formObject[key] = null))
      : null;

    for (let key in formObject) {
      switch (key) {
        case 'id':
          formObject.id = randomId('integer');
          break;
        case 'viewModel':
          formObject.viewModel = {};
          break;
        default:
          break;
      }
    }

    return formObject;
  };

  const conditionallyGenerateField = (key, generator) => {
    if (randomBoolean()) {
      data[key] = generator();
    }
  };

  const optionalFieldsGenerator = (properties, required) => {
    const allProperties = Object.keys(properties);
    const filter = allProperties.filter(value => !required.includes(value));

    filter.forEach(item => {
      switch (item) {
        case 'parentId':
          conditionallyGenerateField(item, () =>
            randomId('null', 'string', 'integer')
          );
          break;
        case 'locationId':
          conditionallyGenerateField(item, () => randomId('null', 'integer'));
          break;
        case 'process':
          conditionallyGenerateField(item, () => {
            randomBoolean() ? stringByPatternGenerator(template) : null;
          });
          break;
        case 'readOnly':
          conditionallyGenerateField(item, () => randomBoolean());
          break;
        case 'priorProbability':
          conditionallyGenerateField(item, () => {
            randomBoolean() ? randomInt(0, 100) : null;
          });
          break;
        case 'channelId':
          conditionallyGenerateField(item, () => randomId('null', 'integer'));
          break;
        case 'externalId':
          conditionallyGenerateField(item, () => randomId('null', 'string'));
          break;
        case 'tags':
          conditionallyGenerateField(item, () => tagsGenerator(tagsCollection));
          break;
        case 'form':
          conditionallyGenerateField(item, () =>
            formGenerator(properties.form)
          );
          break;
        case 'formValue':
          conditionallyGenerateField(item, () => {});
          break;
        default:
          break;
      }
    });
  };

  requiredFieldsGenerator(required);
  optionalFieldsGenerator(properties, required);

  return data;
};

export const result = randomObjBySchemaGenerator(schema);

testTypeOfResult(result, 'object');

testRequiredKeys(schema, result);
testTypesOfKeys(properties, required, result);
priorProbabilityNumbersRangeTest(
  properties.priorProbability.anyOf[1],
  result.priorProbability
);

//test property "attendees"
testRequiredKeys(
  schema,
  result,
  'test "attendees": availability required keys'
);
testTypesOfKeys(
  definitions.attendees.properties,
  definitions.attendees.required,
  result.attendees,
  'test "attendees": all types of keys validation'
);

console.log(result);
