import { resolve } from "node:path";

export const database = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER || "react-together",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "react-together",
};

export const auth0 = {
  issuer: process.env.AUTH0_ISSUER || [],
  audience: process.env.AUTH0_AUDIENCE || [],
};

export const file = {
  root: resolve(process.env.FILE_ROOT || "./photos"),
};

export const flickrCredentials = {
  apiKey: process.env.FLICKR_API_KEY || "",
  consumerSecret: process.env.FLICKR_API_SECRET || "",
  oauthToken: process.env.FLICKR_OAUTH_TOKEN || "",
  oauthTokenSecret: process.env.FLICKR_OAUTH_SECRET || "",
};
