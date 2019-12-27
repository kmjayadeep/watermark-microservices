variable "cluster_name" {
  default = "watermark-development-cluster"
}

variable "node_pool_name" {
  default = "watermark-node-pool"
}

variable "project" {
  default = "watermark-260413"
  description = "GCP Project Id"
}

variable "zone" {
  description = "The zone in which all GCP resources will be launched."
  default     = "us-east1"
}

variable "min_master_version" {
  default = "1.15.4-gke.22"
}
variable "master_username" {
  description = "GKE cluster master username"
}

variable "master_password" {
  description = "GKE cluster master password"
}

variable "machine_type" {
  description = "Node machine type"
  default     = "n1-standard-1"
}

variable "min_node_count" {
  description = "GKE cluster initial node count and min node count value"
  default     = 1
}

variable "max_node_count" {
  description = "GKE cluster maximun node autoscaling count"
  default     = 5
}