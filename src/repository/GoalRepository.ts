import axios from 'axios';
import Config from 'react-native-config';
import { Goal } from '../model/Goal';
import { ErrorResponse } from '../model/ErrorResponse';

export default class GoalRepository {
  findGoalOrSaveWhenNotExist = async (
    targetMonth: string,
    goalPrice: number,
    memberId: number,
  ): Promise<Goal | ErrorResponse> => {
    try {
      const { data } = await axios.put<Goal>(`${Config.API_URL}/goal`, {
        targetMonth,
        goalPrice,
        memberId,
      });
      return data;
    } catch (e) {
      if (axios.isAxiosError<ErrorResponse>(e) && e.response) {
        const { code, message } = e.response.data;
        return new ErrorResponse(code, message);
      }

      return new ErrorResponse('500', '서버 에러입니다.');
    }
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

  findByTargetMonth = async (
    targetMonth: string,
    memberId: number,
  ): Promise<Goal | ErrorResponse> => {
    try {
      const { data } = await axios.get<Goal>(`${Config.API_URL}/goal`, {
        params: {
          targetMonth,
          memberId,
        },
      });

      return data;
    } catch (e) {
      if (axios.isAxiosError<ErrorResponse>(e) && e.response) {
        const { code, message } = e.response.data;
        return new ErrorResponse(code, message);
      }

      return new ErrorResponse('500', '서버 에러입니다.');
    }
  };
}
