import { Kafka, Producer, Partitioners } from "kafkajs";

const kafka = new Kafka({
  clientId: "merchant-manager",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer: Producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

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
