variable "cluster_name" {
  description = "Name of kubernetes cluster"
}

variable "node_pool_name" {
  description = "Name of node pool assigned to cluster"
}

variable "project" {
  description = "GCP Project Id"
}

variable "zone" {
  description = "The zone in which all GCP resources will be launched."
}

variable "min_master_version" {
  description = "Minimum version for kubernetes master"
}
variable "master_username" {
  description = "GKE cluster master username"
}

variable "master_password" {
  description = "GKE cluster master password"
}

variable "machine_type" {
  description = "Node machine type"
}

variable "min_node_count" {
  description = "GKE cluster initial node count and min node count value"
  default     = 1
}

variable "max_node_count" {
  description = "GKE cluster maximun node autoscaling count"
  default     = 5
}