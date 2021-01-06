# Katapult Documentation #

## Implemantation Guides ##

1. [Instalation Guide SFRA Cartridge](#SFRA)
2. [Instalation Guide SiteGenesis Cartridge](#SiteGenesis)


<a name="SFRA"></a>
### Installation Guide SFRA Cartridge ###

#### Import Cartridge ####

- Import **int_katapult_SFRA** into your Workspace inside the **cartridges** folder
- Modify the Site Path in **Business Manager > Administration > Manage Sites > 'Your Site' > Settings**
- Make sure the cartridge name **int_katapult_SFRA** appear before any other cartridges

![Modifying Cartridges Path](README/images/001.png)

If using Visual Studio code, use the below **dw.json** format to upload the cartridges to the sandbox. Place it at the root of the working directory.

```
{
  "hostname": "your-sandbox-hostname.demandware.net",
  "username": "your_user",
  "password": "your_password",
  "code-version": "version_to_upload"
}
```

#### Set the Cartridge to Compile Front-End ####

- Make sure that the cartridge it's a part of the compilator inside of the **webpack.config.js**

![Part of compilator in package.json](README/images/002.png)

#### Compile Front-End ####

- Run the command **npm run compile:js** to compile front-end scripts.
- Run the command **npm run compile:scss** to compile front-end styles.

#### Import Metadata ####

- Locate folder **katapult_site_import** inside **metadata** folder, change site name if needed inside **sites** folder and compress the **katapult_site_import** folder to **katapult_site_import.zip**

- Log in to the **Business Manager**

- Click **Administration > Site Development > Site Import & Export**

- Use the upload control to browse the **katapult_site_import.zip** file located in the **metadata** folder

- Click **Upload**

- Select the **katapult_site_import.zip** and click Import, press OK on the confirmation alert. Import should complete successfully

![Import Metadata I](README/images/003.png)

![Import Metadata II](README/images/004.png)

#### Configure Katapult Services ####

- Make sure that the Katapult services have been imported as part of site import step performed above. Below service configurations should be present in the Services section: **Administration >  Operations >  Services**
- Make sure that the service URL used is one of the following, depending on whether the sandbox is a production or development:
**Sandbox**: https://sandbox.katapult.com
**Live**: https://www.katapult.com

***DO NOT** modify service name(s) of any of the services

Below are the screenshots for reference.

- **Credentials**

![Credentials](README/images/005.png)

- **Profile**

![Profile](README/images/006.png)

- **Service**

![Service](README/images/007.png)

#### Configure Katapult Custom Preferences ####

- Make sure that the **Katapult Custom Preferences** have been imported as part of site import step performed above. Below **Custom Preferences** configurations should be present in **Merchant Tools > Site Preferences > Custom Preferences**

- Select the **Katapult** Group

![Custom Preferences Groups](README/images/008.png)

- Fill the input fields with the information required
  - **KAT_APIToken**: Token to connect with the Katapult API
  - **KAT_environment**: Link for the Katapult environment (Sandbox or Live)</br>
    -**Sandbox** : https://sandbox.katapult.com</br>
    -**Live**: https://www.katapult.com
  - **KAT_minValue**: Minimum value to proceed with Katapult Payment Method
  - **KAT_maxValue**: Maximum value to proceed with Katapult Payment Method
  
  ![Custom Preferences Groups - Katapult](README/images/009.png)
  
  #### Product Configuration to Use Katapult Payment Method ####
  
- First verify that the product selected is leasable, go to **Business Manager > Merchant Tools >  Products and Catalogs >  Products**

![Verifying if the Product is Leasable I](README/images/010.png)

- On the input field search for the ID of the product selected in the Storefront

![Verifying if the Product is Leasable II](README/images/011.png)

- Click on the ID

![Verifying if the Product is Leasable III](README/images/012.png)

- Click **Lock** to be able to edit the information of the product

![Verifying if the Product is Leasable IV](README/images/013.png)

- Scroll down to see all the attributes from the product and you will see the Katapult property, for default is **NONE**, the product is **NOT LEASABLE**

![Verifying if the Product is Leasable V](README/images/014.png)

- To enable the product as **LEASABLE** change the value to **YES** and press **APPLY** button

![Verifying if the Product is Leasable VI](README/images/015.png)

#### Placing Order ####

- Once the product selected is set as **Leasable** product, proceed to add it to Cart

![Placing Order](README/images/016.png)

- Go to the checkout proccess as a Guest user or login with an account

![Placing Order](README/images/0161.png)

- Fill the Shipping information and press **Next: Payment** button

![Placing Order](README/images/017.png)

![Placing Order](README/images/018.png)

- Set the billing information, if is not the same of the Shipping, press **Update Address** and fill the inputs

![Placing Order](README/images/019.png)

- Once is set the Payment Information, select the **tab** for the **Katapult Payment Method** and press **Next: Place Order** button

![Placing Order](README/images/020.png)

*If all the products selected are not leasable the tab for the Katapult payment method will not be displayed

![Placing Order](README/images/021.png)


#### Verify Orders Once Order is Created Using Katapult ####

- In the Business manager go to **Merchant Tools >  Ordering >  Orders**

- Open an order

- Go to the **Payment** tab and verify the Payment Method

![Verifying Orders](README/images/022.png)

- Go to the **Attributes** tab and you will see the Katapult information

***DO NOT** modify any of this information

![Verifying Orders](README/images/023.png)


#### Jobs ####

Our JOBs cover four Methods: **Shipped, Cancel, Cancel Item** and **Completed.**

**Shipped** - Set a delivery date in the Katapult’s management.
**Cancel** - Cancel the entire order.
**Completed** - Mark an order for not to be reprocessed.
**Cancel Item** - Cancel the items individually.

*Your integration must provide the update line items in the SFCC.

You can Update Line Items through:

OCAPI (Open Commerce API)

- Add a Hook to POST order update to the cancel item endpoint. Like below:

![Jobs](README/images/024.png)

XML

- The xml file must have a content like below:

![Jobs](README/images/025.png)

*A test controller was created. In this controller we pass the parameters in the url, where the “CancelItem” is the controller, “cancelItem” is the method, “oid” is the order ID and the “oli” is order line item. See a example url below:
https://www.yoursite.com/CancelItem-cancelItem?oid=00001203&oli=sony-ps3-console*

![Jobs](README/images/026.png)

To avoid change Scope everytime, was created one JOB to SFRA and another to SiteGenesis:

![Jobs](README/images/027.png)

- Go to **Administration > Operations > Jobs**

- Open the Job **katapultOrderUpdateSRFA**

![Jobs](README/images/028.png)

- Verify that the **steps** has selected the **Scope** option for your SFRA site, go to tab **Job Steps**

- Select your RefArch scope and press **Assign**

![Jobs](README/images/029.png)

- Press the button **Run Now** to execute it, this job will update in Katapult’s platform the **Delivery Date**, the orders to **Canceled**, the orders with **Canceled Items** and the **Completed** orders to not be reprocessed.

- You will see that the job was completed at the bottom of the page in the **Schedule and History** Tab, as well as the log file that includes what orders were updated in the Katapult plataform

![Jobs](README/images/030.png)

![Jobs](README/images/031.png)

- This is a row of the log from the order we canceled before in Salesforce, that includes information about the order number and the ID from Katapult's platform

![Jobs](README/images/032.png)

- This is how it looks the order before running the Job in Salesforce

![Jobs](README/images/033.png)

- And this is the status of the order after running the Job

![Jobs](README/images/034.png)

#### Configuring Job Schedules ####

- To configure schedules in Katapult job go to **Administration > Operations > Jobs** and open **katapultOrderUpdateSFRA** Job

- Go to the tab **Schedule and History**

![Jobs](README/images/035.png)

- Configure when will be triggered the job, **Once** or **Recurring**

![Jobs](README/images/036.png)

- If you select **Once** select the date from the option when will be executed the Job

![Jobs](README/images/037.png)

- If you selected **Recurring Interval** select the date from when will starts the job and others parameters like how many times will be ejecuted the Job, this is in the input **Amount, Interval** is to set with minutes, hours, days, weeks or months and for last, the **days** when will be executed the Job

![Jobs](README/images/038.png)

#### Configuring Job Email Notifications ####

- To configure schedules in Katapult job go to **Administration > Operations > Jobs** and open the **katapultOrderUpdateSFRA** Job

- Go to the tab **Notifications**

- Select the events you want notifications, add emails and automatically changes will be saved
 
 ![Jobs](README/images/039.png)
 
 - After run the Job you will receive an email like this
 
 ![Jobs](README/images/040.png)

--------------------------------------------------------------------------------------------------

<a name="SiteGenesis"></a>
### Installation Guide SiteGenesis Cartridge ###

#### Import Cartridge ####

- Import **int_katapult_SG** into your Workspace inside the **cartridges** folder
- Modify the Site Path in **Business Manager > Administration > Manage Sites > 'Your Site' > Settings**
- Make sure the cartridge name **int_katapult_SG** appear before any other cartridges

![Modifying Cartridges Path](README/images/041.png)

If using Visual Studio code, use the below **dw.json** format to upload the cartridges to the sandbox. Place it at the root of the working directory.

```
{
  "hostname": "your-sandbox-hostname.demandware.net",
  "username": "your_user",
  "password": "your_password",
  "code-version": "version_to_upload"
}
```

#### Set the Cartridge to Compile Front-End ####

- Make sure that the cartridge it's a part of the compilator inside of the **package.json**

![Part of compilator in package.json](README/images/042.png)

![Part of compilator in package.json](README/images/043.png)

#### Compile Front-End ####

- Run the command **gulp js** to compile front-end scripts.
- Run the command **gulp css** to compile front-end styles.

#### Import Metadata ####

- Locate folder **katapult_site_import** inside **metadata** folder, change site name if needed inside **sites** folder and compress the **katapult_site_import** folder to **katapult_site_import.zip**

- Log in to the **Business Manager**

- Click **Administration > Site Development > Site Import & Export**

- Use the upload control to browse the **katapult_site_import.zip** file located in the **metadata** folder

- Click **Upload**

- Select the **katapult_site_import.zip** and click Import, press OK on the confirmation alert. Import should complete successfully

![Import Metadata I](README/images/044.png)

![Import Metadata II](README/images/045.png)

#### Configure Katapult Services ####

- Make sure that the Katapult services have been imported as part of site import step performed above. Below service configurations should be present in the Services section: **Administration >  Operations >  Services**
- Make sure that the service URL used is one of the following, depending on whether the sandbox is a production or development:
**Sandbox** : https://sandbox.katapult.com
**Live** : https://www.katapult.com

***DO NOT** modify service name(s) of any of the services

Below are the screenshots for reference.

- **Credentials**

![Credentials](README/images/046.png)

- **Profile**

![Profile](README/images/047.png)

- **Service**

![Service](README/images/048.png)

#### Configure Katapult Custom Preferences ####

- Make sure that the **Katapult Custom Preferences** have been imported as part of site import step performed above. Below **Custom Preferences** configurations should be present in **Merchant Tools > Site Preferences > Custom Preferences**

- Select the **Katapult** Group

![Custom Preferences Groups](README/images/049.png)

- Fill the input fields with the information required
  - **KAT_APIToken**: Token to connect with the Katapult API
  - **KAT_environment**: Link for the Katapult environment (Sandbox or Live)</br>
    -**Sandbox** : https://sandbox.katapult.com</br>
    -**Live**: https://www.katapult.com
  - **KAT_minValue**: Minimum value to proceed with Katapult Payment Method
  - **KAT_maxValue**: Maximum value to proceed with Katapult Payment Method
  
  ![Custom Preferences Groups - Katapult](README/images/050.png)
  
  #### Product Configuration to Use Katapult Payment Method ####
  
- First verify that the product selected is leasable, go to **Business Manager > Merchant Tools >  Products and Catalogs >  Products**

![Verifying if the Product is Leasable I](README/images/051.png)

- On the input field search for the ID of the product selected in the Storefront

![Verifying if the Product is Leasable II](README/images/052.png)

- Click on the ID

![Verifying if the Product is Leasable III](README/images/053.png)

- Click **Lock** to be able to edit the information of the product

![Verifying if the Product is Leasable IV](README/images/054.png)

- Scroll down to see all the attributes from the product and you will see the Katapult property, for default is **NONE**, the product is **NOT LEASABLE**

![Verifying if the Product is Leasable V](README/images/055.png)

- To enable the product as **LEASABLE** change the value to **YES** and press **APPLY** button

![Verifying if the Product is Leasable VI](README/images/056.png)

#### Placing Order ####

- Once the product selected is set as **Leasable** product, proceed to add it to Cart

![Placing Order](README/images/057.png)

- Go to the checkout proccess as a Guest user or login with an account

![Placing Order](README/images/058.png)

- Fill the Shipping information and press **Continue to Billing** button

![Placing Order](README/images/059.png)

- Set the billing information

![Placing Order](README/images/060.png)

- Once is set the Payment Information, select the **option** for the **Katapult Payment Method** and press **Continue to Place Order** button

![Placing Order](README/images/061.png)

*If all of the product selected are not leasable the tab for the Katapult payment method will not be displayed

![Placing Order](README/images/062.png)


#### Verify Orders Once Order is Created Using Katapult ####

- In the Business manager go to **Merchant Tools >  Ordering >  Orders**

- Open an order

- Go to the **Payment** tab and verify the Payment Method

![Verifying Orders](README/images/063.png)

- Go to the **Attributes** tab and you will see the Katapult information

***DO NOT** modify any of this information

![Verifying Orders](README/images/064.png)


#### Jobs ####

Our JOBs cover four Methods: **Shipped, Cancel, Cancel Item** and **Completed.**

**Shipped** - Set a delivery date in the Katapult’s management.
**Cancel** - Cancel the entire order.
**Completed** - Mark an order for not to be reprocessed.
**Cancel Item** - Cancel the items individually.

*Your integration must provide the update line items in the SFCC.

You can Update Line Items through:

OCAPI (Open Commerce API)

- Add a Hook to POST order update to the cancel item endpoint. Like below:

![Jobs](README/images/065.png)

XML

- The xml file must have a content like below:

![Jobs](README/images/066.png)

*A test controller was created. In this controller we pass the parameters in the url, where the “CancelItem” is the controller, “cancelItem” is the method, “oid” is the order ID and the “oli” is order line item. See a example url below:
https://www.yoursite.com/CancelItem-cancelItem?oid=00001203&oli=sony-ps3-console*

![Jobs](README/images/067.png)

To avoid change Scope everytime, was created one JOB to SFRA and another to SiteGenesis:

![Jobs](README/images/068.png)

- Go to **Administration > Operations > Jobs**

- Open the Job **katapultOrderUpdateSG**

![Jobs](README/images/069.png)

- Verify that the **steps** has selected the **Scope** option for your SFRA site, go to tab **Job Steps**

- Select your RefArch scope and press **Assign**

![Jobs](README/images/070.png)

- Press the button **Run Now** to execute it, this job will update in Katapult’s platform the **Delivery Date**, the orders to **Canceled**, the orders with **Canceled Items** and the **Completed** orders to not be reprocessed.

- You will see that the job was completed at the bottom of the page in the **Schedule and History** Tab, as well as the log file that includes what orders were updated in the Katapult plataform

![Jobs](README/images/071.png)

- This is a row of the log from the order we canceled before in Salesforce, that includes information about the order number and the ID from Katapult's platform

![Jobs](README/images/072.png)

- This is how it looks the order before running the Job in Salesforce

![Jobs](README/images/073.png)

- And this is the status of the order after running the Job

![Jobs](README/images/074.png)

#### Configuring Job Schedules ####

- To configure schedules in Katapult job go to **Administration > Operations > Jobs** and open **katapultOrderUpdateSFRA** Job

- Go to the tab **Schedule and History**

![Jobs](README/images/075.png)

- Configure when will be triggered the job, **Once** or **Recurring**

![Jobs](README/images/076.png)

- If you select **Once** select the date from the option when will be executed the Job

![Jobs](README/images/077.png)

- If you selected **Recurring Interval** select the date from when will starts the job and others parameters like how many times will be ejecuted the Job, this is in the input **Amount, Interval** is to set with minutes, hours, days, weeks or months and for last, the **days** when will be executed the Job

![Jobs](README/images/078.png)

#### Configuring Job Email Notifications ####

- To configure schedules in Katapult job go to **Administration > Operations > Jobs** and open the **katapultOrderUpdateSFRA** Job

- Go to the tab **Notifications**

- Select the events you want notifications, add emails and automatically changes will be saved
 
 ![Jobs](README/images/079.png)
 
 - After run the Job you will receive an email like this
 
 ![Jobs](README/images/080.png)

