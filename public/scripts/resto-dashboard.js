$(document).ready(function() {
    let API_URL = 'https://shielded-coast-22560.herokuapp.com';
    const currentSettings = {};
    const updatedSettings = {};
    const query = window.location.search;
    const restoId = (query.split('?id=')[1]).toString();
    //set the default tab onload
    $('.js-donation-list').css('display', 'block');
    $('.upcoming-donations').css('border-bottom', '3px ridge #58635b');
    $('.js-account-settings').css('display', 'none');
    fetchRestoData(restoId);

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
        currentSettings.frequency = data.schedType;
        currentSettings.start = start;
        currentSettings.end = end;
        currentSettings.days = data.dayOfWeek;  //array of days
        if((data.time.hour).toString().length === 1){
            if(data.time.minutes === 0){
                currentSettings.time = `0${data.time.hour}:${data.time.minutes}0`;
            }
            else{
                currentSettings.time = `0${data.time.hour}:${data.time.minutes}`;
            }
        }
        else{
            currentSettings.time = `${data.time.hour}:${data.time.minutes}`;
        }
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
            $(`input[value=${currentSettings.days[i]}]`).attr("checked", "true").removeAttr("hidden").next("span").removeAttr("hidden");
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
            url: `${API_URL}/restaurants/${restoId}/schedules`,
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
            url: `${API_URL}/restaurants/${restoId}`,
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
            url: `${API_URL}/restaurants/${restoId}/schedules`
        })
        .done(function(data) {
            filterUpcomingSched(data[0]);
        });
    }

    //filter and sort the dates
    function filterUpcomingSched(data){
        const appointments = [];
        for(let i=0; i< data.bookings.length; i++){
            let today = moment().format("LL");
            let date = moment(data.bookings[i].date).format("LL");
            let time = moment(`${data.time.hour}:${data.time.minutes}`, 'HH:mm').format('LT');
            //get only those dates for today or in the future
            if(date >= today){
                const apptEntry = {
                    date: date,
                    time: time,
                    orgName: data.bookings[i].organization.name,
                    orgPerson: data.bookings[i].orgPerson
                };
                appointments.push(apptEntry);
            }
        }
        let sortedAppointments = appointments.sort(function(a, b){
            a = moment(a.date);
            b = moment(b.date);
            return a - b;
        });
        renderUpcomingSched(sortedAppointments);
    }

    //show the upcoming sched on the page
    function renderUpcomingSched(array){
        if(array.length < 1){
            $('.js-donation-list .no-donations').css('display', 'block');
        }
        else{
            $('.js-donation-list .no-donations').css('display', 'none');
            $('.js-donation-list tbody').empty();
            for(let i = 0; i < array.length; i++){
                let upcomingEntry = `<tr class="js-donation-entry">
                                        <td>${array[i].date}</td>
                                        <td>${array[i].time}</td> 
                                        <td>${array[i].orgName}</td>
                                        <td>${array[i].orgPerson}</td>
                                    </tr>`;
                    $('.js-donation-list tbody').append(upcomingEntry);
            }
        }
    }

    //call to get sched info from DB
    function fetchScheduleData(){
        $.ajax({
            method: "GET",
            url: `${API_URL}/restaurants/${restoId}/schedules`
        })
        .done(function(data) {
            storeScheduleData(data[0]); //response is gonna be an array since using .find()
            renderValues(currentSettings);
        });
    }

    //call to get account info from DB
    function fetchRestoData(id){
        $.ajax({
            method: "GET",
            url: `${API_URL}/restaurants/${id}`
        })
        .done(function(data) {
            storeAccountData(data);
            fetchScheduleData();
            getUpcomingBookings();
        });
    }
 
//--------click events-------------//
    const clickEvents = {
        clickAccountSettings: function(){
            this.closeHamburgerMenu();
            $('.upcoming-donations').css('border-bottom', 'none');
            $('.account-settings').css('border-bottom', '3px ridge #58635b');
            $('.js-donation-list').css('display', 'none');
            $('.js-account-settings').css('display', 'block');
        },
        closeHamburgerMenu: function(){
            setTimeout(function(){
                    $('.hamburger-menu').css('display', 'none');
                }, 1000);
            $('.hamburger-menu').removeClass('fadeInRight').addClass('fadeOutRight');
        },
        clickUpcomingDonations: function(){
            this.closeHamburgerMenu();
            renderValues();
            $('.cancel-changes').attr('hidden', 'true');
            $('.edit-details').removeAttr('hidden');
            $('.account-settings').css('border-bottom', 'none');
            $('.upcoming-donations').css('border-bottom', '3px ridge #58635b');
            $('.js-donation-list').css('display', 'block');
            $('.js-account-settings').css('display', 'none');
            $('.js-account-settings input').attr('readonly', 'true').css({'border-bottom': 'none', 'font-style': 'normal', 'outline': 'none'});
            $('.js-org-cause p').attr('contenteditable', 'false').css({'border-bottom': 'none', 'font-style': 'normal', 'outline': 'none'});
            $('.js-sched-type select').css({'border': 'none', 'font-style': 'normal'}).removeClass('select-appearance').addClass('no-appearance').prop('disabled', 'true');
            $('.js-day-of-week input').css('font-style', 'normal').removeClass('checkbox-appearance').addClass('no-appearance').next('span').css('font-style', 'normal');
        },
        editInfo: function(){
            this.closeHamburgerMenu();
            $('.cancel-changes').removeAttr('hidden');
            $('.edit-details').attr('hidden', 'true');
            $('input[type="checkbox"]').prop('checked' , false);
            $('.success-modal').css('display', 'none');
            $('.js-account-settings input').removeAttr('readonly').css({'border-bottom': '1px solid black', 'font-style': 'italic'});
            $('.js-org-cause p').attr('contenteditable', 'true').css({'border-bottom': '1px solid black', 'font-style': 'italic'});
            $('.js-account-settings input').removeAttr('readonly checked').css({'border-bottom': '1px solid black', 'font-style': 'italic'});
            $('.js-sched-type select').removeClass('no-appearance').removeAttr('disabled').addClass('select-appearance').css({'border-bottom': '1px solid black', 'font-style': 'italic'});
            $('.js-day-of-week input').removeClass('no-appearance').removeAttr('hidden').addClass('checkbox-appearance').css('font-style', 'italic').next('span').removeAttr('hidden').css('font-style', 'italic');
        },
        cancelEditInfo: function(){
            this.closeHamburgerMenu();
            renderValues();
            $('.cancel-changes').attr('hidden', 'true');
            $('.edit-details').removeAttr('hidden');
            $('input[type="checkbox"]').prop('checked' , false);
            $('.success-modal').css('display', 'none');
            $('.js-account-settings input').attr('readonly', 'true').css({'border-bottom': 'none', 'font-style': 'normal', 'outline': 'none'});
            $('.js-org-cause p').attr('readonly', 'true').css({'border-bottom': 'none', 'font-style': 'normal', 'outline': 'none'});
            $('.js-sched-type select').css({'border': 'none', 'font-style': 'normal'}).removeClass('select-appearance').addClass('no-appearance').prop('disabled', 'true');
            $('.js-day-of-week input').css('font-style', 'normal').removeClass('checkbox-appearance').addClass('no-appearance').next('span').css('font-style', 'normal');
        },
        clickSaveChanges: function(){
            this.closeHamburgerMenu();
            //check if info is being edited first
            if($('.js-account-settings input').css('font-style') == 'italic'){
                //make sure that all editable contents have value before saving
                if($('input[name="first-name"]').val() && $('input[name="last-name"]').val() && $('input[name="phone"]').val() && $('input[name="email"]').val() && $('input[name="street"]').val() && $('input[name="city"]').val() && $('input[name="state"]').val() && $('input[name="zip"]').val() && $('input[name="password"]').val() && $('input[name="start-date"]').val() && $('input[name="end-date"]').val() && $('input[name="appt-time"]').val() && ($('input[name="monday"]').is(':checked') || $('input[name="tuesday"]').is(':checked') || $('input[name="wednesday"]').is(':checked') || $('input[name="thursday"]').is(':checked') || $('input[name="friday"]').is(':checked') || $('input[name="saturday"]').is(':checked') || $('input[name="sunday"]').is(':checked'))){
                    getUpdatedValues();
                    $('.success-modal').css('display', 'block').find('p').text('Account has been updated!');
                    $('.cancel-changes').attr('hidden', 'true');
                    $('.edit-details').removeAttr('hidden');
                    $('.js-account-settings input').attr('readonly', 'true').css({'border-bottom': 'none', 'font-style': 'normal', 'outline': 'none'});
                    $('.js-day-of-week input').removeClass('checkbox-appearance').addClass('no-appearance').next('span').css('font-style', 'normal');
                    $('.js-sched-type select').css({'border': 'none', 'font-style': 'normal'}).removeClass('select-appearance').addClass('no-appearance').prop('disabled', 'true');
                    $('.success-modal').css('display', 'block').find('p').text('Account has been updated!');
                }
                else{
                    $('.success-modal').css('display', 'block').find('p').text('Please make sure all entries have values.');
                }                
            }
            else{
                $('.success-modal').css('display', 'block').find('p').text('Your information is up to date.');
            }
        }
    }

    $('.account-settings').on('click', function(){
        clickEvents.clickAccountSettings();
    });

    $('.upcoming-donations').on('click', function(){
        clickEvents.clickUpcomingDonations();
    });

    $('.account-settings-buttons > .edit-details').on('click', function(e){
        e.preventDefault();
        clickEvents.editInfo();
    });

    $('.account-settings-buttons > .cancel-changes').on('click', function(e){
        e.preventDefault();
        clickEvents.cancelEditInfo();
    });

    $('.account-settings-buttons > .save-changes').on('click', function(e){
        e.preventDefault();
        //check if customer was editing first before clicking save
        clickEvents.clickSaveChanges();
    });
  
    //okay button after changes have been made
    $('.success-modal button').on('click', function(e){
        e.preventDefault();
        $('.success-modal').css('display', 'none');
    });
  
    //show hamburger-menu when sidebar icon is clicked
    $('.sidebar-icon').on('click', function(){
        $('.hamburger-menu').removeClass('fadeOutRight').css('display', 'block').addClass('fadeInRight');
    });

    //hide hamburger-menu when X is clicked
    $('.hamburger-close').on('click', function(){
        clickEvents.closeHamburgerMenu();
    });

});