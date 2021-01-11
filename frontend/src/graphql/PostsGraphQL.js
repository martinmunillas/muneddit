export const postsGQL = `
query Posts($limit: Int!, $cursor: String){
    posts(limit: $limit, cursor: $cursor) {
      hasMore
      posts {
        id
        title
        textSnippet
        createdAt
        points
        creator {
          username
        }
      }
    }
  }`;
