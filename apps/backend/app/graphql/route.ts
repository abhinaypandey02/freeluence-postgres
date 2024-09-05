import "reflect-metadata";
import type { NextRequest } from "next/server";
import { ApolloServer } from "@apollo/server";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { authChecker, context } from "./context";
import { UserResolvers } from "./types/User/resolvers";
import { OrganizationResolvers } from "./types/Organization/resolvers";

const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
  resolvers: [...UserResolvers, ...OrganizationResolvers],
  authChecker,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    process.env.NEXT_PUBLIC_DEVELOPMENT
      ? ApolloServerPluginLandingPageLocalDefault()
      : ApolloServerPluginLandingPageProductionDefault(),
  ],
  introspection: true,
  status400ForVariableCoercionErrors: true,
});
const handler = startServerAndCreateNextHandler(server, {
  context: (req: NextRequest) =>
    new Promise((resolve) => {
      resolve(context(req));
    }),
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
