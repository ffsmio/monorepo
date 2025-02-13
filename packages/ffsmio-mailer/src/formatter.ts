import { Components, Flatterned, ObjectOf } from './types';

export class Formatter<T = unknown> {
  static readonly KEYWORDS = class {
    static readonly LOOP = ['loop', 'endloop'];
    static readonly COMPONENT = ['component'];
  };

  private flatterned: Flatterned = {};

  private formatted: string;

  private components: Components = {};

  constructor(private content: string, private data: ObjectOf<T> = {}) {
    this.flatterned = Formatter.flattern(this.data);
  }

  private static flatternArray<T>(data: T[], prefix = '') {
    let result: Flatterned = {};

    data.forEach((item, index) => {
      const key = prefix ? `${prefix}.[${index}]` : `[${index}]`;

      if (Array.isArray(item)) {
        result = {
          ...result,
          ...Formatter.flatternArray(item, key),
        };
        return;
      }

      if (typeof item === 'object' && item !== null) {
        result = {
          ...result,
          ...Formatter.flattern(item as ObjectOf<T>, key),
        };
        return;
      }

      result[key] = item as string;
    });

    return result;
  }

  static flattern<T = unknown>(data: ObjectOf<T>, prefix = ''): Flatterned {
    return Object.entries(data).reduce((acc, [key, value]) => {
      const lastKey = prefix ? `${prefix}.${key}` : key;

      if (Array.isArray(value)) {
        return {
          ...acc,
          ...Formatter.flatternArray(value, lastKey),
        };
      }

      if (typeof value === 'object' && value !== null) {
        return {
          ...acc,
          ...Formatter.flattern(value as ObjectOf<T>, lastKey),
        };
      }

      return {
        ...acc,
        [lastKey]: value,
      };
    }, {});
  }

  static arrayLike(data: Flatterned, path: string) {
    let isArray = false;

    const dataOfPath = Object.entries(data).filter(([key]) => {
      if (key.startsWith(`${path}.`)) {
        isArray = key.startsWith(`${path}.[`);
      }
      return key.startsWith(`${path}.`);
    });

    if (!dataOfPath.length) {
      return [];
    }

    if (!isArray) {
      return dataOfPath.map(([key, value]) => ({
        key: key.replace(`${path}.`, ''),
        value,
      }));
    }

    return Object.values(
      dataOfPath.reduce((acc, [key, value]) => {
        const [index, ...remain] = key.replace(`${path}.[`, '').split('].');

        if (!acc[index]) {
          acc[index] = {};
        }

        acc[index][remain.join('].')] = value;
        return acc;
      }, {} as ObjectOf<Flatterned>)
    );
  }

  static escape(path: string) {
    return path.replace(/([\.\[\]\{\}])/, '$1');
  }

  static variable(prefix = '') {
    const escaped = prefix ? `${Formatter.escape(prefix)}:` : '';
    return new RegExp(`{${escaped}([^:}]+)}`, 'g');
  }

  static component() {
    return new RegExp(
      Formatter.escape(`{@${Formatter.KEYWORDS.COMPONENT[0]}:([^}:]+)}`),
      'i'
    );
  }

  static loop(prefix = '') {
    const start = prefix ? `${prefix}:` : '';
    const escaped = `{@${Formatter.KEYWORDS.LOOP[0]}:(${start}([^:]+))}([\\s\\S]*?){@${Formatter.KEYWORDS.LOOP[1]}:\\1}`;
    return new RegExp(Formatter.escape(escaped));
  }

  private isNeedFormat() {
    return !![Formatter.variable(), Formatter.loop()].filter(
      (p) => !!p.exec(this.formatted)
    ).length;
  }

  private isHasComponent() {
    return !!Formatter.component().exec(this.formatted);
  }

  private solveVariables(content: string, data: Flatterned, prefix = '') {
    if (!content) {
      return content;
    }

    const varPattern = Formatter.variable(prefix);
    const varMatches = Array.from(content.match(varPattern) ?? []).filter(
      (v, i, s) => s.indexOf(v) === i
    );

    Array.from(varMatches).forEach((varPath) => {
      const key = (prefix ? varPath.split(':').pop()! : varPath).replace(
        /[\{\}]/g,
        ''
      );
      const val = data[key] ?? '';
      const replaceRegex = new RegExp(Formatter.escape(varPath as string), 'g');
      content = content.replace(replaceRegex, val.toString());
    });

    return content;
  }

  private solveLoop(content: string, prefix = '', index?: number) {
    let match;

    const pattern = Formatter.loop(prefix);

    while ((match = pattern.exec(content))) {
      content = this.solveLoopMatch(content, match, index);
    }

    return content;
  }

  private solveLoopMatch(content: string, match: string[], index?: number) {
    const [original, loopPath, p, child] = match;

    const realPath =
      index !== undefined ? loopPath.replace(':', `.[${index}].`) : loopPath;
    const loopArray = Formatter.arrayLike(this.flatterned, realPath);

    if (!loopArray.length) {
      content = content.replace(original, '');
    }

    let formattedChild = '';

    loopArray.forEach((values, index) => {
      const escaped = Formatter.escape(loopPath);
      const indexPattern = new RegExp(`{${escaped}:\\[x\\]}`);

      let contentChild = child.replace(indexPattern, index.toString());
      contentChild = this.solveVariables(contentChild, values, loopPath);
      contentChild = this.solveLoop(contentChild);
      contentChild = this.solveLoop(contentChild, loopPath, index);

      formattedChild += contentChild;
    });

    return content.replace(original, formattedChild);
  }

  private solveComponent(content: string) {
    const pattern = Formatter.component();
    let match;

    while ((match = pattern.exec(content))) {
      const [found, name] = match;
      const component = this.components[name];
      const regex = new RegExp(Formatter.escape(found), 'i');

      if (!component) {
        content = content.replace(regex, '');
      } else {
        content = content.replace(regex, component.content);
        this.data = Object.assign({}, this.data, component.data);
      }
    }

    this.flatterned = Formatter.flattern(this.data);
    return content;
  }

  setData(data: ObjectOf<T>) {
    this.data = data;
    this.flatterned = Formatter.flattern(this.data);
    return this;
  }

  getComponents() {
    return Array.from(this.content.match(Formatter.component()) ?? []).map(
      (match) =>
        match
          .replace(`{@${Formatter.KEYWORDS.COMPONENT[0]}:`, '')
          .replace('}', '')
          .trim()
    );
  }

  setComponents(components: Components) {
    this.components = Object.assign({}, components);
    return this;
  }

  setContent(content: string) {
    this.content = content;
    return this;
  }

  format(data?: ObjectOf<T>) {
    if (data) {
      this.data = Object.assign({}, this.data, data);
      this.flatterned = Formatter.flattern(this.data);
    }

    if (!this.formatted) {
      this.formatted = this.content;
    }

    while (this.isHasComponent()) {
      this.formatted = this.solveComponent(this.formatted);
    }

    while (this.isNeedFormat()) {
      this.formatted = this.solveVariables(this.formatted, this.flatterned);
      this.formatted = this.solveLoop(this.formatted);
    }

    return this.formatted;
  }
}
