export class Item {
  public _id: string;
  public name: string;
  public href: string;
  public soldOut: boolean;
  public active: boolean;

  public toValues() {
    return [ 'name', this.getString(this.name), 'href', this.getString(this.href),  'soldOut', this.getString(this.soldOut), 'active', this.getString(this.active) ];
  }

  private getString(value) {
    return value != undefined ? value : '';
  }
}