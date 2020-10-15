import { Injectable } from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { MachineFilter } from 'src/app/models/machines/machinefilter';
import { clsMaterial } from 'src/app/models/materials/material'
import { MainApp,SecondaryApp } from 'src/app/models/applications/applications';
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { MachineService } from 'src/app/services/machine.service' ;
//import { User } from 'src/app/models/users/user';
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
    
  private obsInputParamSelected = new BehaviorSubject<string>('');
  InputParamSelected = this.obsInputParamSelected.asObservable();

  private obsReloadMachineTab = new BehaviorSubject<boolean>(false);
  ReloadMachineTab = this.obsReloadMachineTab.asObservable(); 

  private mSecondaryAppSelected:SecondaryApp;
  private mMainAppSelected:MainApp; 
 
  //private mUnits:string='M'; //todo:
  private mIsTabToolDataOpen:boolean =false;
  
  constructor(private srv_appsetting:AppsettingService,private srv_machine: MachineService) { }

  CheckTabOperationalDataEnable()
  {   
    if(typeof(this.SelectedMachine) !== 'undefined' && typeof(this.SecAppSelected) !== 'undefined' && typeof(this.GetMaterialSelected()) !== 'undefined' && this.SelectedMachine!=null && this.SecAppSelected!=null && this.GetMaterialSelected()!=null)   
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
      }
    this.mSelectedMachine = Object.assign({}, m);
    let desc:string; 
    if(typeof(m)!=='undefined' && m!==null) 
    {           
      desc=m.AdaptationType.toString() + " - " + m.AdaptationSize.toString() +" / " + m.Power + " kW";
      this.CheckTabOperationalDataEnable();   
      this.obsMachineSelected.next([m.MachineName,desc]); 
    }              
  }  
  
  get SelectMachineFilter():MachineFilter {
    return this.mMachineFilter;
  }
  set SelectMachineFilter(mf:MachineFilter) {
    this.mMachineFilter = mf;
  }
  
  get arrMachineSpindle():Machinespindle[] {
    return this.marrMachineSpindle;
  }
  set arrMachineSpindle(mf:Machinespindle[]) {
    this.marrMachineSpindle = mf;
  }
  
  mMachineSpindleMain:Machinespindle;
  get MachineSpindleMain():Machinespindle {
    return this.mMachineSpindleMain;
  }
  set MachineSpindleMain(ms:Machinespindle) {
    this.mMachineSpindleMain = ms;
  }

  mMachineSpindleTool:Machinespindle;
  get MachineSpindleTool():Machinespindle {
    return this.mMachineSpindleTool;
  }
  set MachineSpindleTool(ms:Machinespindle) {
    this.mMachineSpindleTool = ms;
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
     this.MachineSpindleMain=null;
     this.mSecondaryAppSelected=null;
     this.MainAppSelected=null;
     this.MenuIDLevel1="";
     this.MenuIDLevel2 =""; 
     this.IPL =null;
     this.obsReloadMachineTab.next(true);
     this.mIPLMMandatory = "";
     this.obsInputParamSelected.next("");
   }
  
   private mopttool_selectedfamily:any[]=[];
  get opttool_selectedfamily():any[] {
    return this.mopttool_selectedfamily;
    }
  set opttool_selectedfamily(arr:any[]) {  
    this.mopttool_selectedfamily = arr;
   }

   FillMachineData(arrMachineSpindle: Machinespindle[])
   {
       let mainspindletype:string;
       let ms:Machinespindle;
       mainspindletype='M';
       
       this.IPL.GetItem('MachCostPerHour').value = Math.round(this.SelectedMachine.CostPerHour / this.srv_appsetting.CurrRate*100)/100 + "";
      
       if(this.srv_appsetting.Country!==undefined)
       {
         this.IPL.GetItem('Country').value =this.srv_appsetting.Country.CountryID.toString();
       }
       else
       {
         this.IPL.GetItem('Country').value ='35';
       }    
         
       this.IPL.GetItem('Currency').value = this.srv_appsetting.Currency;
       
       ms = arrMachineSpindle.filter(x=> x.SpindleType ==this.SelectedMachine.SpindleType)[0];

   /*     if(this.SelectedMachine.MachineType=='Multi task' || this.SelectedMachine.MachineType=='Multi spindle' || this.SelectedMachine.MachineType=='Swiss type')
       {
         if(this.MainAppSelected.MainApp=='ML') mainspindletype='T';
         if(this.MainAppSelected.MainApp=='TH') mainspindletype='T';
         //todo:drilling
         
         ms = arrMachineSpindle.filter(x=> x.SpindleType ==mainspindletype)[0];
       }
       else 
         ms = arrMachineSpindle[0]; */
       
       this.IPL.GetItem('MachineType').value = this.SelectedMachine.MachineType;
       this.IPL.GetItem('AdaptorType').value =ms.AdaptationType;
       this.IPL.GetItem('AdaptorSize').value =ms.AdaptationSize;
 
       this.IPL.GetItem('PW_AX').value = ms.N1+""; 
       this.IPL.GetItem('PW_BX').value = ms.N2+"";
       this.IPL.GetItem('PW_CX').value = ms.N3+"";
 
       this.IPL.GetItem('PW_AY').value = ms.P1 +""; 
       this.IPL.GetItem('PW_BY').value = ms.P2 +"";
       this.IPL.GetItem('PW_CY').value = ms.P3 + ""; 
 
       if(ms.FaceContact + ""=='true')
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

   FillInputParameters(arrMachineSpindle: Machinespindle[])
   {                   
     this.IPL.GetItem('MainApplication').value = this.MainAppSelected.MainApp;
     this.IPL.GetItem('SecondaryApplication').value = this.SecAppSelected.ApplicationITAID;
     this.IPL.GetItem('Units').value = this.srv_appsetting.Units;  
    
     this.FillMachineData(arrMachineSpindle);        
     this.FillDataInputParam();         
   } 

   

    
}
 