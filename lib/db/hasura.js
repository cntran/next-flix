export async function insertStats(token, { favorited, userId, watched, videoId }) {
  const operationsDoc = `mutation insertStats($favorited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
                              insert_stats_one(object: {favorited: $favorited, userId: $userId, videoId: $videoId, watched: $watched}) {
                                favorited
                                userId
                              }
                            }
                          `

  return queryHasuraGQL(
    operationsDoc,
    'insertStats',
    {
      favorited,
      userId,
      watched,
      videoId
    },
    token
  )
}

export async function updateStats(token, { favorited, userId, watched, videoId }) {
  const operationsDoc = `mutation updateStats($favorited: Int!, 
                                              $userId: String!, 
                                              $watched: Boolean!, 
                                              $videoId: String!) {
                            update_stats(
                              _set: {watched: $watched, favorited: $favorited},
                              where: {
                                userId: {_eq: $userId},
                                videoId: {_eq: $videoId}
                              }) {
                                returning {
                                  favorited
                                  id
                                  userId
                                  videoId
                                }
                              }
                          }
                        `

  return queryHasuraGQL(
    operationsDoc,
    'updateStats',
    {
      favorited,
      userId,
      watched,
      videoId
    },
    token
  )
}

export async function findVideoIdByUser(token, userId, videoId) {
  const operationsDoc = `query findVideoIdByUserId($userId: String!, $videoId: String!) {
                            stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
                              favorited
                              id
                              userId
                              videoId
                              watched
                            }
                          }
                        `

  const response = await queryHasuraGQL(
    operationsDoc,
    'findVideoIdByUserId',
    {
      userId,
      videoId
    },
    token
  )
  return response?.data?.stats
}

export async function createNewUser(token, metadata) {
  const operationsDoc = `mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
                            insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
                              returning {
                                email
                                id
                                issuer
                              }
                            }
                          }
                        `

  const { issuer, email, publicAddress } = metadata
  return queryHasuraGQL(
    operationsDoc,
    'createNewUser',
    {
      issuer,
      email,
      publicAddress
    },
    token
  )
}

export async function isNewUser(token, issuer) {
  const operationsDoc = `query isNewUser($issuer: String!) {
                            users(where: {issuer: {_eq: $issuer }}) {
                              email
                              id
                              issuer
                              publicAddress
                            }
                          }
                        `
  const response = await queryHasuraGQL(
    operationsDoc,
    'isNewUser',
    {
      issuer
    },
    token
  )
  return response?.data?.users?.length === 0
}

export async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName
    })
  })

  return result.json()
}

export async function getWatchedVideos(userId, token) {
  const operationsDoc = `query watchedVideos($userId: String!) {
                            stats(where: {
                              watched: {_eq: true}, 
                              userId: {_eq: $userId},
                            }) {
                              videoId
                            }
                          }
                        `

  const response = await queryHasuraGQL(
    operationsDoc,
    'watchedVideos',
    {
      userId
    },
    token
  )

  return response?.data?.stats
}

export async function getMyListVideos(userId, token) {
  const operationsDoc = `query favoritedVideos($userId: String!) {
                            stats(where: {
                              userId: {_eq: $userId}, 
                              favorited: {_eq: 1}
                            }) {
                              videoId
                            }
                          }
                        `

  const response = await queryHasuraGQL(
    operationsDoc,
    'favoritedVideos',
    {
      userId
    },
    token
  )

  return response?.data?.stats
}
