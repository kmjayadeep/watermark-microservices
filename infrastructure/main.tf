provider "google" {
  version = "3.0.0"
  credentials = file("key.json")
  project     = var.project
  zone        = var.zone
}

provider "google-beta" {
  version     = "3.0.0"
  credentials = file("key.json")
  project     = var.project
  zone        = var.zone
}

provider "kubernetes" {
  version = "~> 1.7"

  host     = "https://${google_container_cluster.watermark_development_cluster.endpoint}"
  username = var.master_username
  password = var.master_password

  client_certificate     = "${base64decode(google_container_cluster.watermark_development_cluster.master_auth.0.client_certificate)}"
  client_key             = "${base64decode(google_container_cluster.watermark_development_cluster.master_auth.0.client_key)}"
  cluster_ca_certificate = "${base64decode(google_container_cluster.watermark_development_cluster.master_auth.0.cluster_ca_certificate)}"
}

resource "google_container_cluster" "watermark_development_cluster" {
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


resource "google_container_node_pool" "primary_preemptible_nodes" {
  name               = var.node_pool_name
  cluster            = google_container_cluster.watermark_development_cluster.name
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

