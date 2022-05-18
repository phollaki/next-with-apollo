import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import '../styles/globals.css'


const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache(),
  ssrMode: typeof window === 'undefined',
});


function MyApp({ Component, pageProps }) {
  return(
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )

}

export default MyApp
