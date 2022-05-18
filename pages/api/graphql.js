import { ApolloServer,gql } from "apollo-server-micro";
import { axios } from "axios";
import Cors from "micro-cors";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Mutation {
    addBook(title: String!, author: String!): [Book]
  }

  type Query {
    person: [Person],
    books: [Book],
    pet: [Pet],
    getUsers: [GithubUser]
    youngsters(age: Int!): [Person]
  }

  type GithubUser {
      id: ID
      login: String
      avatar_url: String
      type: String
  }

	type Book {
		title: String!
		author: String!
	}

  # type PetType =  'dog' | 'cat' | 'bird'

  type Pet {
    type: String
    name: String
    age: Int
  }

  type Person {
    f_name: String!
    l_name: String!
    age: Int!
    fav_book: Book
    pet: Pet
  }

`;

let books = [
  {title: 'Harry Potter and the Chamber of Secrets', author: 'J.K. Rowling'},
  {title: 'Jurassic Park', author: 'Michael Crichton'},
]
const person = [
  {
    f_name:'James',
    l_name:'Bond',
    age:30,
    pet: {
      type:'dog',
      name:'Taz',
      age:2
    },
    fav_book: {
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling'
    },
  },
  {
    f_name:'Larry',
    l_name:'Garry',
    age:26,
    pet: {
      type:'cat',
      name:'Barn',
      age:12
    },
    fav_book: {
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling'
    },
  },
]
const pet = [
  {type: "dog", name: "Taz", age: 2},
  {type: "cat", name: "Barn", age: 12},
]


const resolvers = {
  Query:{
    books: ()=>books,
    person: () => person,
    // pet: () => pet,
    getUsers: async () => {
      try{
        const users = await axios("https://api.github.com/users")
        return users.data.map(({id,login,avatar_url,type})=>({
          id,
          login,
          avatar_url,
          type
        }));
      }
      catch(err){
        console.log(err);
      }
    },
    youngsters: (_, args, ___, ____) => {
      return person.filter(({age})=>age<args.age)
    }
  },
  Mutation:{
    addBook: (_, args,) => {
      const newBook = {title:args.title, author:args.author};
      books = [...books, newBook];
      return books
    }
  }
};

// for cross origin..
const cors = Cors();

// Create an apollo server
const apolloServer = new ApolloServer({ typeDefs, resolvers });

// Disable body parser
export const config = {
  api: {
    bodyParser: false
  }
};

// Start the server
const startServer = apolloServer.start();

export default cors(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
});
