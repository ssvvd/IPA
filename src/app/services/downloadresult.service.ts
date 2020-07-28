import { Injectable } from '@angular/core';
import { Observable,Observer,of} from 'rxjs';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { clsMaterial } from '../models/materials/material';
import { Machineheader } from '../models/machines/machineheader';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
//import canvg from "canvg";
import 'jspdf-autotable'

@Injectable({
  providedIn: 'root'
})
export class DownloadresultService {
  
  environment=environment;
  axial_y:number=0;
 
  constructor(private srv_statemanage: StateManagerService,public translate: TranslateService) { }
  options_svg_pdf: object = {
    width: 20,
    height :15
  };

  DownLoadData(format:string) : any
  {
    switch (format) {
      case 'PDF':
        return this.downloadPDF();
    }
    
  }

  public downloadPDF():any {
 
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
    

 /*    var svg = document.getElementById('container-iscar-svg').innerHTML;
    if (svg)
      svg = svg.replace(/\r?\n|\r/g, '').trim(); 
    doc.addSVG(svg,0,0,this.options_svg_pdf) ;  */

    /* var canvas = document.createElement('canvas');    
    canvg(canvas, (new XMLSerializer).serializeToString(document.getElementById("imglogisvg"))); 
    var imgData = canvas.toDataURL('image/png');   
    doc.addImage(imgData, 'PNG', 0, 0, 20, 15); */
    
    doc.setFontSize(14);
    //doc=this.addTextWithBackGround(doc,0,0,200,15,246,246,247,'ITA Report');
    
    let img = new Image()
    img.src = environment.ImagePath + 'ISCAR_Logo.png'
    doc.addImage(img, 'png', 5, 5, 40, 15)
    doc.setFontSize(16);
    //doc.text(80, 20, 'ITA Recommendation Report');
    doc.text(80, 20, this.translate.instant('ITA Recommendation Report'));
    

    this.axial_y=15;

    doc.setFontSize(12);
    this.addTextWithBackGround(doc,0,15,400,10,246,246,247,'Machining operation: ' + this.srv_statemanage.MainAppSelected.MenuName + ' ' + this.srv_statemanage.SecAppSelected.MenuName);         
    this.addTextWithBackGround(doc,0,30,400,10,246,246,247,"Material: " + mat_desc);    
    this.addTextWithBackGround(doc,0,45,400,10,246,246,247,'Machine: ' + desc_machine);    
    this.addTextWithBackGround(doc,0,60,400,10,246,246,247,'Operation Data:' );
       
    this.axial_y =90;
    this.BuildOperationData(doc);    
    //this.axial_y=this.axial_y+10; 
    doc.addPage();
    doc.setFontSize(12);
    this.addTextWithBackGround(doc,0,0,400,10,246,246,247,'ITA Recommended:' );
    this.axial_y=5;
   
    return this.BuildResult(doc);
}

BuildResult(doc:jsPDF):any
{
  const div = document.getElementById('tbresult');   
    const options = {
      background: 'white',
      scale: 3
    };

    html2canvas(div, options).then((canvas) => {

      var img = canvas.toDataURL("image/PNG");     

      // Add image Canvas to PDF
      const bufferX = 5;
      //const bufferY = 5;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; 
   
      var imgWidth = 295; 
      //var pageHeight = 210;  
      var imgHeight = canvas.height * imgWidth / canvas.width;
      //var heightLeft = imgHeight;

      //var doc = new jsPDF('p', 'px',[x,y]);
      var adjust = -210; //1050 is my assupmtion of how many pixels each page holds vertically
      var extraNo=Math.ceil((imgHeight+30)/210); //Lets me know how many page are needed to accommodate this image
      //alert(extraNo);
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
      return  'ok'; 
    }); 
    //return  of('no');   
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
}
