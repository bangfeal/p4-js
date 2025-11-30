import { ObjectId } from "mongodb";
import { getDB } from "../mongo";
import { IResolvers } from "@graphql-tools/utils";
import { createUser, validateUser } from "../users";
import { signToken } from "../auth";

const nameCollection = "DiddyPosts";

export const resolvers: IResolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user) return null;
            return {
                _id: user._id.toString(),
                email: user.email
            }
        },
        posts: async () => {
            const db = getDB();
            return db.collection(nameCollection).find().toArray();
        },
        post: async (_, { id }) => {
            const db = getDB();
            return db.collection(nameCollection).findOne( {_id: new ObjectId(id) } );
        } 
    },

    Mutation: {
        register: async (_, {email, password}: {email: string; password: string}) => {
            const userId = await createUser(email, password);
            return signToken(userId);
        },

        login: async (_, {email, password}: {email: string; password: string}) => {
            const user = await validateUser(email, password);
            if (!user) throw new Error("Invalid credentials");
            return signToken(user._id.toString());
        },

        addPost: async (_, {title, date}: {title: string; date: string}, { user }) => {
            if (!user) throw new Error("Not authenticated");

            const db = getDB();
            const collection = db.collection(nameCollection);

            const newPost = {
                title,
                date,
                author: new ObjectId(user._id)
            };

             const result = await collection.insertOne(newPost);

            return {
                _id: result.insertedId.toString(),
                title: newPost.title,
                date: newPost.date,
                author: newPost.author.toString()
            };
        },
        
        // Update y remove si actualizan pero lanzan un error
        // ni idea de como arreglarlo y no me queda mucho tiempo

        updatePost: async (_, { id, title, date }: { id: string; title: string; date: string }, { user }) => {
            if (!user) throw new Error("Not authenticated");

            const db = getDB();
            const collection = db.collection(nameCollection);

            const filter = { _id: new ObjectId(id), author: new ObjectId(user._id) };
            const update = { $set: { title, date } };

            const result = await collection.findOneAndUpdate(filter, update, {
                returnDocument: "after",
            });
            
            if (!result?.value) {
                throw new Error("Post not found or not authorized");
            }

            return {
                _id: result.value._id.toString(),
                title: result.value.title,
                date: result.value.date,
                author: result.value.author,
            };
        },

        removePost: async (_, { id }: { id: string }, { user }) => {
            if (!user) throw new Error("Not authenticated");

            const db = getDB();
            const collection = db.collection(nameCollection);

            const result = await collection.findOneAndDelete({
                _id: new ObjectId(id),
                author: new ObjectId(user._id)
            });

            if (!result?.value) {
                throw new Error("Post not found or not authorized");
            }

            return {
                _id: result.value._id.toString(),
                title: result.value.title,
                date: result.value.date,
                author: result.value.author,
            };
        }
    }
};