const { PubSub } = require('@google-cloud/pubsub');

const createPubsub = (projectId) => new PubSub(projectId);

const createTopic = (pubsub, topicName) => {
  return pubsub.createTopic(topicName);
}

const publish = (pubsub, topicName, data) => {
  const dataBuffer = Buffer.from(data);
  return pubsub.topic(topicName).publish(dataBuffer);
}

module.exports = {
  createPubsub,
  createTopic,
  publish,
}
