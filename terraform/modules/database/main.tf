variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "private_subnets" {
  description = "List of private subnet IDs"
  type        = list(string)
}
variable "api_security_group_id" {
  description = "API security group ID"
  type = string
}

variable "db_security_group_id" {
  description = "Database security group ID"
  type = string
}
data "aws_secretsmanager_secret_version" "db_creds" {
  secret_id = "prod/todo/postgress"
}

locals {
  db_creds = jsondecode(data.aws_secretsmanager_secret_version.db_creds.secret_string)
}

resource "aws_db_instance" "postgres" {
  identifier           = "team7db"
  allocated_storage    = 20 # Minimum storage for RDS
  storage_type         = "gp2" # General Purpose SSD (cheapest option)
  engine               = "postgres"
  engine_version       = "16.4" # Latest stable version
  instance_class       = "db.t3.micro" # Cheapest instance class (free tier eligible)
  db_name              = "team7_db"
  username             = local.db_creds.username
  password             = local.db_creds.password # Change this to a secure password
  skip_final_snapshot  = true # For development/testing only
  publicly_accessible  = false # More secure default
  multi_az             = false # Disable for cheapest option
  backup_retention_period = 0 # Disable backups for cheapest option (not recommended for production)
  deletion_protection  = false # Disable for easier cleanup (enable for production)
  vpc_security_group_ids = [var.db_security_group_id]
  db_subnet_group_name = aws_db_subnet_group.db.name
}

resource "aws_db_subnet_group" "db" {
  name       = "team7-db-subnet-group"
  subnet_ids = var.private_subnets

  tags = {
    Name = "Team7 DB Subnet Group"
  }
}

output "db_endpoint" {
  value = aws_db_instance.postgres.endpoint
}