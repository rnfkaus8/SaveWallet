import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Goal } from '../model/Goal';
import { RootState } from '../store';
import { MemberState } from '../states/memberState';
import { goalRepository } from '../repository';

export const useGoalInitialize = () => {
  const member = useSelector<RootState, MemberState>((state: RootState) => {
    return state.member;
  });

  useEffect(() => {
    goalRepository.findByTargetMonth(
      moment(new Date()).format('YYYYMM'),
      200000,
      member.id,
    );
  }, [member.id]);
};
