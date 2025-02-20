require("dotenv").config();

const config = {
  app: {
    port: process.env.PORT ?? 8080,
    frontEndPoint: process.env.FRONT_END_POINT,
  },
  database: {
    url: process.env.MONGO_DB_URL,
    name: process.env.MONGO_DB_NAME,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    oauthEntryUrl: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_OAUTH_REDIRECT_URL}&response_type=code&scope=email profile`,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
  },
  nodemailer: {
    authEmail: process.env.NODEMAILER_AUTH_EMAIL,
    authPass: process.env.NODEMAILER_AUTH_PASS,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    s3: {
      bucketName: process.env.BUCKET_NAME,
    },
  },
};

module.exports = config;
