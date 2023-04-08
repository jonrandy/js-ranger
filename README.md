# Ranger

Ranger is a small JS library that allows you to use a range-like syntax with any object. All you need to do is to define a function that builds the required 'range' given a starting and ending object (+ optional extra parameters if you so desire).

The 'range' syntax is as follows:

`rangeStart[[...rangeEnd`*`, optionalParam1, optionalParam2...`*`]]`

So, for example, if you created a range function for `Number`s - you could then use it as follows:
```javascript
// create a range of numbers from 1-10
const numbers = 1[[...10]]

// log the numbers from 6-3
6[[...3]].forEach(x => console.log(x))
```

## How to Use

Usage is extremely simple, just import the `attach` function and use it to set up the range function on your required object:
```js
import { attach } from '@jonrandy/js-ranger'

const myRangeFunction = (start, end) => {
  // logic to return 'range' here
}
attach(myObject, myRangeFunction)
```

If you pass in optional parameters according to the syntax detailed at the start of this README, they will simply be passed as additional arguments to your range function. Your 'range' making function can return anything - it doesn't have to be an array.

## Number Ranges

Also exported by the library as an example of usage is a function called `initNumberRangeSyntax`  that sets up a basic range syntax on the `Number` prototype - that does pretty much what you would expect. It can also take an additional `stepSize` parameter that defaults to `1` and decides the (absolute) size of the steps between items in the range:
```js
import { initNumberRangeSyntax } from '@jonrandy/js-ranger'
initNumberRangeSyntax()
console.log(1[[...3]])  // [1, 2, 3]
console.log(5[[...2]])  // [5, 4, 3, 2]
console.log(0[[...3, 0.75]]) // [0, 0.75, 1.5, 2.25, 3]
console.log(2[[...0, 0.5]]) // [2, 1.5, 1, 0.5, 0]
```
The internals of the `initNumberRangeSyntax` function:
```js
attach(Number.prototype, (start, end, stepSize = 1) => {
  const absStep = stepSize<0 ? Math.abs(stepSize) : stepSize
  const step = start<=end ? absStep : -absStep
  let arr = [], i, d = end > start
  for (i=+start; d ? i<=end : i>=end; i+=step) arr.push(i)
  return arr
})
```

## Possible Usages

This was written as a general purpose tool that could have any number of potential uses. Some random ideas:
```js
const myDateRange = date1[[...date2]]
const myRoute = location1[[...location2, {via: location3}]]
const myLine = point1[[...point2]]
const translator = language1[[...language2]] // could return a function that takes strings in one language and translates to another
```

## WARNING

Whilst care has been taken to minimise potential issues, the techniques used in this library (modifying the [`Symbol.toPrimitive`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive) method on the `Array` prototype, and [`Symbol.iterator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator) method on your target object) **could** cause issues with other libraries (and violence in code reviews!) - so thorough testing is advised if you intend to use this in any production code.
