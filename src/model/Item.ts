import Realm from 'realm';

export type Category =
  | '야미'
  | '의류미용'
  | '쓸데 없는'
  | '오락'
  | '택시'
  | '자기계발'
  | '소비 안 함';
export class Item extends Realm.Object<Item> {
  _id: number;

  name: string;

  price: number;

  category: Category;

  date: Date;

  static schema = {
    name: 'Item',
    properties: {
      _id: 'int',
      name: 'string',
      price: 'int',
      date: 'date',
    },
    primaryKey: '_id',
  };
}
