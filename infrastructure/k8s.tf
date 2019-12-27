resource "google_compute_network" "watermark_development" {
  name                    = "watermark-development"
  auto_create_subnetworks = "false"
}

resource "google_compute_subnetwork" "gkecluster" {
  name          = "gkecluster"
  ip_cidr_range = "10.0.1.0/24"
  network       = "${google_compute_network.watermark_development.self_link}"
  region        = "europe-west1"
}
