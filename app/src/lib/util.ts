import parse from 'parse-duration';

// `duration in secords` to `human readable duration`
export const ds2hrd = (seconds: number) => {
  const unit_ratio = [
    { u: 's', r: 60 },
    { u: 'm', r: 60 },
    { u: 'h', r: 24 },
    { u: 'd', r: Number.MAX_SAFE_INTEGER },
  ];

  const ret = [];
  let tmp = seconds;
  for (const ur of unit_ratio) {
    const remain = tmp % ur.r;
    tmp = Math.floor(tmp / ur.r);
    if (remain > 0)
      ret.push(`${remain}${ur.u}`);
    if (tmp == 0) break;
  }

  return ret.reverse().join('');
}

export const hrd2ds = (duration: string): number => {
  return parse(duration, 'second');
}