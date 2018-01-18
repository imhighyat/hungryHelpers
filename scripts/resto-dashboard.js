$(document).ready(function() {
    const currentSettings = {};
    const updatedSettings = {};
    const restoId = "5a6072db3160e79360110d6a";

    //store account info to currentSettings object
    function storeAccountData(data){
        currentSettings.restoName = data.name;
        currentSettings.firstName = data.manager.firstName;
        currentSettings.lastName = data.manager.lastName;
        currentSettings.phone = data.phoneNumber;
        currentSettings.email = data.email;
        currentSettings.street = data.address.street;
        currentSettings.city = data.address.city;
        currentSettings.state = data.address.state;
        currentSettings.zip = data.address.zipcode;
        currentSettings.username = data.username;
        currentSettings.password = data.password;
        currentSettings.days = [];
    }

    //store sched info to currentSettings object
    function storeScheduleData(data){
        //use of moment.js to format dates
        let start = moment.utc(data.startingDate).format("YYYY-MM-DD");
        let end = moment.utc(data.endingDate).format("YYYY-MM-DD");
        console.log(start, end);
        console.log(data.startingDate, data.endingDate);
        currentSettings.frequency = data.schedType;
        currentSettings.start = start;
        currentSettings.end = end;
        currentSettings.time = data.time.hour + ":" + data.time.minutes;
        currentSettings.days = data.dayOfWeek;  //array of days
    }

    //render the info on the page
    function renderValues(obj){
        $('.profile-card h3').text(`Welcome, ${currentSettings.restoName}!`);
        $(".js-resto-name p").text(currentSettings.restoName);
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
        $("input[name=start-date]").val(currentSettings.start);
        $("input[name=end-date]").val(currentSettings.end);
        $("input[name=appt-time]").val(currentSettings.time);
        $("select").val(currentSettings.frequency);
        $("input[type=checkbox]").attr("hidden", "true");   //hide all the checkbox first
        $("span").attr("hidden", "true");   //hide all the span first
        //loop through the days in the array
        //if the value matches one of the checkboxes, add checked and show checkbox together with the span next to it
        for(let i=0;i < currentSettings.days.length;i++){
            console.log(currentSettings.days);
            $(`input[value=${currentSettings.days[i]}]`).attr("checked", "true").removeAttr("hidden").next("span").removeAttr("hidden");
        }
    }

    //show the upcoming sched on the page
    function renderUpcomingSched(data){
        for(let i = 0; i < data.bookings.length; i++){
            let today = moment().format("LL");
            let date = moment(data.bookings[i].date).format("LL");
            let time = moment(`${data.time.hour}:${data.time.minutes}`, 'HH:mm').format('LT');
            let upcomingEntry = `<tr class="js-donation-entry">
                                    <td>${date}</td>
                                    <td>${time}</td> 
                                    <td>${data.bookings[i].organization.name}</td>
                                    <td>${data.bookings[i].orgPerson}</td>
                                </tr>`;
            //only show dates for today or in the future
            if(today <= date){
                $('.js-donation-list table').append(upcomingEntry);
            }
        }
    }

    //to store updated values to an object before sending it to DB
    function getUpdatedValues(){
        const newDaysValue = [];
        //take the values of the checkbox input
        $('input[type=checkbox]:checked').each(function(index, item){
            newDaysValue.push($(item).val());
        });
        updatedSettings.dayOfWeek = newDaysValue;
        updatedSettings.firstName = $('input[name=first-name]').val();
        updatedSettings.lastName = $('input[name=last-name]').val();
        updatedSettings.phone = $('input[name=phone]').val();
        updatedSettings.email = $('input[name=email]').val();
        updatedSettings.street = $('input[name=street]').val();
        updatedSettings.city = $('input[name=city]').val();
        updatedSettings.state = $('input[name=state]').val();
        updatedSettings.zipcode = $('input[name=zip]').val();
        updatedSettings.password = $('input[name=password]').val();
        updatedSettings.schedType = $('select').val();
        updatedSettings.startingDate = $('input[name=start-date').val();
        updatedSettings.endingDate = $('input[name=end-date').val();
        updatedSettings.time = {};
        updatedSettings.time.hour = parseInt($("input[name=appt-time]").val().slice(0,2));
        updatedSettings.time.minutes = parseInt($("input[name=appt-time]").val().slice(3));
        updateRestoData();
    }

    //updates schedule in the DB using PUT
    function updateScheduleData(){
        $.ajax({
            method: "PUT",
            url: `http://localhost:8080/restaurants/${restoId}/schedules`,
            data: JSON.stringify({
                id: restoId,
                schedType: updatedSettings.schedType,
                startingDate: updatedSettings.startingDate,
                endingDate: updatedSettings.endingDate,
                dayOfWeek: updatedSettings.dayOfWeek,
                time: updatedSettings.time
            }),
            contentType: "application/json; charset=utf-8"
        })
        .done(function(data){
            storeScheduleData(data[0]);
            renderValues(currentSettings);
        });
    }

    //updates account info in the DB using PUT
    function updateRestoData(){
        $.ajax({
            method: "PUT",
            url: `http://localhost:8080/restaurants/${restoId}`,
            data: JSON.stringify({
                id: restoId,
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
            storeAccountData(data);
            updateScheduleData();
        });
    }

    //gets upcoming info from DB
    function getUpcomingBookings(){
        $.ajax({
            method: "GET",
            url: `http://localhost:8080/restaurants/${restoId}/schedules`
        })
        .done(function(data) {
            renderUpcomingSched(data[0]); //response is gonna be an array since using .find()
        });
    }

    //call to get sched info from DB
    function fetchScheduleData(){
        $.ajax({
            method: "GET",
            url: `http://localhost:8080/restaurants/${restoId}/schedules`
        })
        .done(function(data) {
            storeScheduleData(data[0]); //response is gonna be an array since using .find()
            renderValues(currentSettings);
        });
    }

    //call to get account info from DB
    function fetchRestoData(id){
        console.log(id);
        $.ajax({
            method: "GET",
            url: `http://localhost:8080/restaurants/${id}`
        })
        .done(function(data) {
            storeAccountData(data);
            fetchScheduleData();
            getUpcomingBookings();
        });
    }

    //calling the main starting function
    fetchRestoData(restoId);










    
    //---------DYNAMIC STYLES----------------//

    //upcoming donations should be the default tab
    $('.js-donation-list').css('display', 'block');
    $('.upcoming-donations').css('border-bottom', '3px ridge #58635b');
    $('.js-account-settings').css('display', 'none');

    //when account settings tab is clicked
    $('.account-settings').on('click', function(){
        $('.upcoming-donations').css('border-bottom', 'none');
        $('.account-settings').css('border-bottom', '3px ridge #58635b');
        $('.js-donation-list').css('display', 'none');
        $('.js-account-settings').css('display', 'block');
    });

    //when upcoming donations tab is clicked
    $('.upcoming-donations').on('click', function(){
        $('.account-settings').css('border-bottom', 'none');
        $('.upcoming-donations').css('border-bottom', '3px ridge #58635b');
        $('.js-donation-list').css('display', 'block');
        $('.js-account-settings').css('display', 'none');
        $('.cancel-changes').attr('hidden', 'true');
        $('.edit-details').removeAttr('hidden');
        $('.js-account-settings input').attr('readonly', 'true').css({'border-bottom': 'none', 'font-style': 'normal'});
        $('.js-sched-type select').css({'border': 'none', 'font-style': 'normal'}).removeClass('select-appearance').addClass('no-appearance').prop('disabled', 'true');
        $('.js-day-of-week input').css('font-style', 'normal').removeClass('checkbox-appearance').addClass('no-appearance').next('span').css('font-style', 'normal');
        renderValues();
    });

    //make the editable content editable when edit is clicked
    $('.account-settings-buttons > .edit-details').on('click', function(e){
        e.preventDefault();
        $('.cancel-changes').removeAttr('hidden');
        $('.edit-details').attr('hidden', 'true');
        $('.js-account-settings input').removeAttr('readonly checked').css({'border-bottom': '1px solid black', 'font-style': 'italic'});
        $('.js-sched-type select').removeClass('no-appearance').removeAttr('disabled').addClass('select-appearance').css({'border-bottom': '1px solid black', 'font-style': 'italic'});
        $('.js-day-of-week input').removeClass('no-appearance').removeAttr('hidden').addClass('checkbox-appearance').css('font-style', 'italic').next('span').removeAttr('hidden').css('font-style', 'italic');
    });

    //when the cancel has been clicked, should show back the current settings
    $('.account-settings-buttons > .cancel-changes').on('click', function(e){
        e.preventDefault();
        $('.cancel-changes').attr('hidden', 'true');
        $('.edit-details').removeAttr('hidden');
        $('.js-account-settings input').attr('readonly', 'true').css({'border-bottom': 'none', 'font-style': 'normal'});
        $('.js-sched-type select').css({'border': 'none', 'font-style': 'normal'}).removeClass('select-appearance').addClass('no-appearance').prop('disabled', 'true');
        $('.js-day-of-week input').css('font-style', 'normal').removeClass('checkbox-appearance').addClass('no-appearance').next('span').css('font-style', 'normal');
        renderValues();
    });

        
    //when the save changes is clicked
    $('.account-settings-buttons > .save-changes').on('click', function(e){
        e.preventDefault();
        //check if customer was editing first before clicking save
        if($('.js-sched-type select').hasClass('select-appearance') == true){
            getUpdatedValues();
            $('.cancel-changes').attr('hidden', 'true');
            $('.edit-details').removeAttr('hidden');
            $('.js-account-settings input').attr('readonly', 'true').css({'border-bottom': 'none', 'font-style': 'normal'});
            $('.js-day-of-week input').removeClass('checkbox-appearance').addClass('no-appearance').next('span').css('font-style', 'normal');
            $('.js-sched-type select').css({'border': 'none', 'font-style': 'normal'}).removeClass('select-appearance').addClass('no-appearance').prop('disabled', 'true');
            $('.success-modal').css('display', 'block').find('p').text('Account has been updated!');
        } else {
            $('.success-modal').css('display', 'block').find('p').text('Your information is up to date.');
        }
    });
  
    //okay button after changes have been made
    $('.success-modal button').on('click', function(e){
        e.preventDefault();
        $('.success-modal').css('display', 'none');
    });
  
    //show hamburger-menu when sidebar icon is clicked
    $('.sidebar-icon').on('click', function(){
        $('.hamburger-menu').fadeIn().css('display', 'block');
    });

    //hide hamburger-menu when X is clicked
    $('.hamburger-close').on('click', function(){
        $('.hamburger-menu').css('display', 'none');
    });

});