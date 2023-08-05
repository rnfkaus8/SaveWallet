export class Item {
  private _id: number;

  private _name: string;

  private _price: number;

  private _createdAt: Date;

  private _updatedAt: Date;

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  constructor(
    id: number,
    name: string,
    price: number,
    startedAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._createdAt = startedAt;
    this._updatedAt = updatedAt;
  }
}
