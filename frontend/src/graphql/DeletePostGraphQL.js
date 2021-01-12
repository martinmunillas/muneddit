export const deletePostGQL = `
mutation DeletePost($id: Int!){
    deletePost(id: $id)
  }
  `;
