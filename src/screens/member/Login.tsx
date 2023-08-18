import React, { useCallback, useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import styled from 'styled-components/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { memberFetched } from '../../states/memberState';
import { useNavigateToHome } from '../home/useNavigateToHome';
import { memberRepository } from '../../repository';
import { Member } from '../../model/Member';

const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
`;

const LoginWrapper = styled.TouchableOpacity`
  position: absolute;
  bottom: 30px;
  width: 100%;
  height: 50px;
  background-color: gray;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Login = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const navigateToHome = useNavigateToHome();
  const handleChangeText = useCallback((text: string) => {
    setName(text);
  }, []);

  const handlePressLogin = useCallback(async () => {
    try {
      const memberProps = await memberRepository.login(name);
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

      const serializeMember = member.serialize();
      await AsyncStorage.setItem('userInfo', serializeMember);
      navigateToHome();
    } catch (e) {
      Alert.alert('존재하지 않는 회원입니다.');
    }
  }, [dispatch, name, navigateToHome]);

  return (
    <Wrapper>
      <View style={{ padding: 20, width: '100%' }}>
        <TextInput
          style={{
            padding: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#000',
          }}
          value={name}
          onChangeText={handleChangeText}
          textAlign="left"
        />
      </View>
      <LoginWrapper
        style={{ width: '100%', height: 50 }}
        onPress={handlePressLogin}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          Login
        </Text>
      </LoginWrapper>
    </Wrapper>
  );
};
