import { Kafka, RecordMetadata } from "kafkajs";
import { NewOrderSingle } from "orders";

const kafka = new Kafka({
  clientId: "order-processor",
  brokers: ["kafka1:9092", "kafka2:9092"],
});
const producer = kafka.producer();

// Could batch these if needed
export function putOrderOnEventBus(
  order: NewOrderSingle
): Promise<Array<RecordMetadata>> {
  return producer.send({
    topic: "new-order-single",
    // We could also use the fix msg here value
    messages: [{ value: JSON.stringify(order) }],
  });
}
