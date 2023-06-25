import express from "express";
import { successResponse, errorResponse, isErrorResponse } from "apiUtils";
import { NewOrderSingle } from "orders";
import { validateNewOrderSingle } from "validation";
import { storeOrder } from "store";
import { reqToFIX, sendFIXMessage } from "fix";
import { putOrderOnEventBus } from "bus";

const app = express();
app.use(express.json());

app.post("/place_order", async function placeOrder(req, res) {
  let order: NewOrderSingle;
  try {
    order = validateNewOrderSingle(req.body);

    // // serial execution alternative
    // const storeResponse = await storeOrder(order);

    // const executionResponse = await sendFIXMessage(reqToFIX(order));
    // if (isErrorResponse(executionResponse)) {
    //   throw new Error(executionResponse.errmsg);
    // }

    // const { transactionId } = executionResponse.data;
    // // success response
    // res.json(
    //   successResponse<{
    //     orderId: NewOrderSingle["requestID"];
    //     transactionId: unknown;
    //   }>({
    //     orderId: order.requestID,
    //     transactionId,
    //   })
    // );

    // putOrderOnEventBus(order).catch((err) => {
    //   console.error(`Failed to put order on the event bus: ${err.message}`);
    // });
  } catch (err) {
    console.error(`Failed order execution: ${(err as Error).message}`);
    return res.json(errorResponse((err as Error).message));
  }

  /**
   * Design discussion: When to resolve the API response for the valid order request?
   * For this exercise:
   *    Successful API response will be returned upon the resolution of the execution request.
   *    This means that we could potentially fail to persist the message to store. We can discuss this.
   */

  // Fire off first storing order asynchronously.
  // Would move after the execution step ideally, but will respect that this is fired before execution per google doc.
  storeOrder(order).catch((err) => {
    // Logging out to console, however in production would have a logging framework in place
    console.error(`Failed persisting order: ${err.message}`);
  });

  try {
    // fire off execution, storeOrder is running in parallel
    const executionResponse = await sendFIXMessage(reqToFIX(order));
    if (isErrorResponse(executionResponse)) {
      throw new Error(executionResponse.errmsg);
    }

    const { transactionId } = executionResponse.data;
    // success response
    res.json(
      successResponse<{
        orderId: NewOrderSingle["requestID"];
        transactionId: unknown;
      }>({
        orderId: order.requestID,
        transactionId,
      })
    );

    // Only send out order on the event bus if there was a successful execution
    // handle event bus exception as to not confuse it with order execution failure
    putOrderOnEventBus(order).catch((err) => {
      console.error(`Failed to put order on the event bus: ${err.message}`);
    });
  } catch (err) {
    console.error(
      `Failed submitting order execution: ${(err as Error).message}`
    );
    res.json(errorResponse("Order execution failed"));
  }
});

// Respond with 404 for all undefined routes
app.use((_, res) => {
  res.status(404).send("Not Found");
});

// Note: In a production ready app,
// PORT would come from an environment specific configuration.
app.listen(3000);
