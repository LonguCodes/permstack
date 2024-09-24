export class Path {
  static simple(pathString: string): string {
    let res = '';
    let i = 0,
      j = 0;
    for (; i < pathString.length; i++) {
      if (pathString.charAt(i) === ':' || pathString.charAt(i) === '<') {
        res += pathString.substring(j, i) + ':';
        while (i < pathString.length && pathString.charAt(i) !== '/') {
          i++;
        }
        j = i;
      }
    }
    res += pathString.substring(j, i);
    return res;
  }
}
