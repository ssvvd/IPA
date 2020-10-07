import { Injectable } from '@angular/core';
import { Observable,Observer,of} from 'rxjs';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { clsMaterial } from '../models/materials/material';
import { Machineheader } from '../models/machines/machineheader';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { BehaviorSubject } from 'rxjs';
//import 'jspdf-autotable'

@Injectable({
  providedIn: 'root'
})
export class DownloadresultService {
  
  environment=environment;
  axial_y:number=0;
  
  private obsPDFListLoaded = new BehaviorSubject<any>(null);
  PDFListLoaded = this.obsPDFListLoaded.asObservable();   

  constructor(private srv_statemanage: StateManagerService,public translate: TranslateService,
              private srv_DataLayer:DatalayerService,private srv_appsetting:AppsettingService) { }

  DownLoadData(format:string) : any
  {   
    return this.downloadListPDF();     
  }
  
  GetHTMLData(url:string) 
  {
     this.srv_DataLayer.gethtmlpage("ALL");
  }

  DownLoadDataItem(format:string,data:string) : any
  {
    switch (format) {
      case 'PDF':
        return this.downloadItemPDF();
      case 'P21':
        return this.srv_DataLayer.downloadp21file(data,this.srv_appsetting.Units);
      case "FP":
        return this.srv_DataLayer.downloadfilepackage(data,this.srv_appsetting.Units);
    }    
  }

  public downloadListPDF():any {
  
    var doc = new jsPDF('l');  
         
    let mat_desc;
    let desc_machine;
    let m:clsMaterial;      
  
    m=this.srv_statemanage.GetMaterialSelected();
    if (typeof ( m.material) !== 'undefined')
      mat_desc=m.Category + m.group.toString() + " - " + m.material ;     
    else
      mat_desc=m.Category + m.group.toString() + " - " + m.description.toString(); 

    let mach:Machineheader;
    mach=this.srv_statemanage.SelectedMachine;
    desc_machine= mach.MachineType + ' ' + mach.MachineName + ' ' +  mach.AdaptationType + ' ' + mach.AdaptationSize;
    
    doc.setFontSize(14);
   
    let img = new Image()
    img.src = environment.ImagePath + 'ISCAR_Logo.png'
    doc.addImage(img, 'png', 5, 5, 40, 15)
    doc.setFontSize(16);
    
    doc.text(80, 20, this.translate.instant('ITA Recommendation Report'));
    
    this.axial_y=15;

    doc.setFontSize(12);
    this.addTextWithBackGround(doc,0,15,400,10,246,246,247,'Machining operation: ' + this.srv_statemanage.MainAppSelected.MenuName + ' ' + this.srv_statemanage.SecAppSelected.MenuName);         
    this.addTextWithBackGround(doc,0,30,400,10,246,246,247,"Material: " + mat_desc);    
    this.addTextWithBackGround(doc,0,45,400,10,246,246,247,'Machine: ' + desc_machine);    
    this.addTextWithBackGround(doc,0,60,400,10,246,246,247,'Operation Data:' );
       
    this.axial_y =90;
    this.BuildOperationData(doc);    
    doc.addPage();
    doc.setFontSize(12);
    this.addTextWithBackGround(doc,0,0,400,10,246,246,247,'ITA Recommended:' );
    this.axial_y=5;
   
    return this.BuildResult(doc,'tbresult');
}

ingDownloaded:any;
public downloadItemPDF():any {
  
  var doc = new jsPDF('l');    
  return this.BuildResultItem(doc,'pdfdata');
}

toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.send();
}

BuildResult(doc:jsPDF,controlname:string):any
{
  const div = document.getElementById(controlname); 

    const options = {
      background: 'white',
      scale: 3
    };

    html2canvas(div, options).then((canvas) => {

      var img = canvas.toDataURL("image/PNG");     

      // Add image Canvas to PDF
      const bufferX = 5;   
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; 
   
      var imgWidth = 295;     
      var imgHeight = canvas.height * imgWidth / canvas.width;
     
      var adjust = -210; //1050 is my assupmtion of how many pixels each page holds vertically
      var extraNo=Math.ceil((imgHeight+30)/210); //Lets me know how many page are needed to accommodate this image
      
      for(let r:number=0;r<extraNo;r++){
        if(r==0)
          doc.addImage(canvas, 'PNG', 0,30, imgWidth, imgHeight);
        else        
          doc.addImage(canvas, 'PNG', 0,(adjust)*r+30, imgWidth, imgHeight);     
        if(r<extraNo-1) doc.addPage();
      }
                   
      return doc;
       }).then((doc) => {
      doc.save('ITARecommendations.pdf');
      this.obsPDFListLoaded.next(null);
      return  'ok'; 
    });   
}

BuildResultItem(doc:jsPDF,controlname:string):any
{
    const options = {
      background: 'white',
      scale: 3
    };
    
    html2canvas(document.getElementById(controlname), {useCORS: true,allowTaint : true,
      onclone: function (clonedDoc) {    
        //I made the div hidden and here I am changing it to visible              
        clonedDoc.getElementById(controlname).style.visibility = 'visible';        
      }
    }).then(canvas => {
      // The following code is to create a pdf file for the taken screenshot
      var img = canvas.toDataURL("image/PNG");     
      document.getElementById(controlname).style.visibility = 'hidden';
      // Add image Canvas to PDF
      const bufferX = 5;   
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; 
   
      var imgWidth = 295;     
      var imgHeight = canvas.height * imgWidth / canvas.width;     
      var adjust = -210; //1050 is my assupmtion of how many pixels each page holds vertically
      var extraNo=Math.ceil((imgHeight+30)/210); //Lets me know how many page are needed to accommodate this image
      
      for(let r:number=0;r<extraNo;r++){
        if(r==0)
          doc.addImage(canvas, 'PNG', 0,0, imgWidth, imgHeight);
        else        
          doc.addImage(canvas, 'PNG', 0,(adjust)*r+30, imgWidth, imgHeight);     
        if(r<extraNo-1) doc.addPage();
      }
                   
      return doc;
       }).then((doc) => {
      doc.save('ITARecommendations' + new Date().toISOString().slice(0, 10) + '.pdf');
      this.obsPDFListLoaded.next(null);
      return  'ok'; 
    });                        
}
BuildOperationData(doc:jsPDF)
  {     
    //add operation data
    var img = new Image();
    img.src = environment.ImageInputPath + this.srv_statemanage.SecApp + ".png";   
    doc.addImage(img, 'png', 150, this.axial_y-15, 100, 80);

    doc.setFontSize(10);
    this.srv_statemanage.IPL.items.filter(x=> x.description!='' && x.istooldetails !='1').forEach(p=> {  
      if(p.value!='')
      {
        doc.text(10, this.axial_y, p.description + ': ' + p.value + ' ' + p.units);
        this.axial_y=this.axial_y+8;
      }                                     
      
    });  
    //add tool data
    if(this.srv_statemanage.IPL.items.filter(x=> x.description!='' && x.istooldetails =='1' && x.valueall !=x.value && x.value!='Default').length >0)  
    {
      doc.setFontSize(12);
      this.addTextWithBackGround(doc,5,this.axial_y-5,400,10,246,246,247,'Tool Data:' );     
      this.axial_y=this.axial_y+20;
      doc.setFontSize(10);
      this.srv_statemanage.IPL.items.filter(x=> x.description!='' && x.istooldetails =='1' && x.valueall !=x.value && x.value!='Default').forEach(p=> {                                               
        doc.text(10, this.axial_y, p.description + ': ' + p.value + ' ' + p.units);
        this.axial_y=this.axial_y+8;
      });
      this.axial_y=this.axial_y-5;
    }      
  }

  addTextWithBackGround(doc:jsPDF,x:number,y:number,w:number,h:number,c1:number,c2:number,c3:number,txt:string)
  {
    let top:number;
    top=10;
    doc.setFillColor(c1,c2,c3);
    doc.rect(x, top+y, w, h, "F"); 
    if(txt=='ITA Report')
      doc.text(60, top+y+7, txt);
    else
      doc.text(10, top+y+7, txt);      
    doc.setFillColor(255, 255, 255);   
  }

 imageReceived() {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
  
    canvas.width = this.ingDownloaded.width;
    canvas.height = this.ingDownloaded.height;
   
    context.drawImage(this.ingDownloaded, 0, 0);
   
    try {
      //localStorage.setItem("saved-image-example", canvas.toDataURL("image/png"));
      
      var imgData =canvas.toDataURL("image/png");
      let doc = new jsPDF('l');
      doc.addImage(imgData, 0, 0, (canvas.width), (canvas.height));
      doc.save('testimage.pdf');
    }
    catch(err) {
      console.log("Error: " + err);
    }  
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
          // This will call another method that will create image from url
          img.onload = () => {         
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
           observer.error(err);
        };
      } else {
          observer.next(this.getBase64Image(img));
          observer.complete();
      }
    });
 }

 getBase64Image(img: HTMLImageElement) {
  // We create a HTML canvas object that will create a 2d image
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  // This will draw image    
  ctx.drawImage(img, 0, 0);
  // Convert the drawn image to Data URL
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg|svg);base64,/, "");
}


CreateURLparamCNCProgram(viewParams:any) :string
{
  let urlparam:string = '';
 
    urlparam = urlparam + "&units=" + this.srv_statemanage.IPL.GetItem('Units').value.toString() ; 
    urlparam = urlparam + "&threadform=" + this.srv_statemanage.IPL.GetItem('ThreadForm').value.toString();
    urlparam = urlparam + "&pitch=" +  this.srv_statemanage.IPL.GetItem('Pitch').value.toString();
    urlparam = urlparam + "&majordiameter=" + this.srv_statemanage.IPL.GetItem('MajorDiameter').value.toString();

    if (!this.srv_statemanage.IPL.GetItem('D_Hole').value.toString() ==null && this.srv_statemanage.IPL.GetItem('D_Hole').value.toString() != "" &&
    this.srv_statemanage.IPL.GetItem('D_Hole').value.toString() != "0")        
      urlparam = urlparam + "&size=" + this.srv_statemanage.IPL.GetItem('D_Hole').value.toString();
    else
      urlparam = urlparam + "&size=" + this.srv_statemanage.IPL.GetItem('Size').value.toString();

  urlparam = urlparam + "&length=" + this.srv_statemanage.IPL.GetItem('LengthOfShoulder_L').value.toString();

  //urlparam = urlparam + "&predrilldia=" + this.srv_statemanage.IPL.GetItem('DiameterInner').Value.ToString; todo:check
  //urlparam = urlparam + "&predrilldia=" + objParamList.Item(InpItemName.DiameterInner.ToString).Value.ToString

  urlparam = urlparam + "&material=" + this.srv_statemanage.IPL.GetItem('Material').value.toString();
  
  urlparam = urlparam + "&sid=" + this.srv_statemanage.IPL.GetItem('SecondaryApplication').value.toString();
  
  urlparam = urlparam + "&lang=" + this.srv_appsetting.Lang;

  if (this.srv_statemanage.IPL.GetItem('ThreadForm').value.toString() == 'M60' || this.srv_statemanage.IPL.GetItem('ThreadForm').value.toString() == 'MJ60' )
    this.srv_statemanage.IPL.GetItem('MachineType').value='M';           
 else
    this.srv_statemanage.IPL.GetItem('MachineType').value='I';

  urlparam = urlparam + "&pitchunits=" + this.srv_statemanage.IPL.GetItem('MachineType').value.toString(); 
  urlparam = urlparam + "&minordiameter=" + this.srv_statemanage.IPL.GetItem('WorkpieceDiameterRad').value.toString();
  
  urlparam=this.CreateURLparamCNCProgramForItem(viewParams) +urlparam ;
  return urlparam;          
}

CreateURLparamCNCProgramForItem(viewParams:any) :string
{
  let strpar:string;
  let catsnumber:string;
  let cuttingspeed:string='0';
  let feedtable:string='0';
  let rpm:string='0';
  let feed:string='0';
  let feed1:string='0';
  let rorl:string='R';

  let cuttingspeedfieldname:string;
  let FeedTablefieldname:string;
  let Feedfieldname:string;
  let FeedGfieldname:string;
  if (this.srv_statemanage.IPL.GetItem('Units').value.toString() == "M")
  {
    cuttingspeedfieldname = "CuttingSpeed";
    FeedTablefieldname = "FeedTable";
    Feedfieldname = "Feed";
    FeedGfieldname = "FeedG";
  }
  else
  {
    cuttingspeedfieldname = "CuttingSpeed_INCH";
    FeedTablefieldname = "FeedTable_INCH";
    Feedfieldname = "Feed_INCH";
    FeedGfieldname = "FeedG_INCH";
  }                  

  catsnumber ="";
  for (let c of viewParams.Res[0].CatalogNo)
  {
    c=c.replace(/\s/g, "");
    catsnumber = catsnumber +c + '_';
  } 
  for (let d of viewParams.Res[1])
  {
    let f:any;
    if(d[0].property!==undefined)
    {
      f=d[0].property.Field;
      if(f==cuttingspeedfieldname) {if(d[0].value!== 'undefined')  cuttingspeed=d[0].value;}     
      if(f=='RPM') {if(d[0].value!== 'undefined') rpm=d[0].value;}  
      if(f==FeedGfieldname)  {if(d[0].value!== 'undefined') feedtable=d[0].value }
      if(f==Feedfieldname)  {if(d[0].value!== 'undefined') feed=d[0].value;}
      if(f==FeedTablefieldname)  {if(d[0].value!=='undefined') feed1=d[0].value;}
      if(f=='RorL')  {if(d[0].value!== 'undefined') rorl=d[0].value;} 
    }    
  }
  
  let itemtype:string;
  itemtype=viewParams.Res[0].itemTypeRes;
  strpar="opt=0&catnumbers=" + catsnumber + "&cuttingspeed=" + cuttingspeed + "&rpm=" + rpm + "&feedtable=" + feedtable + "&feed1=" + feed1 + "&feed=" + feed + "&rorl=" + rorl + "&itemtype=" + itemtype;
  return strpar;
}

}
