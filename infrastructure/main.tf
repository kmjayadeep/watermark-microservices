provider "google" {
  version = "3.0.0"
  project     = var.project
  zone        = var.zone
}

provider "google-beta" {
  version     = "3.0.0"
  project     = var.project
  zone        = var.zone
}

provider "kubernetes" {
  version = "~> 1.7"

  host     = "https://${google_container_cluster.gke_cluster.endpoint}"
  username = var.master_username
  password = var.master_password

  client_certificate     = base64decode(google_container_cluster.gke_cluster.master_auth.0.client_certificate)
  client_key             = base64decode(google_container_cluster.gke_cluster.master_auth.0.client_key)
  cluster_ca_certificate = base64decode(google_container_cluster.gke_cluster.master_auth.0.cluster_ca_certificate)
}

provider "null" {
  version = "~> 2.1"
}

resource "google_container_cluster" "gke_cluster" {
  provider                 = google-beta
  name                     = var.cluster_name
  remove_default_node_pool = true
  initial_node_count       = 1
  min_master_version       = var.min_master_version

  addons_config {
    istio_config {
      disabled = false
      auth     = "AUTH_NONE"
    }
  }

  master_auth {
    username = var.master_username
    password = var.master_password

    client_certificate_config {
      issue_client_certificate = false
    }
  }
}


resource "google_container_node_pool" "gke_node_pool" {
  name               = var.node_pool_name
  cluster            = google_container_cluster.gke_cluster.name
  initial_node_count = var.min_node_count

  autoscaling {
    max_node_count = var.max_node_count
    min_node_count = var.min_node_count
  }

  node_config {
    preemptible  = false
    machine_type = var.machine_type

    metadata = {
      disable-legacy-endpoints = "true"
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}

resource "null_resource" "install_knative" {

  triggers = {
    cluster_ep = google_container_cluster.gke_cluster.endpoint
  }

  provisioner "local-exec" {
    command = <<EOT

      echo "$${CA_CERTIFICATE}" > ca.crt
      kubectl config --kubeconfig=ci set-cluster k8s --server=$${K8S_SERVER} --certificate-authority=ca.crt
      kubectl config --kubeconfig=ci set-credentials admin --username=$${K8S_USERNAME} --password=$${K8S_PASSWORD}
      kubectl config --kubeconfig=ci set-context k8s-ci --cluster=k8s --namespace=default --user=admin
      kubectl config --kubeconfig=ci use-context k8s-ci
      export KUBECONFIG=ci

    EOT

    environment = {
      CA_CERTIFICATE = base64decode(google_container_cluster.gke_cluster.master_auth.0.cluster_ca_certificate)
      K8S_SERVER     = "https://${google_container_cluster.gke_cluster.endpoint}"
      K8S_USERNAME   = var.master_username
      K8S_PASSWORD   = var.master_password
    }
  }

  provisioner "local-exec" {
    command = <<EOT

      kubectl apply --selector knative.dev/crd-install=true \
        --filename https://github.com/knative/serving/releases/download/v0.11.0/serving.yaml \
        --filename https://github.com/knative/eventing/releases/download/v0.11.0/release.yaml


      kubectl apply --filename https://github.com/knative/serving/releases/download/v0.11.0/serving.yaml \
        --filename https://github.com/knative/eventing/releases/download/v0.11.0/release.yaml


      kubectl apply --selector events.cloud.google.com/crd-install=true \
        --filename https://github.com/google/knative-gcp/releases/download/v0.11.0/cloud-run-events.yaml

      kubectl apply --filename https://github.com/google/knative-gcp/releases/download/v0.11.0/cloud-run-events.yaml

    EOT
  }

  depends_on = [google_container_node_pool.gke_node_pool]
}