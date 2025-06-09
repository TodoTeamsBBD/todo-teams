terraform {
  backend "s3" {
    bucket         = "team7-terraform-state"
    key            = "infra/terraform.tfstate"
    region         = "af-south-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

module "compute" {
  source = "./modules/compute"
}

module "web_app" {
  source = "./modules/web_app"
}