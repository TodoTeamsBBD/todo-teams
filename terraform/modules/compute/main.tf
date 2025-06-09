# Use default VPC and subnets
resource "aws_default_vpc" "default_vpc" {
  tags = {
    Name = "default_vpc"
  }
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [aws_default_vpc.default_vpc.id]
  }
}

data "aws_secretsmanager_secret_version" "db_creds" {
  secret_id = "prod/todo/postgress"
}

locals {
  db_creds = jsondecode(data.aws_secretsmanager_secret_version.db_creds.secret_string)
}

# Security Group for Express App
resource "aws_security_group" "express_sg" {
  name        = "team7-app-sg"
  description = "Allow SSH, HTTP, and Express app port"
  vpc_id      = aws_default_vpc.default_vpc.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Express App Port"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 Instance with PostgreSQL and Node.js
resource "aws_instance" "express_ec2" {
  depends_on = [ aws_security_group.express_sg ]
  ami                         = "ami-0722f955ef0cb4675" # Amazon Linux 2 in us-east-1
  instance_type               = "t3.micro"
  subnet_id                   = data.aws_subnets.default.ids[0]
  security_groups             = [aws_security_group.express_sg.name]
  key_name                    = "team7-ec2" # Replace with your actual EC2 key pair name
  associate_public_ip_address = true

  user_data = <<-EOF
    #!/bin/bash
    yum update -y

    curl -sL https://rpm.nodesource.com/setup_20.x | bash -
    yum install -y nodejs git
    npm install -g pm2

    pm2 startup systemd -u ec2-user --hp /home/ec2-user
    env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user
    
    mkdir -p /var/www/api
    chown -R ec2-user:ec2-user /var/www/api
    
    cat <<EOT > /var/www/api/ecosystem.config.js
    module.exports = {
      apps: [{
        name: "node-api",
        script: "dist/src/server.js",
        instances: "max",
        autorestart: true,
        watch: false,
        max_memory_restart: "1G",
        env: {
          NODE_ENV: "production",
          PORT: 3000,
          DB_HOST: "localhost",
          DB_PORT: 5432,
          DB_USERNAME: '${local.db_creds.username}',
          DB_PASSWORD: '${local.db_creds.password}'
        },
        error_file: "/var/log/node-api.err.log",
        out_file: "/var/log/node-api.out.log",
        merge_logs: true,
        log_date_format: "YYYY-MM-DD HH:mm Z"
      }]
    };
    EOT
    
    chown ec2-user:ec2-user /var/www/api/ecosystem.config.js
    touch /var/log/node-api.{err,out}.log
    chown ec2-user:ec2-user /var/log/node-api.{err,out}.log

    dnf install -y postgresql15 postgresql15-server
    /usr/bin/postgresql-setup --initdb
    systemctl enable postgresql
    systemctl start postgresql

    sed -i "s/^#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" /var/lib/pgsql/data/postgresql.conf
    echo "local   all             all                                     peer" > /var/lib/pgsql/data/pg_hba.conf
    echo "host    all             all             127.0.0.1/32            md5" >> /var/lib/pgsql/data/pg_hba.conf

    systemctl restart postgresql

    mkdir -p /var/www/api

    sudo -u postgres psql <<EOSQL
      CREATE USER ${local.db_creds.username} WITH PASSWORD '${local.db_creds.password}';
      CREATE DATABASE team7db OWNER ${local.db_creds.username};
      GRANT ALL PRIVILEGES ON DATABASE team7db TO ${local.db_creds.username};
    EOSQL
  EOF

  tags = {
    Name = "Team7Ec2Instance"
  }
}