class Device{
  id: number;
  name: string;
  description: string;
  type: string;
  value: number;
  
  constructor(id: number, name: string, description: string, type: string, value: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.value = value;
  }

  public mostrar():string {
    return `${this.id} - ${this.name} - ${this.description} - ${this.type} - ${this.value} `; 
  }
}