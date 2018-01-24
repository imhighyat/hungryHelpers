$(document).ready(function() {
    let credentials = {};
    //let newRestoData = {};
    let newOrgData = {};

    //LOGIN SECTION






    //REGISTER SECTION
    const restoDbCallMethods = {
        newRestoData: {},
        restoRegisterClicked: function(){
            this.newRestoData.restoName = $('.resto-register input[name="resto-name"]').val();
            this.newRestoData.firstName = $('.resto-register input[name="first-name"]').val();
            this.newRestoData.lastName = $('.resto-register input[name="last-name"]').val();
            this.newRestoData.phone = $('.resto-register input[name="phone"]').val();
            this.newRestoData.email = $('.resto-register input[name="email"]').val();
            this.newRestoData.street = $('.resto-register input[name="street"]').val();
            this.newRestoData.city = $('.resto-register input[name="city"]').val();
            this.newRestoData.state = $('.resto-register input[name="state"]').val();
            this.newRestoData.zip = $('.resto-register input[name="zip"]').val();
            this.newRestoData.username = $('.resto-register input[name="username"]').val();
            this.newRestoData.password = $('.resto-register input[name="password"]').val();
            console.log(this.newRestoData);
            this.checkIfRestoValueMissing(this.newRestoData);
        },
        checkIfRestoValueMissing: function(restoObj){
            for(let prop in restoObj){
                if(restoObj[prop] === ""){
                    return this.showMissingRestoValuesModal();
                }   
            }
            console.log(this);
            this.addNewRestoToDb(restoObj);
        },
        showMissingRestoValuesModal: function(){
            myThis = this;
            $('.missing-values').css('display', 'block');
            $('.missing-values p').text('Please fill out all the fields.');
            $('.missing-values button').css('display', 'inline-block');
            $('.missing-values button').on('click', function(event){
                event.stopPropagation();
                event.preventDefault();
                $('.missing-values').css('display', 'none');
            });
        },
        addNewRestoToDb: function(restoObj){
            myThis = this;
            $.ajax({
                method: 'POST',
                url: `http://localhost:8080/restaurants`,
                data: JSON.stringify({
                    name: restoObj.restoName,
                    phoneNumber: restoObj.phone,
                    manager: {
                        firstName: restoObj.firstName,
                        lastName: restoObj.lastName
                    },
                    address: {
                        street: restoObj.street,
                        city: restoObj.city,
                        state: restoObj.state,
                        zipcode: restoObj.zip
                    },
                    email: restoObj.email,
                    username: restoObj.username,
                    password: restoObj.password
                }),
                contentType: 'application/json; charset=utf-8'
            })
            .done(function(payload){
                console.log(payload); //inspect what we received
                let restoProfile = payload;
                myThis.showFrequencyModal(restoProfile);
            });
        },
        showFrequencyModal: function(restoObj){
            myThis = this;
            $('.frequency-wrapper').css('display', 'block');
            $('.register-wrapper').css('display', 'none');
            $('.add-frequency button').on('click', function(event){
                event.stopPropagation();
                event.preventDefault();
                myThis.storeFrequencyValues(restoObj);
            });
        },
        storeFrequencyValues: function(restoObj){
            let days = []; //to strore the daysOfWeek
            $('input[type=checkbox]:checked').each(function(index, item){
                    days.push($(item).val());
            });
            let frequencySched = {
                schedType: $('select').val(),
                startingDate: $('input[name=start-date').val(),
                endingDate: $('input[name=end-date').val(),
                dayOfWeek: days,
                time: {
                    hour: parseInt($("input[name=appt-time]").val().slice(0,2)),
                    minutes: parseInt($("input[name=appt-time]").val().slice(3))
                }
            };
            this.addFrequencyToDb(restoObj, frequencySched);
        },
        addFrequencyToDb(restoObj, schedObj){
            myThis = this;
            //make sure everything has value
            if($('input[name="start-date"]').val() && $('input[name="end-date"]').val() && $('input[name="appt-time"]').val() && ($('input[name="monday"]').is(':checked') || $('input[name="tuesday"]').is(':checked') || $('input[name="wednesday"]').is(':checked') || $('input[name="thursday"]').is(':checked') || $('input[name="friday"]').is(':checked') || $('input[name="saturday"]').is(':checked') || $('input[name="sunday"]').is(':checked'))){
                $.ajax({
                    method: 'POST',
                    url: `http://localhost:8080/restaurants/${restoObj._id}/schedules`,
                    data: JSON.stringify({
                        schedType: schedObj.schedType,
                        startingDate: schedObj.startingDate,
                        endingDate: schedObj.endingDate,
                        dayOfWeek: schedObj.dayOfWeek,
                        time: schedObj.time,
                        restaurant: restoObj._id,
                        restPerson: restoObj.manager.firstName + restoObj.manager.lastName,
                        bookings: []
                    }),
                    contentType: 'application/json; charset=utf-8'
                })
                .done(function(){
                    myThis.showRedirectMessage(restoObj.name);
                    setTimeout(`window.location.href = "private/restaurantdashboard.html?id=${restoObj._id}"`, 5000);
                });
            }
        },
        showRedirectMessage: function(restoName){
            $('.redirect-message').css('display', 'block');
            $('.redirect-message p').text(`Welcome, ${restoName}! One moment while I load your dashboard.`);
        }
    }





    //----------CLICK FUNCTIONS------------//
    const clickEvents = {
        closeHamburgerMenu: function(){
            $('.hamburger-menu').css('display', 'none');
        },
        logoclick: function(){
            $('html, body').animate({scrollTop: 0}, 1000);
        },
        showHamburgerMenu: function(){
            $('.hamburger-menu').css('display', 'block');
        },
        resetLoginInputs: function(){
            credentials.username = "";
            credentials.password = "";
        },
        showLoginModal: function(){
            $('#login').removeClass('fadeOutDown').css('display', 'block').addClass('fadeInDown');
        },
        closeLoginModal: function(){
            this.resetLoginInputs();
            setTimeout(function(){
                    $('#login').css('display', 'none');
                }, 1500);
            $('#login').removeClass('fadeInDown').addClass('fadeOutDown');
        },
        showRegisterModal: function(){
            $('#register').removeClass('fadeOutDown').css('display', 'block').addClass('fadeInDown');
        },
        closeRegisterModal: function(){
            setTimeout(function(){
                    $('#register').css('display', 'none');
            }, 1500);
        },
        showRegisterTypesModal: function(){
            $('.register-types').css('display', 'block');
        },
        closeRegisterTypesModal: function(){
            $('.register-types').css('display', 'none');
        },
        showRestoRegisterModal: function(){
            $('.resto-register').css('display', 'block');
        },
        closeRestoRegisterModal: function(){
            $('.resto-register').css('display', 'none');
        },
        showOrgRegisterModal: function(){
            $('.org-register').css('display', 'block');
        },
        closeOrgRegisterModal: function(){
            $('.org-register').css('display', 'none');
        },
        goToHowTo: function(){
            this.closeHamburgerMenu();
            $('html, body').animate({scrollTop: $('#howto').offset().top}, 1000);
        },
        goToContact: function(){
            this.closeHamburgerMenu();
            $('html, body').animate({scrollTop: $('#contact').offset().top}, 1000);
        },
        closeIncorrectCredentialsModal: function(){
            $('.incorrect-credentials').css('display', 'none');
        },
        closeMissingValuesModal: function(){
            $('.missing-values').css('display', 'none');
        }
    };


    //-------AJAX STYLING CLICKS--------------//
    //when resto user clicks on Complete Registration
    $('.resto-register .reg-form-buttons .sign-up').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        restoDbCallMethods.restoRegisterClicked();
    });

    //when org user clicks on Complete Registration
    $('.org-register .reg-form-buttons .sign-up').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        
    });

    //to close the missing values message modal
    $('.missing-values button').on('click', function(e){
            console.log('button clicked');
            e.stopPropagation();
            e.preventDefault();
            clickEvents.closeMissingValuesModal();
    });




    //-------DYNAMIC STYLING CLICKS-----------//
    //when log in button has been clicked
    $('.login-form button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        clickEvents.closeHamburgerMenu();
        clickEvents.showLoginModal();
    });

    //when logo is clicked
    $('.nav-logo').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.logoclick();
    });

    //show hamburger menu on small devices when sidebar icon is clicked
    $('.sidebar-icon').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.showHamburgerMenu();
    });

    //close hamburger menu on small devices when X is clicked
    $('.hamburger-close').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeHamburgerMenu();
    });

    //when X on login modal is clicked
    $('.login-close').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeLoginModal();
        clickEvents.resetLoginInputs();
        clickEvents.showRegisterTypesModal();
        clickEvents.closeRestoRegisterModal();
        clickEvents.closeOrgRegisterModal();
    });

    //when Cancel button on login modal is clicked
    $('.login-cancel-forgot > button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeLoginModal();
        clickEvents.resetLoginInputs();
        clickEvents.showRegisterTypesModal();
        clickEvents.closeRestoRegisterModal();
        clickEvents.closeOrgRegisterModal();
    });

    //when login link is clicked, show log in modal
    $('.login-link').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeHamburgerMenu();
        clickEvents.showLoginModal();
        clickEvents.closeRegisterModal();
    });

    //when register link is clicked, show register modal
    $('.register-link').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeHamburgerMenu();
        clickEvents.showRegisterModal();
    });

    //when cancel button is clicked on the register types modal
    $('.register-types > button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeRegisterModal();
    });

    //when resto type sign up has been selected for registration
    $('.resto-selected').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeRegisterTypesModal();
        clickEvents.closeOrgRegisterModal();
        clickEvents.showRestoRegisterModal();
    });

    //when org type sign up has been selected for registration
    $('.org-selected').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeRegisterTypesModal();
        clickEvents.closeRestoRegisterModal();
        clickEvents.showOrgRegisterModal();
    });

    //when cancel on the registration modal is clicked
    $('.reg-form-buttons .cancel').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeRestoRegisterModal();
        clickEvents.closeOrgRegisterModal();
        clickEvents.showRegisterTypesModal();
    });

    //when howto link is clicked
    $('.howto-link').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.goToHowTo();
    });

    //when contact link is clicked
    $('.contact-link').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.goToContact();
    });

    //when learn more button is clicked, scroll to how to section
    $('.learn-more-button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.goToHowTo();
    });

    //when button in incorrect credentials modal is clicked, close the modal
    $('.incorrect-credentials-card button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeIncorrectCredentialsModal();
    });

    //when the instructions card in how to is entered and left with mouse
    $('.thumb-instructions').mouseenter(function(){
        $(this).addClass('animated pulse');
        $(this).mouseleave(function(){
            $(this).removeClass('pulse');
        });
    });

    //when the learn more button is entered and left with mouse
    $('.learn-more-button').mouseenter(function(){
        $(this).addClass('animated pulse infinite');
        $(this).mouseleave(function(){
            $(this).removeClass('pulse');
        });
    });

    //when back to top is clicked
    $('footer a').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        clickEvents.logoclick();
    });
});