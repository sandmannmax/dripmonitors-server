export class Product {
  public _id: string;
  public name: string;
  public href: string;
  public soldOut: boolean;
  public active: boolean;

  public toValues(): [string, string][] {
    return [[ 'name', this.getString(this.name) ], ['href', this.getString(this.href)], [ 'soldOut', this.getString(this.soldOut)],[ 'active', this.getString(this.active) ]];
  }

  private getString(value): string {
    return value != undefined ? value.toString() : '';
  }
}