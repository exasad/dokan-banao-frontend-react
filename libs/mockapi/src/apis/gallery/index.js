import mock from '../MockConfig';
import { photos } from '@crema/fakedb/data';

mock.onGet('/gallery/photos').reply(200, photos);
