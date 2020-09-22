export class clsMaterial {
    id:number;
    group:string;
    description:string;
    Condition:string;
    Hardness:number;
    material:string;
    HardnessOrigin:number;
    Category:string;
    Standard:string;
    HardnessUnits:string = 'HB';
    HardnessHBValue:number = this.Hardness;
    FavName:string = '';
    isDefault:boolean;


    constructor(public grp: string,public desc: string,public mat: string,public cat: string,public hardHbValue: number) { 
        this.group =grp;
        this.id = +this.group
        this.description =desc;
        this.material = mat;
        this.Category = cat;
        this.HardnessHBValue = hardHbValue;
      }
}

