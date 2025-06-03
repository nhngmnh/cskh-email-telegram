import kafka from "../config/kafkaConfig.js";
const producer = kafka.producer();
let isConnected = false;

async function sendAcdResult(topic,acdResult) {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log('Kafka producer connected (once)');
  }

  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(acdResult),
      },
    ],
  });
  console.log(`message send: ${acdResult}`);
  
}

export {
    sendAcdResult
}