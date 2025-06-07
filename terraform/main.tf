module "networking" {
  source = "./modules/networking"
}

module "database" {
  source = "./modules/database"
  vpc_id = module.networking.vpc_id
  private_subnets = [module.networking.private_db_a_id, module.networking.private_db_b_id]
}

# module "web_app" {
#   source = "./modules/web_app"
#   vpc_id          = module.networking.vpc_id
#   public_subnets  = [module.networking.public_a_id] # Just need one subnet
#   db_security_group = module.database.db_security_group_id
# }