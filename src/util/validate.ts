require("dotenv").config();
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (_, key: any) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

async function isTokenValid(token: any) {
  if (token) {
    const bearerToken = token.split(" ");

    const result = new Promise((resolve, _) => {
      jwt.verify(
        bearerToken[1],
        getKey,
        {
          audience: process.env.API_IDENTIFIER,
          issuer: `https://${process.env.AUTH0_DOMAIN}/`,
          algorithms: ["RS256"],
        },
        (error, decoded) => {
          if (error) {
            resolve({ error });
          }
          if (decoded) {
            resolve({ decoded });
          }
        }
      );
    });

    return result;
  }

  return { error: "No token provided" };
}

export default isTokenValid;
