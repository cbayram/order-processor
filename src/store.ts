import { InsertOneResult, MongoClient } from "mongodb";
import { NewOrderSingle } from "orders";

export async function storeOrder(
  order: NewOrderSingle
): Promise<InsertOneResult<Document>> {
  // This client can be managed by a client pool manager.
  const client = new MongoClient("<connection string uri>");
  try {
    const db = client.db("tradeDB");
    const orders = db.collection("orders");
    const result = await orders.insertOne({ timestamp: Date.now(), ...order });
    return result;
  } finally {
    client.close();
  }
}
