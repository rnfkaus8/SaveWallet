import axios from 'axios';
import { Member } from '../model/Member';

export default class MemberRepository {
  login = async (name: string): Promise<Member> => {
    const axiosResponse = await axios.get<Member>(
      `http://localhost:8080/member/${name}`,
    );

    if (axiosResponse.status === 200) {
      return axiosResponse.data;
    }

    throw Error('존재하지 않는 회원입니다');
  };
}
