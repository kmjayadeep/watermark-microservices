# Watermarking service

A microservices based prject to watermark a document asynchronously.

## Architecture

![Image of Yaktocat](assets/architecture.png)

## Tech stack

1. Kubernetes (GKE)
2. Knative serving and eventing
3. PubSub
4. Nodejs, ExpressJS, Mongodb, GraphQL
5. grpc

## Knative setup

* Create gcloud cluster :- n1-standard-1 VM 1-5 nodes with istio setup

```
export CLUSTER_NAME=knative
export CLUSTER_ZONE=us-west1-c
```

```
gcloud beta container clusters create $CLUSTER_NAME \
  --addons=HorizontalPodAutoscaling,HttpLoadBalancing,Istio \
  --machine-type=n1-standard-1 \
  --cluster-version=latest --zone=$CLUSTER_ZONE \
  --enable-stackdriver-kubernetes --enable-ip-alias \
  --enable-autoscaling --min-nodes=1 --max-nodes=5 \
  --enable-autorepair \
  --scopes cloud-platform
```

* Install Knative serving, Eventing and istio extras

```
kubectl apply --selector knative.dev/crd-install=true \
   --filename https://github.com/knative/serving/releases/download/v0.10.0/serving.yaml \
   --filename https://github.com/knative/eventing/releases/download/v0.10.0/release.yaml

kubectl apply --filename https://github.com/knative/serving/releases/download/v0.10.0/serving.yaml \
   --filename https://github.com/knative/eventing/releases/download/v0.10.0/release.yaml

kubectl apply -f https://raw.githubusercontent.com/knative/serving/master/third_party/istio-1.3.5/istio-knative-extras.yaml
```

* Create service account credentials with permissions to access firestore and pubsub.
* Export credentials in json and convert into base64. Edit google-cloud-key-secret.yaml and replace `<KEY HERE IN BASE64>`

```
kubectl apply -f google-cloud-key-secret.yaml
```

* Config Domain

Get external IP address from the following command

```
kubectl get svc istio-ingressgateway -n istio-system -o jsonpath="{.status.loadBalancer.ingress[0].ip}"
```

Replace the IP in `config-domain.yaml` file and apply the config

```
kubectl apply -f config-domain.yaml
```

### Setting up Services

* Ticketing service

```
kubectl apply -f ticketing_service/ticketing-knative-service.yaml
```

* Status service

```
kubectl apply -f status_service/status-knative-service.yaml
```

* Worker service

```
kubectl apply -f worker_service/worker-knative-service.yaml
```

* Watermark result service

```
kubectl apply -f result_service/result-knative-service.yaml
```

## Setting up events

Install PubSub

```
kubectl apply --selector events.cloud.google.com/crd-install=true \
--filename https://github.com/google/knative-gcp/releases/download/v0.10.0/cloud-run-events.yaml

kubectl apply --filename https://github.com/google/knative-gcp/releases/download/v0.10.0/cloud-run-events.yaml
```

Open gcp-pubsub-source.yaml, update the sink urls with the service urls and apply the configuration


```
kubectl apply -f gcp-pubsub-source.yaml
```

### Checking Service Logs

Use any of the following commands to view the logs of a particular running service

```
kubectl logs --selector serving.knative.dev/service=ticketing-service -c user-container -f
kubectl logs --selector serving.knative.dev/service=status-service -c user-container -f
kubectl logs --selector serving.knative.dev/service=result-service -c user-container -f
kubectl logs --selector serving.knative.dev/service=worker-service -c user-container -f
```

### Running e2e tests

Go to e2e folder and run the following commands

* Run full test suite

```
npm test
```

* Run full test suite and serve results in allure dashboard

```
npm run allure
```

* Run tests with allure reporting

```
npm run allure:test
```

* Serve previous test results in allure dashboard

```
npm run allure:serve
```

Sample response

```

   ✔ Got ticketId 56188b13-85bb-4d9b-9c95-7ba0e6e0be93 for request with params book,my-awesome-book,me,business
    - Creating a new request for checking status
    - Got ticketId 7724f5a4-1029-41de-b925-cd3e08f2bedd
    ✔ Got request status NONE
    - Creating a new request for checking result
    - Got ticketId 667dda9c-d897-4701-8c58-b4fb8bb647e5
    ✔ Got document result my-test-title book null me
    - Creating a new request with params book,my-awesome-book,me,business
    - Got ticketId 68a0de25-f7f8-4832-9988-a8dd95a7cf6c
    - Checking status for 68a0de25-f7f8-4832-9988-a8dd95a7cf6c
    - Current status is PENDING
    - Checking status for 68a0de25-f7f8-4832-9988-a8dd95a7cf6c
    - Current status is PENDING
    - Checking status for 68a0de25-f7f8-4832-9988-a8dd95a7cf6c
    - Current status is PENDING
    - Checking status for 68a0de25-f7f8-4832-9988-a8dd95a7cf6c
    - Current status is PENDING
    - Checking status for 68a0de25-f7f8-4832-9988-a8dd95a7cf6c
    - Current status is PENDING
    - Checking status for 68a0de25-f7f8-4832-9988-a8dd95a7cf6c
    - Current status is PENDING
    - Checking status for 68a0de25-f7f8-4832-9988-a8dd95a7cf6c
    - Current status is PENDING
    - Checking status for 68a0de25-f7f8-4832-9988-a8dd95a7cf6c
    - Current status is PENDING
    - Checking status for 68a0de25-f7f8-4832-9988-a8dd95a7cf6c
    - Current status is FINISHED
    ✔ Got watermark WATERMARK : {"content":"book","title":"my-awesome-book","author":"me","topic":"business"} 1576119468500

```