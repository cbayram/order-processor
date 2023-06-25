/**
 * Custom validation for this exercise,
 *  but for larger projects would evaluate third-party validation libraries like joy.
 * Additionally, would look into options to generate openAPI validation off of an openAPI spec.
 */
import { APISymbol, Side, symbols, sides, NewOrderSingle } from "orders";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function isPositiveNumber(value: unknown): value is number {
  return isNumber(value) && value > 0;
}

function isValidSymbol(value: unknown): value is APISymbol {
  // case-insensitive validation
  return isString(value) && symbols.has(value.toLocaleUpperCase());
}

function isValidSide(value: unknown): value is Side {
  // case-insensitive validation
  return isString(value) && sides.has(value.toLocaleLowerCase());
}

export function validateNewOrderSingle(order: unknown): NewOrderSingle | never {
  // aggregating all validation errors instead of bailing on first
  const errorMessages: Array<string> = [];
  const { requestID, symbol, side, quantity, price } =
    order as Partial<NewOrderSingle>;
  if (!isString(requestID)) {
    errorMessages.push(`requestID ${requestID} must be a string`);
  }
  if (!isValidSymbol(symbol)) {
    errorMessages.push(`Unknown symbol ${symbol}`);
  }
  if (!isValidSide(side)) {
    errorMessages.push(`Unknown side ${side}`);
  }
  if (!isPositiveNumber(quantity)) {
    errorMessages.push(`quantity ${quantity} must be a positive number`);
  }
  if (!isPositiveNumber(price)) {
    errorMessages.push(`price ${price} must be a positive number`);
  }

  if (errorMessages.length > 0) {
    // this could be a custom ValidationError
    throw new Error(`Validation error: ${errorMessages.join("\n")}`);
  }

  // returning a new object trimming additional properties (we can discuss this leniency)
  return { requestID, symbol, side, quantity, price } as NewOrderSingle;
}
