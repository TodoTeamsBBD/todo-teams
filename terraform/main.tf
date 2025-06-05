module "networking" {
  source = "./modules/networking"
}

module "database" {
  source = "./modules/database"
  vpc_id = module.networking.vpc_id
  private_subnets = [module.networking.private_db_a_id, module.networking.private_db_b_id]
}