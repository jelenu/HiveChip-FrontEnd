import * as secureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const log = (message, data) => {
  if (__DEV__) {
    console.log(message, data); // * Log messages only in development mode
  }
};

// * Save both tokens
export const saveTokens = async (accessToken, refreshToken) => {
  try {
    log('Saving tokens:', { accessToken, refreshToken });
    await secureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await secureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error saving tokens:', error); // ! Handle token saving errors
  }
};

// * Retrieve both tokens
export const getTokens = async () => {
  try {
    const accessToken = await secureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await secureStore.getItemAsync(REFRESH_TOKEN_KEY);
    console.log('Retrieved access token:', accessToken);
    console.log('Retrieved refresh token:', refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error retrieving tokens:', error); // ! Handle token retrieval errors
    return { accessToken: null, refreshToken: null };
  }
};

// * Remove both tokens
export const removeTokens = async () => {
  try {
    await secureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await secureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    console.log('Tokens removed successfully'); // * Confirm token removal
  } catch (error) {
    console.error('Error removing tokens:', error); // ! Handle token removal errors! Handle token removal errors
  }
};
