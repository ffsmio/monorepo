# Serialization string

## Installation

```bash
npm i @ffsm/serialize
```

OR

```bash
yarn add @ffsm/serialize
```

## Usage

Using single function

```ts
import { encode } from '@ffsm/serialize`;

encode('&');
```

OR using with default object

```ts
import Serialize from '@ffsm/serialize';

Serialize.encode('&');
```

### decode

Safely decodes URL-encoded strings with error handling.

```typescript
import { decode } from '@ffsm/serialize';

// Basic usage - decodes with decodeURIComponent (default)
const text = decode('Hello%20World'); // 'Hello World'

// Use decodeURI instead (preserves certain URL characters)
const url = decode('https%3A%2F%2Fexample.com%2Fpath%3Fquery%3Dvalue', false);
// 'https://example.com/path?query=value'

// Custom decoder function
const emoji = decode('%F0%9F%8C%9F', myCustomDecoder);

// Graceful error handling
const problematic = decode('This%20has%2G%an%20error');
// Returns with best-effort decoding, logs error but doesn't throw exception
```

The function handles null and undefined values gracefully, returning an empty string. If decoding fails for certain segments, it maintains the original encoded value and logs an error to the console rather than throwing exceptions.

### encode

Safely encodes strings for URL usage with error handling.

```typescript
import { encode } from '@ffsm/serialize';

// Basic usage - encodes with encodeURIComponent (default)
const encoded = encode('Hello World'); // 'Hello%20World'

// Use encodeURI instead (preserves URL structure characters)
const urlSafe = encode('https://example.com/path?query=value', false);
// 'https://example.com/path?query=value'

// Custom encoder function
const custom = encode('Special chars: @#$%', myCustomEncoder);

// Graceful error handling for problematic strings
const safe = encode('Text with invalid \uD800 surrogate character');
// Handles the encoding without throwing exceptions
```

The function returns an empty string for null or undefined inputs. If encoding encounters errors with certain characters, it maintains those characters as-is and logs an error to the console rather than throwing exceptions, ensuring your application continues to run smoothly.

### get

Safely access nested properties in objects and arrays without causing errors.

```typescript
import { get } from '@ffsm/serialize';

const user = {
  name: 'John',
  profile: {
    contact: {
      email: 'john@example.com',
      phone: null,
    },
    preferences: ['dark-mode', 'notifications'],
  },
};

// Simple property access
const name = get(user, 'name'); // 'John'

// Deep property access (as string path)
const email = get(user, 'profile.contact.email'); // 'john@example.com'

// Deep property access (as array path)
const email2 = get(user, ['profile', 'contact', 'email']); // 'john@example.com'

// Array element access
const pref = get(user, 'profile.preferences.0'); // 'dark-mode'

// Providing default values when property doesn't exist
const address = get(user, 'profile.contact.address', 'N/A'); // 'N/A'

// Type safety with generics
const phone = get<string>(user, 'profile.contact.phone', 'No phone'); // 'No phone'
```

This function helps you avoid the infamous "Cannot read property 'x' of undefined" errors by safely navigating through object hierarchies. It works with both dot notation strings and array paths for flexibility.

### parse

Converts a URL query string into a structured object with support for various formats.

```typescript
import { parse } from '@ffsm/serialize';

// Basic parsing
const params = parse('name=John&age=30');
// { name: 'John', age: '30' }

// Auto-convert types
const typedParams = parse('active=true&count=42', {
  parseBooleans: true,
  parseNumbers: true,
});
// { active: true, count: 42 }

// Parse arrays in different formats
const bracketArray = parse('colors[]=red&colors[]=blue', {
  arrayFormat: 'bracket',
});
// { colors: ['red', 'blue'] }

const indexArray = parse('colors[0]=red&colors[1]=blue', {
  arrayFormat: 'index',
});
// { colors: ['red', 'blue'] }

const commaArray = parse('colors=red,blue', { arrayFormat: 'comma' });
// { colors: ['red', 'blue'] }

// Parse nested objects
const nested = parse('user[name]=John&user[profile][age]=30');
// { user: { name: 'John', profile: { age: '30' } } }

// Parsing from URL with query prefix
const fromUrl = parse('?sort=desc&page=2', { ignoreQueryPrefix: true });
// { sort: 'desc', page: '2' }
```

#### Options

Configure parsing behavior with `SerializeParseOptions`:

| Option                 | Type    | Default | Description                                                                 |
| ---------------------- | ------- | ------- | --------------------------------------------------------------------------- |
| `arrayFormat`          | string  | 'none'  | How arrays are formatted ('bracket', 'index', 'comma', 'separator', 'none') |
| `arrayFormatSeparator` | string  | ','     | Character separating array values when using 'comma' or 'separator'         |
| `parseNumbers`         | boolean | false   | Auto-convert numeric strings to numbers                                     |
| `parseBooleans`        | boolean | false   | Auto-convert 'true'/'false' strings to booleans                             |
| `decode`               | boolean | true    | Whether to decode URI encoded components                                    |
| `ignoreQueryPrefix`    | boolean | true    | Whether to remove '?' prefix from query string                              |

### query

Converts a JavaScript object into a URL query string with support for various formats.

```typescript
import { query } from '@ffsm/serialize';

// Basic object to query string
const basic = query({ name: 'John', age: 30 });
// 'name=John&age=30'

// Format arrays in different ways
const bracketArray = query(
  { colors: ['red', 'blue'] },
  {
    arrayFormat: 'bracket',
  }
);
// 'colors[]=red&colors[]=blue'

const indexArray = query(
  { colors: ['red', 'blue'] },
  {
    arrayFormat: 'index',
  }
);
// 'colors[0]=red&colors[1]=blue'

const commaArray = query(
  { colors: ['red', 'blue'] },
  {
    arrayFormat: 'comma',
  }
);
// 'colors=red,blue'

// Custom array separator
const customSep = query(
  { tags: ['javascript', 'typescript'] },
  {
    arrayFormat: 'separator',
    arrayFormatSeparator: '|',
  }
);
// 'tags=javascript|typescript'

// Handle nested objects
const nested = query({
  user: {
    name: 'John',
    profile: { age: 30 },
  },
});
// 'user[name]=John&user[profile][age]=30'

// Skip null or undefined values
const skipNulls = query({ name: 'John', email: null }, { skipNull: true });
// 'name=John'

// Skip empty strings
const skipEmpty = query({ name: 'John', bio: '' }, { skipEmptyString: true });
// 'name=John'

// Sort parameters
const sorted = query({ z: 3, a: 1, b: 2 }, { sort: true });
// 'a=1&b=2&z=3'

// Custom sorting function
const customSort = query(
  { z: 3, a: 1, b: 2 },
  {
    sort: (a, b) => b.localeCompare(a), // reverse sort
  }
);
// 'z=3&b=2&a=1'
```

#### Options

Configure serialization behavior with `SerializeQueryOptions`:

| Option                 | Type             | Default | Description                                                                 |
| ---------------------- | ---------------- | ------- | --------------------------------------------------------------------------- |
| `arrayFormat`          | string           | 'none'  | How arrays are formatted ('bracket', 'index', 'comma', 'separator', 'none') |
| `arrayFormatSeparator` | string           | ','     | Character separating array values when using 'comma' or 'separator'         |
| `skipNull`             | boolean          | false   | Whether to omit null and undefined values                                   |
| `skipEmptyString`      | boolean          | false   | Whether to omit empty string values                                         |
| `encode`               | boolean          | true    | Whether to encode URI components                                            |
| `strict`               | boolean          | true    | Whether to validate keys strictly                                           |
| `sort`                 | boolean/function | false   | Whether and how to sort the parameters                                      |

### url

Replaces named parameters in a URL template with actual values.

```typescript
import { url } from '@ffsm/serialize';

// Simple parameter replacement
const profileUrl = url('/users/:username', { username: 'john.doe' });
// '/users/john.doe'

// Multiple parameters in a route
const articleUrl = url('/blog/:category/:slug/:id', {
  category: 'technology',
  slug: 'javascript-tips',
  id: 42,
});
// '/blog/technology/javascript-tips/42'

// Same parameter used multiple times
const duplicateParams = url('/products/:id/reviews/:reviewId/by/:id', {
  id: 'abc123',
  reviewId: 789,
});
// '/products/abc123/reviews/789/by/abc123'

// With primitive types
const apiUrl = url('/api/:version/filter/:active/:count', {
  version: 'v2',
  active: true,
  count: 50,
});
// '/api/v2/filter/true/50'

// Missing parameters are replaced with empty string
const partialUrl = url('/users/:id/posts/:postId', { id: 123 });
// '/users/123/posts/'

// No parameters to replace
const staticUrl = url('/about-us', {});
// '/about-us'
```

The function provides a simple way to build URLs with dynamic parameters, similar to how routing works in modern web frameworks. It safely handles different primitive types (string, number, boolean) and replaces missing parameters with empty strings rather than throwing errors.

### variable

Replaces variable placeholders in a string template with actual values.

```typescript
import { variable } from '@ffsm/serialize';

// Basic template substitution
const greeting = variable('Hello, {name}!', {
  params: { name: 'John' },
});
// 'Hello, John!'

// Multiple variables
const userInfo = variable('Name: {name}, Email: {email}, Role: {role}', {
  params: {
    name: 'Alice',
    email: 'alice@example.com',
    role: 'Admin',
  },
});
// 'Name: Alice, Email: alice@example.com, Role: Admin'

// Accessing nested properties with dot notation
const profileText = variable('Profile: {user.name} ({user.details.age})', {
  params: {
    user: {
      name: 'Bob',
      details: {
        age: 32,
        location: 'New York',
      },
    },
  },
});
// 'Profile: Bob (32)'

// Custom formatting
const eventDetails = variable('Event: {title} on {date}', {
  params: {
    title: 'Company Meeting',
    date: '2023-09-15',
  },
  format: {
    title: (title) => title.toUpperCase(),
    date: (date) => {
      const [year, month, day] = date.split('-');
      return `${month}/${day}/${year}`;
    },
  },
});
// 'Event: COMPANY MEETING on 09/15/2023'

// Array values
const listItems = variable('Selected items: {items.0}, {items.1}, {items.2}', {
  params: {
    items: ['Apple', 'Banana', 'Cherry'],
  },
});
// 'Selected items: Apple, Banana, Cherry'
```

The function provides a flexible template system for string interpolation with:

- Variable substitution with `{variableName}` syntax
- Deep property access with dot notation: `{user.profile.name}`
- Custom formatting through synchronous formatter functions
- Multiple occurrences of the same variable
- Safe handling of missing variables (replaced with empty string)

For asynchronous operations (API calls, database queries), use `variableAsync`.

### variableAsync

Asynchronously replaces variable placeholders in a string template with actual values, supporting async formatters.

```typescript
import { variableAsync } from '@ffsm/serialize';

// Basic template substitution (similar to variable)
const greeting = await variableAsync('Hello, {name}!', {
  params: { name: 'John' },
});
// 'Hello, John!'

// With async formatters
const userProfile = await variableAsync('User: {userId}', {
  params: { userId: 1234 },
  format: {
    userId: async (id) => {
      // Fetch user data from API
      const response = await fetch(`/api/users/${id}`);
      const user = await response.json();
      return `${user.name} (${user.status})`;
    },
  },
});
// 'User: John Doe (active)'

// Multiple async formatters processed in parallel
const weatherReport = await variableAsync(
  'Weather: {city1} | {city2} | {city3}',
  {
    params: {
      city1: 'New York',
      city2: 'London',
      city3: 'Tokyo',
    },
    format: {
      city1: async (city) => await fetchWeatherData(city),
      city2: async (city) => await fetchWeatherData(city),
      city3: async (city) => await fetchWeatherData(city),
    },
  }
);
// All three weather API calls happen concurrently

// Formatted date with timezone adjustment
const eventTime = await variableAsync('Event starts: {startTime}', {
  params: { startTime: '2023-09-15T14:00:00Z' },
  format: {
    startTime: async (time) => {
      // Could involve timezone API call or complex async calculation
      const localTime = await convertToLocalTimezone(time);
      return localTime.toLocaleString();
    },
  },
});
// 'Event starts: 9/15/2023, 10:00:00 AM'
```

#### When to use variableAsync vs variable

Use `variableAsync` when you need:

- **Async data sources**: Fetching data from APIs, databases, or file systems
- **Complex transformations**: Processing that requires promises or async/await
- **Parallel processing**: All variables are processed concurrently for better performance
- **External services**: Integration with services requiring network requests

Use `variable` (synchronous version) for simpler cases where:

- You only need basic variable substitution
- All data is already available in memory
- Performance is critical and async overhead isn't needed

`variableAsync` provides all the same templating features as `variable`, plus:

- Support for async formatter functions
- Parallel processing of multiple variables using Promise.all
- Seamless integration with async/await workflows

### isString

Checks if a value is a string with TypeScript type guard support.

```typescript
import { isString } from '@ffsm/serialize';

// Basic usage
const value = getUserInput();
if (isString(value)) {
  // TypeScript knows value is a string here
  const normalized = value.trim().toLowerCase();
  console.log(`Processing string: ${normalized}`);
} else {
  console.log('Expected a string value');
}

// Using with mapping functions
const processedValues = mixedData
  .filter(isString)
  .map((str) => str.toUpperCase());
// processedValues is string[]
```

This function not only checks if a value is a string at runtime but also serves as a TypeScript type guard, providing type narrowing in conditional blocks for improved type safety.

### isNumber

Checks if a value is a number with TypeScript type guard support.

```typescript
import { isNumber } from '@ffsm/serialize';

// Basic usage
const value = getValueFromAPI();
if (isNumber(value)) {
  // TypeScript knows value is a number here
  const formatted = value.toFixed(2);
  console.log(`Numeric value: ${formatted}`);
} else {
  console.log('Expected a numeric value');
}

// In data processing pipelines
const numericValues = dataset.filter(isNumber).filter((num) => num > 0);
// numericValues is number[]

// For calculations
function calculateAverage(values: unknown[]) {
  const numbers = values.filter(isNumber);
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}
```

This function checks if a value is a number at runtime while also serving as a TypeScript type guard, allowing you to safely access number methods in conditional blocks.

### isBoolean

Checks if a value is a boolean with TypeScript type guard support.

```typescript
import { isBoolean } from '@ffsm/serialize';

// Basic usage
const value = getConfigValue('featureEnabled');
if (isBoolean(value)) {
  // TypeScript knows value is a boolean here
  if (value) {
    enableFeature();
  } else {
    disableFeature();
  }
} else {
  console.log('Expected a boolean configuration value');
}

// With optional chaining
function getFeatureState(config: unknown) {
  if (isBoolean(config?.features?.darkMode)) {
    return config.features.darkMode ? 'enabled' : 'disabled';
  }
  return 'not configured';
}

// Filtering boolean flags
const enabledFeatures = Object.entries(featureFlags)
  .filter(([_, value]) => isBoolean(value) && value)
  .map(([key]) => key);
```

This function verifies a value is strictly a boolean (true or false) at runtime while also acting as a TypeScript type guard, making it safer to use in conditional logic.

### isPrimitive

Checks if a value is a primitive (string, number, boolean, null, or undefined) with TypeScript type guard support.

```typescript
import { isPrimitive } from '@ffsm/serialize';

// Basic usage
const value = getSomeValue();
if (isPrimitive(value)) {
  // TypeScript knows value is a string, number, boolean, null, or undefined here
  console.log(`Simple value: ${String(value)}`);
} else {
  // TypeScript knows value is an object or array here
  console.log('Complex data structure');
}

// Differentiating between primitive and complex values
function serializeValue(value: unknown) {
  if (isPrimitive(value)) {
    return String(value); // Simple stringification for primitives
  } else {
    return JSON.stringify(value); // JSON for objects and arrays
  }
}

// Validating input types
function validateInput(input: unknown) {
  if (!isPrimitive(input)) {
    throw new Error('Only primitive values are accepted');
  }
  return input; // TypeScript knows input is a primitive here
}
```

This function helps distinguish between simple primitive values and complex data structures (objects and arrays) both at runtime and at compile time with TypeScript.
