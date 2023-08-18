import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Member } from '../model/Member';
import { memberFetched } from '../states/memberState';
import { authInitialize } from '../states/authState';

export const useAppInitialize = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    AsyncStorage.getItem('userInfo').then((data) => {
      if (data) {
        const member = Member.deserialize(data);
        dispatch(
          memberFetched({
            id: member.id,
            name: member.name,
            updatedAt: member.updatedAt,
            createdAt: member.createdAt,
          }),
        );
        dispatch(authInitialize());
      }
    });
  });
};
