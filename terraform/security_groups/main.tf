data "aws_ec2_managed_prefix_list" "cloudfront" {
  name = "com.amazonaws.global.cloudfront.origin-facing"
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

resource "aws_security_group" "alb_sg" {
  name        = "team7-alb-sg"
  description = "Allow HTTP traffic to ALB"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "api" {
  name        = "team7-api-sg"
  description = "Allow HTTP from CloudFront only"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    prefix_list_ids = [data.aws_ec2_managed_prefix_list.cloudfront.id]
    description     = "Allow HTTP from CloudFront prefix list"
  }

  egress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.db.id]
    description     = "Allow outbound PostgreSQL to DB SG"
  }
}

resource "aws_security_group" "db" {
  name        = "team7-db-sg"
  description = "Allow access to PostgreSQL"
  vpc_id      = var.vpc_id
}

resource "aws_security_group_rule" "db_ingress_from_api" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.db.id
  source_security_group_id = aws_security_group.api.id
  description              = "Allow inbound PostgreSQL from API SG"
}

resource "aws_security_group_rule" "db_egress_allow_all" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  security_group_id = aws_security_group.db.id
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow all outbound"
}

output "api_security_group_id" {
  value       = aws_security_group.api.id
  description = "The ID of the API security group"
}

output "db_security_group_id" {
  value       = aws_security_group.db.id
  description = "The ID of the DB security group"
}

output "alb_security_group_id" {
  value       = aws_security_group.alb_sg.id
  description = "The ID of the load balancer security group"
}
