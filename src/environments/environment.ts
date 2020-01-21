// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false  ,
  API_HOST: 'http://localhost:17586/',
  internal:true,
  //API_HOST: 'http://www.iscar.com/ITA_API/',
  //API_HOST: 'http://intranet.imc.co.il/ITA_API/',
  IscarLogo: 'https://www.iscar.com/eCatalog/media/images/ISCAR_Logo.svg',
  ImagePath:"assets/img/",
  ImageInputPath:"assets/img/input_images/",
  ImageApplicationsPath:"assets/img/Applications/",
  ImgAddToFavorite:"assets/img/AddToFavoritIcon.svg" ,
  ImgDefault:"assets/img/SetDiffult_Icon.svg" ,
  ImgView:"assets/img/View_Icon.svg",
  ImgSetDefault:"assets/img/SetDiffult_Icon.svg",
  ImgViewTable:"assets/img/AlternativeIcon.svg",
  ImgEditParams:"assets/img/icon_edit_ITA.svg",
  ImgStock:"assets/img/icon_stock.svg",
  ECatalogLink:"http://intranet.imc.co.il/ecatalog/Index.aspx"
};

    
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
