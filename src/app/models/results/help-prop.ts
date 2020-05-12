import { ResultsService} from 'src/app/services/results.service' ;

export class clsHelpProp {
    index:number;
    IsExpand:string;
    AverageUse:number;
    DesgT:string[]=[];
    DesgS:string[]=[];
    DesgSI:string[]=[];
    CatalogNoT:string[]=[];
    // CatalogNoS:string[]=[];
    CatalogNoSI:string[]=[];
    private _FzminF:string[];
    SecondaryAppOrig1:string;
    BrandName:string[]=[];
    Designation:string[]=[];
    CatalogNo:string[]=[];
    Dconms:string[]=[];
    Grade:string[]=[];
    CCTMS:string[]=[]
    // CCFMS:string;
    BMC:string[]=[];
    CSP:number;
    DC:number;
    DCX:number;
    KAPR:number;
    APMX:number;
    LU:number;
    THSZMS:number[]=[];
    RE:number;
    NOF:number;
    CHW:number;
    itemType:string;
    private _isHidden:number;

        constructor(private srv_Results:ResultsService, ind:number){
            this._isHidden = 0;
            this.index = ind;
        }

    get isHidden(): number {
        return this._isHidden;
    }

    set isHidden(newValue: number) {
        if (newValue < 0) {
            this._isHidden = 0;
        }
        else {
            this._isHidden = newValue;
        }
        // this._isHidden = newValue;
    }



    checkFzminF(Res:boolean,control:string) {
        if (this._FzminF)
            this.fZiminFCheckHidden(Res,control);
        else{
            this._FzminF = []
            for (let entry of this.CatalogNoT) {
                this.srv_Results.getfzminf(entry.trim()).subscribe((res: any) => {
                    this._FzminF.push(JSON.parse(res)); 
                    if (this._FzminF.length = this.CatalogNoT.length){
                        this.fZiminFCheckHidden(Res,control);
                    }     
                  })
            }
            return this._FzminF;
        }
    }

    fZiminFCheckHidden(Res:boolean,control:string){
        switch (control){
            case 'IT':
                if (this._FzminF.filter(s => s.trim() != '01' && s.trim() != '02').length > 0){
                  if (!Res)
                      this.isHidden++
                  else
                      this.isHidden--
                }
                  break;
               case 'IH':
                if (this._FzminF.filter(s => s.trim() == '01' || s.trim() == '02').length > 0){
                  if (!Res)
                      this.isHidden++
                  else
                      this.isHidden--
                }
                  break;   
        }
    }



}