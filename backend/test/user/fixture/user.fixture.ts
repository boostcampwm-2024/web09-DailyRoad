import { Role } from '@src/user/enum/Role';
import { User } from '@src/user/entity/User';
import { UserFixtureType } from './user.fixture.type';

export class UserFixture {
  static createUser({
    provider = 'google',
    nickname = 'test',
    oauthId = `${Date.now()}${Math.random()}`,
    role = Role.MEMBER,
    profileImageUrl = 'https://test.com/test.jpg',
  }: UserFixtureType) {
    return new User(provider, nickname, oauthId, role, profileImageUrl);
  }
}
