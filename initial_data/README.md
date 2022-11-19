nat2021.csv is the raw datasource for all firstnames downloaded from the INSEE.
(French statistics institute). (Here => https://www.insee.fr/fr/statistiques/2540004?sommaire=4767262)

It give a raw csv file, with one row by year + firstname + sex with nb times this firstname has been given this specific year. (If it has been given more than 3times during that year).

Our goal is to create two files, one file for boy and one for girl.

We want those new file to be realistic (not too big), here is where the script prepare_file.py is usefull, it takes the initial database file, split boy and girl, and create a file by unicity.

As the file is very huge (17 626 boys and 20 853 girls), and it would be unusable to sort out so many firstname. We need to sort out the firstname that are just badly written (example: Aurelien has been given 581 times, but Aurélien has been given 79619 times).

All my respect and appologies for very singular firstname, but for example "ZALHATA" given 29 times since 1900 is not interesting me neither.

So let's filter out all the firstname given less than 500times over the last 5 years.

It gives 430 boys firstname and 467 girls firstname. That's a good start for our project ! 

