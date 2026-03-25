---
title: Complete javascript syllabus to study
description: "Javascript syllabus with important topics list."
author: random coders
date: 5 Sep 2025
image: "/Images/blogs/b3.jpg"
keywords: "js syllabus"
testing: ["sample", "accept"]
isBlog: Yes
---

## Typescript with react & nextjs

## To run .ts file use this commands

This will run .ts file directly in terminal

```npm
node filename.ts
```

This will create .js file from .ts file then we need index.html to run this file

```npm
tsc filename.ts
```

## Data types in typescript / Javascripts

```js
var myName = "kundalik";
```

Here..
var - variable
myName - variable Name
"kudalik" - data

![alt text](image-1.png)

Now in typescript this is

```ts
let myName: string = "kundalik";
```

## Javascript topics

1. Variables
2. Datatypes
3. String and its methods
4. Number & methods
5. Boolean & methods
6. Object
7. Array
8. Functions
9. Closures
10. Promises and async/await
11. Callbacks
12. Event loop
13. DOM manipulation
14. ES6+ features (e.g., arrow functions, destructuring, spread/rest operators)
15. Modules and imports/exports
16. Error handling (try/catch)
17. Prototypes and inheritance
18. Classes
19. JSON and APIs
20. Event handling
21. Regular expressions
22. LocalStorage and SessionStorage
23. Web APIs (e.g., Fetch API, Geolocation API)
24. Debugging and performance optimization

### Very important topics that must to understand in javascript

1. Scope (block, function, and global)
2. Hoisting
3. Closures
4. The "this" keyword
5. Event delegation
6. Asynchronous JavaScript (callbacks, promises, async/await)
7. Prototype chain
8. The event loop and concurrency model
9. ES6+ features (e.g., destructuring, template literals, default parameters)
10. Modules and tree-shaking
11. Error handling and debugging
12. Memory management and garbage collection
13. Functional programming concepts (e.g., map, filter, reduce)
14. Immutable data structures
15. Performance optimization techniques

### String methods

````markdown
#### Commonly Used String Methods

1. **`length`** - Returns the length of the string.

   ```js
   let str = "hello";
   console.log(str.length); // 5
   ```

2. **`toUpperCase()`** - Converts the string to uppercase.

   ```js
   let str = "hello";
   console.log(str.toUpperCase()); // "HELLO"
   ```

3. **`toLowerCase()`** - Converts the string to lowercase.

   ```js
   let str = "HELLO";
   console.log(str.toLowerCase()); // "hello"
   ```

4. **`trim()`** - Removes whitespace from both ends of the string.

   ```js
   let str = "  hello  ";
   console.log(str.trim()); // "hello"
   ```

5. **`includes()`** - Checks if the string contains a specified substring.

   ```js
   let str = "hello world";
   console.log(str.includes("world")); // true
   ```

6. **`startsWith()`** - Checks if the string starts with a specified substring.

   ```js
   let str = "hello world";
   console.log(str.startsWith("hello")); // true
   ```

7. **`endsWith()`** - Checks if the string ends with a specified substring.

   ```js
   let str = "hello world";
   console.log(str.endsWith("world")); // true
   ```

8. **`slice()`** - Extracts a section of the string and returns it as a new string.

   ```js
   let str = "hello world";
   console.log(str.slice(0, 5)); // "hello"
   ```

9. **`substring()`** - Similar to `slice()`, but does not accept negative indices.

   ```js
   let str = "hello world";
   console.log(str.substring(0, 5)); // "hello"
   ```

10. **`replace()`** - Replaces a specified value with another value in the string.

    ```js
    let str = "hello world";
    console.log(str.replace("world", "everyone")); // "hello everyone"
    ```

11. **`split()`** - Splits the string into an array of substrings.

    ```js
    let str = "hello world";
    console.log(str.split(" ")); // ["hello", "world"]
    ```

12. **`charAt()`** - Returns the character at a specified index.

    ```js
    let str = "hello";
    console.log(str.charAt(1)); // "e"
    ```

13. **`indexOf()`** - Returns the index of the first occurrence of a specified value.

    ```js
    let str = "hello world";
    console.log(str.indexOf("world")); // 6
    ```

14. **`lastIndexOf()`** - Returns the index of the last occurrence of a specified value.

    ```js
    let str = "hello world world";
    console.log(str.lastIndexOf("world")); // 12
    ```

15. **`concat()`** - Joins two or more strings.

    ```js
    let str1 = "hello";
    let str2 = "world";
    console.log(str1.concat(" ", str2)); // "hello world"
    ```

16. **`repeat()`** - Returns a new string with a specified number of copies of the original string.

    ```js
    let str = "hello";
    console.log(str.repeat(3)); // "hellohellohello"
    ```

17. **`padStart()`** - Pads the string with another string from the start to reach a specified length.

    ```js
    let str = "5";
    console.log(str.padStart(3, "0")); // "005"
    ```

18. **`padEnd()`** - Pads the string with another string from the end to reach a specified length.

    ```js
    let str = "5";
    console.log(str.padEnd(3, "0")); // "500"
    ```

19. **`match()`** - Matches a string against a regular expression.

    ```js
    let str = "hello world";
    console.log(str.match(/world/)); // ["world"]
    ```

20. **`search()`** - Searches the string for a match against a regular expression and returns the index.

    ```js
    let str = "hello world";
    console.log(str.search(/world/)); // 6
    ```

21. **`localeCompare()`** - Compares two strings in the current locale.

    ```js
    let str1 = "apple";
    let str2 = "banana";
    console.log(str1.localeCompare(str2)); // -1
    ```

22. **`codePointAt()`** - Returns the Unicode code point of the character at a specified index.

    ```js
    let str = "hello";
    console.log(str.codePointAt(0)); // 104
    ```

23. **`normalize()`** - Returns the Unicode normalization form of the string.

    ```js
    let str = "e\u0301";
    console.log(str.normalize("NFC")); // "é"
    ```

24. **`toString()`** - Returns the string representation of the value.
    ```js
    let str = new String("hello");
    console.log(str.toString()); // "hello"
    ```
````
