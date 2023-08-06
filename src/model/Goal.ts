export const goalTargetMonthFormat = 'YYYYMM';
export class Goal {
  private _id: number;

  private _createdAt: Date;

  private _updatedAt: Date;

  private _targetMonth: string;

  private _goalPrice: number;

  get id(): number {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get targetMonth(): string {
    return this._targetMonth;
  }

  get goalPrice(): number {
    return this._goalPrice;
  }

  constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    targetMonth: string,
    goalPrice: number,
  ) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._targetMonth = targetMonth;
    this._goalPrice = goalPrice;
  }
}
