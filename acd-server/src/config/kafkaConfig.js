import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'acd-server',
  brokers: [process.env.KAFKA_BROKER], // đổi theo môi trường
});

export default kafka;
