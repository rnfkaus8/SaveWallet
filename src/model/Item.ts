import Realm from 'realm';
import { BSON } from 'bson';

export type Category =
  | '야미'
  | '의류미용'
  | '쓸데 없는'
  | '오락'
  | '택시'
  | '자기계발'
  | '소비 안 함';
export class Item extends Realm.Object<Item> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  _id = new Realm.BSON.ObjectId();

  name: string;

  price: number;

  category: Category;

  date: Date;

  constructor(
    realm: Realm,
    name: string,
    price: number,
    category: Category,
    date: Date,
  ) {
    super(realm, {
      name,
      price,
      category,
      date,
    });
  }

  static primaryKey = '_id';
}
