<h1 align="center">
  <br>
  H U N G R Y  |  H E L P E R S
  <br>
</h1>

<blockquote align="center"><em>“I learned to give not because I have much, but because I know exactly how it feels to have nothing.”</em></blockquote>

<h3 align="center">
    <a href="#the-idea">The Idea</a> |
    <a href="#how-it-works">How It Works</a> |
    <a href="#application-website">Application Website</a> |
    <a href="#tech-stack">Tech Stack</a> |
    <a href="#restful-api">API Documentation</a> 
</h3>

![homepage](https://github.com/imhighyat/hungryHelpers/blob/master/public/images/homepage.png)
---

### The Idea
#### Did you know?
+	Over 1/3 of all food produced globally goes to waste.
+	The annual value of food wasted globally is $1 trillion, and it weighs 1.3 billion tons.
+	All the world’s nearly one billion hungry people could be fed on less than a quarter of the food that is wasted in the US, UK and Europe.

<p>What if we lessen food/edible goods that are being thrown away by supermarkets, restaurants, food chains and donate them to charitable groups/organizations who are devoted to feeding unfortunate individuals?</p>

---

### How It Works
#### For Restaurants/Establishments
+	Managers or representative can create an account online.
+	Set your preferred donation frequency afterwards, including the days and time you are willing to meet up with organizations.
+	Wait for organizations to book appointments.
+	You will see your upcoming donations on a rolling week basis in your dashboard.
+	Update your information and frequency when you need.

#### For Charitable Groups
+	Managers or representative can create an account online.
+	Browse from restaurants/establishments with active donation schedule.
+	Click on a restaurant to view their preferred donation time and available appointments for the week and click on a date to book it.
+	You will see your upcoming booked appointments in your dashboard.
+	To check the location and phone number of the restaurant/establishments, click on the restaurant/establishment’s name.
+	Update your information when you need.

---

### Application Website
<a href="https://shielded-coast-22560.herokuapp.com">H U N G R Y | H E L P E R S</a>
#### Demo Accounts (but of course, you can create your own accounts)

<p>There is a <b><em>quick Demo Login link on the homepage</em></b>, but if you want to try the login link here are the credentials that you can try. </p>

##### Restaurant Login
+ <b>username</b> - kfcculvercity
+ <b>password</b> - culvercity99
##### Charitable Organization Login
+ <b>username</b></b> - twoorg
+ <b>password</b> - updatedpassword
---

### Tech Stack
#### Front-End
+	HTML
+	CSS
+	JavaScript
+	jQuery

#### Back-end
+	Node.js
+	Express.js
+	Mongoose
+	MongoDB

#### Deployment, Version Control and Cloud Hosting
+	Github
+	Heroku
+	mLab

#### Others
+ Animate.css
+ FontAwesome
---

### RESTful API
#### Admins endpoint
##### /admins
##### GET
+	returns all admin profiles
##### Parameters:
+	active=true	 only returns app admins who are active
+	active=false	 only returns app admins who are disabled
#### POST
+	creates a new admin profile

##### /admins/restverify
##### GET
+	return all restaurant profiles that need verification

##### /admins/orgverify
##### GET
+	return all organization profiles that need verification

##### /admins/restverify/:restoId
##### PUT
+	updates the verified property to true

##### /admins/orgverify/:orgId
##### PUT
+	updates the verified property to true

##### /admins/:id
##### PUT
+	updates an admin profile
##### DELETE
+	disables the admin profile

---

#### Restaurants endpoint
##### /restaurants
##### GET
 +	returns all restaurant profile
##### Parameters(can be combined)
 +	active=true	 returns active profiles
 +	active=false	 returns disabled profiles
 +	verified=true	returns verified profiles
 +	verified=false	returns unverified profiles
##### POST
+	creates a new restaurant profile

##### /restaurants/:id
##### GET
+	returns a restaurant profile
##### PUT
+	updates a restaurant profile
##### DELETE
+	disables a restaurant profile

##### /restaurants/:id/schedules
##### GET
+	returns a restaurant profile’s schedule, info and booked dates
##### POST
+	create restaurant’s donation frequency schedule
##### PUT
+	update restaurant’s donation frequency schedule

---

#### Organizations endpoint
##### /organizations
##### GET
+	returns all organization profile
##### Parameters(can be combined)
+	active=true	 returns active profiles
+	active=false	 returns disabled profiles
+	verified=true	returns verified profiles
+	verified=false	returns unverified profiles
##### POST
+	creates a new organization profile

##### /organizations/:id
##### GET
+	returns an organization profile
##### PUT
+	updates an organization profile
##### DELETE
+	disables an organization profile

##### /organizations/:id/pickups
##### GET
+	returns the upcoming pickups in the current week

---

#### Schedules endpoint
##### /schedules
##### GET
+	returns all schedule info
##### Parameters(can be combined)
+	active=true	 returns schedules that are active from today until the next 6 days
+	active=false	 returns inactive schedules within the next 6 days

##### /schedules/:schedId
##### GET
+	returns a booking array which holds booked appointments so far and an availableBookDates array which holds dates that you can book within the next 6 days depending on restaurant’s preferred days of donation.
