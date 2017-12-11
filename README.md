# RiverineGEE

## Cloud Masking and Compute MNDWI around Mission River near Refugio, Texas using Google Earth Engine.

### Google Earth Engine Riverine Code Manual.

1.	Click on the provided links, (There are 4 different links, one for each LANDSAT imagery)        
        The current code will run on one day of the collection. This will display an example of the process that the code can do.
        https://code.earthengine.google.com/6ab54a2762ac681fafaaa47b9ade85ab **Landsat 8**
        https://code.earthengine.google.com/05e3d0843cfe0e099643f377fa749b7e **Landsat 7**
        https://code.earthengine.google.com/2cf07625fb56ceb513e12945dd2c1d5d **Landsat 5**
        https://code.earthengine.google.com/a1c92a27a9b37063ee4d193313a211ba **Landsat 4**        
**If links doesn't work, you can download the associated script and copy/paste the script content into the code area at https://code.earthengine.google.com/.**
2.	On the right tool bar, there are 3 different tabs. The “**Inspector**” tab lets you analyze the data at any pixel you click on the map.

![1](https://user-images.githubusercontent.com/29620463/33814295-e989ac34-ddee-11e7-98f1-176ee81198be.PNG)

3.	On the right tool bar, click on “**Console**”. This will display the information that is needed (Date of each images, and the number of images that was acquired from the satellite for the selected dates). The number of images is noted as “The size of the Collection is:”. This number is important since you will be needing to add it into the code later.

4.	Next to the “Console” tab in the right tool bar, the “**Tasks**” tab is to run any exporting events that you need. Click “Tasks”, then for each image that you want to export, hit “Run” and hit “Run” again when a window popped up.

![3](https://user-images.githubusercontent.com/29620463/33814493-1df836e2-ddf0-11e7-87dc-d056e779d5a8.PNG)

#### Now that you have familiarize with the console tasks. Let's edit the code so you can run it the way you want to.

5.	In line 29, “var Size_of_Collection = **1**”, Change “1” to “The size of the Collection is:” number that is on the console task. (Look at #3)

6.	Line 30, “var exporting = **true**”, Change “true” to “false” if you don’t want to export the data.

7.	Line 31, “var folderName = '**LANDSAT8**'”, Change “LANDSAT8”, to whatever you want the folder name to be. This folder can be anywhere in your google drive (it can even be a drive that you are sharing with other people.) If there are no folders in your drive with that name, the folder will be created in your “My Drive”.

![2](https://user-images.githubusercontent.com/29620463/33814414-b24b102c-ddef-11e7-83e0-f2efa98db534.PNG)


8.	Hit the “**Save**” button so these changes can be save in your Google Earth Engine.

9.	Hit “**Run**” and wait. (You can do any of step 2-4 after this)

10.	To export images to drive, follow step 4.

![4](https://user-images.githubusercontent.com/29620463/33814732-e6d9879a-ddf1-11e7-9713-3a70fbb64ac3.PNG)

#### Everything after this will be optional:

11.	Line 38, “var thresholdValue = 0.0”.        
        This value is the threshold value that determine the water threshold. Change “0.0” to any number you want. (Recommended -1.0 to 1.0)
        
12.	Line 45-46, Change the date here to any date interval you want. Follow the same date format.

        var Start = ee.Date('2013-4-11');        
        var End = ee.Date('2017-12-07');        
        
        
13.	Line 55-56, If you wish to sort the images by date, move the “//” down to line 56. Otherwise, the image collection will be sorted by cloud cover.

        *//*.sort('DATE_ACQUIRED',true);        
        .sort('CLOUD_COVER',true);        
        If you wish to sort the images by date, move the “//” down to line 56. 
        Otherwise, the image collection will be sorted by cloud cover.
        
14.	Line 59, This can be change to display any band combinations you want.

        var vizParams = {bands: ['B4', 'B3', 'B2'],         
        
15.	Line 93-100, This is where the images are cloud masked. Shouldn’t be touch since the databases already define this function.

16.	Line 103-118, The applied the MNDWI calculation to the images. You can change the bands that are used for NDWI calculation here.

17.	Line 125-128, These are the naming scheme for each image. Pretty self-explanatory, but this is where you can change it if you wish.

18.	Line 123, If you have a specific day that you want to look at and know the number that was assigned to it. Change **0** to that number and **Size_of_Collection** to that number + 1.
  
        for(var x = 0; x<Size_of_Collection; x++)
        
        Ex: You want to display image # 25
        for(var x = 25; x<26; x++)

19. Line 134-167, This is where the exporting happens. The images will be exported with all of the bands listed here.

20. Don't forget to hit the "Display Background Value" in symbology in ArcMap to view the images properly.
![5](https://user-images.githubusercontent.com/29620463/33814787-55e40e44-ddf2-11e7-8182-553c2f854651.PNG)









## Example of a Test run on a single day.

This is the output of the satellite image.
![satellite_image](https://user-images.githubusercontent.com/29620463/33815127-a408e638-ddf4-11e7-94cb-29751aec4f24.PNG)

Satellite image with Cloud masking applied. Also mask cloud shadows.
![satellite_image_masked](https://user-images.githubusercontent.com/29620463/33815167-f7c4366a-ddf4-11e7-8a04-26c30e5ad41e.PNG)

MNDWI Calculation applied on the original satellite image.
![satellite_image_mndwi](https://user-images.githubusercontent.com/29620463/33815210-51759e1a-ddf5-11e7-96c8-b376be697911.PNG)

MNDWI Calculation applied on the cloud masked satellite image.
![satellite_image_masked_mndwi](https://user-images.githubusercontent.com/29620463/33815209-516488d2-ddf5-11e7-8e7e-f1565a6dddb0.PNG)

