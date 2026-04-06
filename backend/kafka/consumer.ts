 import { Kafka, Consumer } from "kafkajs";

const kafka = new Kafka({
  clientId: "merchant-manager",
  brokers: ["kafka:9092"],
});

const consumer: Consumer = kafka.consumer({ groupId: "merchant-group" });

export const startConsumer = async (topic: string) => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });
    },
  });
};
