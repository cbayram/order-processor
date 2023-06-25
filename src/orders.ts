export type NewOrderSingle = {
  requestID: string;
  symbol: APISymbol;
  side: Side;
  quantity: number;
  price: number;
};

// Symbol is a built-in JS object, hence APISymbol
export enum APISymbol {
  AAPL = "AAPL",
}
export enum Side {
  BUY = "buy",
  SELL = "sell",
}
// Generating an O(1) lookups Set from enum values
export const symbols = new Set(Object.values<string>(APISymbol));
export const sides = new Set(Object.values<string>(Side));
