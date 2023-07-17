import Realm from 'realm';

export class Goal extends Realm.Object<Goal> {
  id: Realm.BSON.ObjectId;

  date: Date;

  goalPrice: number;

  static schema = {
    name: 'Goal',
    properties: {
      id: 'objectId',
      date: 'date',
      goalPrice: 'int',
    },
    primaryKey: 'id',
  };
}
