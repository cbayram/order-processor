/**
 * Node.js 20 has its own test runner, allowing one to deprecate third-party test runner like jest
 * Skipping testing other validation methods for this exercise, only testing isValidNewOrderSingle
 */
import { validateNewOrderSingle } from "validation";

describe("validateNewOrderSingle", () => {
  it("fails on invalid order objects", () => {
    // empty object
    expect(() => validateNewOrderSingle({})).toThrow();
    expect(() =>
      validateNewOrderSingle({
        requestID: 999, // not string
        symbol: "AAPL",
        quantity: 100,
        price: 135.5,
        side: "buy",
      })
    ).toThrow();
    expect(() =>
      validateNewOrderSingle({
        requestID: "123ABC",
        symbol: "TSLA", // unknown symbol
        quantity: 100,
        price: 135.5,
        side: "buy",
      })
    ).toThrow();
    expect(() =>
      validateNewOrderSingle({
        requestID: "123ABC",
        symbol: "AAPL",
        quantity: 0, // must be positive number
        price: -135.5, // must be positive number
        side: "buy",
      })
    ).toThrow();
    expect(() =>
      validateNewOrderSingle({
        requestID: "123ABC",
        symbol: "AAPL",
        quantity: 100,
        price: 135.5,
        side: "short", // unknown side
      })
    ).toThrow();
  });

  it("passes on valid order objects", () => {
    expect(
      validateNewOrderSingle({
        requestID: "123ABC",
        symbol: "AAPL",
        quantity: 100,
        price: 135.5,
        side: "buy",
      })
    ).toStrictEqual({
      requestID: "123ABC",
      symbol: "AAPL",
      quantity: 100,
      price: 135.5,
      side: "buy",
    });
    expect(
      validateNewOrderSingle({
        requestID: "123ABC",
        symbol: "AAPL",
        quantity: 100,
        price: 137.5,
        side: "sell",
      })
    ).toStrictEqual({
      requestID: "123ABC",
      symbol: "AAPL",
      quantity: 100,
      price: 137.5,
      side: "sell",
    });

    expect(
      validateNewOrderSingle({
        requestID: "123ABC",
        symbol: "AAPL",
        quantity: 100,
        price: 137.5,
        side: "sell",
        additional: "prop",
      })
    ).toStrictEqual({
      requestID: "123ABC",
      symbol: "AAPL",
      quantity: 100,
      price: 137.5,
      side: "sell",
    });
  });
});
