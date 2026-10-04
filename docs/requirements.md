 ## send anonymous messages.
## send public messages.

## tech stack:
express.
javascript.
mongodb/mongoose.
caching (redis).
validation (zod/joi/yup/class-validator).
send emails (nodemailer/mailjet).
authentication (jwt).
load balancer (nginx).
rate limiting.
OAuth2. [google]
Error handling. [AppError]
swagger.

* features:
authentication
register with sending otp verification.
verify using otp or link.
login.
reset password.
send otp.
logout.
refresh token.
login with google.

* message:
send anonymous a message.
send public a message.
delete a message.
view a message.

* user [me]:
view a user with related messages.
delete a user.
update a user.

* guards:
authentication.[token]
authorization.[role] -> e-commerce.
OTP >> one-time password.

store it into temporary storage.
DB mongodb support concept TTL.
caching redis support concept TTL. x50 faster more DB.[ram]
delete it after 5 minutes.
delete it after usage.
============================

* todo session1:
 folder structure.
 connection to DB.
 register.[send mail, generate otp]
============================

* todo session2:
verify account.
send otp.[hooks]
==============================

* todo session3:
login. cookie.
custom app error. Error class.
custom logger. console.log
intro to Dependency inversion principle. [class]
===========================

* todo session4:
reset password.
validation.
=============================

* todo session5:
login with Google.
redis caching.
rate limiting.[nginx]
load balancer.[nginx]
swagger.
how to get/access a token from a cookie.
send message.
delete message.
view message. 