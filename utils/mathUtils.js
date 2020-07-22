export function accMul(arg1, arg2) {
  let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {
  }
  try {
    m += s2.split(".")[1].length
  } catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

export function accSub(arg1, arg2) {
  let r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m - arg2 * m) / m;
}

export function accAdd(arg1, arg2) {
  let r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}

export function accDivide(arg1, arg2, precision, type) {
  arg1 = accMul(arg1, Math.pow(10, precision))
  let rs;
  if (type === 'ceil') {
    rs = Math.ceil(arg1 / arg2)
  } else if (type === 'floor') {
    rs = Math.floor(arg1 / arg2)
  } else if (type === 'round') {
    rs = Math.round(arg1 / arg2)
  } else {
    rs = Math.round(arg1 / arg2)
  }
  return rs / Math.pow(10, precision)
}
