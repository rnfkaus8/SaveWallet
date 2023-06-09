import Realm from 'realm';

export const CategoryArr = [
  '야미',
  '의류미용',
  '쓸데 없는',
  '오락',
  '택시',
  '자기계발',
  '소비 안 함',
] as const;

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
