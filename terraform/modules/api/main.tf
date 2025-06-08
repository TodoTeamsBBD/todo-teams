variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet" {
  description = "Private subnet ID"
  type        = string
}

variable "public_subnets" {
  description = "Private subnet ID"
  type        = list(string)
}

variable "alb_security_group_id" {
  type = string
}

variable "db_security_group_id" {
  description = "The database security group ID"
  type = string
}

variable "api_security_group_id" {
  description = "The database security group ID"
  type = string
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_lb_target_group" "api_tg" {
  name     = "team7-api-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }

  target_type = "instance"
}

resource "aws_lb_target_group_attachment" "api_attachment" {
  target_group_arn = aws_lb_target_group.api_tg.arn
  target_id        = aws_instance.api.id
  port             = 3000
}

resource "aws_lb" "api_alb" {
  name               = "team7-api-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnets

  enable_deletion_protection = false
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.api_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api_tg.arn
  }
}

resource "aws_instance" "api" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  subnet_id     = var.private_subnet   # Private subnet
  vpc_security_group_ids = [var.api_security_group_id]
  user_data     = <<-EOF
                  #!/bin/bash
                  # Install Node.js
                  curl -sL https://rpm.nodesource.com/setup_20.x | bash -
                  yum install -y nodejs

                  # Install PM2 (process manager)
                  npm install -g pm2

                  # Create app directory
                  mkdir -p /var/www/api
                  EOF

  tags = {
    Name = "team7-api-server"
  }
}

output "alb_dns_name" {
  value = aws_lb.api_alb.dns_name
}
