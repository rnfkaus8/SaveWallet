import axios from 'axios';
import { Item } from '../model/Item';

export default class ItemRepository {
  getItemList = async (
    id: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Item[] | null> => {
    const axiosResponse = await axios.get<Item[]>(
      'http://localhost:8080/items',
      {
        params: {
          memberId: id,
          startDate,
          endDate,
        },
      },
    );
    if (axiosResponse.status === 200) {
      return axiosResponse.data;
    }
    return null;
  };

  delete = async (id: number): Promise<string> => {
    const axiosResponse = await axios.delete<string>(
      `http://localhost:8080/item/${id}`,
    );
    if (axiosResponse.status === 200) {
      return axiosResponse.data;
    }

    throw Error('존재하지 않는 기록입니다.');
  };

  save = async (
    name: string,
    price: number,
    memberId: number,
    boughtDate: Date,
  ): Promise<Item> => {
    const axiosResponse = await axios.post<Item>('http://localhost:8080/item', {
      name,
      price,
      memberId,
      boughtDate,
    });

    if (axiosResponse.status === 200) {
      return axiosResponse.data;
    }

    throw Error('저장에 실패했습니다.');
  };
}