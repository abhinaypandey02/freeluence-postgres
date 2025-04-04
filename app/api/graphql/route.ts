import "reflect-metadata";
import type { NextRequest } from "next/server";
import { ApolloServer } from "@apollo/server";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { buildTypeDefsAndResolvers } from "type-graphql";
import type { AuthorizedContext, Context } from "./context";
import { authChecker, context } from "./context";
import { UserResolvers } from "./types/User/resolvers";
import { ChatResolvers } from "./types/Chat/resolvers";
import { MapResolvers } from "./types/Map/resolvers";
import { PostingResolvers } from "./types/Posting/resolvers";
import { ApplicationResolvers } from "./types/Application/resolvers";
import { RequestResolvers } from "./types/Request/resolvers";
import { PortfolioResolvers } from "./types/Portfolio/resolvers";
import { ReviewResolvers } from "./types/Review/resolvers";

const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
  resolvers: [
    ...UserResolvers,
    ...ChatResolvers,
    ...MapResolvers,
    ...PostingResolvers,
    ...ApplicationResolvers,
    ...RequestResolvers,
    ...PortfolioResolvers,
    ...ReviewResolvers,
  ],
  authChecker,
  validate: true,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault()
      : ApolloServerPluginLandingPageLocalDefault(),
    {
      // eslint-disable-next-line @typescript-eslint/require-await -- No async required
      async requestDidStart({ request, contextValue }) {
        if (
          (contextValue as AuthorizedContext).onlyQuery &&
          !request.query?.startsWith("query")
        )
          (contextValue as Context).userId = null;
      },
    },
  ],
  introspection: true,
  status400ForVariableCoercionErrors: true,
});
const handler = startServerAndCreateNextHandler(server, {
  context,
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
