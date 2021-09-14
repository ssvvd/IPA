import { Injectable } from '@angular/core';
import { Machineheader } from '../models/machines/machineheader';
import { Machinespindle } from '../models/machines/machinespindle';
import { MachineFilter } from '../models/machines/machinefilter';
import { clsMaterial } from '../models/materials/material'
import { MainApp,SecondaryApp } from '../models/applications/applications';
import { InputParameterlist } from '../models/operational-data/inputparameterlist';
import { AppsettingService} from './appsetting.service';
//import { MachineService } from './machine.service' ;
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
  
export class StateManagerService { 

  //private lstMachineHeader:Machineheader[]; 
  private mMachineFilter:MachineFilter;
  private mSelectedMachine:Machineheader;
  private marrMachineSpindle:Machinespindle[]; 

  private obsMachineSelected = new BehaviorSubject<string[]>([]);
  CurrentMachineSelected = this.obsMachineSelected.asObservable();   
  
  private materialSelected:clsMaterial;
  private obsMaterialSelected = new BehaviorSubject<string[]>([]);
  CurrentMaterialSelected = this.obsMaterialSelected.asObservable();   

  private obsSecondaryAppSelected = new BehaviorSubject<string[]>([]);
  CurrentSecAppSelected = this.obsSecondaryAppSelected.asObservable();  
 
  private obsOperationDataEnable = new BehaviorSubject<boolean>(false);
  OperationDataEnable = this.obsOperationDataEnable.asObservable();   
  
/*   private obsMachiningOperationEnable = new BehaviorSubject<boolean>(false);
  MachiningOperationEnable = this.obsMachiningOperationEnable.asObservable();    */

  private obsInputParamSelected = new BehaviorSubject<string>('');
  InputParamSelected = this.obsInputParamSelected.asObservable();

  private obsReloadMachineTab = new BehaviorSubject<boolean>(false);
  ReloadMachineTab = this.obsReloadMachineTab.asObservable(); 
 
  private obsflgDownLoadPDF = new BehaviorSubject<number>(0);
  onflgDownLoadPDF = this.obsflgDownLoadPDF.asObservable(); 

  private mSecondaryAppSelected:SecondaryApp;
  private mMainAppSelected:MainApp; 
 
  //private mUnits:string='M'; //todo:
  private mIsTabToolDataOpen:boolean =true;
  public _hideFiltermobile:boolean;
  
  constructor(private srv_appsetting:AppsettingService) { }

  CheckTabOperationalDataEnable()
  {   
    if(typeof(this.SelectedMachine) !== 'undefined' && typeof(this.SecAppSelected) !== 'undefined' && typeof(this.GetMaterialSelected()) !== 'undefined' && this.SelectedMachine!=null && this.SecAppSelected!=null && this.GetMaterialSelected()!=null)   
        if(this.MainAppSelected.MainApp=='TH' && (this.SelectedMachine.MachineType=='Lathe' || this.SelectedMachine.MachineType=='Swiss type' || this.SelectedMachine.MachineType=='Multi spindle') || (this.SelectedMachine.MachineType=='Multi task' && this.SelectedMachine.SpindleType=='T')  )
          this.obsOperationDataEnable.next(false);
        else  
          this.obsOperationDataEnable.next(true);    
    else     
        this.obsOperationDataEnable.next(false);  
  }

  public CheckToOperationData():boolean
  {   
    if(typeof(this.SelectedMachine) !== 'undefined'  && typeof(this.GetMaterialSelected()) !== 'undefined' && this.SelectedMachine!=null && this.GetMaterialSelected()!=null)   
        return true;    
    else     
        return false;
  }

  get SelectedMachine():Machineheader {
    return this.mSelectedMachine;
  }
  set SelectedMachine(m:Machineheader) { 
    if(typeof(this.SelectedMachine)!=='undefined' && this.SelectedMachine!==null)            
      if(m.MachineType!=this.mSelectedMachine.MachineType)
      {
        this.mMainAppSelected = null;
        this.mSecondaryAppSelected = null; 
        this.MenuIDLevel1="";
        this.MenuIDLevel2 ="";  
        this.obsOperationDataEnable.next(false);  
        this.obsInputParamSelected.next("");        
      }
    this.mSelectedMachine = Object.assign({}, m);
    let desc:string; 
    if(typeof(m)!=='undefined' && m!==null) 
    {         
     /*  let u:string;
      if(this.srv_appsetting.Units=='M') u=' kW';  
      if(this.srv_appsetting.Units=='I') u=' HP';
      desc=m.AdaptationType.toString() + " - " + m.AdaptationSize.toString() +" / " + m.Power + u; */
      this.CheckTabOperationalDataEnable();   
      this.obsMachineSelected.next([m.MachineName,this.SelectedMachineDescription(m)]); 
    }              
  }  
  
  SelectedMachineDescription(m:Machineheader) :string
  {
    let u:string;
    if(this.srv_appsetting.Units=='M') u=' kW';  
    if(this.srv_appsetting.Units=='I') u=' HP';   
    return m.AdaptationType.toString() + " - " + m.AdaptationSize.toString() +" / " + m.Power + u;;
  }

  get SelectMachineFilter():MachineFilter {
    return this.mMachineFilter;
  }
  set SelectMachineFilter(mf:MachineFilter) {
    this.mMachineFilter = mf;
  }
  
  private mSelectMachineFilterTopMobile:MachineFilter
  get SelectMachineFilterTopMobile():MachineFilter {
    return this.mSelectMachineFilterTopMobile;
  }
  set SelectMachineFilterTopMobile(mf:MachineFilter) {
    this.mSelectMachineFilterTopMobile = mf;
  }
  get arrMachineSpindle():Machinespindle[] {
    return this.marrMachineSpindle;
  }
  set arrMachineSpindle(mf:Machinespindle[]) {
    this.marrMachineSpindle = mf;
  }
  
  get SelectedMachineSpindle():Machinespindle {
    if(this.arrMachineSpindle!=null && this.SelectedMachine!=null)         
      return this.arrMachineSpindle.find(s=>s.SpindleType==this.SelectedMachine.SpindleType);  
    else    
      return null;       
  }

  get SecAppSelected():SecondaryApp {
    return this.mSecondaryAppSelected;
  }
  set SecAppSelected(sa:SecondaryApp) {
    this.mSecondaryAppSelected = sa;   
    this.CheckTabOperationalDataEnable();
    if(typeof(this.SelectedMachine)!=='undefined')
    
    { 
      if(sa.ApplicationITAID == '53' || sa.ApplicationITAID == '50' || sa.ApplicationITAID == '188' || sa.ApplicationITAID == '890' || sa.ApplicationITAID == '880' || sa.ApplicationITAID == '870' || sa.ApplicationITAID == '860' || sa.ApplicationITAID == '850')                
        this.obsSecondaryAppSelected.next([this.MainAppSelected.MenuName, "Int. " +sa.MenuName]);
      else
        this.obsSecondaryAppSelected.next([this.MainAppSelected.MenuName, sa.MenuName]);
    }
  }

  get MainAppSelected():MainApp {
    return this.mMainAppSelected;
  }
  set MainAppSelected(ma:MainApp) {
    this.mMainAppSelected = ma;
  }

  private mMenuIDLevel1:string='';
  get MenuIDLevel1():string {
    return this.mMenuIDLevel1;
  }
  set MenuIDLevel1(id:string) {
    this.mMenuIDLevel1 = id;
  }
  
  private mMenuIDLevel2:string='';
  get MenuIDLevel2():string {
    return this.mMenuIDLevel2;
  }
  set MenuIDLevel2(id:string) {
    this.mMenuIDLevel2 = id;/*  */
  }
  
   private mIPL:InputParameterlist;
   get IPL():InputParameterlist {
    return this.mIPL;
    }
  set IPL(ipl:InputParameterlist) {
    this.CheckTabOperationalDataEnable();   
    this.mIPL = ipl;
   }
   
  private mIPL_ListChanged: { name: string, value: string }[];
  get IPL_ListChanged():{ name: string, value: string }[] {
    return this.mIPL_ListChanged;
    }
  set IPL_ListChanged(ipl:{ name: string, value: string }[]) {   
    this.mIPL_ListChanged = ipl;
   }

   private mIPLChanged:string;
   get IPLChanged():string {
    return this.mIPLChanged;
    }
  set IPLChanged(ipl:string) {  
    this.mIPLChanged = ipl;
   }
   
   mIPLMMandatory:string;
   get IPLMMandatory():string {
    return this.mIPLMMandatory;
  }
  set IPLMMandatory(p:string) {
    this.mIPLMMandatory = p;
    this.obsInputParamSelected.next(p);
  }
  
  AddTostrMandatoryParam(name:string,desc:string,units:string)
  {
    if(this.IPL.GetItem(name).value!=null && this.IPL.GetItem(name).value!='')
    this.IPLMMandatory=this.IPLMMandatory +desc + this.IPL.GetItem(name).value + units + ', ';    
  }
  
  SelectMaterial(mat: clsMaterial) {
    
    mat.HardnessHBValue = mat.HardnessUnits?mat.HardnessHBValue:mat.Hardness;
    this.materialSelected=mat;   
    let desc:string;
    if (mat.material && mat.material != ''){
      desc=mat.Category + mat.group.toString() + " - " + mat.material ; 
    }
    else{
      if (mat.FavName && mat.FavName != ''){
        desc=mat.Category + mat.group.toString() + " - " + mat.FavName ; 
      }
      else{
        desc=mat.Category + mat.group.toString() + " - " + mat.description.toString().split(",")[0].split("(")[0].split(".")[0] ; 
      }
      
    }       
    this.obsMaterialSelected.next([desc]);
  }

  GetMaterialSelectedDescription(mat: clsMaterial):string
  {
   let desc:string;
    if (mat.material && mat.material != ''){
      desc=mat.Category + mat.group.toString() + " - " + mat.material ; 
    }
    else{
      if (mat.FavName && mat.FavName != ''){
        desc=mat.Category + mat.group.toString() + " - " + mat.FavName ; 
      }
      else{
        desc=mat.Category + mat.group.toString() + " - " + mat.description.toString().split(",")[0].split("(")[0].split(".")[0] ; 
      }
      
    } 
    return desc;      
  }

  GetMaterialSelected() :clsMaterial
  {
    return this.materialSelected;    
  }
   
   get SecApp():string
  {
    return this.mSecondaryAppSelected.ApplicationITAID;
  } 
   
  get IsTabToolDataOpen():boolean {   
    return this.mIsTabToolDataOpen;
    }
  set IsTabToolDataOpen(v:boolean) {      
    this.mIsTabToolDataOpen = v;
   }
  
   mTabOpen:number;
   get TabOpen():number {
    return this.mTabOpen;
    }
  set TabOpen(t:number) {  
    this.mTabOpen = t;
   }

   ChangeUnits()
   {
     this.SelectMachineFilter =null;
     this.mSelectedMachine =null;
     this.arrMachineSpindle=null;
     //this.MachineSpindleMain=null;
     this.mSecondaryAppSelected=null;
     this.MainAppSelected=null;
     this.MenuIDLevel1="";
     this.MenuIDLevel2 =""; 
     this.IPL =null;
     this.obsReloadMachineTab.next(true);
     this.mIPLMMandatory = "";
     this.obsInputParamSelected.next("");
     this.obsSecondaryAppSelected.next(["", ""]);
   }
  
   private mopttool_selectedfamily:any[]=[];
  get opttool_selectedfamily():any[] {
    return this.mopttool_selectedfamily;
    }
  set opttool_selectedfamily(arr:any[]) {  
    this.mopttool_selectedfamily = arr;
   }

   FillMachineData()
   {
       //let ms:Machinespindle;       
       this.IPL.GetItem('MachCostPerHour').value = Math.round(this.SelectedMachine.CostPerHour / this.srv_appsetting.CurrRate*100)/100 + "";
      
       if(this.srv_appsetting.Country!==undefined)       
         this.IPL.GetItem('Country').value =this.srv_appsetting.Country.CountryID.toString();       
       else       
         this.IPL.GetItem('Country').value ='35';
           
         
       this.IPL.GetItem('Currency').value = this.srv_appsetting.Currency;
       
       //ms = this.SelectedMachineSpindle;

       this.IPL.GetItem('MachineType').value = this.SelectedMachine.MachineType;
       this.IPL.GetItem('AdaptorType').value =this.SelectedMachineSpindle.AdaptationType;

       if(this.IPL.GetItem('AdaptorType').value.indexOf('CAMFIX')>0)  this.IPL.GetItem('AdaptorType').value='CAMFIX'

       this.IPL.GetItem('AdaptorSize').value =this.SelectedMachineSpindle.AdaptationSize;
 
       this.IPL.GetItem('PW_AX').value = this.SelectedMachineSpindle.N1+""; 
       this.IPL.GetItem('PW_BX').value = this.SelectedMachineSpindle.N2+"";
       this.IPL.GetItem('PW_CX').value = this.SelectedMachineSpindle.N3+"";
 
       this.IPL.GetItem('PW_AY').value = this.SelectedMachineSpindle.P1 +""; 
       this.IPL.GetItem('PW_BY').value = this.SelectedMachineSpindle.P2 +"";
       this.IPL.GetItem('PW_CY').value = this.SelectedMachineSpindle.P3 + ""; 
 
       if(this.SelectedMachineSpindle.FaceContact + ""=='true')
         this.IPL.GetItem('ADAPTOR_FaceContact').value = "1";
       else
         this.IPL.GetItem('ADAPTOR_FaceContact').value = "0";    
   }
   

  FillCoolant()
  {
  if(this.SecAppSelected.ApplicationITAID=='57' || this.SecAppSelected.ApplicationITAID =='760' || this.SecAppSelected.ApplicationITAID =='770'
    || this.SecAppSelected.ApplicationITAID =='780' || this.SecAppSelected.ApplicationITAID =='790')
    {
      if(this.IPL.GetItem('Coolant').value=='2')    
        if((this.GetMaterialSelected().id>=1 && this.GetMaterialSelected().id<=20) 
        || (this.GetMaterialSelected().id>=38 && this.GetMaterialSelected().id<=41) )
        {
          this.IPL.GetItem('Coolant').value='0';
        }
      else
      {
        this.IPL.GetItem('Coolant').value='1';
      }
    }
 }

 FillDataInputParam()
  {
    this.FillCoolant();
    
    this.IPL.GetItem('Material').value = String(this.GetMaterialSelected().id);
    if(this.GetMaterialSelected().HardnessHBValue!==undefined)
      this.IPL.GetItem('HardnessHB').value = String(this.GetMaterialSelected().HardnessHBValue);

    let listparams: { name: string, value: string }[]=[];
    let str:string='';

    if(this.SecApp=='119' || this.SecApp=='120')        
    {
      this.IPL.GetItem('IsExternal').value='';
      this.IPL.GetItem('IsInternal').value='';
      if(this.SecApp=='119') this.IPL.GetItem('IsExternal').value='External';
      if(this.SecApp=='120') this.IPL.GetItem('IsInternal').value='Internal';
      this.IPL.GetItem('Size').value= this.IPL.GetItem('Size').value.toString().replace('"', '***');
    }
           
    if (this.IPL.items.filter(x=> (x.value==null || (x.value=='0' && x.name!='DiameterBoring' ) || x.value.toString()=='') && x.required).length==0)    
      {
      this.IPL.items.filter(x=> x.valuedefault!=x.value).forEach(p=> {                                       
        str=str + '"' + p.name + '":"' + p.value +'",';
        listparams.push(
        {  
          "name": p.name,
          "value": p.value
        })
      });
      str=str.substr (0,str.length-1);
      str="{" + str + "}";     
      this.IPLChanged = str;                  
      }    
  }

   FillInputParameters()
   {                   
     this.IPL.GetItem('MainApplication').value = this.MainAppSelected.MainApp;
     this.IPL.GetItem('SecondaryApplication').value = this.SecAppSelected.ApplicationITAID;
     this.IPL.GetItem('Units').value = this.srv_appsetting.Units;  
    
     this.FillMachineData();        
     this.FillDataInputParam();         
   } 

   mflgPDFLoading:number=0;
   get flgPDFLoading():number {
    return this.mflgPDFLoading;
    }
  set flgPDFLoading(f:number) {  
    this.mflgPDFLoading = f;
    this.obsflgDownLoadPDF.next(f);
   }
  
    mGoMaterialTab:boolean=false;
    get GoMaterialTab():boolean {
      return this.mGoMaterialTab;
      }
    set GoMaterialTab(c:boolean) {  
      this.mGoMaterialTab = c;
      if(c) this.obsMachineSelected.next([this.SelectedMachine.MachineName,this.SelectedMachineDescription(this.SelectedMachine)]);            
     }
     
     mGoOperationTab:boolean=false;
     get GoOperationTab():boolean {
       return this.mGoOperationTab;
      }
     set GoOperationTab(c:boolean) {     
       this.mGoOperationTab = c;    
       //this.obsMachiningOperationEnable.next(true);
       if(c) this.obsMaterialSelected.next([this.GetMaterialSelectedDescription(this.materialSelected)]);           
      }
}
 