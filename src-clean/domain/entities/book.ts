export class Book {
  constructor(
    private _id: string,
    private _title: string,
    private _isAvailable: boolean,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  loan(): void {
    if (!this._isAvailable) {
      throw new Error("Book is not available");
    }
    this._isAvailable = false;
  }
  return(): void {
    if (this._isAvailable) {
      throw new Error("Book is already returned");
    }
    this._isAvailable = true;
  }
}
