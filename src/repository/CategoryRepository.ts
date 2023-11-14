import axios from 'axios';
import Config from 'react-native-config';
import { Category } from '../model/Category';
import { ErrorResponse } from '../model/ErrorResponse';

export default class CategoryRepository {
  findByMemberId = async (
    memberId: number,
  ): Promise<Category[] | ErrorResponse> => {
    try {
      const { data } = await axios.get<Category[]>(
        `${Config.API_URL}/categories/${memberId}`,
      );
      return data;
    } catch (e) {
      if (axios.isAxiosError<ErrorResponse>(e) && e.response) {
        const { code, message } = e.response.data;
        return new ErrorResponse(code, message);
      }
      return new ErrorResponse('500', '서버 에러입니다');
    }
  };
}
