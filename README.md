# Redwood Passport.js Example

The easiest way to test locally is using the `passport-google-oauth20` strategy. Read more: https://www.passportjs.org/packages/passport-google-oauth20/

In order for sessions to persist in our express server, we rely on [connect-pg-simple](https://github.com/voxpelli/node-connect-pg-simple)

```
psql mydatabase < node_modules/connect-pg-simple/table.sql
```

TODO: add a script to run this command using the redwood DATABASE_URL?
TODO: add something to ensure this is run for new projects

### Fire it up

```terminal
yarn
yarn redwood dev
```

### Setup
