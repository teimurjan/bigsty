export interface IProductType {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  image: string;
  category: number;
  featureValues: number[];
}

export class ProductType implements IProductType {
  public id: number;
  public name: string;
  public description: string;
  public shortDescription: string;
  public image: string;
  public category: number;
  public featureValues: number[];

  constructor(
    id: number,
    name: string,
    description: string,
    shortDescription: string,
    image: string,
    category: number,
    featureValues: number[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.shortDescription = shortDescription;
    this.image = image;
    this.category = category;
    this.featureValues = featureValues;
  }
}
