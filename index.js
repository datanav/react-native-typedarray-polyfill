function ToUint32(v) { return v >>> 0; }
function ToInt32(v) { return v >> 0; }

// Snapshot intrinsics
var abs = Math.abs,
  floor = Math.floor,
  max = Math.max,
  min = Math.min;

Uint8Array.from = function (buffer) {
  return new Uint8Array(buffer);
}

// adapted from https://github.com/inexorabletash/polyfill/blob/master/typedarray.js

Uint8Array.prototype.indexOf = function (searchElement) {
  var t = Object(this);
  var len = ToUint32(t.length);
  if (len === 0) return -1;
  var n = 0;
  if (arguments.length > 0) {
    n = Number(arguments[1]);
    if (n !== n) {
      n = 0;
    } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
      n = (n > 0 || -1) * floor(abs(n));
    }
  }
  if (n >= len) return -1;
  var k = n >= 0 ? n : max(len - abs(n), 0);
  for (; k < len; k++) {
    if (t[k] === searchElement) {
      return k;
    }
  }
  return -1;
};

Uint8Array.prototype.lastIndexOf = function (searchElement) {
  var t = Object(this);
  var len = ToUint32(t.length);
  if (len === 0) return -1;
  var n = len;
  if (arguments.length > 1) {
    n = Number(arguments[1]);
    if (n !== n) {
      n = 0;
    } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
      n = (n > 0 || -1) * floor(abs(n));
    }
  }
  var k = n >= 0 ? min(n, len - 1) : len - abs(n);
  for (; k >= 0; k--) {
    if (t[k] === searchElement)
      return k;
  }
  return -1;
};

Uint8Array.prototype.subarray = function(start, end) {
  function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }

  var t = Object(this);

  start = ToInt32(start);
  end = ToInt32(end);

  if (arguments.length < 1) { start = 0; }
  if (arguments.length < 2) { end = this.length; }

  if (start < 0) { start = this.length + start; }
  if (end < 0) { end = this.length + end; }

  start = clamp(start, 0, this.length);
  end = clamp(end, 0, this.length);

  var len = end - start;
  if (len < 0) {
    len = 0;
  }

  return new Uint8Array(
    t.buffer, t.byteOffset + start, len);
};
