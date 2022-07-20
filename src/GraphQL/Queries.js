import { gql } from '@apollo/client';

// Fetch 100 posts by id and createdAt queries
export const LOAD_POSTS = gql`   
    query {    
        allPosts(count: 100) {
        id
        createdAt
    }
}
`;