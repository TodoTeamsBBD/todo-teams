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

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.4.0/24"
  availability_zone       = "af-south-1b"
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

resource "aws_subnet" "private_api_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24" # New CIDR
  availability_zone = "af-south-1c" # Same AZ as private_db_a
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main-igw"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "public-rt"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}
output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_id" {
  value = aws_subnet.public.id
}

output "public_subnet_b_id" {
  value = aws_subnet.public_b.id
}

output "private_db_a_id" {
  value = aws_subnet.private_db_a.id
}
output "private_api_id" {
  value = aws_subnet.private_api_a.id
}

output "private_db_b_id" {
  value = aws_subnet.private_db_b.id
}
