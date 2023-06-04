import { createRealmContext } from '@realm/react';
import { Item } from './Item';

export const RealmContext = createRealmContext({ schema: [Item] });
