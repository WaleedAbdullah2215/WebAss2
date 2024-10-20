# Web_Eng_Ass2
 
THis is the readme file, in this file i will explain some basic information abotu this project as well as how to run it locally.

This project was created as a solution to the assignment 2 for the web engineering course for fall-2024. 
In this project i developed a local website that could be used to find eather reklated for all those who need it. ther are 5 main files in this project.
Which are as follows:
1) Index.html - This file is the main html file which is started when using the website. THis page displays important weather related information
                for a specific city that is seached by the user. Moreover 3 charts are also shown on this page to sumamrize the weather information.
                The page allows the user to enter the name of a city, and after submitting the query, the relevant weather data is fetched from the server using API and displayed visually in an easy-to-understand format.

2) Tables.html - This file contains more detailed weather data in the form of atable. use er gets data like the forecast for the next 5 days through the table
                  the data is after every 3 hours and also the table can be filtered via many filters provided like sorting by temperasture or finding days that it would rain.
                  Thsi page also has an AI powered chatbot that the user can talk to to get qewather related information.
   
3. Styles.css - This is the CSS file used to style the website. It contains all the styles for making the website visually appealing and alcho responsive.
  
   
4. app.js  This is teh main JavaScript file for the project. This file makes the necesary api calls for the dashboard page (index.html) and also updates the html elements accordingly.
                 It uses charts.js for displaying the charts and necessary error handling is also applied to enhance user experience.
   
5. tables.js   This JavaScript file is responsible specifically for handling the tables.html page logic.
               It gets information for the table that is to be displayed and also all the logic behind the provided filters in implemented in this file. 
               This file also coantains the logic for makign api calls to gemini for the chatbot and necessary error handling is also applied.

## How to Run the Project Locally
Follow these steps to run the project locally on your machine:

install the node.js tool and and vs code.
then import the project from github to your local machien and open it via VScode.
Right click on the index.html fiel in the explorer and select the go live option.
This wil open up the website for you without any issue.
Also make sure that you are connnected to a stable wifi because the api calls to the weather api needs a good internet connection.
