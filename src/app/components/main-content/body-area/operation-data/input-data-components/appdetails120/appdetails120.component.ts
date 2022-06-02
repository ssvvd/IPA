import { Component, OnInit,Input } from '@angular/core';
import { StateManagerService} from '../../../../../../services/statemanager.service' ;
import { AppsettingService} from '../../../../../../services/appsetting.service';
import { DatalayerService} from '../../../../../../services/datalayer.service';
import { environment } from 'src/environments/environment';
import { Observable ,Subscription} from 'rxjs';

export class ThreadForm
{
  ThreadFormISO:string;
  ThreadForm:string;
  f1:string;
  Sequence:string;
  Description:string
} 
export class ThreadFormPitch
{
   ThreadFormISO:string;
   Pitch:number;
   Size:string;
}

export class FormColName
{
    ThreadForm:string;
    ItemID:string;
    ItemName:string;
    Units:string
}
export class DisplayData
{
    item:string;
    value:string;
    units:string;
}

@Component({
  selector: 'appdetails120',
  templateUrl: './appdetails120.component.html',
  styleUrls: ['./appdetails120.component.scss']
})

export class Appdetails120Component implements OnInit {

  ImageName:string='';
  ImageName1:string='';
  InFocus:boolean=false;
  environment=environment;

  
  @Input() events: Observable<void>;
  @Input () evGetResult: Observable<void>;
  @Input() exportPDF: boolean=false;
  //private eventsSubscription: Subscription;
  private eventsSubscription: Subscription=new Subscription();

  public msrv_StMng:StateManagerService =this.srv_StMng;
  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  
  arrThreadForm:ThreadForm[]=[];
  arrThreadFormPitch:ThreadFormPitch[]=[];
  arrFormColName:FormColName []=[];
  arrformdata:any[]=[];
  arrdatainfo:any[]=[];

  arrPitch:string[]=[];
  arrSize:string[]=[];
 
  arrDisplayData:DisplayData[]=[];

  objthreadform:ThreadForm;
  objPitch:ThreadFormPitch;

  threadform:string='';
  pitch:any='';
  size:string='';
  lenght:number;
  lead:number;
  start:number=1;

  threadtype:string='';
  pitch_units:string =''; 
  isLoaded:boolean =false;
  CostPerHourByRate:number;
  IsGetResult:boolean=false;
  IsSizeEmpty:boolean =false;
  ThreadDiaEnable:boolean=true;

  IsShowInfoThread:boolean=false;

  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService,private srv_DataLayer:DatalayerService) { }
  
  ngOnInit() { 
       
    this.ImageName1= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";
    if(this.srv_StMng.SecApp=='120' || this.srv_StMng.SecApp=='810')
    {
      this.threadtype="Internal";
    }
    else
    {
      this.threadtype="External";
    }
    
    let dia:string;
    dia=this.srv_StMng.IPL.GetItem('D_Hole').value;
    this.eventsSubscription.add(this.events.subscribe(() => this.ClearData()));  
    if(this.evGetResult!=null)
        this.eventsSubscription.add(this.evGetResult.subscribe(() => this.CheckMandatoryFiled()));

    this.eventsSubscription.add(this.srv_DataLayer.thread_form(this.srv_StMng.SecApp).subscribe((data: any)=> {
        for (const d of JSON.parse(data)) {                                                
                this.arrThreadForm.push({
                ThreadFormISO:d.ThreadFormISO,
                ThreadForm:  d.ThreadForm,
                f1:(this.srv_StMng.SecApp=='120' || this.srv_StMng.SecApp=='119')?d.f1:'',
                Sequence: d.Sequence  ,
                Description:(this.srv_StMng.SecApp=='120' || this.srv_StMng.SecApp=='119')?d.ThreadFormISO==''? '': d.ThreadFormISO + ' - ' + d.f1 : d.Description
            })                                        
        } 
        if(this.srv_StMng.IPL.GetItem('ThreadForm').value!=null && this.srv_StMng.IPL.GetItem('ThreadForm').value!='' )
        {
            this.objthreadform = this.arrThreadForm.find(e=> e.ThreadFormISO == this.srv_StMng.IPL.GetItem('ThreadForm').value);
            this.threadform= this.srv_StMng.IPL.GetItem('ThreadForm').value;
            this.fillarrpitch();

            if (this.threadform == 'M60' || this.threadform == 'MJ60')
                this.pitch_units ='mm';//this.srv_appsetting.UnitslengthDesc;
            else
                this.pitch_units ='TPI';

        }

        this.eventsSubscription.add(this.srv_DataLayer.thread_form_colname(this.threadtype).subscribe((data: any)=> {             
        for (const d of JSON.parse(data)) {                                                
            this.arrFormColName.push({
                ThreadForm:d.ThreadForm,
                ItemID:  d.ItemID,
                ItemName:d.ItemName,
                Units:this.srv_appsetting.Units=='M'?d.Units_M:d.Units_Inch
            }) ;                                                                                          
        }
        this.pitch= Number(this.srv_StMng.IPL.GetItem('Pitch').value);
        this.changepitch();
        this.size= this.srv_StMng.IPL.GetItem('Size').value;
        this.lenght= Number(this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value);
            
        this.isLoaded=true;  
        if(dia!=null && dia!='' && dia!='0') //todo: not works!!!
        {
            this.srv_StMng.IPL.GetItem('D_Hole').value =dia;
            this.ChangeDiameter();              
        }

        if(this.srv_StMng.IPL.GetItem('D_Hole').value!='' && this.srv_StMng.IPL.GetItem('D_Hole').value!='0') 
        {
            this.srv_StMng.IPL.GetItem('Size').required=false;
            this.srv_StMng.IPL.GetItem('D_Hole').required=true;
        }
        if(this.srv_StMng.IPL.GetItem('Size').value!='' && this.srv_StMng.IPL.GetItem('Size').value!=null) 
        {
            this.srv_StMng.IPL.GetItem('Size').required=true;
            this.srv_StMng.IPL.GetItem('D_Hole').required=false;
        }       
        //this.srv_StMng.IPL.GetItem('Size').required=true;

        this.SetIPLMandatory();
        }         
        ));      
    }         
)); 

//this.CostPerHourByRate = Math.round(this.msrv_StMng.SelectedMachine.CostPerHour / this.srv_appsetting.CurrRate*100)/100;    
this.CostPerHourByRate =Math.round(this.msrv_StMng.SelectedMachine.CostPerHour / ( Math.round(this.srv_appsetting.CurrRate*1000)/1000)*100)/100;

this.SetImage();
}

CheckMandatoryFiled()
{
    this.IsGetResult =true;
    this.IsSizeEmpty=this.IsGetResult && (this.msrv_StMng.IPL.GetItem('Size').value==null || this.msrv_StMng.IPL.GetItem('Size').value=='0') 
    && (this.msrv_StMng.IPL.GetItem('D_Hole').value==null || this.msrv_StMng.IPL.GetItem('D_Hole').value=='0');

}
onfocusfield(field:string)
{
  this.InFocus=true;  
  if(this.srv_StMng.SecApp=='120' || this.srv_StMng.SecApp=='119')
    this.ImageName1= environment.ImageInputPath + this.srv_StMng.IPL.GetItem(field).image1;
  else
    this.ImageName1= environment.ImageInputPath + this.srv_StMng.IPL.GetItem(field).image1;
}

SetImage()
{
    let s:string;
    let ss:string;
    if(this.srv_StMng.IPL.GetItem('GrooveToolSide').value=='R' && this.srv_StMng.IPL.GetItem('PushOrPull').value=='Push') ss='R';
    if (this.srv_StMng.IPL.GetItem('GrooveToolSide').value =='R' && this.srv_StMng.IPL.GetItem('PushOrPull').value=='Pull' ) ss='L';

    if (this.srv_StMng.IPL.GetItem('GrooveToolSide').value=='L' &&  this.srv_StMng.IPL.GetItem('PushOrPull').value=='Push') ss='L';
    if (this.srv_StMng.IPL.GetItem('GrooveToolSide').value=='L' && this.srv_StMng.IPL.GetItem('PushOrPull').value=='Pull') ss='R';

    s=this.srv_StMng.IPL.GetItem('GrooveToolSide').value+this.srv_StMng.IPL.GetItem('PushOrPull').value;
    s='inpt_' + this.srv_StMng.SecApp + '_' +ss +'H_With_' + this.srv_StMng.IPL.GetItem('GrooveToolSide').value + 'H_Tool';
    this.ImageName1= environment.ImageInputPath + s + ".png"; 
    console.log(this.ImageName1);
}

ChangeStart()
{
    
    //this.srv_StMng.IPL.GetItem('NumberStarts').value=ev;
    this.start=Number(this.srv_StMng.IPL.GetItem('NumberStarts').value);
    if(this.pitch_units=='mm')
        this.lead=Math.round(((+this.pitch)* this.start*10))/10;
    else
        if(this.srv_appsetting.Units=='M')
            this.lead= Math.round((25.4/(+this.pitch)* this.start)*10)/10;
        else
            this.lead=Math.round((1/(+this.pitch)* this.start)*100)/100;

    if(this.isLoaded && this.arrformdata.length>0)
    {
    if(this.srv_StMng.IPL.GetItem('Size').value!=null && this.srv_StMng.IPL.GetItem('Size').value!='')
        this.FillDisplayDataBySize();

    if(this.srv_StMng.IPL.GetItem('D_Hole').value!=null && this.srv_StMng.IPL.GetItem('D_Hole').value!='')
        this.FillDisplayDataByDiameter();   
    }
}

onfocusoutfield()
{  
  this.InFocus=false;       
  this.ImageName1= environment.ImageInputPath + this.srv_StMng.SecApp + ".png";  
}

ClearData()
  {
    this.srv_StMng.IPL.GetItem('ThreadForm').value =null;
    this.srv_StMng.IPL.GetItem('D_Hole').value =null;
    this.srv_StMng.IPL.GetItem('Size').value =null;
    this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value ='';
    this.srv_StMng.IPL.GetItem('Pitch').value =null;
    this.srv_StMng.IPL.GetItem('OverHang').value =this.srv_StMng.IPL.GetItem('OverHang').valuedefault;    
  }
  
  fillarrpitch()
  {
    if(this.objthreadform.ThreadFormISO!=null && this.objthreadform.ThreadFormISO!='')
      this.eventsSubscription.add(this.srv_DataLayer.thread_data_c(this.srv_appsetting.Units,this.objthreadform.ThreadFormISO).subscribe((data: any)=> {        
        this.arrThreadFormPitch=[];
        this.arrPitch=[];
        this.arrPitch.push('');
        for (const d of JSON.parse(data)) {                                                               
                  this.arrThreadFormPitch.push({
                  ThreadFormISO:d.ThreadFormISO,
                  Pitch: d.pitch,
                  Size:d.size                  
            })  
            if(this.arrPitch.filter(p=>p==d.pitch).length==0) 
                this.arrPitch.push(d.pitch);                          
        }  
        
        //this.pitch= this.srv_StMng.IPL.GetItem('Pitch').value;
        //this.changepitch(); 
        
        //this.srv_StMng.IPL.GetItem('Pitch').value=this.pitch;   
        this.arrSize=[];
        let arr:ThreadFormPitch []=this.arrThreadFormPitch.filter(e=> e.Pitch == this.pitch);
        this.size =this.srv_StMng.IPL.GetItem('Size').value;
        this.srv_StMng.IPL.GetItem('D_Hole').value='';
        this.arrSize.push('');
        for(let i=0; i<arr.length; i++)
            this.arrSize.push(arr[i].Size);   
    
        if(this.srv_StMng.SecApp=='800' || this.srv_StMng.SecApp=='810')
            this.ChangeStart();
            
        this.get_threadformdata(); 
                               
    }         
    ));
  }
  
  strMandatory:string='';
  SetIPLMandatory()
  {
    this.strMandatory='';
    this.msrv_StMng.IPLMMandatory='';
    this.AddTostrMandatoryParam('ThreadForm',"TS:","");
    this.AddTostrMandatoryParam('Pitch',"P:",this.pitch_units);
    this.AddTostrMandatoryParam('D_Hole',"Do:",this.srv_appsetting.UnitslengthDesc);
    this.AddTostrMandatoryParam('Size',"NS:","");
    this.AddTostrMandatoryParam('LengthOfShoulder_L',"LTH:",this.srv_appsetting.UnitslengthDesc);
    if(this.strMandatory.length>0)
      this.msrv_StMng.IPLMMandatory=this.strMandatory.substring(0,this.strMandatory.length-2);
  }

  AddTostrMandatoryParam(name:string,desc:string,units:string)
  {
    

    if(this.srv_StMng.IPL.GetItem(name).value!=null && this.srv_StMng.IPL.GetItem(name).value!='')
    {
        if(name=='Size')
            this.srv_StMng.IPL.GetItem('Size').value= this.srv_StMng.IPL.GetItem('Size').value.toString().replace('***','"');
        this.strMandatory=this.strMandatory +desc + this.srv_StMng.IPL.GetItem(name).value + units + ', ';    
    }
    
  }

  changethreadform()
  {  
    this.arrDisplayData=[];
    this.srv_StMng.IPL.GetItem('Pitch').value=null;
    this.srv_StMng.IPL.GetItem('D_Hole').value=null;
    this.srv_StMng.IPL.GetItem('Size').value=null;
    this.strMandatory='TS:' + this.objthreadform.ThreadFormISO;
    this.msrv_StMng.IPLMMandatory= this.strMandatory;

    this.threadform=this.objthreadform.ThreadFormISO;
    this.srv_StMng.IPL.GetItem('ThreadForm').value=this.objthreadform.ThreadFormISO;

    //show info
    if(this.threadform == 'BSPT55' || this.threadform == 'NPT60' || this.threadform == 'NPTF60')
    {   
        this.IsShowInfoThread=true;
        this.eventsSubscription.add(this.srv_DataLayer.getthreadstandartinfo(this.objthreadform.ThreadFormISO).subscribe((data: any)=> {               
            this.arrdatainfo = JSON.parse(data);                                          
        }                 
  ))  
    }
    else
        this.IsShowInfoThread=false;

    this.fillarrpitch();   
    this.fillimagepath(this.objthreadform.ThreadFormISO);
    if (this.threadform == 'M60' || this.threadform == 'MJ60')
        this.pitch_units ='mm';//this.srv_appsetting.UnitslengthDesc;
    else
        this.pitch_units ='TPI';

        
    if (this.threadform == "M60" || this.threadform == "UN60" || this.threadform == "MJ60" || this.threadform == "AC29" || this.threadform == "NJ60" || this.threadform == "NPSF" || this.threadform == "ABUT" || this.threadform == "WH55")
        this.ThreadDiaEnable=true;
    else
        this.ThreadDiaEnable=false;

    //if(this.srv_StMng.SecApp=='800' || this.srv_StMng.SecApp=='810')
        //this.star =null;
  }

  changepitch()
  {
    this.srv_StMng.IPL.GetItem('Pitch').value=this.pitch;   
    this.arrSize=[];
    let arr:ThreadFormPitch []=this.arrThreadFormPitch.filter(e=> e.Pitch == this.pitch);
    this.size =this.srv_StMng.IPL.GetItem('Size').value;
    this.srv_StMng.IPL.GetItem('D_Hole').value='';
    this.arrSize.push('');
    for(let i=0; i<arr.length; i++)
        this.arrSize.push(arr[i].Size);   

    if(this.srv_StMng.SecApp=='800' || this.srv_StMng.SecApp=='810')
        this.ChangeStart();

  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  
  fillimagepath(threadform:string)
  {
      switch (threadform) {
            case 'M60':
                this.ImageName= "M60.jpg";
                break;
            case 'MJ60':
                this.ImageName="MJ60.jpg";
                break;
            case "UN60":
                this.ImageName = "UN60.jpg";
                break;
            case "WH55":
                this.ImageName = "WH55.jpg";
                break;
            case "BSPT55":
                this.ImageName = "BSPT55.jpg";
                break;
            case "NPT60":
                this.ImageName = "NPT60.jpg";
                break;
            case "NPTF60":
                this.ImageName ="NPTF60.jpg";
                break;
            case "NJ60":
                this.ImageName ="NJ60.jpg";
                break;                     
            case "PG":
                this.ImageName ="PG.jpg";
                break;
            case "AC29":
                this.ImageName = "AC29.jpg";
                break;
            case "ABUT":
                this.ImageName ="BUT.jpg";
                break;
            case "BSP(G)":
                this.ImageName = "BSP(G).jpg";
                break;
            case "NPSF":
                this.ImageName = "NPSF.jpg";
                break;
            case "NPS":
                this.ImageName = "NPS.jpg";
                break;
        }
        this.ImageName = environment.ImagePath + this.ImageName;
  }

  changesize()
  {
    this.srv_StMng.IPL.GetItem('Size').value=this.size;
    this.srv_StMng.IPL.GetItem('D_Hole').value='';    
    this.srv_StMng.IPL.GetItem('D_Hole').required=false;    
    this.srv_StMng.IPL.GetItem('Size').required=true;
    this.FillDisplayDataBySize();
  }
  

  ChangeDiameter()
  {
    if(this.srv_StMng.IPL.GetItem('D_Hole').value.toString().indexOf('-')>-1)
    {
        alert("Thread Diameter should be bigger then 0")
        this.srv_StMng.IPL.GetItem('D_Hole').value="";
        return;
    }

    if(this.srv_StMng.IPL.GetItem('D_Hole').value!=null && this.srv_StMng.IPL.GetItem('D_Hole').value!='' && this.srv_StMng.IPL.GetItem('D_Hole').value!='0')
    {       
        this.size='';
        this.srv_StMng.IPL.GetItem('Size').value ='';
        this.FillDisplayDataByDiameter();            
        this.srv_StMng.IPL.GetItem('D_Hole').required=true;    
        this.srv_StMng.IPL.GetItem('Size').required=false;
    }
  }

  get_threadformdata()
  {
    if(this.objthreadform.ThreadFormISO!='') 
       this.eventsSubscription.add(this.srv_DataLayer.thread_form_data(this.objthreadform.ThreadFormISO,this.threadtype,this.srv_appsetting.Units).subscribe((data: any)=> {               
            this.arrformdata = JSON.parse(data);  
            if(this.srv_StMng.IPL.GetItem('Size').value!=null && this.srv_StMng.IPL.GetItem('Size').value!='')
                this.FillDisplayDataBySize();

            if(this.srv_StMng.IPL.GetItem('D_Hole').value!=null && this.srv_StMng.IPL.GetItem('D_Hole').value!='')
                this.FillDisplayDataByDiameter();                             
        }                 
  ))  
  }

  FillDisplayDataBySize()
  {

    this.IsShowInfoThread=false;
    if(this.threadform!=null && this.threadform!=''  && this.size!=null && this.size!='' && this.pitch!=null && this.pitch!='' )
    {
        let arrformatdata_f:any=[];
        let arrFormColName_f:FormColName[];
        this.arrDisplayData=[];
        this.srv_StMng.IPL.GetItem('D_Hole').value='';
                
        if (this.threadform == 'M60' || this.threadform == 'MJ60') 
            arrformatdata_f=this.arrformdata.filter(p=>p.FTDZ==this.size && p.Pitchmm==this.pitch);
        else
            arrformatdata_f=this.arrformdata.filter(p=>p.FTDZ==this.size && p.Pitch==this.pitch);

        arrFormColName_f=this.arrFormColName.filter(p=>p.ThreadForm==this.objthreadform.ThreadFormISO);
        
        if(this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value==null || this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value=='')
            this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value =arrformatdata_f[0]['ThreadLength'];

        for(let i=0; i<arrFormColName_f.length; i++)
        {
            this.arrDisplayData.push({
                item:arrFormColName_f[i].ItemName,
                value:arrformatdata_f[0][arrFormColName_f[i].ItemID],
                units:arrFormColName_f[i].Units
            });
           
            if(arrFormColName_f[i].ItemID=='Majordiameter') 
            {
                this.srv_StMng.IPL.GetItem('MajorDiameter').value =arrformatdata_f[0][arrFormColName_f[i].ItemID];
            }
            if(this.threadtype=="Internal")
            {
                if(arrFormColName_f[i].ItemID=='Minordiameterint') this.srv_StMng.IPL.GetItem('WorkpieceDiameterRad').value =arrformatdata_f[0][arrFormColName_f[i].ItemID];
            }                
            else
            {
                if(arrFormColName_f[i].ItemID=='Minordiameterext') 
                {
                    this.srv_StMng.IPL.GetItem('WorkpieceDiameterRad').value =arrformatdata_f[0][arrFormColName_f[i].ItemID];
                }                
            }
                
            if(arrFormColName_f[i].ItemID=='Helixangle') 
            {
                if(this.srv_StMng.SecApp=='800' || this.srv_StMng.SecApp=='810')
                {
                    let pitch_calc:number;
                    let pitchdia:number;                     
                    let r:string;    

                    pitch_calc = this.getpitch_cal(this.objthreadform.ThreadFormISO);             
                    pitchdia =this.getpitchdiameter(this.threadform,Number(this.srv_StMng.IPL.GetItem('MajorDiameter').value),pitch_calc)
                    r= (Math.round(Math.atan(pitch_calc * this.start/Math.PI / pitchdia )*180/Math.PI* 100) / 100).toString();
                    this.srv_StMng.IPL.GetItem('MinAxialEntAngle').value =  r;

                        if(this.arrDisplayData.find(p=>p.item =='Helix Angle') !=null)
                            this.arrDisplayData.find(p=>p.item =='Helix Angle').value =r;
                }
                else
                    this.srv_StMng.IPL.GetItem('MinAxialEntAngle').value =arrformatdata_f[0][arrFormColName_f[i].ItemID];
            }
            if(arrFormColName_f[i].ItemID=='Predrilldiameter') 
            {
                this.srv_StMng.IPL.GetItem('DiameterInner').value =arrformatdata_f[0][arrFormColName_f[i].ItemID];
            }
            if(arrFormColName_f[i].ItemID=='Effectivediameter') 
            {
                this.srv_StMng.IPL.GetItem('RmaxRadial').value =arrformatdata_f[0][arrFormColName_f[i].ItemID];
            }
        }  
    }      
  }

  FillDisplayDataByDiameter()
  {
    let arrformatdata_f:any=[];
    let arrFormColName_f:FormColName[];
    this.arrDisplayData=[];
    this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value='';

     if (this.threadform == 'M60' || this.threadform == 'MJ60') 
        arrformatdata_f=this.arrformdata.filter(p=>p.FTDZ==this.size && p.Pitchmm==this.pitch);
    else
        arrformatdata_f=this.arrformdata.filter(p=>p.FTDZ==this.size && p.Pitch==this.pitch);

    arrFormColName_f=this.arrFormColName.filter(p=>p.ThreadForm==this.objthreadform.ThreadFormISO);     
    
    let pitch_calc;
    let coeffpitch;
    let dia:number =Number(this.srv_StMng.IPL.GetItem('D_Hole').value);
    pitch_calc = this.getpitch_cal(this.objthreadform.ThreadFormISO); 
    if (this.srv_appsetting.Units == 'M') coeffpitch = 1;
    if (this.srv_appsetting.Units == 'I') coeffpitch = 25.4;
    let res:number;
        for (let i=0; i<arrFormColName_f.length; i++) {        
            res=0;
            switch (i + 1) {
                case 1:
                    if (this.threadform == 'M60' || this.threadform == 'BSPT55' || this.threadform == 'MJ60' 
                       || this.threadform == 'NJ60' || this.threadform == 'AC29' || this.threadform == 'NPSF' || this.threadform == 'ABUT'
                       || this.threadform == "WH55")
                        res = Number(this.pitch);
                    if (this.threadform == 'UN60')
                        res = Math.round(coeffpitch / Number(this.pitch) * 1000) / 1000;                   
                    break;
                case 2:
                    if (this.threadform == 'M60' || this.threadform == 'MJ60') {
                        res = Math.round(25.4 / Number(this.pitch) * 1000) / 1000;                        
                    }
                    else
                        if (this.threadform  == 'NJ60' || this.threadform  == 'AC29' || this.threadform  == 'NPSF' || this.threadform  == 'ABUT') {
                            res = Math.round(25.4 / Number(this.pitch) * 100) / 100;                        
                        }
                        else
                            res = dia;
                    break;
                
                case 3:                    
                    res = dia;   
                    break;
                  
                case 4:
                    if (this.threadform == 'MJ60')
                        res = Math.round((dia - 0.65 * pitch_calc) * 1000) / 1000;
                    else
                        if (this.threadform == 'M60')
                            res =dia;
                        else
                            if (this.threadform == 'NJ60' || this.threadform == 'AC29' || this.threadform == 'NPSF' || this.threadform == 'ABUT')
                                res = dia;
                            else
                                if (this.threadform== 'UN60') {                                
                                    res = Math.round((dia - 0.64952 * pitch_calc) * 1000) / 1000;
                                }
                                else
                                    res = Math.round((dia - 0.64952 * pitch_calc) * 1000) / 1000;
                        break;
                case 5:
                    {
                        if (this.threadform == 'M60') {
                            res = Math.round((dia - 0.64952 * pitch_calc) * 1000) / 1000;
                        }
                        if (this.threadform == 'UN60') {
                            if (this.threadtype == 'Internal')
                                res = Math.round((dia - 1.082532 * pitch_calc) * 1000) / 1000;

                            if (this.threadtype == 'External')
                                res = Math.round((dia - pitch_calc * 1.22687) * 1000) / 1000;
                        }

                        if (this.threadform == 'MJ60') {
                                if (this.threadtype == 'External')
                                    res = Math.round((dia - 1.1547 * pitch_calc) * 1000) / 1000;
                                else
                                    res = Math.round((dia - 0.9747 * pitch_calc) * 1000) / 1000;
                        }

                        if (this.threadform == 'NJ60') {
                            if (this.threadtype == 'External')
                                res = Math.round((dia - 1.15512 * pitch_calc) * 1000) / 1000;
                            else
                                res = Math.round((dia - 0.97449 * pitch_calc) * 1000) / 1000;
                        }
                        if (this.threadform == 'AC29') {
                            if (this.threadtype == 'External')
                                res = Math.round((dia - 0.53598 * pitch_calc) * 1000) / 1000;
                            else
                                res = Math.round((dia - 0.56315 * pitch_calc) * 1000) / 1000;
                        }
                        if (this.threadform == 'NPSF') {
                            res = Math.round((dia - 0.696 * pitch_calc) * 1000) / 1000;
                        }
                        if (this.threadform == 'ABUT') {
                            res = Math.round((dia - 0.6 * pitch_calc) * 1000) / 1000;
                        }
                    }
                                         
                    break;

                case 6:
                    switch (this.threadform) {
                        case 'M60':                                                     
                            if (this.threadtype == 'Internal')
                                res = Math.round((dia - 2 * 0.54127 * pitch_calc) * 1000) / 1000;

                            if (this.threadtype == 'External')
                                res = Math.round((dia - pitch_calc * 1.22687) * 1000) / 1000;

                            break;
                        case 'MJ60':                           
                            if (this.threadtype == 'Internal')
                                res =  Math.round((dia - pitch_calc)*1000)/1000;
                                
                            else
                                res = Math.round((Math.atan(
                                        pitch_calc *this.start/
                                        Math.PI / (dia - 0.64952 * pitch_calc
                                        )) ) *180/Math.PI* 100) / 100;
                            break;
                        case 'NJ60':
                            if (this.threadtype == 'Internal') {
                                res =  Math.round((dia - pitch_calc)*1000)/1000;
                            }
                            else
                                res = Math.round((Math.atan(
                                        pitch_calc * this.start/
                                        Math.PI / (dia - 0.64952 * pitch_calc
                                        )) )*180/Math.PI * 100) / 100;
                            break;
                        case "AC29":
                            if (this.threadtype == 'Internal')
                                res = Math.round((dia - 1.06323 * pitch_calc) * 1000) / 1000;
                            if (this.threadtype == 'External')
                                res = Math.round((dia - 1.06004 * pitch_calc * 1000)) / 1000;
                            break;
                        case "NPSF":
                            res = Math.round((dia - 1.39252 * pitch_calc) * 1000) / 1000;
                            break;
                        case "ABUT":
                            res = Math.round((dia - 1.32543 * pitch_calc) * 1000) / 1000;
                            break;                                               
                        default:
                            if (this.threadtype == 'Internal')
                                res = Math.round((0.54127 * pitch_calc) * 1000) / 1000;
                            if (this.threadtype == 'External')
                                res = Math.round((0.61343 * pitch_calc) * 1000) / 1000;
                    }                                  
                    break;

                case 7:
                    switch (this.threadform) {
                        case "M60":                          
                            if (this.threadtype == 'Internal')
                                res = Math.round((0.54127 * pitch_calc) * 1000) / 1000;
                            if (this.threadtype == 'External') {
                                res = Math.round((0.61343 * pitch_calc) * 1000) / 1000;
                                
                            }
                            break;
                        case "MJ60":                          
                            if (this.threadtype == 'Internal')
                                res = Math.round((Math.atan(
                                            pitch_calc * this.start/
                                            Math.PI / (dia - 0.64952 * pitch_calc
                                            )) )*180/Math.PI * 100) / 100;
                            else
                                res = 0;
                            break;

                        case 'NJ60':
                            if (this.threadtype == 'Internal')
                                res = Math.round((Math.atan(
                                            pitch_calc * this.start/
                                            Math.PI / (dia - 0.64952 * pitch_calc
                                            )) ) *180/Math.PI* 100) / 100;
                            break;
                        case 'AC29':
                            {
                                if (this.threadtype == 'Internal') {
                                    res = dia - (pitch_calc);

                                }
                                if (this.threadtype == 'External')
                                    res = Math.round((Math.atan(
                                           pitch_calc * this.start/
                                           Math.PI / (dia - 0.53598 * pitch_calc
                                           )) ) *180/Math.PI* 100) / 100;
                            }
                            break;
                        case 'NPSF':
                            if (this.threadtype == 'Internal') {//pre hole diameter                         
                                res = Math.round((dia - pitch_calc) * 1000) / 1000;
                            }
                            if (this.threadtype == 'External') { //helix angle
                                res = Math.round((Math.atan(
                                        pitch_calc * this.start/
                                        Math.PI / (dia - 0.696 * pitch_calc
                                        )) ) *180/Math.PI* 100) / 100;

                                break;
                            }

                        case "ABUT":
                            if (this.threadtype == 'Internal')
                                res = Math.round((dia - 1.32543 * pitch_calc) * 1000) / 1000;
                            else
                                res = Math.round((Math.atan(
                                       pitch_calc * this.start/
                                       Math.PI / (dia - 0.6 * pitch_calc
                                       )) ) *180/Math.PI* 100) / 100;
                            break;
                        case 'UN60':                           
                            res = Math.round((Math.atan(
                                            pitch_calc * this.start/
                                            Math.PI / (dia - 0.64952 * pitch_calc
                                            )) ) *180/Math.PI* 100) / 100;
                            break;                            
                        default:
                            {
                                res = Math.round((Math.atan(
                                            pitch_calc * this.start/
                                            Math.PI / (dia - 0.64952 * pitch_calc
                                            ))) *180/Math.PI* 100) / 100;                                
                            }
                    }                  
                    break;
                case 8:
                    switch (this.threadform)
                    {
                        case "M60":                          
                            res = Math.round((Math.atan(
                                          pitch_calc * this.start/
                                           Math.PI / (dia - 0.64952 * pitch_calc
                                           )) ) *180/Math.PI* 100) / 100;                           
                            break;
                        case "MJ60":                           
                            res = Math.round((Math.atan(
                                           pitch_calc * this.start/
                                           Math.PI / (dia - 0.64952 * pitch_calc
                                           )))*180/Math.PI * 100) / 100;
                            break;
                        case 'AC29':
                            if (this.threadtype == 'Internal')
                                res = Math.round((Math.atan(
                                        pitch_calc * this.start/
                                         Math.PI / (dia - 0.56315 * pitch_calc
                                         )) ) *180/Math.PI* 100) / 100;
                            break;
                        case 'ABUT':
                            if (this.threadtype == 'Internal')
                                res = Math.round((Math.atan(
                                         pitch_calc /
                                         Math.PI / (dia - 0.6 * pitch_calc
                                         )) ) *180/Math.PI* 100) / 100;
                            break;
                        case 'NPSF':
                            res = Math.round((Math.atan(
                                    pitch_calc * this.start/
                                    Math.PI / (dia - 0.696 * pitch_calc
                                    )) ) *180/Math.PI* 100) / 100;

                            break;
                        case "UN60":
                            if (this.threadtype == 'Internal')
                                res = Math.round((dia - 1.082532 * pitch_calc) * 10) / 10;

                            if (this.threadtype == 'External')
                                res = Math.round((dia - pitch_calc * 1.22687) * 10) / 10;                          
                            break;
                        default:
                            res = dia - pitch_calc;

                    }
                    break;
                case 9:
                    switch (this.threadform)
                    {
                        case "M60":
                            res = Math.round((dia - pitch_calc) * 1000) / 1000;                            
                            break;
                        default:

                    }
                default:
            }   
            this.arrDisplayData.push({
            item:arrFormColName_f[i].ItemName,
            value:res.toString(),
            units:arrFormColName_f[i].Units
        });

        if(arrFormColName_f[i].ItemID=='Majordiameter') this.srv_StMng.IPL.GetItem('MajorDiameter').value =res.toString();
            if(this.threadtype=="Internal")
                if(arrFormColName_f[i].ItemID=='Minordiameterext') this.srv_StMng.IPL.GetItem('WorkpieceDiameterRad').value =res.toString();
            else
                if(arrFormColName_f[i].ItemID=='Minordiameterint') this.srv_StMng.IPL.GetItem('WorkpieceDiameterRad').value =res.toString();

        if(arrFormColName_f[i].ItemID=='Helixangle') 
        {
          this.srv_StMng.IPL.GetItem('MinAxialEntAngle').value =res.toString();
        }

        if(arrFormColName_f[i].ItemID=='Effectivediameter') this.srv_StMng.IPL.GetItem('RmaxRadial').value =res.toString();
        
        }

  }

  getpitchdiameter(threadform:string,majordia:number,pitch_calc:number) :number
  {
    let pd:number;
    pd = majordia-0.64952*pitch_calc;
    switch (threadform) {
       
        case "NPSF":            
            pd = majordia - 0.696 * pitch_calc;
            break;        
        case "AC29":  
            if (this.threadtype == 'Internal')
                pd = majordia - 1.06323 * pitch_calc;
            if (this.threadtype == 'External')
                pd = majordia - 1.06004 * pitch_calc;
            break;           
        case "ABUT":
            pd =majordia - 0.6 * pitch_calc
            break;
        }
        return pd;
  }
  
  getpitch_cal(threadform:string)
  {    
    let pitch_calc:number;
    let coeffpitch:number;        
    switch (threadform) {
        case "M60":
        case "MJ60":                
            if (this.srv_appsetting.Units == 'M') coeffpitch = 1;
            if (this.srv_appsetting.Units == 'I') coeffpitch = 25.4;
            pitch_calc = Number(this.pitch) / coeffpitch;
            break;
        case "UN60":
            if (this.srv_appsetting.Units == 'M') coeffpitch = 25.4;
            if (this.srv_appsetting.Units == 'I') coeffpitch = 1;
            pitch_calc = coeffpitch / Number(this.pitch);
        case "WH55":
        case "BSPT55":
        case "NPT60":
        case "NPTF60":
        case "NPS":
        case "NPSF":
        case "NJ60":
        case "PG":
        case "AC29":             
        case "ABUT":
            if (this.srv_appsetting.Units == 'M') coeffpitch = 25.4;
            if (this.srv_appsetting.Units == 'I') coeffpitch = 1;
            pitch_calc = coeffpitch / Number(this.pitch);
            break;
        }
        return pitch_calc;    
  }

  changelength()
  {
    if(Number(this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value)<0 || Number(this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value) >1000)
    {
        var min_l;
        var max_l;              
        if (this.srv_appsetting.Units  == 'M')
        {
            min_l = 1;
            max_l = 1000;
        }
        else
        {
            min_l = 0.001;
            max_l = 100;
        }
        alert("Thread length should be between " + min_l + " to " + max_l ) ;            
        this.srv_StMng.IPL.GetItem('LengthOfShoulder_L').value="";
        return;

    } 
  }

}
