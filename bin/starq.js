module.exports = after => `
{
  repository(owner: "freeCodeCamp", name: "freeCodeCamp") {
    stargazers(first: 50${after ? `, after: "${after}"` : ''}) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      stars: edges {
        starredAt
        user: node {
          id
          name
          login
          avatarUrl
          location
          createdAt
          followers {
            totalCount
          }
          following {
            totalCount
          }
          repositories {
            totalCount
          }
          pullRequests {
            totalCount
          }
          starredRepositories {
            totalCount
          }
        }
      }
    }
  }
}
`
