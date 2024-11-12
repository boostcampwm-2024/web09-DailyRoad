import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private preSignedPost: string;

  constructor(private configService: ConfigService) {
    this.preSignedPost = this.configService.get<string>('PRE_SIGNED_POST');
  }

  async generatePreSignedPost(dirName: string, extension: string) {
    return fetch(this.preSignedPost, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dirName: dirName,
        extension: extension,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
}
