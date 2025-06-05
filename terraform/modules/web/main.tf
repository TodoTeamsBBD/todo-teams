variable "vpc_id" {}
variable "public_subnet_id" {}

# Cheap t2.micro (free tier eligible)
resource "aws_instance" "app" {
  ami           = "ami-0c7217cdde317cfec" # Amazon Linux 2023 (us-east-1)
  instance_type = "t2.micro"              # Free tier eligible
  subnet_id     = var.public_subnet_id
  key_name      = aws_key_pair.app.key_name

  vpc_security_group_ids = [aws_security_group.app.id]

  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
              sudo yum install -y nodejs
              npm install -g pm2
              EOF

  tags = {
    Name = "team8-app-server"
  }
}

# SSH key for EC2 access
resource "aws_key_pair" "app" {
  key_name   = "team8-app-key"
  public_key = file("~/.ssh/id_rsa.pub") # Replace with your public key
}

# Security group allowing HTTPS (443), HTTP (80), and SSH (22)
resource "aws_security_group" "app" {
  name        = "team8-app-sg"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Restrict to your IP in production!
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Cheapest HTTPS solution: AWS Certificate Manager (free) + ALB
resource "aws_lb" "app" {
  name               = "team8-app-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.app.id]
  subnets            = [var.public_subnet_id]

  enable_deletion_protection = false # Disable for cost savings (not for production)
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.app.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate.app.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

resource "aws_acm_certificate" "app" {
  domain_name       = "yourdomain.com" # Replace with your domain
  validation_method = "DNS"
}

resource "aws_lb_target_group" "app" {
  name     = "team8-app-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id
}

resource "aws_lb_target_group_attachment" "app" {
  target_group_arn = aws_lb_target_group.app.arn
  target_id        = aws_instance.app.id
  port             = 80
}