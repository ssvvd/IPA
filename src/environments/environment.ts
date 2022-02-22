// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  internal: true ,
  production: false  ,
  
  //API_HOST: 'https://intranet.imc.co.il/ITA_API/', 
  API_HOST: 'http://localhost:17586/',
  //API_HOST: 'https://www.iscar.com/ITA_API/',
  CalcReq_Host: 'https://cts02.iscar.com/MachiningPwrWs/api/CalcReq/',
  IscarLogo: 'https://intranet.imc.co.il/eCatalog/media/images/ISCAR_Logo.svg',
  ImagePath:"assets/img/",
  LanguagePath:"assets/i18n/",
  ImageInputPath:"assets/img/input_images/",
  ImageApplicationsPath:"assets/img/Applications/",
  ImgAddToFavorite:"assets/img/AddToFavoritIcon.svg" ,
  ImgFavorite:"assets/img/icon_Favorite.svg" ,
  ImgDefault:"assets/img/SetDiffult_Icon.svg" ,
  ImgSetDefault:"assets/img/SetDefaultIcon_Visited.svg" ,
  ImgView:"assets/img/View_Icon.svg",
  ImgViewTable:"assets/img/AlternativeIcon.svg",
  ImgEditParams:"assets/img/icon_edit_ITA.svg",
  ImgStock:"assets/img/icon_stock.svg",
  ImgArrowLeft:"assets/img/arrows_left.png",
  ImgArrowRight:"assets/img/arrows_right.png",
  ImgThreeDots:"assets/img/threeDots.jpg",
  ImgAssembly:"assets/img/icon_Assembly.svg",
  ECatalogLink:"https://intranet.imc.co.il/ecatalog/Default.aspx",
  IscarSite:"https://intranet.imc.co.il",
  MachiningCalculatorSite:"https://cts02.iscar.com/MachiningPwrWs/", 
  eCatItemPictures:"https://www.iscar.com/ISCARCatalogConfirmPictures/",
  eCatFamilyPictures:"https://intranet.imc.co.il/eCatalog/Ecat/datafile/PICTURE/",
  //eCatFamilyPictures:"https://www.iscar.com/Ecat/datafile/PICTURE/",
  eCatItemRedPage:"https://intranet.imc.co.il/ecat/eHiba.asp?cat=",
  eCatItemPage1:"https://intranet.imc.co.il/ecatalog/item.aspx?type=1&cat=",
  eCatItemPage:"https://intranet.imc.co.il/ecatalog/Default.aspx?e=1",
  eCatFamilyDrawing:"https://intranet.imc.co.il/eCatalog/Ecat/illust_ISO",
  eCatLogo: "https://intranet.imc.co.il/eCatalog/Ecat/datafile/Logo/",
  wsMaterials: "https://intranet.imc.co.il/wsmaterials/service.asmx/",

  signinURL:'https://sign.ssl.imc-companies.com/signin', 
  LoginURLTokenUrl:"authapi.ssl.imc-companies.com",  
  LoginURLRes:"authapi.ssl.imc-companies.com",  
  LoginURLCheckCookies:"https://sign.ssl.imc-companies.com/general" ,
  LoginURLogOut:"https://sign.ssl.imc-companies.com/signout"  ,
  LogInURLLogInData:"https://intranet.imc.co.il/imclogin/api/imclogin/checkcookie/iscita21/",
  urlCheckCookies:"https://intranet.imc.co.il/imcLogin/checkcookie.aspx",
  urlLogIn:"http://intranet.imc.co.il/imcLogin/Default.aspx",
  urlSignOut:"https://intranet.imc.co.il/imcLogin/SignOut.aspx?sId=iscita21"

  
};
    
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
