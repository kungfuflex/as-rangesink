# as-rangesink

Generic class to abstract token numbering.

## Usage

```js

import { IndexPointer } from "metashrew-as/assembly/indexer/tables";
import { BSTU128 } from "metashrew-as/assembly/indexer/widebst";
import { u128 } from "as-bignum";
import { fromArrayBuffer } from "metashrew-runes/assembly/utils";

import { Source } from "as-rangesink/assembly";

export function _start(): void {
  const runeId = new RuneId(840000, 12).toArrayBuffer();
  const sourceOutpoint = IndexPointer.for("/example-source-outpoint").get();
  const targetOutpoint = IndexPointer.for("/example-target-outpoint").get();
  const amountSentToTrack = u128.from(100000);
  const source = new Source<u128, BSTU128>(
    BSTU128.at(IndexPointer.for("/rune/").select(runeId).keyword("/outpoint/byunit")), 
    IndexPointer.for("/rune/").select(runeId).keyword("/ranges/byoutpoint/").select(sourceOutpoint).getList().map((v: ArrayBuffer, i: i32, ary: Array<u128>) => fromArrayBuffer(v)),
    fromArrayBuffer(IndexPointer.for("/rune/").select(runeId).keyword("/totalsupply").get())
  );
  source.pull();
  const excess = source.pipeTo(IndexPointer.for("/rune/").select(runeId).keyword("/ranges/byoutpoint/"), targetOutpoint, amountSentToTrack);
  // surplus after transfer amount is exhausted, is 0 if source is exhausted first, and source.index source.offset are updated to indicate position in remaining ranges
}
```
