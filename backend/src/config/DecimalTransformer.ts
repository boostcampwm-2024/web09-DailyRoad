export class DecimalNumericTransformer {
  to(data: number): number {
    return data;
  }

  from(data: string): number {
    return parseFloat(data);
  }
}

const decimalNumericTransformer = new DecimalNumericTransformer();
export default decimalNumericTransformer;
