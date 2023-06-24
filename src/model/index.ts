import { createRealmContext } from '@realm/react';
import { Item } from './Item';

const RealmContext = createRealmContext({ schema: [Item] });

export default RealmContext;
