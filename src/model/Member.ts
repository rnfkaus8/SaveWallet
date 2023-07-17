import Realm from 'realm';

export class Member extends Realm.Object<Member> {
  id: Realm.BSON.ObjectId;

  startedAt: Date;

  static schema = {
    name: 'Member',
    properties: {
      id: 'objectId',
      startedAt: 'date',
    },
    primaryKey: 'id',
  };
}
