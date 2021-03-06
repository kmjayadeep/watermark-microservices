output "master_version" {
  value = google_container_cluster.gke_cluster.master_version
}

output "endpoint" {
  value = google_container_cluster.gke_cluster.endpoint
}

output "admin_username" {
  value = "${var.master_username}"
}

output "admin_password" {
  value = "${var.master_password}"
}