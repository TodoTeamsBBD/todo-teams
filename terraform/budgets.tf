# budgets.tf
resource "aws_budgets_budget" "total_monthly_budget" {
  name              = "total-monthly-budget"
  budget_type       = "COST"
  limit_amount      = "50"
  limit_unit        = "USD"
  time_unit         = "MONTHLY"
  time_period_start = "2025-06-01_00:00"

  dynamic "notification" {
    for_each = { for threshold in [50, 75] : threshold => threshold }
    
    content {
      comparison_operator        = "GREATER_THAN"
      threshold                  = notification.value
      threshold_type             = "PERCENTAGE"
      notification_type          = "FORECASTED"
      subscriber_email_addresses = var.budget_alert_emails
    }
  }

  dynamic "notification" {
    for_each = { for threshold in [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] : threshold => threshold }
    
    content {
      comparison_operator        = "GREATER_THAN"
      threshold                  = notification.value
      threshold_type             = "PERCENTAGE"
      notification_type          = "ACTUAL"
      subscriber_email_addresses = var.budget_alert_emails
    }
  }
}