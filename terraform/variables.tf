

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "af-south-1"
}

variable "budget_alert_emails" {
  description = "List of email addresses to receive budget alerts"
  type        = list(string)
  default     = ["keith.hughes@bbd.co.za", "Sameer.Ghela@bbd.co.za","rudolphe@bbdsoftware.com", "kgotlelelo.mangene@bbd.co.za", "ron.joseph@bbd.co.za", "shailyn.moodley@bbd.co.za"]
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "prod"
}

variable "api_security_group" {
  
}