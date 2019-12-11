
const graphqlFetch = (endPoint, data) => fetch(endPoint, {
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data),
  method: "POST",
}).then(res => res.json());

module.exports = graphqlFetch;
