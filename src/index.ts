import { ApolloServer } from "apollo-server";
import { connectToMongoDB } from "./mongo"
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { getUserFromToken } from "./auth";

const start = async () => {
  await connectToMongoDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      const user = token ? await getUserFromToken(token as string) : null;
      console.log("User from token:", user);
      return { user };
    },
  });

  await server.listen({ port: 4000 });
  console.log("GraphQL escuchando en puerto 4000\n");
};



start().catch(err=>console.error(err));