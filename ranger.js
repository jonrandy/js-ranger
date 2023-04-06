const RANGER_SYMBOL = Symbol('ranger')

let isInitialised = false

export function attach(target, rangeFunc) {

  !isInitialised && init()
	
}

export function initNumberRangeSyntax() {
	
}


function init() {

  // set up our 'toPrimitive' method on the Array prototype
  Array.prototype[Symbol.toPrimitive] = function (hint) {
    // try to leave as much default behaviour alone as possible
    if (hint === 'default') return this.toString()
    if (hint === 'number') return Number(this.toString())
    if (!isValidRangerArray(this)) return this.toString()
    // return the symbol that 'names' the method on the target object
    return this[2]
  }

}

function isValidRangerArray(arr) {

}