import { createRealmContext } from '@realm/react';
import { Item } from './Item';
import { Goal } from './Goal';

const RealmContext = createRealmContext({ schema: [Item, Goal] });

export default RealmContext;
