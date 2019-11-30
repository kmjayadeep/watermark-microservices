const { PubSub } = require('@google-cloud/pubsub');
const projectId = 'watermark-260413';

async function publishEvent(topicName, data) {
  const pubsub = new PubSub({ projectId });

  const dataBuffer = Buffer.from(data);

  const messageId = await pubsub.topic(topicName).publish(dataBuffer);
  console.log(`Message ${messageId} published.`);
  return messageId;
}

exports.publishEvent = publishEvent;