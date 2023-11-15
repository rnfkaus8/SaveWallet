import axios from 'axios';
import Config from 'react-native-config';
import { Member, SerializeMemberProps } from '../model/Member';
import { ErrorResponse } from '../model/ErrorResponse';

export default class MemberRepository {
  login = async (
    name: string,
  ): Promise<SerializeMemberProps | ErrorResponse> => {
    try {
      const { data } = await axios.get<SerializeMemberProps>(
        `${Config.API_URL}/member/${name}`,
      );
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
