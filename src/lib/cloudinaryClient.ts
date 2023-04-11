import { Cloudinary } from '@cloudinary/url-gen';

export const cld = new Cloudinary({
  cloud: {
    cloudName: 'dualcslc4'
  },
  url: {
    secure: true
  }
});
