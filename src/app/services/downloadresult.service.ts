import { Injectable } from '@angular/core';
import { Observable,Observer,of} from 'rxjs';
import { StateManagerService } from './statemanager.service';
import { AppsettingService} from './appsetting.service';
import { Machineheader } from '../models/machines/machineheader';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import html2pdf from 'html2pdf.js'
import { Subject }    from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})

export class DownloadresultService {
  
  environment=environment;
  axial_y:number=0;
  

  obsPDFListLoaded = new Subject();
  PDFListLoaded = this.obsPDFListLoaded.asObservable();

  constructor(private srv_statemanage: StateManagerService,public translate: TranslateService,
              private srv_DataLayer:DatalayerService,private srv_appsetting:AppsettingService) {}

  DownLoadData(format:string) : any
  {   
    return this.downloadListPDF();     
  }
  
  DownLoadDataItem(format:string,data:string,srv:any, filename:string) : any
  {
    switch (format) {
      case 'PDF':
        return this.downloadItemPDF(srv,filename);
      case 'P21':
        return this.srv_DataLayer.downloadp21file(data,this.srv_appsetting.Units);
      case "GTC":
        return this.srv_DataLayer.downloadfilepackage(data,this.srv_appsetting.Units);
    }    
  }
  
public downloadListPDF():any {
  
  var pdf = new jsPDF();
  var opt = {
     margin: [0, 0, 40, 0],    
    filename:     'IPAReport.pdf',
    image:        { type: 'jpeg', quality: 0.4 },
    html2canvas:  { scale: 1, useCORS: true,allowTaint : true,  dpi: 300},
    jsPDF:        { unit: 'mm',orientation: 'p',format: 'letter'},
    pagebreak:    { before: '.break-page'} 
  };  

  var element = document.getElementById('docheader').innerHTML;
  pdf.setDisplayMode(1);
  html2pdf().from(element).set({ pdf: pdf }).set(opt).from(element).toPdf().get('pdf').then( (pdf)=> 
  {  
    let m=this.srv_statemanage.GetMaterialSelected();
    let mat_desc;
    let desc_machine;
   
    if (typeof ( m.material) !== 'undefined')
      mat_desc=m.Category + m.group.toString() + " - " + m.material ;     
    else
      mat_desc=m.Category + m.group.toString() + " - " + m.description.toString(); 
  
    let mach:Machineheader;
    mach=this.srv_statemanage.SelectedMachine;
    desc_machine= mach.MachineType + ' ' + mach.MachineName + ' ' +  mach.AdaptationType + ' ' + mach.AdaptationSize;
    
    pdf.setFontSize(14);
    pdf.setFontSize(16);
  
    pdf.text(5, 20+10, this.translate.instant('IPA Recommendation Report'));    
    this.axial_y=15+15;
    this.axial_y=15;

    pdf.setFontSize(12);
    this.addTextWithBackGround(pdf,0,15+15,400,10,246,246,247,'Machining operation: ' + this.srv_statemanage.MainAppSelected.MenuName + ' ' + this.srv_statemanage.SecAppSelected.MenuName);         
    this.addTextWithBackGround(pdf,0,30+15,400,10,246,246,247,"Material: " + mat_desc);    
    this.addTextWithBackGround(pdf,0,45+15,400,10,246,246,247,'Machine: ' + desc_machine);    
    this.addTextWithBackGround(pdf,0,60+15,400,10,246,246,247,'Operation Data:' ); 
       
    this.axial_y =90+20;
    this.BuildOperationData(pdf);    
    pdf.addPage();
    pdf.setFontSize(12);
    this.axial_y=5+35 +15;
    var element = document.getElementById('docheader').innerHTML;
    //pdf.setDisplayMode(1);
    html2pdf().from(element).set({ pdf: pdf }).set(opt).from(element).toPdf().get('pdf').then( (pdf)=> 
    {return this.BuildResult1(pdf,'tbresult1');});
    
  } );

 
}

ingDownloaded:any
public downloadItemPDF(srv:any,filename:string):any {  
  //var doc = new jsPDF('p');

  var opt = {
    margin: [0, 0, 2, 0],
    filename:     'IPAReport.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 1, useCORS: true,allowTaint : true,  dpi: 192},
    jsPDF:        { unit: 'mm',orientation: 'p',format: 'letter'},
    pagebreak:    { before: '.break-page'} //,    
    //pdfCallback: this.pdfCallback 
  };
 
  var element = document.getElementById('pdfdata');  
  
  var pdf = new jsPDF();
  pdf.setDisplayMode(1);
  
  html2pdf().from(element).set({ pdf: pdf }).set(opt).from(element).toPdf().get('pdf').then((pdf) => 
  { 
    this.AddPagingNumber(pdf);   
    
    pdf.save(filename + '.pdf');  
    srv.flgPDFLoading=2; 
    
    this.obsPDFListLoaded.next();    
    return  'ok';                       
  }); 
  
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
      scale: 1,
      useCORS: true,allowTaint : true      
    }; 

    html2canvas(div, options).then((canvas) => {

      var img = canvas.toDataURL("image/PNG");     
      var imgWidth = 210;   
      //var imgWidth = 180;  
      var imgHeight = canvas.height * imgWidth / canvas.width;
     
      var adjust = -295; //1050 is my assupmtion of how many pixels each page holds vertically
      var extraNo=Math.ceil((imgHeight+40)/295); //Lets me know how many page are needed to accommodate this image
      
      //imgHeight =450;
      for(let r:number=0;r<extraNo;r++){
        if(r==0)
          doc.addImage(canvas, 'PNG', 0,40, imgWidth, imgHeight);
        else        
          doc.addImage(canvas, 'PNG', 0,(adjust)*r+40, imgWidth, imgHeight);     
        if(r<extraNo-1) doc.addPage();
      }
                   
      return doc;
       }).then((doc) => {
        this.AddPagingNumber(doc);       
        
      doc.save('IPARecommendations.pdf');
      this.obsPDFListLoaded.next(null);
      return  'ok'; 
    });   
}

BuildResult1(doc:jsPDF,controlname:string):any
{
  const div = document.getElementById(controlname);

     const options = {
      background: 'white',
      scale: 1,
      useCORS: true,allowTaint : true      
    }; 

    html2canvas(div, options).then((canvas) => {

      var imgWidth = 210; 
      var pageHeight=295 -45 ;      
       
      var innerPageWidth = imgWidth ;
      //var innerPageHeight = pageHeight- 40;

      // Calculate the number of pages.
      var pxFullHeight = canvas.height;
      var pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
      var nPages = Math.ceil(pxFullHeight / pxPageHeight);

      // Define pageHeight separately so it can be trimmed on the final page.
      //var pageHeight = innerPageHeight;

      // Create a one-page canvas to split up the full image.
      var pageCanvas = document.createElement('canvas');
      var pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pxPageHeight;

      // Initialize the PDF.
      //var pdf = new jsPDF('p', 'in', [8.5, 11]);

      for (var page = 0; page < nPages; page++) {
        // Trim the final page to reduce file size.
        if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
          pageCanvas.height = pxFullHeight % pxPageHeight;
          pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width;
        }

        // Display the page.
        var w = pageCanvas.width; 
        var h = pageCanvas.height;
        pageCtx.fillStyle = 'white';
        pageCtx.fillRect(0, 0, w, h);
        pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

        // Add the page to the PDF.
        if (page > 0) doc.addPage();
        //debugger;

       /*  var element = document.getElementById('docheader').innerHTML;
        //pdf.setDisplayMode(1);
        html2pdf().from(element).set({ pdf: doc }).set(options).from(element).toPdf().get('pdf').then( (doc)=> 
        { 
           var imgData = pageCanvas.toDataURL('image/' + "PNG");
          doc.addImage(imgData, "PNG", 0, 5, innerPageWidth, pageHeight); 
        });     */    

         var imgData = pageCanvas.toDataURL('image/' + "PNG");
         //if(page==0)
         //   doc.addImage(imgData, "PNG", 0, 40, innerPageWidth, pageHeight);
         // else
          doc.addImage(imgData, "PNG", 0, 30, innerPageWidth, pageHeight,'someAlias', 'FAST');
         
        }
      

      return doc;
       }).then((doc) => {
        this.AddPagingNumber(doc);       
        this.AddHeaderPage(doc);

      doc.save('IPARecommendations.pdf');
      this.obsPDFListLoaded.next(null);
      return  'ok'; 
    });   
}

AddPagingNumber(doc:jsPDF)
{
  var totalPages = doc.internal.getNumberOfPages();
  //alert(totalPages);
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFillColor(221,221,221);

   /*  todo: !!!!!
    doc.addFileToVFS('Roboto-Regular.ttf', 'Oswald')
    doc.addFileToVFS('Roboto-Bold.ttf', 'Oswald')
    doc.addFont('Oswald-Regular.ttf', 'Oswald', 'normal')
    doc.addFont('Oswald-Bold.ttf', 'Oswald', 'bold')
    doc.setFont('Oswald') */
        
    doc.rect(0, doc.internal.pageSize.getHeight() - 18, 400, 10, "F");
    /* doc.setTextColor(32, 79, 150);    
    doc.setFontSize(14);   */
    doc.text('', 70, doc.internal.pageSize.getHeight()-10);
    doc.setTextColor(33, 37, 41); 
    doc.setFontSize(10);
    doc.text('Page ' + i + ' / ' + totalPages, doc.internal.pageSize.getWidth() - 115, doc.internal.pageSize.getHeight() - 4);
  } 
}

AddHeaderPage(doc:jsPDF)
{
  var totalPages = doc.internal.getNumberOfPages();
  for (let i = 3; i <= totalPages; i++) {
    doc.setPage(i);
  
    doc.setFillColor(221,221,221);
    doc.rect(0, 0, 400, 15, "F");

    //#757677
    doc.setFillColor(117,118,119);
    doc.rect(0, 15, 400, 6, "F");

    doc.setTextColor(255,255,255); 
    doc.setFontSize(10);    
    doc.text(this.srv_appsetting.User.displayName + ' ' +  new Date().toISOString().slice(0, 10),190,19)
    // /{{srv_appsetting.User.displayName}}&nbsp;&nbsp;{{srv_appsetting.curDate | date:'dd-MM-yyyy'}}
    var img = new Image();
    //img.src = environment.ImagePath + 'INGITA_New-logo.png';   
    doc.addImage(img, 'png', 2, 2, 46, 11);
  
    //img.src = environment.ImagePath + 'INGITA_New-logo.png';   
    doc.addImage(img, 'png', 180, 2, 28, 11);
    
  } 
}

BuildResultItem(doc:jsPDF,controlname:string):any
{     
    html2canvas(document.getElementById(controlname),{scale:4, useCORS: true,allowTaint : true,
      onclone: function (clonedDoc) {    
        //I made the div hidden and here I am changing it to visible              
        clonedDoc.getElementById(controlname).style.visibility = 'visible';        
      }
    }).then(canvas => {
      // The following code is to create a pdf file for the taken screenshot
    
      var img = canvas.toDataURL("image/PNG");     
      document.getElementById(controlname).style.visibility = 'hidden';  
      const bufferX = 5;   
    
    
      var imgWidth = 295;     
      var imgHeight = canvas.height * imgWidth / canvas.width;       
      var adjust = -210; //1050 is my assupmtion of how many pixels each page holds vertically
      var extraNo=Math.ceil((imgHeight+30)/210); //Lets me know how many page are needed to accommodate this image
      
      for(let r:number=0;r<extraNo;r++)
      {
        if(r==0)
          doc.addImage(canvas, 'PNG', 0,0, imgWidth, imgHeight);
        else        
          doc.addImage(canvas, 'PNG', 0,(adjust)*r, imgWidth, imgHeight);     
        if(r<extraNo-1) doc.addPage();
      } 

      return doc;
       }).then((doc) => {
        
      //var pageCount = doc.internal.getNumberOfPages();
      //doc.deletePage(pageCount);              
      doc.save('IPARecommendations' + new Date().toISOString().slice(0, 10) + '.pdf');
      this.obsPDFListLoaded.next(null);
      return  'ok'; 
    });                        
}

BuildResultItemByTab(doc:jsPDF,div_style)
{
  //var imgData;
  var forPDF = document.querySelectorAll("." + div_style);
  let count:number=0;
  forPDF.forEach(d=>
  {   
    let div=<HTMLScriptElement>d;
    let controlname:string;
    controlname=div.attributes['id'].value;
    html2canvas(div,{
      useCORS:true,allowTaint : true,onclone: function (clonedDoc) {    
        //I made the div hidden and here I am changing it to visible              
        clonedDoc.getElementById(controlname).style.visibility = 'visible';        
      }
    }).then(canvas => {
      // The following code is to create a pdf file for the taken screenshot       
      document.getElementById(controlname).style.visibility = 'hidden';
    
      var imgWidth = 295;     
      var imgHeight = canvas.height * imgWidth / canvas.width;     
      var adjust = -210; //1050 is my assupmtion of how many pixels each page holds vertically
      var extraNo=Math.ceil((imgHeight+30)/210); //Lets me know how many page are needed to accommodate this image
      
      for(let r:number=0;r<extraNo;r++){
        if(r==0)
          doc.addImage(canvas, 'PNG', 0,0, imgWidth, imgHeight);          
        else        
          doc.addImage(canvas, 'PNG', 0,(adjust)*r+30, imgWidth, imgHeight);                 
        //if(r<extraNo-1) doc.addPage();
        if(count!=forPDF.length) doc.addPage();
      }                   
    return doc
    }).then((doc) => {
      //setTimeout( () => { count=count+1; }, 500 );
      count=count+1;
      if(count==forPDF.length)
      {        
        doc.save('IPARecommendations' + new Date().toISOString().slice(0, 10) + '.pdf');
        this.obsPDFListLoaded.next(null);        
        return  'ok'; 
      }       
  });    
})    
}

BuildResultsItemByTag1(doc:jsPDF,d:any):any
{
  let div=<HTMLScriptElement>d;
    let controlname:string;
    controlname=div.attributes['id'].value;
    html2canvas(div,{
      useCORS:true,allowTaint : true,onclone: function (clonedDoc) {    
        //I made the div hidden and here I am changing it to visible              
        clonedDoc.getElementById(controlname).style.visibility = 'visible';        
      }
    }).then(canvas => {
      // The following code is to create a pdf file for the taken screenshot       
      document.getElementById(controlname).style.visibility = 'hidden';
    
      var imgWidth = 295;     
      var imgHeight = canvas.height * imgWidth / canvas.width;     
      var adjust = -210; //1050 is my assupmtion of how many pixels each page holds vertically
      var extraNo=Math.ceil((imgHeight+30)/210); //Lets me know how many page are needed to accommodate this image
      
      for(let r:number=0;r<extraNo;r++){
        if(r==0)
          doc.addImage(canvas, 'PNG', 0,0, imgWidth, imgHeight);          
        else        
          doc.addImage(canvas, 'PNG', 0,(adjust)*r+30, imgWidth, imgHeight);                 
        //if(r<extraNo-1) doc.addPage();
        //if(count!=forPDF.length) doc.addPage();
      }                   
    return doc
    })
}

AddImageToPDF(doc:jsPDF,d:any,controlname:string)//:Observable<any>
{
  
  let div=<HTMLScriptElement>d;
  //let controlname:string;
  controlname=div.attributes['id'].value;
  html2canvas(div,{
    useCORS:true,allowTaint : true,onclone: function (clonedDoc) {    
      //I made the div hidden and here I am changing it to visible              
      clonedDoc.getElementById(controlname).style.visibility = 'visible';        
    }
  }).then(canvas => {
    // The following code is to create a pdf file for the taken screenshot       
    document.getElementById(controlname).style.visibility = 'hidden';
  
    var imgWidth = 295;     
    var imgHeight = canvas.height * imgWidth / canvas.width;     
    var adjust = -210; //1050 is my assupmtion of how many pixels each page holds vertically
    var extraNo=Math.ceil((imgHeight+30)/210); //Lets me know how many page are needed to accommodate this image
    
    for(let r:number=0;r<extraNo;r++){
      if(r==0)
        doc.addImage(canvas, 'PNG', 0,0, imgWidth, imgHeight);          
      else        
        doc.addImage(canvas, 'PNG', 0,(adjust)*r+30, imgWidth, imgHeight);                 
      //if(r<extraNo-1) doc.addPage();
      //if(count!=forPDF.length) doc.addPage();
    }                   
  return doc;
});
}

BuildOperationData(doc:jsPDF)
  {     
    //add operation data
    var img = new Image();
    img.src = environment.ImageInputPath + this.srv_statemanage.SecApp + ".png";   
    doc.addImage(img, 'png', 80, this.axial_y-15, 100, 80);

    doc.setFontSize(10);
    this.srv_statemanage.IPL.items.filter(x=> x.description!='' && x.istooldetails !='1').forEach(p=> {        
      if(p.value!='')
      {
        if(this.srv_statemanage.SecApp=='780')
        {           
          if(this.srv_statemanage.IPL.GetItem('HoleTypeSolid').value!='')
          {
            if(p.name!='D3' && p.name!='D2')
            {
              doc.text(10, this.axial_y, p.description + ': ' + p.value + ' ' + p.units);
              this.axial_y=this.axial_y+8;
            }            
          }    
          if(this.srv_statemanage.IPL.GetItem('HoleTypePreHole').value!='')
          {
            if(p.name!='D2Min' && p.name!='D2Max')
            {
              doc.text(10, this.axial_y, p.description + ': ' + p.value + ' ' + p.units);
              this.axial_y=this.axial_y+8;
            }              
          }
          
        }
        else
        {
          if(p.description.toString()=='Slope' && this.srv_statemanage.SecApp!='77' ) p.description = "Tool Hand"  ;        

          doc.text(10, this.axial_y, p.description + ': ' + p.value + ' ' + p.units);
          this.axial_y=this.axial_y+8;
        }
        
      }                                     
      
    });  
    //add tool data
    if(this.srv_statemanage.IPL.items.filter(x=> x.description!='' && x.istooldetails =='1' && x.valueall !=x.value && x.value!='Default').length >0)  
    {
      doc.setFontSize(12);
      this.addTextWithBackGround(doc,2,this.axial_y-5,400,10,246,246,247,'Tool Data:' );     
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
    if(txt=='IPA Report')
      doc.text(60, top+y+7, txt);
    else
      doc.text(5, top+y+7, txt);      
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

    if (!this.srv_statemanage.IPL.GetItem('D_Hole').value.toString() !=null && this.srv_statemanage.IPL.GetItem('D_Hole').value.toString() != "" &&
    this.srv_statemanage.IPL.GetItem('D_Hole').value.toString() != "0")        
      urlparam = urlparam  + "&size=" + this.srv_statemanage.IPL.GetItem('D_Hole').value.toString();
    else
    {
      this.srv_statemanage.IPL.GetItem('Size').value= this.srv_statemanage.IPL.GetItem('Size').value.toString().replace('***','"');
      urlparam = urlparam  + "&size=" + this.srv_statemanage.IPL.GetItem('Size').value.toString();
    }
      

  urlparam = urlparam + "&length=" + this.srv_statemanage.IPL.GetItem('LengthOfShoulder_L').value.toString();
  urlparam = urlparam + "&predrilldia=" + this.srv_statemanage.IPL.GetItem('DiameterInner').value.toString(); 
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
 
  cuttingspeedfieldname = "CuttingSpeed";
  FeedTablefieldname = "FeedTable";
  Feedfieldname = "Feed";
  FeedGfieldname = "FeedG";
                
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
      if(f==FeedGfieldname)  {if(d[0].value!== 'undefined') feed1=d[0].value }
      if(f==Feedfieldname)  {if(d[0].value!== 'undefined') feed=d[0].value;}
      if(f==FeedTablefieldname)  {if(d[0].value!=='undefined') feedtable=d[0].value;}
      if(f=='RorL')  {if(d[0].value!== 'undefined') rorl=d[0].value;} 
    }    
  }
  
  let itemtype:string;
  itemtype=viewParams.Res[0].itemTypeRes;
  strpar="opt=0&catnumbers=" + catsnumber + "&cuttingspeed=" + cuttingspeed + "&rpm=" + rpm + "&feedtable=" + feedtable + "&feed1=" + feed1 + "&feed=" + feed + "&rorl=" + rorl + "&itemtype=" + itemtype;
  return strpar;
}

}
