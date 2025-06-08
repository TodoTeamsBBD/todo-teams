output "alb_dns_name" {
  value = module.api.alb_dns_name
}

output "db_endpoint" {
  value = module.database.db_endpoint
}