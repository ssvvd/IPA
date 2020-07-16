import { Injectable } from '@angular/core';
import { Observable,Observer} from 'rxjs';
import { StateManagerService } from 'src/app/services/statemanager.service';
import * as jsPDF from 'jspdf'
import { clsMaterial } from '../models/materials/material';

@Injectable({
  providedIn: 'root'
})
export class DownloadresultService {

  constructor(private srv_statemanage: StateManagerService) { }

  DownLoadResult(format:string)
  {
    this.downloadPDF();
  }

  public downloadPDF():void {
 
    var doc = new jsPDF();   
    //var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    /* this.getBase64ImageFromURL( 'http://intranet.imc.co.il/eCatalog/media/images/ISCAR_Logo.svg').subscribe(base64data => {               
      let base64Image = 'data:image/pdf;base64,' + base64data;
      pdf.addImage(base64Image, 'SVG', 15, 40, 180, 160);
      pdf.save('angular-demo.pdf');
    });  */      
    
    let mat_desc;
    let desc_machine;
    let m:clsMaterial;
    desc_machine=this.srv_statemanage.MainAppSelected.MenuName + ' ' + this.srv_statemanage.SecAppSelected.MenuName;

    m=this.srv_statemanage.GetMaterialSelected();
    if (typeof ( m.material) !== 'undefined')
      mat_desc=m.Category + m.group.toString() + " - " + m.material ;     
    else
      mat_desc=m.Category + m.group.toString() + " - " + m.description.toString(); 
       
    doc.text(10, 20, 'Machining operation: ' + this.srv_statemanage.MainAppSelected.MenuName + ' ' + this.srv_statemanage.SecAppSelected.MenuName);  
    doc.text(10, 40, 'Material: ' + mat_desc );  
    doc.save('angular-demo.pdf');
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
