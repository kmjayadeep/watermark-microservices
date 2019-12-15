const { createPubsub, publish } = require('./pubsub');

async function publishEvent(topicName, data) {
  const pubsub = createPubsub();

  const messageId = await publish(pubsub, topicName, data);
  console.log(`Message ${messageId} published to topic ${topicName}`);
  return messageId;
}

exports.publishEvent = publishEvent;
