import { useEffect } from 'react';
import Realm, { Results } from 'realm';
import { useDispatch } from 'react-redux';
import RealmContext from '../model';
import { Member } from '../model/Member';
import { memberFetched, MemberState } from '../states/memberState';

const useMemberUpdate = () => {
  const dispatch = useDispatch();
  const members: Results<Member> = RealmContext.useQuery<Member>(Member);
  const realm = RealmContext.useRealm();

  useEffect(() => {
    if (members.length === 0) {
      realm.write(() => {
        realm.create('Member', {
          id: new Realm.BSON.ObjectId(),
          startedAt: new Date(),
        });
      });
      return;
    }

    const payload: MemberState = {
      id: members[0].id,
      startedAt: members[0].startedAd,
    };
    dispatch(memberFetched(payload));
  }, [dispatch, members, members.length, realm]);
};

export default useMemberUpdate;
