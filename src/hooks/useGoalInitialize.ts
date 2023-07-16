import Realm, { Results } from 'realm';
import { useEffect } from 'react';
import { endOfMonth, startOfMonth } from 'date-fns';
import RealmContext from '../model';
import { Goal } from '../model/Goal';

export const useGoalInitialize = () => {
  const goals: Results<Goal> = RealmContext.useQuery<Goal>(Goal);
  const realm = RealmContext.useRealm();

  useEffect(() => {
    if (goals.isEmpty()) {
      realm.write(() => {
        realm.create('Goal', {
          id: new Realm.BSON.ObjectId(),
          startDate: startOfMonth(new Date()),
          endDate: endOfMonth(new Date()),
          goalPrice: 200000,
        });
      });
    }
  }, [goals, realm]);
};
