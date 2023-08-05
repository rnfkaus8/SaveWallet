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
}
