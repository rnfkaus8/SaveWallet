import Realm from 'realm';

export const CategoryArr = ['save', 'waste'];

export type Category = (typeof CategoryArr)[number];
export class Item extends Realm.Object<Item> {
  _id: Realm.BSON.ObjectId;

  name: string;

  price: number;

  category: Category;

  date: Date;

  static schema = {
    name: 'Item',
    properties: {
      _id: 'objectId',
      name: 'string',
      price: 'int',
      category: 'string',
      date: 'date',
    },
    primaryKey: '_id',
  };
}
