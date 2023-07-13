import { createRealmContext } from '@realm/react';
import { Item } from './Item';
import { Goal } from './Goal';
import { Member } from './Member';

const RealmContext = createRealmContext({ schema: [Item, Goal, Member] });

export default RealmContext;
