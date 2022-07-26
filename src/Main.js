import React, { useEffect, useState } from 'react';
import {ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import GetPosts from './Components/GetPosts';
import './Main.css';
 


// Catch error
const errorLink = onError(({graphqlErrors, networkError}) => {
  if(graphqlErrors) {
    graphqlErrors.map(({message, location, path}) => {
      console.log(`Graphql error ${message}`);
    })
  }
});

// Create graphql url
const link = from([
  errorLink,
  new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_API})
]);

// Initialize client to check connection
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
});




function Main() {

    return (
      <ApolloProvider client={client}>
        <GetPosts/>
      </ApolloProvider>
    )
  }
  
  export default Main;