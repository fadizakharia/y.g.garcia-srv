import { AuthChecker } from "type-graphql";
import Context from "../types/context";
import isTokenValid from "./validate";
export const customAuthChecker: AuthChecker<Context> = async (
  { context },
  permissions
) => {
  let validity: boolean = false;
  if (context.req.headers["authorization"]) {
    const token = context.req.headers["authorization"];

    const decodedToken = (await isTokenValid(token)) as any;

    if (decodedToken) {
      if (permissions && permissions.length > 0) {
        permissions.forEach((r) => {
          if (decodedToken.decoded.permissions.includes(r)) {
            validity = true;
          } else {
            validity = false;
          }
        });
      } else {
        validity = true;
      }
    } else {
      validity = false;
    }
  } else {
    validity = false;
  }
  return validity;
};
