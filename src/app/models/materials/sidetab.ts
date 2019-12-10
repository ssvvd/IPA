export class sidetab {
    TabID:number;
    TapLetter:string;
    Description: string;
    IsSelected:boolean=false;
  
    constructor(public pTabID: number,public pTapLetter: string, public pDescription: string) { 
      this.TabID =pTabID;
      this.TapLetter =pTapLetter;
      this.Description =pDescription;
    }
  }
