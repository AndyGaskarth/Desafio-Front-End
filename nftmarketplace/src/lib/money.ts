import Decimal from 'decimal.js'

export function multiply(a: string, quantity: number) { return new Decimal(a).mul(quantity).toDecimalPlaces(18).toFixed() }
export function sum(values: string[]) { return values.reduce((total, value) => total.plus(value), new Decimal(0)).toDecimalPlaces(18).toFixed() }
export function subtract(a: string, b: string) { return new Decimal(a).minus(b).toDecimalPlaces(18).toFixed() }
export function money(value: string) { return `${new Decimal(value).toDecimalPlaces(4).toFixed(4)} ETH` }
