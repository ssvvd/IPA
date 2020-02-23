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


    constructor(public grp: string,public desc: string,public mat: string,public cat: string) { 
        this.group =grp;
        this.description =desc;
        this.material = mat;
        this.Category = cat;
      }
}

