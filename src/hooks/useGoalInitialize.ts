import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { goalTargetMonthFormat } from '../model/Goal';
import { RootState } from '../store';
import { MemberState } from '../states/memberState';
import { goalRepository } from '../repository';

export const useGoalInitialize = () => {
  const member = useSelector<RootState, MemberState>((state: RootState) => {
    return state.member;
  });

  useEffect(() => {
    goalRepository.saveNotExistMonth(
      moment(new Date()).format(goalTargetMonthFormat),
      200000,
      member.id,
    );
  }, [member.id]);
};
