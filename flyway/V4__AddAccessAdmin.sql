WITH new_user AS (
  INSERT INTO users (username, email, password_hash, two_factor_secret, created_at, two_factor_verified)
  VALUES (
    'Access_Admin',
    'access.admin@todo.com',
    '$argon2id$v=19$m=65536,t=3,p=4$WWAOHmQZpDkBw2ePzk25uw$QbRn9BMs4uFS3IIogGtVbVFH+zGyWZIysEyILL48UXQ',
    'IEXXC3TSNAZCK22SEVQSY3SQHZ2G4VLGPF5V43DGNFITGUTDNQYA',
    CURRENT_DATE,
    false
  )
  RETURNING id
)

INSERT INTO user_roles (user_id, team_id, role_id)
SELECT id, NULL, 1 FROM new_user;

