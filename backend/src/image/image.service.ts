import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  constructor() {}

  async generatePreSignedURL(dirName: string, extension: string) {
    return fetch(
      'https://o7bfsxygtk.apigw.ntruss.com/ogil/v1/BEwksUqeJl?blocking=true&result=true',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dirName: dirName,
          extension: extension,
        }),
      },
    )
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
}
