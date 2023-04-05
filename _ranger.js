// When we 'spread' a number, set up a temporary method on the Number
// prototype that will return our final result, and get the Symbol
// that is the 'name' of this method
Number.prototype[Symbol.iterator] = function *range() {
  yield attachTempNumRangeMethod(+this)
}

// Create a preconfigured range method, and attach it to the Number
// prototype (idea from Metho)
function attachTempNumRangeMethod(rangeEnd) {
  const s = Symbol()
  Object.defineProperty(
    Number.prototype, s,
    { configurable: true, get: makeRangeMethod(rangeEnd, s) }
  )
  return s
}

// Create a function to count from or to the given end value, then
// delete itself from the Number prototype (idea from Metho-number)
function makeRangeMethod(end, sym) {
  return function range() {
    const step = this<=end ? 1 : -1
    let arr = [], i, d = end>this
    for (i=+this; d ? i<=end : i>=end; i+=step) arr.push(i)
    delete Number.prototype[sym]
    return arr
  }
}

// Set up a 'toPrimitive' method on the Array prototype so we can
// hijack it if we spot an array containing a Number method symbol
// we previously set up (idea from Turboprop)
Array.prototype[Symbol.toPrimitive] = function (hint) {
  // this is dangerous, so try to and leave all default behaviour alone:
  if (hint === 'default') return this.toString()
  if (hint === 'number') return Number(this.toString())
  if (this.length != 1 && !Number.prototype.hasOwnProperty(this[0]))
    return this.toString()
  // return our symbol that names the Number method
  return this[0]
}
