import { Item } from "kolmafia";

export class Options {
  keep?: number;
  stock?: number;
  limit?: number;
  price?: number;
  target?: string;
  body?: string;
  priceUpperThreshold?: number;
  priceLowerThreshold?: number;
  default?: string;
  collectionsMap: Map<string, Item[]> = new Map<string, Item[]>();

  static parse(optionsStr: string[], collectionsMap: Map<string, Item[]>): Options {
    const options: Options = new Options();
    options.collectionsMap = collectionsMap;
    for (const optionStr of optionsStr) {
      const keep = optionStr.match(/keep(\d+)/);
      if (keep && keep[1]) {
        options.keep = parseInt(keep[1]);
        continue;
      }
      const stock = optionStr.match(/stock(\d+)/);
      if (stock && stock[1]) {
        options.stock = parseInt(stock[1]);
        continue;
      }
      const limit = optionStr.match(/limit(\d+)/);
      if (limit && limit[1]) {
        options.limit = parseInt(limit[1]);
        continue;
      }
      const price = optionStr.match(/price(\d+)/);
      if (price && price[1]) {
        options.price = parseInt(price[1]);
        continue;
      }
      const target = optionStr.match(/#(.*)/);
      if (target && target[1]) {
        options.target = target[1];
        continue;
      }
      const upperThreshold = optionStr.match(/<(\d+)/);
      if (upperThreshold && upperThreshold[1]) {
        options.priceUpperThreshold = parseInt(upperThreshold[1]);
        continue;
      }
      const lowerThreshold = optionStr.match(/>(\d+)/);
      if (lowerThreshold && lowerThreshold[1]) {
        options.priceUpperThreshold = parseInt(lowerThreshold[1]);
        continue;
      }
      const body = optionStr.match(/body=(.*)/);
      if (body && body[1]) {
        options.body = body[1];
        continue;
      }
      if (optionStr.length > 0) {
        throw `Unsupported Option: ${optionStr}`;
      }
    }
    return options;
  }

  toString(): string {
    const optionsStr = [];
    if (this.keep) {
      optionsStr.push(`keep: ${this.keep}`);
    }
    if (this.stock) {
      optionsStr.push(`stock: ${this.stock}`);
    }
    if (this.limit) {
      optionsStr.push(`limit: ${this.limit}`);
    }
    if (this.price) {
      optionsStr.push(`price: ${this.price}`);
    }
    if (this.target) {
      optionsStr.push(`target: ${this.target}`);
    }
    if (this.body) {
      optionsStr.push(`body: ${this.body}`);
    }
    if (this.priceUpperThreshold) {
      optionsStr.push(`price upper threshold: ${this.priceUpperThreshold}`);
    }
    if (this.priceLowerThreshold) {
      optionsStr.push(`price lower threshold: ${this.priceLowerThreshold}`);
    }
    return optionsStr.join(";");
  }

  empty(): boolean {
    return this.toString() === "";
  }
}
