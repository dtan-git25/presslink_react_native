import HttpServiceManager from '../../services/HttpServiceManager';
import {BASE_URL_SOCKET} from '../SocketIO';

export const modalInToGiftedChatObjects = (data, loggedUsr) => {
  return data.map(
    ({id, message, created_at, user_data, message_type, file_url}) => {
      const {id: userId, image_url, name} = user_data;
      const isImage = message_type == 'image';

      const obj = {
        _id: id,
        text: message,
        createdAt: created_at,
        isImage,
        imagePath: file_url,
        user: {
          _id: userId,
          name,
          avatar: image_url,
        },
      };

      if (isImage) obj['image'] = file_url;

      return obj;
    },
  );
};

const PATH = '/api/file_upload';

export const uploadImage = (uri) => {
  const formData = new FormData();
  formData.append('file', {
    name: 'image',
    type: 'image/png',
    uri,
  });

  formData.append('type', 'image');

  return HttpServiceManager.getInstance().request(
    PATH,
    formData,
    'POST',
    true,
    BASE_URL_SOCKET,
  );
};
