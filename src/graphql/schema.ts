import { gql } from "apollo-server"

export const typeDefs = gql`
    type User {
        _id: ID!
        email: String!
    }

    type Post {
        _id: ID
        title: String
        date: String
        author: ID
    }

    type Query {
        me: User
        posts: [Post]!
        post(id: ID!): Post 
    }

    type Mutation {
        register(email: String!, password: String!): String!
        login(email: String!, password: String!): String!
        addPost(title: String!, date: String!): Post!
        updatePost(id: ID!, title: String!, date: String!): Post!
        removePost(id: ID!): Post! 
    }
`;