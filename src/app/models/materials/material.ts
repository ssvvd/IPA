export class clsMaterial {
    id:number;
    group:string;
    description:string;
    Condition:string;
    Hardness:string;
    material:string;
    HardnessOrigin:string;

    constructor(public grp: string,public desc: string,public mat: string) { 
        this.group =grp;
        this.description =desc;
        this.material = mat;
      }
}

