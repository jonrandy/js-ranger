const
  RANGER_SYMBOL = Symbol('ranger'),
  paramsStore = {}

let isInitialised = false


// attach the range syntax to the target object, using the given function to generate the range
export function attach(target, rangeFunc) {
  !isInitialised && init()
  target[Symbol.iterator] = function* range() {
    yield [ RANGER_SYMBOL, target, getTempRangeMethodSymbol(target, this, rangeFunc) ]
  }
}


// do one time initialisation (set up the toPrimitive trick on Array)
function init() {
  // set up our 'toPrimitive' method on the Array prototype
  Array.prototype[Symbol.toPrimitive] = function (hint) {
    // try to leave as much default behaviour alone as possible
    if (hint === 'default') return this.toString()
    if (hint === 'number') return Number(this.toString())
    if (!isValidRangerArray(this)) return this.toString()
    // return the symbol that 'names' the method on the target object
    paramsStore[this[0][2]] = this.slice(1)
    return this[0][2]
  }
}


// create the one-time temporary method for the target, attach it, and return symbol 'name'
function getTempRangeMethodSymbol(target, rangeEndValue, func) {
  const sym = Symbol('ranger temp method')
  const get = function() {
    let res = func.call(this, this, rangeEndValue, ...paramsStore[sym])
    delete target[sym]
    delete paramsStore[sym]
    return res
  }
  Object.defineProperty(target, sym, { configurable: true, get })
  return sym
}

// check if given array is a 'Ranger' array
const isValidRangerArray = ([[rangerSym, target, methodSym]]) =>
  rangerSym === RANGER_SYMBOL && target.hasOwnProperty(methodSym)


// sample usage - range function for numbers, with optional step size
// e.g. 27[[...42]] 1[[...3, 0.5]]
export function initNumberRangeSyntax() {
  attach(Number.prototype, (start, end, stepSize = 1) => {
    const absStep = stepSize<0 ? Math.abs(stepSize) : stepSize
    const step = start<=end ? absStep : -absStep
    let arr = [], i, d = end > start
    for (i=+start; d ? i<=end : i>=end; i+=step) arr.push(i)
    return arr
  })
}
