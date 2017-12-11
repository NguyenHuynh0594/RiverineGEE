/*
//--------------------------------------------------------------------------
//Created by: Nguyen Huynh
//Date: 12/07/2017
//Contribution: Garrison Goessler (NDWI, MNDWI), Sergio Torres (Cloud Masking), Max, Megan Tennill
//Discription: Cloud Masking and Compute MNDWI around Mission River near Refugio, Texas using USGS Landsat 4 TOA Reflectance (Orthorectified) with Fmask.
//--------------------------------------------------------------------------
*/

//S-------------------------------------------------------------------------
// Add AOI Line 12-26 Define the Area of Interest.
var river  = ee.Geometry.Point([-97.25921630859375, 28.245118203195265]);
var AOI = /* color: #0b4a8b */ee.Geometry.Polygon(
[[[-97.36358642578125, 28.390313040392773],
          [-97.36358642578125, 28.34439439513518],
          [-97.36907958984375, 28.293619102738464],
          [-97.3883056640625, 28.230720883042277],
          [-97.3883056640625, 28.160521419042386],
          [-97.305908203125, 28.13872600724788],
          [-97.2454833984375, 28.116926160359025],
          [-97.18231201171875, 28.097544797213097],
          [-97.12738037109375, 28.1145036814758],
          [-97.09716796875, 28.155678377594246],
          [-97.1630859375, 28.29120062698606],
          [-97.21527099609375, 28.37098129597947]]]);
Map.centerObject(river,12);

//!!!!!!!!!!!!!!!!!!NEED MANUAL EDIT!!!!!!!!!!!!!!!!!!!!!!!!
var Size_of_Collection = 1; 
var exporting = true;
var folderName = 'LANDSAT4';
print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
print("DON'T FORGET TO CHANGE THE SIZE COLLECTION NUMBER ");
print("DO YOU WANT TO EXPORT IMAGES");
print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

//Define thresholdValue
var thresholdValue = 0.1;
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

{
//Setting image requirements/Creating variables
//Dates of interest Aug 22, 1982 - Dec 14, 1993

var Start = ee.Date('1982-8-22');
var End = ee.Date('1993-12-4');
/*
var Start = ee.Date('2002-7-01');
var End = ee.Date('2003-3-31');
*/
//Create image collection
var Riverine = ee.ImageCollection('LANDSAT/LT4_L1T_TOA_FMASK')
.filterBounds(river)
.filterDate(Start,End)
.sort('CLOUD_COVER',true);
//.sort('DATE_ACQUIRED',true);

//Define the visualization parameters.
var vizParams = {bands: ['B3', 'B2', 'B1'], min: 0, max: 0.5,gamma: [0.95, 1.1, 1]};

//Setting Vizualization Parameters for Image NDWI
var ndwiViz = {min: thresholdValue, max: 1, palette: ['44c9f1', '1637f1']};
  
//Get # of image
var count = Riverine.size();
var listOfImages = Riverine.toList(count);
print('The size of the Collection is:', count);
//print(typeof(listOfImages.size()));

//Creating 3 Lists: Satellite, Satellite with Cloud masked, NDWI masked
var Sat_Images_List = [];
var Sat_Cloud_Masked_Images_List = [];
var NDWI_Images_List = [];
var NDWI_Images_List_WithOut_Cloud_Mask = [];
var exportScale = 15;
//E-------------------------------------------------------------------------
}

//S-------------------------------------------------------------------------
//Looping Through Collection
for(var x=0; x<Size_of_Collection; x++)
{
  var image = ee.Image(listOfImages.get(x)).clip(AOI);//Get image from the collection
  Sat_Images_List[x] = image;//Add satellite images to a List
  
  /*
  //Display cloud cover images
  var scored = ee.Algorithms.Landsat.simpleCloudScore(image);
  var mask = scored.select(['cloud']).lte(20);
  var image_masked = image.updateMask(mask);
  */
  
  // Fmask classification values
  var FMASK_CLOUD = 4;
  var FMASK_CLOUD_SHADOW = 2;
  
  //Cloud Masking
  var fmask = image.select('fmask');
  var cloudMask = fmask.neq(FMASK_CLOUD)
    .and(fmask.neq(FMASK_CLOUD_SHADOW));
  var image_masked = image.updateMask(cloudMask);
  Sat_Cloud_Masked_Images_List[x] = image_masked; //Add CloudMasked images to a List
 
  //Compute the NDWI using an expression (Manually Compute) With Cloud Mask.
  var Manual_NDWI = image_masked.expression(
      '((GREEN-NIR) / (GREEN + NIR))', {
        'NIR': image_masked.select('B7'),
        'GREEN': image_masked.select('B2')
  });
  var ndwiMasked = Manual_NDWI.updateMask(Manual_NDWI.gte(thresholdValue));
  NDWI_Images_List[x] = ndwiMasked;//Add NDWI with cloud mask images to a List
  
  //Compute the NDWI using an expression (Manually Compute) Without Cloud Mask.
  var Manual_NDWI_Without_Cloud_Mask = image.expression(
      '((GREEN-NIR) / (GREEN + NIR))', {
        'NIR': image.select('B7'),
        'GREEN': image.select('B2')
  });
  var ndwiMasked_Without_Cloud_Mask = Manual_NDWI_Without_Cloud_Mask.updateMask(Manual_NDWI_Without_Cloud_Mask.gte(thresholdValue));
  NDWI_Images_List_WithOut_Cloud_Mask[x] = ndwiMasked_Without_Cloud_Mask;//Add NDWI without cloudmask images to a List
}
//E--------------------------------------------------------------------------

//S--------------------------------------------------------------------------
for(var x = 0; x<Size_of_Collection; x++)
{
	var name_of_Sat_Image = 'Satellite_Image_' + x;
	var name_of_Cloud_Masked_Image = 'Cloud_Masked_Image_' + x;
	var name_of_NDWI_Image = 'NDWI_Image_With_CloudMask_' + x;
	var name_of_NDWI_Without_CloudMask_Image = 'NDWI_Image_Without_CloudMask_' + x;
	Map.addLayer(Sat_Images_List[x], vizParams, name_of_Sat_Image);
	Map.addLayer(Sat_Cloud_Masked_Images_List[x], vizParams, name_of_Cloud_Masked_Image);
	Map.addLayer(NDWI_Images_List[x], ndwiViz, name_of_NDWI_Image);
	Map.addLayer(NDWI_Images_List_WithOut_Cloud_Mask[x], ndwiViz, name_of_NDWI_Without_CloudMask_Image);
  //Exporting
  if(exporting === true)
  {
    Export.image.toDrive({
      image: Sat_Images_List[x].select(['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']),
      description: folderName + '_' + name_of_Sat_Image,
      folder: folderName,
      scale: exportScale,
      region : AOI,
      skipEmptyTiles : true
    });
    Export.image.toDrive({
      image: Sat_Cloud_Masked_Images_List[x].select(['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']),
      description: folderName + '_'  + name_of_Cloud_Masked_Image,
      folder: folderName,
      scale: exportScale,
      region : AOI,
      skipEmptyTiles : true
    });
    Export.image.toDrive({
      image: NDWI_Images_List[x].visualize(ndwiViz),
      description: folderName + '_'  + name_of_NDWI_Image,
      folder: folderName,
      scale: exportScale,
      region : AOI,
      skipEmptyTiles : true
    });
    Export.image.toDrive({
      image: NDWI_Images_List_WithOut_Cloud_Mask[x].visualize(ndwiViz),
      description: folderName + '_'  + name_of_NDWI_Without_CloudMask_Image,
      folder: folderName,
      scale: exportScale,
      region : AOI,
      skipEmptyTiles : true
    });
  }
  
  //Print out date for each images
  var date = ee.Date(Sat_Images_List[x].get('system:time_start'));
  print('Image ' + x + ' Timestamp: ', date); // ee.Date
}	
//E--------------------------------------------------------------------------