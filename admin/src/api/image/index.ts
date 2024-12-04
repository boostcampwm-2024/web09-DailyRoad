type bannerFormData = {
  imageUrl: File | null;
  redirectUrl: string;
  startedAt: string;
  endedAt: string;
};

const generatePreSignedPost = async (dirName: string, extension: string) => {
  try {
    const response = await fetch(
      'http://localhost:8080/storage/preSignedPost',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJtZW1iZXIiLCJpYXQiOjE3MzE2ODk2NTcsImV4cCI6MTgwMDA5MTAwMH0.mtyacG5lY1mLFJUWLXqP5gDdugzM8s4Xl2injKI5JJo',
        },
        body: JSON.stringify({
          dirName: dirName,
          extension,
        }),
      },
    );
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const uploadImage = async (image: File) => {
  try {
    const extension = image.name.split('.').pop() || '';
    const preSignedPost = await generatePreSignedPost('banner', extension);

    const formData = new FormData();
    Object.entries(preSignedPost.fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('file', image!);

    await fetch(preSignedPost.url, {
      method: 'POST',
      body: formData,
    });
    return `https://kr.object.ncloudstorage.com/ogil-public/post/uploads/${preSignedPost.fields.key}`;
  } catch (error) {
    alert(error);
    throw error;
  }
};

export const uploadBanner = async (body: bannerFormData) => {
  try {
    const uploadedUrl = await uploadImage(body.imageUrl!);
    const response = await fetch('http://localhost:8080/admin/banners', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        ...body,
        imageUrl: uploadedUrl,
        redirectUrl: body.redirectUrl,
        startedAt: new Date(body.startedAt).toISOString(),
        endedAt: new Date(body.endedAt).toISOString(),
      }),
    });
    if (response.ok) {
      alert('배너 업로드 완료');
    }
  } catch (err) {
    alert('배너 업로드 실패');
  }
};
