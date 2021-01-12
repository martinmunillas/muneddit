export const voteGQL = `
mutation Vote($post: Int!, $value: Int!) {
    vote(value: $value, postId: $post )
  }
`;
