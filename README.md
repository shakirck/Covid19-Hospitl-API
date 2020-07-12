# Hospital API  :hospital:  :ambulance:


### Installation


```sh
$ git clone https://github.com/shakirck/Covid19-Hospitl-API.git
$ cd Covid19-Hospitl-API 
$ npm install 
$ npm run dev 
      **OR**
$ npm start 
```
Change the  :key: **Secret Key** in  **key.js** file inside the config folder(***Recommended***)



### Tasks


- [x] Register as a  Doctor
- [x] Login as a  Doctor
- [x] Register a  Patient into DB
- [x] Create a Report for a Patient
- [x] View all Report of Patient
- [x] View all Patients with specific status


### Register a Doctor
-----------
* **URL**
/api/doctors/register

* **Method:**

  `POST`
  
*  **URL Params**
     NONE
     
     
 ---------------
 
 ###   Doctor Login 
 * **URL**
/api/doctors/login

* **Method:**

  `POST`
  
*  **URL Params**
     NONE
     
     
     
--------------

 ### Create Patient
 
* **URL**
/api/patients/register

* **Method:**

  `POST`
  
*  **URL Params**
     NONE
     
     
     
--------------
 ### Create Patient Report

* **URL**
api/patients/:id/create_report
* **Method:**

  `POST`
  
*  **URL Params**
     Required: **patientID**
     
-----------     
 ### Get all Reports of Patient

* **URL**
/api/patients/:id/all_reports

* **Method:**

  `GET`
  
*  **URL Params**
     Required: **patientID**
     
     
     
--------------

 ### Get  Reports of Specific Status
 
* **URL**
api/reports/:status

* **Method:**

  `GET`
  
*  **URL Params**
     Required: **STATUS**
     
     
     
--------------

  
