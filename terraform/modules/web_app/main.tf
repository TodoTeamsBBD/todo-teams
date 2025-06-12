data "aws_region" "current" {}

data "aws_iam_policy_document" "angular_s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.angular_app.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.angular_oai.iam_arn]
    }
  }
}

# Create S3 bucket for Angular files
resource "aws_s3_bucket" "angular_app" {
  bucket = "team7-todo-app" # Change to a unique name
  tags = {
    Project = "Team7 Todo"
  }
}

resource "aws_s3_bucket_public_access_block" "angular_app" {
  bucket = aws_s3_bucket.angular_app.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_website_configuration" "angular_app" {
  bucket = aws_s3_bucket.angular_app.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_ownership_controls" "angular_app" {
  bucket = aws_s3_bucket.angular_app.id
  rule {
    object_ownership = "BucketOwnerEnforced" # Recommended for security
  }
}

# CloudFront distribution for S3
resource "aws_cloudfront_distribution" "angular_distribution" {
  origin {
    domain_name = aws_s3_bucket.angular_app.bucket_regional_domain_name
    origin_id   = "S3-angular-app"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.angular_oai.cloudfront_access_identity_path
    }
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-angular-app"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Project = "Team7 ToDo"
  }
}

# Allow CloudFront to access S3 (security)
resource "aws_cloudfront_origin_access_identity" "angular_oai" {
  comment = "OAI for Team7 Angular app"
}

# S3 Bucket Policy (only allow CloudFront)
resource "aws_s3_bucket_policy" "angular_bucket_policy" {
  bucket = aws_s3_bucket.angular_app.id
  policy = data.aws_iam_policy_document.angular_s3_policy.json
}



output "cloudfront_url" {
  value = "https://${aws_cloudfront_distribution.angular_distribution.domain_name}"
}

output "s3_website_url" {
  value = "http://${aws_s3_bucket.angular_app.bucket}.s3-website-${data.aws_region.current.name}.amazonaws.com"
}