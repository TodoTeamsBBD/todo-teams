terraform {
  backend "s3" {
    bucket         = "team7-terraform-state"
    key            = "infra/terraform.tfstate"
    region         = "af-south-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

module "networking" {
  source = "./modules/networking"
}

module "security_groups" {
  source = "./security_groups"
  vpc_id = module.networking.vpc_id
}

module "database" {
  source = "./modules/database"
  vpc_id = module.networking.vpc_id
  db_security_group_id = module.security_groups.db_security_group_id
  api_security_group_id = module.security_groups.api_security_group_id
  private_subnets = [module.networking.private_db_a_id, module.networking.private_db_b_id]
}

module "web_app" {
  source = "./modules/web_app"
}

module "api" {
  source = "./modules/api"
  vpc_id = module.networking.vpc_id
  alb_security_group_id = module.security_groups.alb_security_group_id
  public_subnets = [module.networking.public_subnet_id, module.networking.public_subnet_b_id]
  private_subnet = module.networking.private_api_id
  db_security_group_id = module.security_groups.db_security_group_id
  api_security_group_id = module.security_groups.api_security_group_id
}