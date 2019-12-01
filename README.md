# Watermarking service

## Knative setup

* Create gcloud cluster or n1-standard-1 with 1-5 nodes with istio setup

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

* Install Knative serving

```
kubectl apply --selector knative.dev/crd-install=true \
   --filename https://github.com/knative/serving/releases/download/v0.10.0/serving.yaml

kubectl apply --filename https://github.com/knative/serving/releases/download/v0.10.0/serving.yaml

```

* export google service acount credentials in json and convert into base64. Edit google-cloud-key-secret.yaml and replace `<KEY HERE IN BASE64>`

```
kubectl apply -f google-cloud-key-secret.yaml
```

### Services

* Ticketing service

```
kubectl apply -f ticketing_service/ticketing-knative-service.yaml
```