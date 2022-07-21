import React, { useEffect, useState } from 'react';
import './App.css';
import {ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import GetPosts from './Components/GetPosts';
 


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
  new HttpLink({ uri: 'https://fakerql.goosfraba.ro/graphql'})
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