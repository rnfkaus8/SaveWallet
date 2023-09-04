export class Category {
  private _id: number;

  private _name: string;

  private _color: string;

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get color(): string {
    return this._color;
  }

  constructor(id: number, name: string, color: string) {
    this._id = id;
    this._name = name;
    this._color = color;
  }
}
