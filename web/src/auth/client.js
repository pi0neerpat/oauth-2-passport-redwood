// Adapted from https://github.com/oneclickdapp/ethereum-auth

import { getErrorResponse } from 'src/auth/helpers'
import { LOCAL_TOKEN_KEY, WALLET_TYPES } from 'src/auth/constants'

import { loginWithPassport } from 'src/auth/passport'

class PassportAuthClient {
  constructor({ debug = false } = {}) {
    this.debug = debug

    // torus.init()
    // this.torus = torus
  }

  async login(type = WALLET_TYPES.torus) {
    try {
      let walletUserData
      try {
        walletUserData = await loginWithPassport()
      } catch (e) {
        console.log(e)
        throw Error('Error logging in with Torus')
      }
      if (!isProduction) console.log(walletUserData)
      localStorage.setItem(LOCAL_TOKEN_KEY, JSON.stringify(walletUserData))
    } catch (e) {
      console.log(
        getErrorResponse(`${e}. See above error for more details.`, 'login')
          .error.message
      )
    }
  }

  logout() {
    return localStorage.removeItem(LOCAL_TOKEN_KEY)
  }

  getToken() {
    return localStorage.getItem(LOCAL_TOKEN_KEY)
  }

  userMetadata() {
    console.log('getting user metadata')
    console.log(localStorage.getItem(LOCAL_TOKEN_KEY))
    return JSON.parse(localStorage.getItem(LOCAL_TOKEN_KEY))
  }
}

export default PassportAuthClient
