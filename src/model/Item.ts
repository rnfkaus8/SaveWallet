import Realm from 'realm';

export class Item extends Realm.Object<Item> {
  _id: Realm.BSON.ObjectId;

  name: string;

  price: number;

  date: Date;

  static schema = {
    name: 'Item',
    properties: {
      _id: 'objectId',
      name: 'string',
      price: 'int',
      date: 'date',
    },
    primaryKey: '_id',
  };
}
