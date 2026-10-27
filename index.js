
import "dotenv/config";
import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";

import { typeDefs } from "./types/types.mjs";
import { departmentResolvers } from "./resolvers/departments.mjs";
import { attractionResolvers } from "./resolvers/attractions.mjs";

const resolvers = {
  Query: {
    ...departmentResolvers.Query,
    ...attractionResolvers.Query
  },

  Department: departmentResolvers.Department
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers
  }),
  graphqlEndpoint: "/graphql"
});

const PORT = Number(process.env.PORT) || 4000;

const servidor = createServer(yoga);

servidor.listen(PORT, () => {
  console.log(`Servidor GraphQL activo en http://localhost:${PORT}/graphql`);
});
