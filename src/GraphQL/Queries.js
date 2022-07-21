import { gql } from '@apollo/client';

// Fetch 100 posts using 'id' and 'createAt' queries
export const LOAD_POSTS = gql`   
    query {    
        allPosts(count: 100) {
        id
        createdAt
    }
}
`;