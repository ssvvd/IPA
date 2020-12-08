import { ResultsService} from 'src/app/services/results.service' ;
import { StateManagerService} from 'src/app/services/statemanager.service' ;

export class clsHelpProp {
    index:number;
    IsExpand:string;
    AverageUse:number;
    DesgT:string[]=[];
    DesgS:string[]=[];
    DesgSI:string[]=[];
    CatalogNoT:string[]=[];
    Families:string[]=[]
    // CatalogNoS:string[]=[];
    CatalogNoSI:string[]=[];
    private _FzminF:string[];
    SecondaryAppOrig1:string;
    BrandName:string[]=[];
    Designation:string[]=[];
    CatalogNo:string[]=[];
    Promotion:boolean;
    // PromotionFile:string
    Dconms:string[]=[];
    Grade:string[]=[];
    CCTMS:string[]=[]
    // CCFMS:string;
    BMC:string[]=[];
    // CSP:number;
    // CP:number;
    DC:number;
    DCX:number;
    KAPR:number;
    APMX:number;
    LU:number;
    THSZMS:number[]=[];
    RE:number;
    NOF:number;
    CHW:number;
    ZEFF:number;
    IC:number;
    L:number;
    PSIR:number;
    CEDC:number;
    CW:number;
    kappaLeadAngle:number;
    itemImg:string='';
    familyImg:string='';
    img:string='';
    itemType:string[]=[];
    itemTypeRes:string;
    GroupText:string[]=[];
    GroupID:number[]=[];
    desgFieldName:string[]=[];
    info:string[]=[];
    [key: string]: any;

    private _isHidden:number;

        constructor(private srv_Results:ResultsService, ind:number,private srv_StMng:StateManagerService){
            this._isHidden = 0;
            this.index = ind;
            this.Promotion = false;
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
            if (this.itemType.indexOf('S') == -1)
            {
                for (let entry of this.CatalogNoT) {
                    this.srv_Results.getfzminf(entry.trim(),this.SecondaryAppOrig1 || this.srv_StMng.SecApp).subscribe((res: any) => {
                        this._FzminF.push(JSON.parse(res)); 
                        if (this._FzminF.length = this.CatalogNoT.length){
                            this.fZiminFCheckHidden(Res,control);
                        }     
                      })
                }
            }
            else{
                for (let entry of this.CatalogNoSI) {
                    this.srv_Results.getfzminf(entry.trim(),this.SecondaryAppOrig1 || this.srv_StMng.SecApp).subscribe((res: any) => {
                        this._FzminF.push(JSON.parse(res)); 
                        if (this._FzminF.length = this.CatalogNoSI.length){
                            this.fZiminFCheckHidden(Res,control);
                        }     
                      })
                }
            }
            return this._FzminF;
        }
    }

    fZiminFCheckHidden(Res:boolean,control:string){
        switch (control){
            case 'IT':
                if (((this.srv_StMng.MainAppSelected.MainApp=='ML' && this._FzminF.filter(s => s.trim() != '01,307-01,SAI' && !s.trim().startsWith('02,307-01,')).length > 0) ||
                (this.srv_StMng.MainAppSelected.MainApp!='ML' && this._FzminF.filter(s => s.trim() != '01,307-01,SAI' && s.trim() != '02,307-01,SAI').length > 0))
                 && this.itemType.indexOf('S') == -1){
                  if (!Res)
                      this.isHidden++
                  else
                      this.isHidden--
                }
                  break;
               case 'IH':
                if (((this.srv_StMng.MainAppSelected.MainApp=='ML' && this._FzminF.filter(s => s.trim() == '01,307-01,SAI' || s.trim().startsWith('02,307-01,')).length > 0) 
                || (this.srv_StMng.MainAppSelected.MainApp!='ML' && this._FzminF.filter(s => s.trim() == '01,307-01,SAI' || s.trim() == '02,307-01,SAI').length > 0))
                 && this.itemType.indexOf('S') == -1){
                  if (!Res)
                      this.isHidden++
                  else
                      this.isHidden--
                }
                  break;   
                case 'ST':
                if (((this.srv_StMng.MainAppSelected.MainApp=='ML' && this._FzminF.filter(s => s.trim().startsWith('01,') && (s.trim().endsWith(',SAI') || s.trim().endsWith(',SPI'))).length < 1) ||
                (this.srv_StMng.MainAppSelected.MainApp!='ML' && this._FzminF.filter(s => s.trim() != '01,307-01,SAI' && s.trim() != '02,307-01,SAI').length > 0))
                 && this.itemType.indexOf('S') != -1){
                    if (!Res)
                        this.isHidden++
                    else
                        this.isHidden--
                }
                    break;   
                case 'SH':
                if (((this.srv_StMng.MainAppSelected.MainApp=='ML' && this._FzminF.filter(s => s.trim().startsWith('01,') && (s.trim().endsWith(',SAI') || s.trim().endsWith(',SPI'))).length > 0) ||
                (this.srv_StMng.MainAppSelected.MainApp!='ML' && this._FzminF.filter(s => s.trim() == '01,307-01,SAI' || s.trim() == '02,307-01,SAI').length > 0))
                 && this.itemType.indexOf('S') != -1){
                    if (!Res)
                        this.isHidden++
                    else
                        this.isHidden--
                }
                    break;   
        }
    }



        // switch (filed){
        // case 'CSP':
        //     if (this.CSP){
        //         this.InternalCoolantFilter(filed,value,checked)
        //     }
        //     else{
        //         //get CSP value
        //         this.InternalCoolantFilter(filed,value,checked)
        //     }
        //     break;
        // case 'CP':
        //     if (this.CP){
        //         this.InternalCoolantFilter(filed,value,checked)
        //     }
        //     else{
        //         //get CSP value
        //         this.InternalCoolantFilter(filed,value,checked)
        //     }
        //     break;
        // }

    

    InternalCoolantFilter(filed:string,value:string,checked:string){
        switch (checked){
            case 'T':
               if (this[filed] == value)
                     this.isHidden--
              break;
            case 'F':
               if (this[filed] == value)
                   this.isHidden++
              break;
        }
    }



}
