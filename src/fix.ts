/**
 * In a larger production project as needs grow,
 *  I'd look at and evaluate third-party fix libraries for managing session/logon, heartbeat,
 *  and sending & receiving of other messages.
 * For this exercise, I'll implement a minimal custom FIX helpers.
 */
import { NewOrderSingle } from "orders";
import { Response } from "apiUtils";

export const SOH = String.fromCharCode(1);
// Assuming case-sensitivity in order mapping keys; i.e. requestid vs requestID
// This mapping could get more flexible handling different message types.
const FIX_TAG_MAPPING: Record<keyof NewOrderSingle, number> = {
  symbol: 55,
  quantity: 38,
  price: 44,
  side: 54,
  requestID: 50,
};

// Assuming valid order
export function reqToFIX(validatedOrder: NewOrderSingle): string {
  let msg = `35=D${SOH}`;
  for (const [key, value] of Object.entries(validatedOrder)) {
    msg += `${FIX_TAG_MAPPING[key as keyof NewOrderSingle]}=${value}${SOH}`;
  }
  const bodyLength = msg.length;
  const fixMsgWithoutChecksum = `8=FIX.4.2${SOH}9=${bodyLength}${SOH}${msg}`;

  // Compute trailer checksum
  let asciiSum = 0;
  for (let i = 0; i < fixMsgWithoutChecksum.length; i++) {
    asciiSum += fixMsgWithoutChecksum.charCodeAt(i);
  }
  // Tag 10 (checksum) must be 3 characters long
  const checksum = (asciiSum % 256).toString().padStart(3, "0");

  return `${fixMsgWithoutChecksum}10=${checksum}${SOH}`;
}

export type ExecutionSuccessResponsePayload = { transactionId: number };

export async function sendFIXMessage(
  fixMsg: string
): Promise<Response<ExecutionSuccessResponsePayload>> {
  const response = await fetch("http://trade-exec.com:5000", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: fixMsg,
  });

  return response.json();
}
