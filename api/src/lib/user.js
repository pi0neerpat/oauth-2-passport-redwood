import { db } from 'src/lib/db'

export const fetchUser = async (input) => {
  const { email, id, displayName } = input // Values returned from google OAuth2.0
  let user
  user = await db.user.findUnique({
    where: { oauthId: id },
  })
  if (!user) {
    user = await db.user.create({
      data: {
        oauthId: id,
        email,
        name: displayName,
      },
    })
  }
  return user
}
