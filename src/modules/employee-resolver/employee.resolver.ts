import { Ctx, Query, Resolver } from "type-graphql";
import Context from "../../types/context";
import isTokenValid from "../../util/validate";
import { EmployeeResponse } from "./employee-response/response";

@Resolver()
export class EmployeeResolver {
  @Query(() => EmployeeResponse)
  async isAuthenticated(@Ctx() ctx: Context): Promise<EmployeeResponse> {
    if (ctx.req.headers["authorization"]) {
      const token = ctx.req.headers.authorization;
      console.log(token);

      const decodedToken = (await isTokenValid(token)) as any;
      if (decodedToken) {
        console.log(decodedToken);
        return { permissions: decodedToken.decoded.permissions };
      }
      throw new Error("user has an invalid token!");
    }
    throw new Error("user is not authenticated!");
  }
}
