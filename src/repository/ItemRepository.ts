import Realm from 'realm';
import { RealmContext } from '../model';
import { Category, Item } from '../model/Item';

export interface SaveItemProps {
  name: string;
  price: number;
  category: Category;
  date: Date;
}

class ItemRepository {
  private realmContext;

  constructor() {
    this.realmContext = RealmContext;
  }

  save(payload: SaveItemProps) {
    const realm = this.realmContext.useRealm();
    realm.write(() => {
      realm.create('Item', {
        name: payload.name,
        price: payload.price,
        category: payload.category,
        date: payload.date,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        _id: new Realm.BSON.ObjectId(),
      });
    });
  }

  findAll() {
    return this.realmContext.useQuery(Item);
  }
}

export default ItemRepository;
