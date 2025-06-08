variable "private_subnet" {
  description = "Private subnet ID"
  type        = string
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
