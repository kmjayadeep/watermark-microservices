const pubsubLib = require('./pubsub');

async function publishEvent(topicName, data) {
  const pubsub = pubsubLib.createPubsub();

  const messageId = await pubsubLib.publish(pubsub, topicName, data);
  console.log(`Message ${messageId} published to topic ${topicName}`);
  return messageId;
}

exports.publishEvent = publishEvent;
