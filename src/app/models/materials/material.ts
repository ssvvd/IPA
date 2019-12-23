export class clsMaterial {
    id:number;
    group:string;
    description:string;
    Condition:string;
    Hardness:string;

    constructor(public grp: string,public desc: string) { 
        this.group =grp;
        this.description =desc;
      }
}

