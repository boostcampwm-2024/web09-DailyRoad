export type OAuthUserInfo = {
  oauthId: string;
  nickname: string;
  profileImageUrl: string;
};

export type googleTokenResponse = {
  access_token: string;
};

export function isGoogleTokenResponse(
  response: any,
): response is googleTokenResponse {
  return response && typeof response.access_token === 'string';
}

export type googleUserResponse = {
  id: string;
  picture: string;
  name: string;
};

export function isGoogleUserResponse(
  response: any,
): response is googleUserResponse {
  return (
    response &&
    typeof response.id === 'string' &&
    typeof response.picture === 'string' &&
    typeof response.name === 'string'
  );
}
