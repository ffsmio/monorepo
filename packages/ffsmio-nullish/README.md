# Utilities Nullish

A lightweight utility package for handling null and undefined values in TypeScript.

## Installation

```bash
npm i @ffsm/nullish
```

OR

```bash
yarn add @ffsm/nullish
```

## Usage

```ts
import { isNullish } from '@ffsm/nullish';

isNullish(null);
```

OR

```ts
import Nullish from '@ffsm/nullish';

Nullish.isNullish(null);
```

### isNull

Check if a value is specifically null.

```typescript
import { isNull } from '@ffsm/nullish';

// Example usage
const value = getSomeValue();

if (isNull(value)) {
  console.log('Value is null');
}
```

### isUndefined

Check if a value is specifically undefined.

```typescript
import { isUndefined } from '@ffsm/nullish';

// Example usage
const value = getSomeValue();

if (isUndefined(value)) {
  console.log('Value is undefined');
}
```

### isNullish

Check if a value is null or undefined.

```typescript
import { isNullish } from '@ffsm/nullish';

// Example usage
const value = getSomeValue();

if (isNullish(value)) {
  console.log('Value is null or undefined');
} else {
  console.log('Value has actual content');
}
```

### isNotNullish

Type guard to check if a value is neither null nor undefined.

```typescript
import { isNotNullish } from '@ffsm/nullish';

// In conditional statements
if (isNotNullish(user)) {
  // TypeScript knows user is not null or undefined here
  console.log(user.name);
}

// In array filtering
const validItems = items.filter(isNotNullish);
```

### nullish

Provide a default value for null or undefined values.

```typescript
import { nullish } from '@ffsm/nullish';

// Basic example with explicit return type
const name = nullish<string>(user.name, 'Anonymous User');

// Use with data processing pipelines
const processedData = pipe(
  getData(),
  (data) => nullish<any[]>(data, []),
  (array) => array.map((item) => nullish<number>(item.value, 0))
);

// Use with configuration objects
const config = {
  timeout: nullish<number>(userConfig.timeout, 1000),
  retries: nullish<number>(userConfig.retries, 3),
  baseUrl: nullish<string>(userConfig.baseUrl, 'https://api.example.com'),
};
```

### chain

Chain multiple functions together, applying each one to the result of the previous function only if the value is not nullish.

```typescript
import { chain } from '@ffsm/nullish';

// Transform a string through multiple operations
const result = chain(
  'hello world',
  (str) => str.toUpperCase(),
  (str) => str.replace('WORLD', 'TYPESCRIPT')
);
// result: "HELLO TYPESCRIPT"

// Will skip operations if value is nullish
const nullResult = chain(null, (str) => str.toUpperCase());
// nullResult: null
```

### map

Map a value through a series of transformation functions, stopping if any intermediate result is nullish.

```typescript
import { map } from '@ffsm/nullish';

// Transform data with type conversion
const length = map('Hello, World!', (str) => str.length);
// length: 13

// Process user data
const userAge = map(
  getUserData(),
  (data) => data.user,
  (user) => user.profile,
  (profile) => profile.age
);
// Returns age or null/undefined if any step fails
```

### tryNull

Execute a function and return its result, or null if an error is thrown.

```typescript
import { tryNull } from '@ffsm/nullish';

// Safely parse JSON
const userData = tryNull(() => JSON.parse(userDataString));

// Safely access DOM elements
const element = tryNull(() =>
  document.getElementById('app')?.getBoundingClientRect()
);
```

### hocTryNull

Higher-order function that wraps a function to catch errors and return null instead.

```typescript
import { hocTryNull } from '@ffsm/nullish';

// Create a safe version of JSON.parse
const safeParse = hocTryNull(JSON.parse);

// Use it without try/catch blocks
const config = safeParse(configString);
const user = safeParse(userString);
```

### isNullishOrEmpty

Check if a value is nullish, an empty array, an empty object, or an empty string.

```typescript
import { isNullishOrEmpty } from '@ffsm/nullish';

// Validate form inputs
if (isNullishOrEmpty(username)) {
  showError('Username is required');
}

// Check if data is available before processing
if (!isNullishOrEmpty(searchResults)) {
  displayResults(searchResults);
} else {
  showNoResultsMessage();
}
```

### coalesce

Return the first non-nullish value from the provided arguments, or null if all are nullish.

```typescript
import { coalesce } from '@ffsm/nullish';

// Get user display name from multiple sources
const displayName = coalesce(
  user.nickname,
  user.username,
  user.email,
  'Anonymous User'
);

// Use with configuration
const apiUrl = coalesce(
  process.env.API_URL,
  config.apiUrl,
  'https://api.default.com'
);
```

### coalesceRight

Return the last non-nullish value from the provided arguments, or null if all are nullish.

```typescript
import { coalesceRight } from '@ffsm/nullish';

// Prioritize later values (useful for overrides)
const theme = coalesceRight(
  defaultTheme, // Lowest priority
  userTheme, // Medium priority
  sessionTheme // Highest priority
);

// Configuration with specific overrides
const timeout = coalesceRight(
  1000, // Default
  globalConfig.timeout, // Global override
  requestConfig.timeout // Specific override
);
```

### every

Check if every element in an array is not nullish.

```typescript
import { every } from '@ffsm/nullish';

// Validate required fields
const requiredFields = [name, email, password];
if (every(requiredFields)) {
  submitForm();
} else {
  showErrorMessage('All fields are required');
}

// Ensure complete data before processing
if (every(userData)) {
  processUserData(userData);
}
```

### some

Check if at least one element in an array is not nullish.

```typescript
import { some } from '@ffsm/nullish';

// Check if any contact method is available
const contactMethods = [user.email, user.phone, user.address];
if (some(contactMethods)) {
  enableContactButton();
} else {
  showWarning('No contact methods available');
}
```

### swap

Swap null with undefined and vice versa.

```typescript
import { swap } from '@ffsm/nullish';

// Convert null to undefined for optional parameters
function processUser(user, options = swap(null)) {
  // Now options is undefined instead of null
}

// Convert undefined to null for API requirements
const payload = {
  name: user.name,
  email: user.email,
  phone: swap(user.phone), // Convert undefined to null if phone is undefined
};
```

### until

Processes a value through a series of functions until a non-nullish result is produced.

```typescript
import { until } from '@ffsm/nullish';

// Finding the first available value in a fallback chain
const username = until(
  null,
  () => user.preferredName,
  () => user.firstName + ' ' + user.lastName,
  () => 'Guest_' + user.id,
  () => 'Anonymous'
);
// Returns the first non-nullish value from the chain of attempts

// Finding a valid configuration value
const apiEndpoint = until(
  config.customEndpoint, // If this exists, use it immediately
  () => process.env.API_ENDPOINT,
  () => localStorage.getItem('apiEndpoint'),
  () => 'https://api.default.com'
);

// Generating and validating in a single chain
const validId = until(
  null,
  () => generateRandomId(),
  (id) => (isValidFormat(id) ? id : null), // Return null to try next function
  () => 'default-id-12345'
);

// Early return if value already exists
const existingData = until(
  cachedData, // If not nullish, functions won't be executed
  () => fetchFromDatabase(),
  () => fetchFromAPI()
);
```

#### Key Features

- **Early Return**: If the initial value is not nullish, returns immediately without executing any functions
- **Sequential Processing**: Applies functions in order until a non-nullish result is found
- **Fallback Chain**: Perfect for implementing priority-based fallback strategies
- **Short-Circuit Evaluation**: Stops processing as soon as a valid value is found
- **Recovery Mechanism**: Can be used to recover from nullish values with multiple strategies

#### When to Use

Use `until` when you have multiple ways to obtain a value and want to try them in a specific order until one succeeds. It's particularly useful for:

- Implementing fallback chains for configuration values
- Setting default values with multiple alternatives
- Attempting recovery operations in sequence
- Loading data from multiple possible sources in order of preference

Unlike `map` which stops when it encounters a nullish value, `until` stops when it finds a non-nullish value, making it ideal for fallback scenarios.

## Type Safety Benefits

All functions in this package are designed with TypeScript type predicates, which means they provide excellent type narrowing in conditional blocks:

```typescript
// Example of type narrowing with isNullish
function processUser(user: User | null | undefined) {
  if (isNullish(user)) {
    // TypeScript knows user is null | undefined here
    return createDefaultUser();
  }

  // TypeScript knows user is User here (neither null nor undefined)
  return processUserData(user);
}
```

## TypeScript Support

All functions have full TypeScript support with type predicates and type generics, giving you accurate type checking when using them.

## License

MIT
