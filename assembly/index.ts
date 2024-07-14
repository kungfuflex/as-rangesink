export function min<T>(a: T, b: T): T {
  if (a > b) return b;
  return a;
}

class Source<T, B> {
  public points: Array<T>;
  public distances: Array<T>;
  public index: i32;
  public offset: T;
  public table: B;
  constructor(table: B, points: Array<T>, limit: T) {
    this.points = points;
    this.distances = new Array<T>(points.length);
    this.offset = T.from(0);
    this.index = 0;
    this.table = table;
    for (let i: i32 = 0; i < points.length; i++) {
      this.distances = min(table.seekGreater(points[0]), limit);
    }

  }
  pull(): Source {
    this.points.reduce((r: Source, v: T, i: i32, ary: Array<T>) => {
      r.table.set(v, new ArrayBuffer(0));
    }, this);
  }
  consumed(): boolean {
    if (this.index >= this.points.length) return true;
    return this.index === this.points.length - 1 && this.offset >= this.distances[this.distances.length - 1];
  }
  pipeTo(prefix: IndexPointer, target: ArrayBuffer, value: T): T {
    let remaining = value;
    const pointer = prefix.select(target);
    while (!this.consumed()) {
      const rangeRemaining = this.distances[this.index] - this.offset;
      const valueToApply = min(rangeRemaining, remaining);
      const point = this.points[this.index] + this.offset;
      this.table.set(point, target);
      pointer.append(toArrayBuffer(point));
      this.offset += valueToApply;
      remaining -= valueToApply;
      if (this.offset === this.distances[this.index]) {
        this.index++;
	this.offset = 0;
      }
      if (remaining.isZero()) break;
    }
    return remaining;
  }
}
