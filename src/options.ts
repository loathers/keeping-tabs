import { Coinmaster, Item } from "kolmafia";

type OptionsParams = {
  collections: Map<string, Item[]>;
  coinmasters: Map<Item, [Coinmaster, Item]>;
};

export class Options {
  keep?: number;
  target?: string;
  body?: string;
  priceUpperThreshold?: number;
  priceLowerThreshold?: number;
  default?: string;
  best?: boolean;
  collections: Map<string, Item[]> = new Map();
  coinmasters: Map<Item, [Coinmaster, Item]> = new Map();

  static parse(optionsStr: string[], params?: OptionsParams): Options {
    const options: Options = new Options();
    if (params) {
      options.collections = params.collections;
      options.coinmasters = params.coinmasters;
    }
    for (const optionStr of optionsStr) {
      const keep = optionStr.match(/keep(\d+)/);
      if (keep && keep[1]) {
        options.keep = parseInt(keep[1]);
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
      const best = optionStr.match(/best/);
      if (best) {
        options.best = true;
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
