import Realm from 'realm';

export class Goal extends Realm.Object<Goal> {
  id: Realm.BSON.ObjectId;

  startDate: Date;

  endDate: Date;

  goalPrice: number;

  static schema = {
    name: 'Goal',
    properties: {
      id: 'objectId',
      startDate: 'date',
      endDate: 'date',
      goalPrice: 'int',
    },
    primaryKey: 'id',
  };
}
