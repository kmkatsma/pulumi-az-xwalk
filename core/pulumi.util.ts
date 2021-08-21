export class PulumiUtil {
  static validateInput(field: string, news: any, failures: any[]) {
    if (news[field] === undefined) {
      failures.push({
        property: field,
        reason: `required property '${field}' missing`,
      });
    }
  }

  static hasDiffs(source: any, target: any, fields: string[]) {
    if (!source.outs) {
      return true;
    }
    // console.log('hasDiffs', source['inputs']['type']);
    let hasDiff = false;
    fields.forEach((p) => {
      if (source.outs[p] !== target[p]) {
        hasDiff = true;
      }
    });

    return hasDiff;
  }
}
