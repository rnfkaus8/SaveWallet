import axios from 'axios';
import Config from 'react-native-config';
import { Category } from '../model/Category';

export default class CategoryRepository {
  findByMemberId = async (memberId: number): Promise<Category[]> => {
    const axiosResponse = await axios.get<Category[]>(
      `${Config.API_URL}/categories/${memberId}`,
    );

    if (axiosResponse.status === 200) {
      return axiosResponse.data;
    }

    throw Error('카테고리 조회에 실패하였습니다.');
  };
}
