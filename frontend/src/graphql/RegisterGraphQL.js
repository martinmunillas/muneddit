export const register = `
mutation Register($email: String!, $password: String!) {
  register(options: {email: $email, password: $password}) {
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
