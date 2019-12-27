provider "google" {
  credentials = file("key.json")
  region      = "europe-west1"
  zone        = "europe-west1-b"
  # project     = "my-project-id"
}

resource "google_compute_network" "watermark_development" {
  name                    = "watermark-development"
  auto_create_subnetworks = "false"
}

resource "google_compute_subnetwork" "gkecluster" {
  name          = "gkecluster"
  ip_cidr_range = "10.0.1.0/24"
  network       = google_compute_network.watermark_development.self_link
}

resource "google_container_cluster" "watermark_development_cluster" {
  name               = "watermark-development-cluster"
  remove_default_node_pool = true
  initial_node_count       = 1
  network            = "watermark-development"
  subnetwork         = "gkecluster"
  min_master_version = "1.15.4-gke.22"

  master_auth {
    username = ""
    password = ""

    client_certificate_config {
      issue_client_certificate = false
    }
  }
}


resource "google_container_node_pool" "primary_preemptible_nodes" {
  name       = "my-node-pool"
  cluster    = google_container_cluster.watermark_development_cluster.name
  node_count = 2

  node_config {
    preemptible  = true
    machine_type = "n1-standard-1"

    metadata = {
      disable-legacy-endpoints = "true"
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}

