import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { Member } from '../model/Member';
import { memberFetched } from '../states/memberState';
import { memberRepository } from '../repository';

export const useAppInitialize = () => {
  const dispatch = useDispatch();

  const getMember = async (serializeMember: string | null) => {
    if (serializeMember) {
      return Member.deserialize(serializeMember);
    }

    const deviceId = await DeviceInfo.getUniqueId();
    const memberProps = await memberRepository.login(deviceId);

    return new Member(
      memberProps.id,
      memberProps.name,
      memberProps.createdAt,
      memberProps.updatedAt,
    );
  };

  const init = useCallback(async () => {
    const serializeMember = await AsyncStorage.getItem('userInfo');

    const member = await getMember(serializeMember);

    dispatch(
      memberFetched({
        id: member.id,
        name: member.name,
        updatedAt: member.updatedAt,
        createdAt: member.createdAt,
      }),
    );

    await AsyncStorage.setItem('userInfo', member.serialize());
  }, [dispatch]);

  useEffect(() => {
    init();
  }, [init]);
};
