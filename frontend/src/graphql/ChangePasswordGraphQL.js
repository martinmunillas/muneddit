export const changePassword = `
mutation ChangePassword($newPassword: String!, $token: String!) {
  changePassword(newPassword: $newPassword, token: $token) {
    user {
      id
      email
      name
      username
    }
    errors {
      message
      field
    }
  }
}
`;
