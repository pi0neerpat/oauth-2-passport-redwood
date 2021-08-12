import { logger } from 'src/lib/logger'
import { db } from 'src/lib/db'

import passport from 'passport'
import OAuth2Strategy from 'passport-oauth2'
import express from 'express'
import session from 'express-session'

const app = express()

// TODO: If you have your node.js behind a proxy and are using secure: true, you need to set "trust proxy" in express
// See https://www.npmjs.com/package/express-session
// app.set('trust proxy', 1) // trust first proxy

// TODO: Warning The default server-side session storage, MemoryStore, is purposely not designed for a production environment
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.PASSPORT_SESSION_SECRET,
    // cookie: { secure: true, ephemeral: false },
  })
)
app.use(passport.initialize())
app.use(passport.session())

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: process.env.PASSPORT_AUTHORIZATION_URL,
      tokenURL: process.env.PASSPORT_TOKEN_URL,
      clientID: process.env.PASSPORT_CLIENT_ID,
      clientSecret: process.env.PASSPORT_CLIENT_SECRET,
      callbackURL: `${process.env.APP_DOMAIN}/auth/callback`,
    },
    function (accessToken, refreshToken, profile, cb) {
      db.user.findOrCreate({ exampleId: profile.id }, function (err, user) {
        return cb(err, user)
      })
    }
  )
)

app.get(
  '/auth/login',
  () => {
    logger.info('Invoked auth function')
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: 'Permitted',
      }),
    }
    passport.authenticate('oauth2', { failureRedirect: '/login' })
  },
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/')
  }
)

export default app
