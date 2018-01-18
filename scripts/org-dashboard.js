$(document).ready(function() {
    const currentSettings = {};
    const updatedSettings = {};
    const orgId = "5a5ff9245670e92d08e25f3b";

    function fetchOrgData(id){
        $.ajax({
            method: "GET",
            url: `http://localhost:8080/organizations/${orgId}`
        })
        .done(function(data) {
            storeAccountData(data);
            renderAccountInfo(currentSettings);
            loadUpcomingPickups();
        });
    }

    function storeAccountData(data){
        currentSettings.orgName = data.name;
        currentSettings.cause = data.causeDescription;
        currentSettings.phone = data.phoneNumber;
        currentSettings.email = data.email;
        currentSettings.username = data.username;
        currentSettings.password = data.password;
        currentSettings.street = data.address.street;
        currentSettings.city = data.address.city;
        currentSettings.state = data.address.state;
        currentSettings.zip = data.address.zipcode;
        currentSettings.firstName = data.manager.firstName;
        currentSettings.lastName = data.manager.lastName;
    }

    function renderAccountInfo(obj){
        $('.profile-card h3').text(`Welcome, ${currentSettings.orgName}!`);
        $('.js-org-name p').text(currentSettings.orgName);
        $('.js-org-cause textarea').val(currentSettings.cause);
        $("input[name=first-name]").val(currentSettings.firstName);
        $("input[name=last-name]").val(currentSettings.lastName);
        $("input[name=phone]").val(currentSettings.phone);
        $("input[name=email]").val(currentSettings.email);
        $("input[name=street]").val(currentSettings.street);
        $("input[name=city]").val(currentSettings.city);
        $("input[name=state]").val(currentSettings.state);
        $("input[name=zip]").val(currentSettings.zip);
        $(".js-username p").text(currentSettings.username);
        $("input[name=password]").val(currentSettings.password);
    }

    function getUpdatedValues(){
        updatedSettings.cause = $('.js-org-cause textarea').val();
        updatedSettings.phone = $("input[name=phone]").val();
        updatedSettings.email = $("input[name=email]").val();
        updatedSettings.password = $("input[name=password]").val();
        updatedSettings.street = $("input[name=street]").val();
        updatedSettings.city = $("input[name=city]").val();
        updatedSettings.state = $("input[name=state]").val();
        updatedSettings.zip = $("input[name=zip]").val();
        updatedSettings.firstName = $("input[name=first-name]").val();
        updatedSettings.lastName = $("input[name=last-name]").val();
        updateOrgData();
    }

    function updateOrgData(){
        $.ajax({
            method: "PUT",
            url: `http://localhost:8080/organizations/${orgId}`,
            data: JSON.stringify({
                id: orgId,
                causeDescription: updatedSettings.cause,
                phoneNumber: updatedSettings.phone,
                manager: {
                    firstName: updatedSettings.firstName,
                    lastName: updatedSettings.lastName
                },
                address: {
                    street: updatedSettings.street,
                    city: updatedSettings.city,
                    state: updatedSettings.state,
                    zipcode: updatedSettings.zipcode
                },
                email: updatedSettings.email,
                password: updatedSettings.password
            }),
            contentType: "application/json; charset=utf-8"
        })
        .done(function(data){
            console.log(data);
            storeAccountData(data);
            renderAccountInfo(currentSettings);
        });
    }

    function loadRestaurants(){
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/schedules?active=true"
        })
        .done(function(data) {
            renderResto(data);
        });
    }

    function renderResto(data){
        console.log(data);
        $('.schedules-wrapper').empty();
        if(data.length >= 1){
            for(let i = 0; i < data.length; i++){
                let restoEntry = `<div class="js-schedule-entry">
                        <a href="#" id="${data[i].restaurant._id}" class="resto-schedule"><p>${data[i].restaurant.name}</p></a>
                    </div>`;
                $('.schedules-wrapper').append(restoEntry);
            } 
        } else {
            $('.schedules-wrapper').append('<p>No one is offering a donation at the moment. Please try again later.</p>');
        }
    }

    function loadUpcomingPickups(){
        $.ajax({
            method: "GET",
            url: `http://localhost:8080/organizations/${orgId}/pickups`
        })
        .done(function(data) {
            filterOrgPickups(data);
        });
    }

    function filterOrgPickups(data){
        const pickups = [];
        //loop through the elements
        for(let i=0; i < data.length; i++){
            for(let x=0; x < data[i].bookings.length; x++){
                if(data[i].bookings[x].organization === orgId){
                    let today = moment().format("LL");
                    let date = moment(data[i].bookings[x].date).format("LL");
                    let time = moment(`${data[i].time.hour}:${data[i].time.minutes}`, 'HH:mm').format('LT');
                    //get only those dates for today or in the future
                    if(date >= today){
                        const pickupEntry = {
                        date: date,
                        time: time,
                        restaurant: data[i].restaurant.name,
                        restPerson: data[i].restPerson
                        };
                        pickups.push(pickupEntry);
                    }
                }
            }
        }
        renderUpcomingPickups(pickups);
    }

    function renderUpcomingPickups(array){
        $('.js-pickups-list table tbody').empty();
        for(let i=0; i < array.length; i++){
            let pickupEntry = `<tr class="js-pickups-entry">
                                    <td>${array[i].date}</td>
                                    <td>${array[i].time}</td> 
                                    <td>${array[i].restaurant}</td>
                                    <td>${array[i].restPerson}</td>
                                </tr>`;
            $('.js-pickups-list table tbody').append(pickupEntry);
        }
    }

    function loadRestaurantSchedule(restoId){
        $.ajax({
            method: "GET",
            url: `http://localhost:8080/schedules/${restoId}`
        })
        .done(function(data) {
            getAvailableDates(data);
        });
    }

    function getAvailableDates(data){
        console.log(data);
        let time = moment(`${data.data.time.hour}:${data.data.time.minutes}`, 'HH:mm').format('LT');
        const availableDates = {
            schedId: data.data._id,
            restoName: data.data.restaurant.name,
            dates: [],
            time: time
        };
        for(var prop in data.availBookDates){
            if(data.availBookDates[prop] === true){
                date = moment(prop).format("LL");
                availableDates.dates.push(date);
            }
        }
        renderAvailableDates(availableDates);
    }

    function renderAvailableDates(obj){
        $('.js-dates-wrapper').empty();
        $('.schedule-info-card h4').text(obj.restoName);
        if(obj.dates.length != 0){
            $('.schedule-info-card p').text(`Pick up time is ${obj.time}.`);
        } else {
            $('.schedule-info-card p').text(`Sorry, all dates are booked so far.`);
        }
        for(let i=0; i < obj.dates.length; i++){
            let dateEntry = `<div class="js-avail-bookings" id="${obj.schedId}">
                                <p>${obj.dates[i]}</p>
                            </div>`;
        $('.js-dates-wrapper').append(dateEntry);
        }
    }

    function bookTheDate(schedId, date){
        $.ajax({
            method: "PUT",
            url: `http://localhost:8080/schedules/${schedId}`,
            data: JSON.stringify({
                date: date,
                organization: orgId,
                orgPerson: `${currentSettings.firstName} ${currentSettings.lastName}`
            }),
            contentType: "application/json; charset=utf-8"
        })
        .done(function(){
            loadRestaurants();
        });
    }

    fetchOrgData();


    

//DYNAMIC STYLES!!!!!!!!!!!
    //to click a resto and view open schedule
    $('.schedules-wrapper').on('click', 'a', function(event){
        event.preventDefault();
        let restoId = $(this).attr('id');
        loadRestaurantSchedule(restoId);
        $('.schedule-info-modal').css('display', 'block');
    });

    //click on an available date to book
    $('.js-dates-wrapper').on('click', '.js-avail-bookings', function(){
        schedId = $('.js-avail-bookings').attr('id');
        date = $(this).text();
        $('.booking-confirmation').css('display', 'block');
        //when yes to book the date
        $('.book-yes').on('click', function(){
            bookTheDate(schedId, date);
            $('.booking-confirmation').css('display', 'none');
            $('.date-booked').css('display', 'block');
        });
    });

    //when no to book the date
    $('.book-no').on('click', function(){
        $('.booking-confirmation').css('display', 'none');
    });

    //okay after booking the date
    $('.date-booked-card button').on('click', function(){
        $('.date-booked').css('display', 'none');
        $('.booking-confirmation').css('display', 'none');
        $('.schedule-info-modal').css('display', 'none');
    });

    //upcoming pickups should be the default tab
    $(".js-pickups-list").css("display", "block");
    $(".upcoming-pickups").css("border-bottom", "3px ridge #5779ac");
    $(".js-account-settings").css("display", "none");

    //when account settings tab is clicked
    $(".account-settings").click(function(){
        $(".upcoming-pickups").css("border-bottom", "none");
        $(".account-settings").css("border-bottom", "3px ridge #5779ac");
        $(".js-pickups-list").css("display", "none");
        $(".js-account-settings").css("display", "block");
    });

    //when upcoming pickups tab is clicked
    $(".upcoming-pickups").click(function(){
        $(".account-settings").css("border-bottom", "none");
        $(".upcoming-pickups").css("border-bottom", "3px ridge #5779ac");
        $(".js-pickups-list").css("display", "block");
        $(".js-account-settings").css("display", "none");
        $('.js-org-cause textarea').attr('readonly', 'true');
    });

    //make the editable content editable when edit is clicked
    $(".account-settings-buttons > .edit-details").click(function(e){
        e.preventDefault();
        $(".cancel-changes").removeAttr("hidden");
        $(".edit-details").attr("hidden", "true");
        $(".js-account-settings input").removeAttr("readonly").css({"border-bottom": "1px solid black", "font-style": "italic"});
        $('.js-org-cause textarea').removeAttr("readonly");
    });

    //when the cancel has been clicked, should show the initial settings
    $(".account-settings-buttons > .cancel-changes").click(function(e){
        e.preventDefault();
        $(".cancel-changes").attr("hidden", "true");
        $(".edit-details").removeAttr("hidden");
        $(".js-account-settings input").attr("readonly", "true").css({"border-bottom": "none", "font-style": "normal"});
        $('.js-org-cause textarea').attr("readonly", "true");
    });

        
    //when the save changes is clicked
    $(".account-settings-buttons > .save-changes").click(function(e){
        e.preventDefault();
        //check if customer was editing first before clicking save
        if($('.js-account-settings input').css('font-style') == 'italic'){
            getUpdatedValues();
            $(".cancel-changes").attr("hidden", "true");
            $(".edit-details").removeAttr("hidden");
            $(".js-account-settings input").attr("readonly", "true").css({"border-bottom": "none", "font-style": "normal"});
            $('.js-org-cause textarea').attr("readonly", "true");
            $('.success-modal').css('display', 'block').find('p').text('Account has been updated!');
        } else{
            $('.success-modal').css('display', 'block').find('p').text('Your information is up to date.');
        }        
    });
  
    //okay button after changes have been made
    $(".success-modal button").click(function(e){
        e.preventDefault();
        $(".success-modal").css("display", "none");
    });

    //when browse schedules is clicked
    $(".browse-sched-link").on('click', function(){
        $('.profile-card > h3').css("display", "none");
        $('.profile-nav').css("display", "none");
        $('.js-pickups-list').css("display", "none");
        $(".js-account-settings").css("display", "none");
        $('.browse-schedules').css("display", "block");
        $(".hamburger-menu").css("display", "none");
        $(".nav-links .dashboard-link").css("display", "inline-block");
        $(".hamburger-menu .dashboard-link").css("display", "block");
        $(".browse-sched-link").css("display", "none");
    });

    //when my dashboard is clicked
    $(".dashboard-link").click(function(){
        loadUpcomingPickups();
        $('.profile-card > h3').css("display", "block");
        $('.profile-nav').css("display", "block");
        $('.js-pickups-list').css("display", "block");
        $('.js-account-settings').css("display", "none");
        $('.browse-schedules').css("display", "none");
        $(".dashboard-link").css("display", "none");
        $(".nav-links .browse-sched-link").css("display", "inline-block");
        $(".hamburger-menu .browse-sched-link").css("display", "block");
        $(".upcoming-pickups").css("border-bottom", "3px ridge #5779ac");
        $(".account-settings").css("border-bottom", "none");
        $(".hamburger-menu").css("display", "none");
    });

    //when restaurant is clicked for avail bookings
    $(".js-schedule-entry").on('click', function(){
        $(".schedule-info-modal").css("display", "block");
    });

    //when cancel is clicked from available bookings modal
    $(".avail-bookings-buttons button").click(function(){
        $(".schedule-info-modal").css("display", "none");
    });
  
    //show hamburger-menu when sidebar icon is clicked
    $(".sidebar-icon").click(function(){
        $(".hamburger-menu").fadeIn().css("display", "block");
    });

    //hide hamburger-menu when X is clicked
    $(".hamburger-close").click(function(){
        $(".hamburger-menu").css("display", "none");
    });

    $('.browse-sched-link').on('click', function(){
        loadRestaurants();
    });

    

});