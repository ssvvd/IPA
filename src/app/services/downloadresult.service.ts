import { Injectable } from '@angular/core';
import { Observable,Observer} from 'rxjs';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { clsMaterial } from '../models/materials/material';
import { Machineheader } from '../models/machines/machineheader';
import { environment } from 'src/environments/environment';
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
//import canvg from "canvg";
//import 'jspdf-autotable'

@Injectable({
  providedIn: 'root'
})
export class DownloadresultService {
  
  environment=environment;
  axial_y:number=0;
 
  constructor(private srv_statemanage: StateManagerService) { }
  options_svg_pdf: object = {
    width: 20,
    height :15
  };

  DownLoadResult(format:string)
  {
    switch (format) {
      case 'PDF':
        this.downloadPDF();
    }

  }

  public downloadPDF():void {
 
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
    doc.text(60, 20, 'ITA Recommendation Report');

    this.axial_y=15;

    doc.setFontSize(12);
    this.addTextWithBackGround(doc,0,15,400,10,246,246,247,'Machining operation: ' + this.srv_statemanage.MainAppSelected.MenuName + ' ' + this.srv_statemanage.SecAppSelected.MenuName);         
    this.addTextWithBackGround(doc,0,30,400,10,246,246,247,'Material: ' + mat_desc);    
    this.addTextWithBackGround(doc,0,45,400,10,246,246,247,'Machine: ' + desc_machine);    
    this.addTextWithBackGround(doc,0,60,400,10,246,246,247,'Operation Data:' );
       
    this.axial_y =90;
    this.BuildOperationData(doc);    
    //this.axial_y=this.axial_y+10; 
    doc.addPage();
    this.addTextWithBackGround(doc,0,0,400,10,246,246,247,'ITA Recommended:' );
    this.axial_y=30;
    //doc.addPage();
    doc.autoTable({ html: '#tbresult' });
    doc.save('ITARecommendations.pdf');
    //this.BuildResult(doc);
}

BuildResult(doc:jsPDF)
{
  const div = document.getElementById('tbresult');   
    const options = {
      background: 'white',
      scale: 3
    };

    html2canvas(div, options).then((canvas) => {

      var img = canvas.toDataURL("image/PNG");
      //var doc = new jsPDF('l', 'mm', 'a4', 1);

      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; 
      //doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      var imgWidth = 295; 
      var pageHeight = 210;  
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      //heightLeft -= pageHeight;
      
      var position = this.axial_y; // give some top padding to first page
      doc.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
      while (heightLeft >= 0) {
        position += heightLeft - imgHeight; // top padding for other pages
        doc.addPage();
        doc.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      //doc.addImage(img, 'PNG', bufferX, this.axial_y, pdfWidth, pdfHeight, undefined, 'FAST');          
      return doc;
    }).then((doc) => {
      doc.save('ITARecommendations.pdf');
    });     
}

/* BuildResult(doc:jsPDF)
{
  const div = document.getElementById('tbresult');   
    const options = {
      background: 'white',
      scale: 3
    };

    html2canvas(div, options).then((canvas) => {

      var img = canvas.toDataURL("image/PNG");
      //var doc = new jsPDF('l', 'mm', 'a4', 1);

      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; 
      
      doc.addImage(img, 'PNG', bufferX, this.axial_y, pdfWidth, pdfHeight, undefined, 'FAST');          
      return doc;
    }).then((doc) => {
      doc.save('ITARecommendations.pdf');
    });     
} */

BuildOperationData(doc:jsPDF)
  {     
    //add operation data
    doc.setFontSize(10);
    this.srv_statemanage.IPL.items.filter(x=> x.description!='' && x.istooldetails !='1').forEach(p=> {                                       
      doc.text(10, this.axial_y, p.description + ': ' + p.value + ' ' + p.units);
      this.axial_y=this.axial_y+8;
    });  
    //add tool data
    if(this.srv_statemanage.IPL.items.filter(x=> x.description!='' && x.istooldetails =='1' && x.valueall !=x.value && x.value!='Default').length >0)  
    {
      doc.setFontSize(12);
      doc=this.addTextWithBackGround(doc,5,this.axial_y-5,200,10,246,246,247,'Tool Data:' );
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
