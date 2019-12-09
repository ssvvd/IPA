export class sidetab {
    TabID:number;
    TapLetter:string;
    Description: string;
    color: string;
    IsSelected:boolean=false;
  
    constructor(public pTabID: number,public pTapLetter: string, public pDescription: string,public pColor:string) { 
      this.TabID =pTabID;
      this.TapLetter =pTapLetter;
      this.Description =pDescription;
      this.color=pColor; 
    }
  }
