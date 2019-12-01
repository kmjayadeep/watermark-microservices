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

* Install Knative serving and Eventing

```
kubectl apply --selector knative.dev/crd-install=true \
   --filename https://github.com/knative/serving/releases/download/v0.10.0/serving.yaml \
   --filename https://github.com/knative/eventing/releases/download/v0.10.0/release.yaml

kubectl apply --filename https://github.com/knative/serving/releases/download/v0.10.0/serving.yaml \
   --filename https://github.com/knative/eventing/releases/download/v0.10.0/release.yaml
```

* Export google service acount credentials in json and convert into base64. Edit google-cloud-key-secret.yaml and replace `<KEY HERE IN BASE64>`

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

* Eventing setup

Enable eventing injection in default namespace

```
kubectl label namespace default knative-eventing-injection=enabled
```

Verify with following command

```
kubectl get Broker default
```


### Setting up Services

* Ticketing service

```
kubectl apply -f ticketing_service/ticketing-knative-service.yaml
```