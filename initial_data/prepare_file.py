import json

data = {
    "1": {},
    "2": {}
}

with open('nat2021.csv', 'r') as file:
    header = None
    for row in file:
        if header is None:
            header = row.split(';')
            continue

        sex, firstname, year, number = row.split(';')
        number = int(number.strip())
        if firstname not in data[sex]:
            data[sex][firstname] = {"total": 0, "last_5year": 0}
        data[sex][firstname]["total"] += number
        if year > "2017" and year != "XXXX":
            data[sex][firstname]["last_5year"] += number

# Filter out all the firstname less than 500 times in the last 5 year.
boys = []
girls = []

for firstname, values in data["1"].items():
    if values["last_5year"] > 500 and firstname != "_PRENOMS_RARES":
        boys.append(firstname)

for firstname, values in data["2"].items():
    if values["last_5year"] > 500 and firstname != "_PRENOMS_RARES":
        girls.append(firstname)

print("nb boys: ", len(boys))
print("nb girls: ", len(girls))

with open('../src/dataset.json', 'w') as file:
    file.write(json.dumps({"boys": boys, "girls": girls}))

