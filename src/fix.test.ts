import { reqToFIX, SOH } from "fix";
import { APISymbol, Side } from "orders";

const convertSOH = (fixMsg: string): string =>
  fixMsg.replace(new RegExp(SOH, "g"), "|");

describe("reqToFIX", () => {
  it("converts new order single JSON to valid fix message", () => {
    expect(
      convertSOH(
        reqToFIX({
          requestID: "123ABC",
          symbol: APISymbol.AAPL,
          quantity: 100,
          price: 135.5,
          side: Side.BUY,
        })
      )
    ).toEqual(
      "8=FIX.4.2|9=46|35=D|50=123ABC|55=AAPL|38=100|44=135.5|54=buy|10=130|"
    );
    expect(
      convertSOH(
        reqToFIX({
          requestID: "A12345",
          symbol: APISymbol.AAPL,
          quantity: 10,
          price: 105,
          side: Side.SELL,
        })
      )
    ).toEqual(
      "8=FIX.4.2|9=44|35=D|50=A12345|55=AAPL|38=10|44=105|54=sell|10=046|"
    );
  });
});
