import Realm from 'realm';

export class Member extends Realm.Object<Member> {
  id: Realm.BSON.ObjectId;

  startedAd: Date;

  static schema = {
    name: 'Member',
    properties: {
      id: 'objectId',
      startedAd: 'date',
    },
    primaryKey: 'id',
  };
}
