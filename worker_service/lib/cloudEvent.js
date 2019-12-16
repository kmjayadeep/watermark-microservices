const { PubSub } = require('@google-cloud/pubsub');

async function publishEvent(topicName, data) {
  const pubsub = new PubSub();

  try {
    await pubsub.createTopic(topicName)
  } catch (error) {
    console.log('unable to create topic, likely that topic already exists');
  }

  const dataBuffer = Buffer.from(data);

  const messageId = await pubsub.topic(topicName).publish(dataBuffer);
  console.log(`Message ${messageId} published.`);
  return messageId;
}

exports.publishEvent = publishEvent;
