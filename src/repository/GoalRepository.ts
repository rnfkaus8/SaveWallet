import axios from 'axios';
import { Goal } from '../model/Goal';

export default class GoalRepository {
  findByTargetMonth = async (
    targetMonth: string,
    goalPrice: number,
    memberId: number,
  ): Promise<Goal> => {
    const axiosResponse = await axios.put<Goal>('http://localhost:8080/goal', {
      targetMonth,
      goalPrice,
      memberId,
    });

    if (axiosResponse.status === 200) {
      return axiosResponse.data;
    }

    throw Error('목표 조회에 실패하였습니다.');
  };
}
