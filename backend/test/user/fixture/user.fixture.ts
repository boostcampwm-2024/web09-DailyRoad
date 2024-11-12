import { UserRole } from '../../../src/user/user.role';
import { User } from '../../../src/user/entity/user.entity';
import { UserFixtureType } from './user.fixture.type';

export class UserFixture {
  static createUser({
    provider = 'google',
    nickname = 'test',
    oauthId = 'abcd1234',
    role = UserRole.MEMBER,
    profileImageUrl = 'https://test.com/test.jpg',
  }: UserFixtureType) {
    return new User(provider, nickname, oauthId, role, profileImageUrl);
  }
}
