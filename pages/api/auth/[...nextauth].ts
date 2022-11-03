import { CallbacksOptions } from "next-auth"
import NextAuth from "next-auth/next"
import SpotifyProvider from "next-auth/providers/spotify"
import { scopes, spotifyApi } from "../../../config/spotify"
import { ExtendedSession, ExtendedToken, TokenError } from "../../../types"

const refreshAccessToken = async (token: ExtendedToken): Promise<ExtendedToken> => {
    try {
        spotifyApi.setAccessToken(token.accessToken)
        spotifyApi.setRefreshToken(token.refreshToken)
        const { body: refreshedTokens } = await spotifyApi.refreshAccessToken()
        console.log('refreshed token are ', refreshedTokens);
        
        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            refreshToken: refreshedTokens.refresh_token || token.refreshToken,
            accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000
        }
        
    } catch(error) {
        console.error(error)
        return {
            ...token,
            error:TokenError.RefreshAccessTokenError
        }
    }
}

const jwtCallback: CallbacksOptions['jwt'] = async ({ token, account, user }) => {

    let extendedToken: ExtendedToken
    
    //user login for the first time
    if (account && user) {
        extendedToken = {
            ...token,
            user,
            accessToken: account.access_token as string,
            refreshToken: account.refresh_token as string,
            accessTokenExpiresAt: (account.expires_at as number) * 1000 //convert to ms
        }
        console.log("first time login,extended token",token);
        return extendedToken
    }

    //subsequent requests to check auth sessions
    if (Date.now() + 5000 < (token as ExtendedToken).accessTokenExpiresAt) {
        console.log('access token still valid,return extended token',token);
        
        return token
    }

    //access token has expired, refresh
    console.log('access token expired,refreshing...');
    return await refreshAccessToken(token as ExtendedToken)

}

const sessionCallback: CallbacksOptions['session'] = async ({session ,token}) => {
    (session as ExtendedSession).accessToken = (token as ExtendedToken).accessToken;
    (session as ExtendedSession).error = (token as ExtendedToken).error;

    return session
}

export default NextAuth({
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
            authorization: {
                url: 'https://accounts.spotify.com/authorize',
                params: {
                    scope:scopes
                }
            }
        })
    ],
    pages: {
        signIn:'/login'
    },
    callbacks: {
        jwt: jwtCallback,
        session:sessionCallback
    }
})
