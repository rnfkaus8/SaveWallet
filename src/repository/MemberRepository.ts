import axios from 'axios';
import Config from 'react-native-config';
import { Member, SerializeMemberProps } from '../model/Member';

export default class MemberRepository {
  login = async (name: string): Promise<SerializeMemberProps> => {
    const axiosResponse = await axios.get<SerializeMemberProps>(
      `${Config.API_URL}/member/${name}`,
    );

    if (axiosResponse.status === 200) {
      return axiosResponse.data;
    }

    throw Error('존재하지 않는 회원입니다');
  };
}
