import { safeParseJSON } from '../common/SafeParseJson';

export interface SerializeMemberProps {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Member {
  private _id: number;

  private _name: string;

  private _createdAt: Date;

  private _updatedAt: Date;

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  constructor(id: number, name: string, createdAt: Date, updatedAt: Date) {
    this._id = id;
    this._name = name;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static deserialize(data: string): Member {
    const serializeMember = safeParseJSON<SerializeMemberProps>(data);

    return new Member(
      serializeMember!.id,
      serializeMember!.name,
      serializeMember!.createdAt,
      serializeMember!.updatedAt,
    );
  }

  public serialize(): string {
    const data: SerializeMemberProps = {
      id: this._id,
      name: this._name,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };

    return JSON.stringify(data);
  }
}
