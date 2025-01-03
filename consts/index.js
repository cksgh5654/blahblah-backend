require("dotenv").config();

const config = {
  app: {
    port: process.env.PORT ?? 8080,
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
};

module.exports = config;
