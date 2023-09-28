import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { Member } from '../model/Member';
import { memberFetched } from '../states/memberState';
import { authInitialize } from '../states/authState';
import { memberRepository } from '../repository';

export const useAppInitialize = () => {
  const dispatch = useDispatch();

  const init = useCallback(async () => {
    const serializeMember = await AsyncStorage.getItem('userInfo');
    if (serializeMember) {
      const member = Member.deserialize(serializeMember);
      dispatch(
        memberFetched({
          id: member.id,
          name: member.name,
          updatedAt: member.updatedAt,
          createdAt: member.createdAt,
        }),
      );
    } else {
      const deviceId = await DeviceInfo.getUniqueId();
      const memberProps = await memberRepository.login(deviceId);
      const member = new Member(
        memberProps.id,
        memberProps.name,
        memberProps.createdAt,
        memberProps.updatedAt,
      );
      dispatch(
        memberFetched({
          id: member.id,
          name: member.name,
          updatedAt: member.updatedAt,
          createdAt: member.createdAt,
        }),
      );

      await AsyncStorage.setItem('userInfo', member.serialize());
    }
    dispatch(authInitialize());
  }, [dispatch]);

  useEffect(() => {
    init();
  }, [init]);
};
