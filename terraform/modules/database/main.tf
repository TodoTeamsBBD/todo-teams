variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "private_subnets" {
  description = "List of private subnet IDs"
  type        = list(string)
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
  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name = aws_db_subnet_group.db.name
}

resource "aws_security_group" "db" {
  name        = "team7-db-sg"
  description = "Allow access to PostgreSQL"
  vpc_id      = var.vpc_id  # Attaches to your VPC

  # Rule: Allow inbound PostgreSQL traffic (port 5432) ONLY from your API/application servers
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]  # Restrict to your VPC (or narrower range)
  }

  # Rule: Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_subnet_group" "db" {
  name       = "team7-db-subnet-group"
  subnet_ids = var.private_subnets

  tags = {
    Name = "Team7 DB Subnet Group"
  }
}
output "db_security_group_id" {
  value = aws_security_group.db.id
}

output "db_endpoint" {
  value = aws_db_instance.postgres.endpoint
}