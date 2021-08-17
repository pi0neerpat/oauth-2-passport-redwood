import { logger } from 'src/lib/logger'
import { db } from 'src/lib/db'
import { fetchUser } from 'src/lib/user'

import passport from 'passport'
// import OAuth2Strategy from 'passport-oauth2'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'

import express from 'express'
import expressSession from 'express-session'

// const pgSession = require('connect-pg-simple')(expressSession)

const app = express()

// const pgPool = new pg.Pool({
//   // Insert pool options here
// })

app.use(
  expressSession({
    // store: new pgSession({
    //   pool: pgPool, // Connection pool
    //   // Insert connect-pg-simple options here
    // }),
    resave: false,
    saveUninitialized: true,
    secret: process.env.PASSPORT_SESSION_SECRET,
    // TODO: If you have your node.js behind a proxy and are using secure: true, you need to set "trust proxy" in express
    // See https://www.npmjs.com/package/express-session
    // app.set('trust proxy', 1) // trust first proxy
    // cookie: { secure: true, ephemeral: false },
  })
)
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (oauthId, done) {
  // oauthId is used to find the user, which will be restored to req.user
  const user = fetchUser({ id: oauthId })
  done(null, user)
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.PASSPORT_CLIENT_ID,
      clientSecret: process.env.PASSPORT_CLIENT_SECRET,
      callbackURL: 'http://localhost:8911/auth/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log({ profile })
      const user = await fetchUser(profile)
      console.log({ user })
      return done(null, user)
    }
  )
  // new OAuth2Strategy(
  //   {
  //     authorizationURL: process.env.PASSPORT_AUTHORIZATION_URL,
  //     tokenURL: process.env.PASSPORT_TOKEN_URL,
  //     clientID: process.env.PASSPORT_CLIENT_ID,
  //     // clientSecret: process.env.PASSPORT_CLIENT_SECRET, // You might need this
  //     callbackURL: `${global.__REDWOOD__API_PROXY_PATH}/auth/callback`,
  //     state: true,
  //     pkce: true,
  //   },
  //   function (accessToken, refreshToken, profile, cb) {
  //     db.user.findOrCreate({ exampleId: profile.id }, function (err, user) {
  //       return cb(err, user)
  //     })
  //   }
  // )
)

app.get(
  '/auth',
  // passport.authenticate('oauth2', {
  passport.authenticate('google', {
    failureRedirect: '/login',
    scope: ['profile', 'email'],
    // scope: ['openid', 'profile'],
    // state
    // codeChallenge
    code_challenge_method: 'S256',
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('localhost:8910')
  }
)

app.get(
  '/auth/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  // passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function (req, res) {
    // req.session.user = userProfile
    // console.log(req.session.user)
    // Successful authentication, redirect home.
    res.redirect('localhost:8910')
  }
)

export default app
