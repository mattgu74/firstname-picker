# Firstname-Picker

## Genesis

When my first child came, I look for app to help future parents find a name that matches both parents wishes.
I have not found anything that suited me, because all apps on the market are tinder like where you say yes or no.
At the end you got a list of firstname you and your partners don't refuse, but how to pick one from the final list ?

My idea was instead of doing a yes or no, about a firstname, let the user (me and my love) choose the one we prefer between two options. And let an algorithm (ELO - like sorting chess player), sort them depending of the issue of the match.

That's how we selected the firstname for our first child. The second is on-road and it's time to open up again this app.
I have kind of lost the code of the first version of the app that was hosted locally on a raspberry-pi, and using my well known technology stack (Django). 

So for this new version I put myself two challenges : 

1. Host it publicly, to share with other future parents

2. Discover new tech stacks

This is then using firebase, it sounds like the free hosting is interesting for such an app.
It will force me to think differently than when using regular relational database, and making an app front first.

## Diary - Keep an history of the project

### Early november 2022
starts working actively (:joy: at night) on this project.

### 9th November 2022

First commits, to keep track of the progress.
=> A react app is there.
=> Firebase hosting is in place (app is here : https://firstname-picker.firebaseapp.com/)
=> Thanks to firebase, authentication system is there
=> I have started understanding the firestore database, and the rules associated.
=> One person can see the list of projects he created + the list shared with him + delete his own projects.

I'm pretty amazed by firestore live update. Connecting to same account from my desktop and my phone, editing the list of projects seeing it refresh in realtime is pretty amazing.

It's time to sleep we are now the 10th ;)

Next topics in mind : 

- [] Add a way for someone to invite an email inside his own project (to get your wife onboard)
- [] Think about how to store the ranking, in this non relational database
- [] Add a view to see list of firstname added to a project / And allow to add more. (At the end I will pre-import a databse from french statistics institue INSEE, but to start a small dataset managed manually will be easier to manipulate and discover).
- [] Implement the ranking algorithm
- [] Prepare the view to do match
- [] Make a summary view of the project to see the results (nb of match done / ranks of firstname (by person that play, and the version that includes everyone) / nb firstname not discarded that stay in the run...)
- [] Do some UI/Css (find a theme ? / use Material UI ?)


### 14th november 2022

- [x] Add a way for someone to invite an email inside his own project (to get your wife onboard)

And then how to remove if you made a mistake.

