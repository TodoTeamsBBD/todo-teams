resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

# Public subnet for web server
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.0.0/24"
  availability_zone       = "af-south-1a" 
  map_public_ip_on_launch = true
}

# Private subnets for database
resource "aws_subnet" "private_db_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24" 
  availability_zone = "af-south-1c"
}

resource "aws_subnet" "private_db_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24" 
  availability_zone = "af-south-1b"
}
output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_id" {
  value = aws_subnet.public.id
}

output "private_db_a_id" {
  value = aws_subnet.private_db_a.id
}

output "private_db_b_id" {
  value = aws_subnet.private_db_b.id
}
