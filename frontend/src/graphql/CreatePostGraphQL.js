export const createPostGQL = `
mutation CreatePost($title: String!, $text: String!) {
    createPost(
      options: { title: $title, text: $text }
    ) {
      id
      title
      textSnippet
      createdAt
    }
  }
`;
