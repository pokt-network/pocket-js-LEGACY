/* eslint-disable */
import * as Long from "long";
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import { Any } from "./google/protobuf/any";

export const protobufPackage = "pocketjs";

export interface ProtoStdTx {
  msg: Any | undefined;
  fee: Coin[];
  signature: ProtoStdSignature | undefined;
  memo: string;
  entropy: number;
}

export interface ProtoStdSignature {
  publicKey: Uint8Array;
  Signature: Uint8Array;
}

export interface StdSignDoc {
  ChainID: string;
  fee: Uint8Array;
  memo: string;
  msg: Uint8Array;
  entropy: number;
}

export interface Coin {
  denom: string;
  amount: string;
}

/**
 * DecCoin defines a token with a denomination and a decimal amount.
 *
 * NOTE: The amount field is an Dec which implements the custom method
 * signatures required by gogoproto.
 */
export interface DecCoin {
  denom: string;
  amount: string;
}

const baseProtoStdTx: object = { memo: "", entropy: 0 };

export const ProtoStdTx = {
  encode(message: ProtoStdTx, writer: Writer = Writer.create()): Writer {
    if (message.msg !== undefined && message.msg !== undefined) {
      Any.encode(message.msg, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.fee) {
      Coin.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.signature !== undefined && message.signature !== undefined) {
      ProtoStdSignature.encode(
        message.signature,
        writer.uint32(26).fork()
      ).ldelim();
    }
    writer.uint32(34).string(message.memo);
    writer.uint32(40).int64(message.entropy);
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ProtoStdTx {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseProtoStdTx } as ProtoStdTx;
    message.fee = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.msg = Any.decode(reader, reader.uint32());
          break;
        case 2:
          message.fee.push(Coin.decode(reader, reader.uint32()));
          break;
        case 3:
          message.signature = ProtoStdSignature.decode(reader, reader.uint32());
          break;
        case 4:
          message.memo = reader.string();
          break;
        case 5:
          message.entropy = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProtoStdTx {
    const message = { ...baseProtoStdTx } as ProtoStdTx;
    message.fee = [];
    if (object.msg !== undefined && object.msg !== null) {
      message.msg = Any.fromJSON(object.msg);
    } else {
      message.msg = undefined;
    }
    if (object.fee !== undefined && object.fee !== null) {
      for (const e of object.fee) {
        message.fee.push(Coin.fromJSON(e));
      }
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = ProtoStdSignature.fromJSON(object.signature);
    } else {
      message.signature = undefined;
    }
    if (object.memo !== undefined && object.memo !== null) {
      message.memo = String(object.memo);
    } else {
      message.memo = "";
    }
    if (object.entropy !== undefined && object.entropy !== null) {
      message.entropy = Number(object.entropy);
    } else {
      message.entropy = 0;
    }
    return message;
  },

  fromPartial(object: DeepPartial<ProtoStdTx>): ProtoStdTx {
    const message = { ...baseProtoStdTx } as ProtoStdTx;
    message.fee = [];
    if (object.msg !== undefined && object.msg !== null) {
      message.msg = Any.fromPartial(object.msg);
    } else {
      message.msg = undefined;
    }
    if (object.fee !== undefined && object.fee !== null) {
      for (const e of object.fee) {
        message.fee.push(Coin.fromPartial(e));
      }
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = ProtoStdSignature.fromPartial(object.signature);
    } else {
      message.signature = undefined;
    }
    if (object.memo !== undefined && object.memo !== null) {
      message.memo = object.memo;
    } else {
      message.memo = "";
    }
    if (object.entropy !== undefined && object.entropy !== null) {
      message.entropy = object.entropy;
    } else {
      message.entropy = 0;
    }
    return message;
  },

  toJSON(message: ProtoStdTx): unknown {
    const obj: any = {};
    message.msg !== undefined &&
      (obj.msg = message.msg ? Any.toJSON(message.msg) : undefined);
    if (message.fee) {
      obj.fee = message.fee.map((e) => (e ? Coin.toJSON(e) : undefined));
    } else {
      obj.fee = [];
    }
    message.signature !== undefined &&
      (obj.signature = message.signature
        ? ProtoStdSignature.toJSON(message.signature)
        : undefined);
    message.memo !== undefined && (obj.memo = message.memo);
    message.entropy !== undefined && (obj.entropy = message.entropy);
    return obj;
  },
};

const baseProtoStdSignature: object = {};

export const ProtoStdSignature = {
  encode(message: ProtoStdSignature, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).bytes(message.publicKey);
    writer.uint32(18).bytes(message.Signature);
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ProtoStdSignature {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseProtoStdSignature } as ProtoStdSignature;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.publicKey = reader.bytes();
          break;
        case 2:
          message.Signature = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProtoStdSignature {
    const message = { ...baseProtoStdSignature } as ProtoStdSignature;
    if (object.publicKey !== undefined && object.publicKey !== null) {
      message.publicKey = bytesFromBase64(object.publicKey);
    }
    if (object.Signature !== undefined && object.Signature !== null) {
      message.Signature = bytesFromBase64(object.Signature);
    }
    return message;
  },

  fromPartial(object: DeepPartial<ProtoStdSignature>): ProtoStdSignature {
    const message = { ...baseProtoStdSignature } as ProtoStdSignature;
    if (object.publicKey !== undefined && object.publicKey !== null) {
      message.publicKey = object.publicKey;
    } else {
      message.publicKey = new Uint8Array();
    }
    if (object.Signature !== undefined && object.Signature !== null) {
      message.Signature = object.Signature;
    } else {
      message.Signature = new Uint8Array();
    }
    return message;
  },

  toJSON(message: ProtoStdSignature): unknown {
    const obj: any = {};
    message.publicKey !== undefined &&
      (obj.publicKey = base64FromBytes(
        message.publicKey !== undefined ? message.publicKey : new Uint8Array()
      ));
    message.Signature !== undefined &&
      (obj.Signature = base64FromBytes(
        message.Signature !== undefined ? message.Signature : new Uint8Array()
      ));
    return obj;
  },
};

const baseStdSignDoc: object = { ChainID: "", memo: "", entropy: 0 };

export const StdSignDoc = {
  encode(message: StdSignDoc, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.ChainID);
    writer.uint32(18).bytes(message.fee);
    writer.uint32(26).string(message.memo);
    writer.uint32(34).bytes(message.msg);
    writer.uint32(40).int64(message.entropy);
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): StdSignDoc {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStdSignDoc } as StdSignDoc;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ChainID = reader.string();
          break;
        case 2:
          message.fee = reader.bytes();
          break;
        case 3:
          message.memo = reader.string();
          break;
        case 4:
          message.msg = reader.bytes();
          break;
        case 5:
          message.entropy = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StdSignDoc {
    const message = { ...baseStdSignDoc } as StdSignDoc;
    if (object.ChainID !== undefined && object.ChainID !== null) {
      message.ChainID = String(object.ChainID);
    } else {
      message.ChainID = "";
    }
    if (object.fee !== undefined && object.fee !== null) {
      message.fee = bytesFromBase64(object.fee);
    }
    if (object.memo !== undefined && object.memo !== null) {
      message.memo = String(object.memo);
    } else {
      message.memo = "";
    }
    if (object.msg !== undefined && object.msg !== null) {
      message.msg = bytesFromBase64(object.msg);
    }
    if (object.entropy !== undefined && object.entropy !== null) {
      message.entropy = Number(object.entropy);
    } else {
      message.entropy = 0;
    }
    return message;
  },

  fromPartial(object: DeepPartial<StdSignDoc>): StdSignDoc {
    const message = { ...baseStdSignDoc } as StdSignDoc;
    if (object.ChainID !== undefined && object.ChainID !== null) {
      message.ChainID = object.ChainID;
    } else {
      message.ChainID = "";
    }
    if (object.fee !== undefined && object.fee !== null) {
      message.fee = object.fee;
    } else {
      message.fee = new Uint8Array();
    }
    if (object.memo !== undefined && object.memo !== null) {
      message.memo = object.memo;
    } else {
      message.memo = "";
    }
    if (object.msg !== undefined && object.msg !== null) {
      message.msg = object.msg;
    } else {
      message.msg = new Uint8Array();
    }
    if (object.entropy !== undefined && object.entropy !== null) {
      message.entropy = object.entropy;
    } else {
      message.entropy = 0;
    }
    return message;
  },

  toJSON(message: StdSignDoc): unknown {
    const obj: any = {};
    message.ChainID !== undefined && (obj.ChainID = message.ChainID);
    message.fee !== undefined &&
      (obj.fee = base64FromBytes(
        message.fee !== undefined ? message.fee : new Uint8Array()
      ));
    message.memo !== undefined && (obj.memo = message.memo);
    message.msg !== undefined &&
      (obj.msg = base64FromBytes(
        message.msg !== undefined ? message.msg : new Uint8Array()
      ));
    message.entropy !== undefined && (obj.entropy = message.entropy);
    return obj;
  },
};

const baseCoin: object = { denom: "", amount: "" };

export const Coin = {
  encode(message: Coin, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.denom);
    writer.uint32(18).string(message.amount);
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Coin {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCoin } as Coin;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string();
          break;
        case 2:
          message.amount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Coin {
    const message = { ...baseCoin } as Coin;
    if (object.denom !== undefined && object.denom !== null) {
      message.denom = String(object.denom);
    } else {
      message.denom = "";
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = String(object.amount);
    } else {
      message.amount = "";
    }
    return message;
  },

  fromPartial(object: DeepPartial<Coin>): Coin {
    const message = { ...baseCoin } as Coin;
    if (object.denom !== undefined && object.denom !== null) {
      message.denom = object.denom;
    } else {
      message.denom = "";
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    } else {
      message.amount = "";
    }
    return message;
  },

  toJSON(message: Coin): unknown {
    const obj: any = {};
    message.denom !== undefined && (obj.denom = message.denom);
    message.amount !== undefined && (obj.amount = message.amount);
    return obj;
  },
};

const baseDecCoin: object = { denom: "", amount: "" };

export const DecCoin = {
  encode(message: DecCoin, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.denom);
    writer.uint32(18).string(message.amount);
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DecCoin {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDecCoin } as DecCoin;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string();
          break;
        case 2:
          message.amount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DecCoin {
    const message = { ...baseDecCoin } as DecCoin;
    if (object.denom !== undefined && object.denom !== null) {
      message.denom = String(object.denom);
    } else {
      message.denom = "";
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = String(object.amount);
    } else {
      message.amount = "";
    }
    return message;
  },

  fromPartial(object: DeepPartial<DecCoin>): DecCoin {
    const message = { ...baseDecCoin } as DecCoin;
    if (object.denom !== undefined && object.denom !== null) {
      message.denom = object.denom;
    } else {
      message.denom = "";
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    } else {
      message.amount = "";
    }
    return message;
  },

  toJSON(message: DecCoin): unknown {
    const obj: any = {};
    message.denom !== undefined && (obj.denom = message.denom);
    message.amount !== undefined && (obj.amount = message.amount);
    return obj;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw new Error("Unable to locate global object");
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (let i = 0; i < arr.byteLength; ++i) {
    bin.push(String.fromCharCode(arr[i]));
  }
  return btoa(bin.join(""));
}

type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}