import axios from 'axios';
import Config from 'react-native-config';
import { Goal } from '../model/Goal';

export default class GoalRepository {
  findGoalOrSaveWhenNotExist = async (
    targetMonth: string,
    goalPrice: number,
    memberId: number,
  ): Promise<Goal> => {
    const axiosResponse = await axios.put<Goal>(`${Config.API_URL}/goal`, {
      targetMonth,
      goalPrice,
      memberId,
    });

    if (axiosResponse.status === 200) {
      return axiosResponse.data;
    }

    throw Error('목표 조회에 실패하였습니다.');
  };

  updateSelectedMonthGoalPrice = async (id: number, price: number) => {
    const axiosResponse = await axios.patch(`${Config.API_URL}/goal`, {
      id,
      price,
    });

    if (axiosResponse.status === 200) {
      return;
    }

    throw Error('목표 금액 수정에 실패하였습니다.');
  };

  findByTargetMonth = async (targetMonth: string, memberId: number) => {
    const axiosResponse = await axios.get<Goal>(`${Config.API_URL}/goal`, {
      params: {
        targetMonth,
        memberId,
      },
    });

    if (axiosResponse.status === 200) {
      return axiosResponse.data;
    }

    throw Error('목표 조회에 실패하였습니다.');
  };
}
