import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
  clientId: "merchant-manager",
  brokers: ["kafka:9092"],
});

const producer: Producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer Connected");
};

export const sendMessage = async (topic: string, message: any) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};
