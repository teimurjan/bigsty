export interface ICategory {
  id: number;
  name: string;
  featureTypes: number[];
}

export class Category implements ICategory {
  public id: number;
  public name: string;
  public featureTypes: number[];

  constructor(id: number, name: string, featureTypes: number[]) {
    this.id = id;
    this.name = name;
    this.featureTypes = featureTypes;
  }
}
