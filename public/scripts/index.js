$(document).ready(function() {
    let API_URL = 'https://shielded-coast-22560.herokuapp.com';
    //LOGIN SECTION
    const loginDbCallMethods = {
        loginCredentials: {},
        getLoginValues: function(){
            this.loginCredentials.username = $('input[name="username"]').val();
            this.loginCredentials.password = $('input[name="password"]').val();
            this.checkIfValueMissing(this.loginCredentials);
        },
        checkIfValueMissing: function(credentials){
            myThis = this;
            if(credentials.username === "" || credentials.password === ""){
                $('.incorrect-credentials').css('display', 'block');
                $('.incorrect-credentials-card p').text('Please fill out all the fields.');
                $('.incorrect-credentials button').css('display', 'inline-block');
            }
            else{
                myThis.checkUsernameInDb(credentials);
            }
        },
        checkUsernameInDb: function(obj){
            myThis = this;
            $.ajax({
                method: 'POST',
                url: `${API_URL}/sessions`,
                data: JSON.stringify(obj),
                contentType: 'application/json; charset=utf-8'
            })
            .done(function(data){
                if(typeof(data) === 'string'){
                    $('.incorrect-credentials').css('display', 'block');
                    $('.incorrect-credentials-card p').text('Invalid credentials. Please try again.');
                    $('.incorrect-credentials button').css('display', 'inline-block');
                }
                else{
                    if('restoToken' in data){
                    myThis.launchRestoDashboard(data.restoToken);
                    }
                    else if('orgToken' in data){
                    myThis.launchOrgDashboard(data.orgToken);
                    }
                }
            });
        },
        launchRestoDashboard: function(id){
            $('.incorrect-credentials').css('display', 'block');
            $('.incorrect-credentials button').css('display', 'none');
            $('.incorrect-credentials-card p').text('Found ya! One moment while I load your dashboard.');
            $('.incorrect-credentials-card span').css('display', 'block');
            $('input[name="username"]').val("");
            $('input[name="password"]').val("");
            setTimeout(`window.location.href = "private/restaurantdashboard.html?id=${id}"`, 3000);
        },
        launchOrgDashboard: function(id){
            $('.incorrect-credentials').css('display', 'block');
            $('.incorrect-credentials button').css('display', 'none');
            $('.incorrect-credentials-card p').text('Found ya! One moment while I load your dashboard.');
            $('.incorrect-credentials-card span').css('display', 'block');
            $('input[name="username"]').val("");
            $('input[name="password"]').val("");
            setTimeout(`window.location.href = "private/organizationdashboard.html?id=${id}"`, 3000);
        }
    };

    //REGISTER RESTO SECTION
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
            this.checkIfRestoValueMissing(this.newRestoData);
        },
        checkIfRestoValueMissing: function(restoObj){
            for(let prop in restoObj){
                if(restoObj[prop] === ""){
                    return this.showMissingRestoValuesModal();
                }   
            }
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
                url: `${API_URL}/restaurants`,
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
                    url: `${API_URL}/restaurants/${restoObj._id}/schedules`,
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
                    setTimeout(`window.location.href = "private/restaurantdashboard.html?id=${restoObj._id}"`, 3000);
                });
            }
            else{
                myThis.showMissingRestoValuesModal();
            }
        },
        showRedirectMessage: function(restoName){
            $('.redirect-message').css('display', 'block');
            $('.redirect-message p').text(`Welcome, ${restoName}! One moment while I load your dashboard.`);
        }
    }

    //REGISTER ORG SECTION
    const orgDbCallMethods = {
        newOrgData: {},
        orgRegisterClicked: function(){
            this.newOrgData.orgName = $('.org-register input[name="org-name"]').val();
            this.newOrgData.firstName = $('.org-register input[name="first-name"]').val();
            this.newOrgData.lastName = $('.org-register input[name="last-name"]').val();
            this.newOrgData.cause = $('.org-register textarea').val();
            this.newOrgData.phone = $('.org-register input[name="phone"]').val();
            this.newOrgData.email = $('.org-register input[name="email"]').val();
            this.newOrgData.street = $('.org-register input[name="street"]').val();
            this.newOrgData.city = $('.org-register input[name="city"]').val();
            this.newOrgData.state = $('.org-register input[name="state"]').val();
            this.newOrgData.zip = $('.org-register input[name="zip"]').val();
            this.newOrgData.username = $('.org-register input[name="username"]').val();
            this.newOrgData.password = $('.org-register input[name="password"]').val();
            this.checkIfOrgValueMissing(this.newOrgData);
        },
        checkIfOrgValueMissing: function(orgObj){
            for(let prop in orgObj){
                if(orgObj[prop] === ""){
                    console.log('true');
                    return this.showMissingOrgValuesModal();
                }   
            }
            this.addNewOrgToDb(orgObj);
        },
        showMissingOrgValuesModal: function(){
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
        addNewOrgToDb: function(orgObj){
            myThis = this;
            $.ajax({
                method: 'POST',
                url: `${API_URL}/organizations`,
                data: JSON.stringify({
                    name: orgObj.orgName,
                    causeDescription: orgObj.cause,
                    phoneNumber: orgObj.phone,
                    manager: {
                        firstName: orgObj.firstName,
                        lastName: orgObj.lastName
                    },
                    address: {
                        street: orgObj.street,
                        city: orgObj.city,
                        state: orgObj.state,
                        zipcode: orgObj.zip
                    },
                    email: orgObj.email,
                    username: orgObj.username,
                    password: orgObj.password
                }),
                contentType: 'application/json; charset=utf-8'
            })
            .done(function(payload){
                myThis.showRedirectMessage(payload.name);
                setTimeout(`window.location.href = "private/organizationdashboard.html?id=${payload._id}"`, 3000);
            });
        },
        showRedirectMessage: function(orgName){
                $('.redirect-message').css('display', 'block');
                $('.redirect-message p').text(`Welcome, ${orgName}! One moment while I load your dashboard.`);
            }
    };

    //----------CLICK FUNCTIONS------------//
    const clickEvents = {
        closeHamburgerMenu: function(){
            setTimeout(function(){
                    $('.hamburger-menu').css('display', 'none');
                }, 1000);
            $('.hamburger-menu').removeClass('fadeInRight').addClass('fadeOutRight');
        },
        logoclick: function(){
            $('html, body').animate({scrollTop: 0}, 1000);
        },
        showHamburgerMenu: function(){
            $('.hamburger-menu').removeClass('fadeOutRight').css('display', 'block').addClass('fadeInRight');
            
        },
        resetLoginInputs: function(){
            $('#login input[name="username"]').val("");
            $('#login input[name="password"]').val("");
        },
        showLoginModal: function(){
            $('#login').removeClass('fadeOutDown').css('display', 'block').addClass('fadeInDown');
        },
        closeLoginModal: function(){
            this.resetLoginInputs();
            setTimeout(function(){
                    $('#login').css('display', 'none');
                }, 1000);
            $('#login').removeClass('fadeInDown').addClass('fadeOutDown');
        },
        showRegisterModal: function(){
            $('#register').removeClass('fadeOutDown').css('display', 'block').addClass('fadeInDown');
        },
        closeRegisterModal: function(){
            setTimeout(function(){
                    $('#register').css('display', 'none');
            }, 1000);
            $('#register').removeClass('fadeInDown').addClass('fadeOutDown');
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
            $('input[name="username"]').val("");
            $('input[name="password"]').val("");
        },
        closeMissingValuesModal: function(){
            $('.missing-values').css('display', 'none');
        },
        resetOrgForm: function(){
            $('.org-register input[name="org-name"]').val("");
            $('.org-register input[name="first-name"]').val("");
            $('.org-register input[name="last-name"]').val("");
            $('.org-register textarea').val("");
            $('.org-register input[name="phone"]').val("");
            $('.org-register input[name="email"]').val("");
            $('.org-register input[name="street"]').val("");
            $('.org-register input[name="city"]').val("");
            $('.org-register input[name="state"]').val("");
            $('.org-register input[name="zip"]').val("");
            $('.org-register input[name="username"]').val("");
            $('.org-register input[name="password"]').val("");
        },
        resetRestoForm: function(){
            $('.resto-register input[name="resto-name"]').val("");
            $('.resto-register input[name="first-name"]').val("");
            $('.resto-register input[name="last-name"]').val("");
            $('.resto-register input[name="phone"]').val("");
            $('.resto-register input[name="email"]').val("");
            $('.resto-register input[name="street"]').val("");
            $('.resto-register input[name="city"]').val("");
            $('.resto-register input[name="state"]').val("");
            $('.resto-register input[name="zip"]').val("");
            $('.resto-register input[name="username"]').val("");
            $('.resto-register input[name="password"]').val("");
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
        orgDbCallMethods.orgRegisterClicked();
    });

    //-------DYNAMIC STYLING CLICKS-----------//
    //when log in button has been clicked inside the login form
    $('.login-form button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        loginDbCallMethods.getLoginValues();
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
    $('.login-close button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.closeLoginModal();
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
        clickEvents.resetOrgForm();
        clickEvents.resetRestoForm();
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
        clickEvents.resetRestoForm();
        clickEvents.closeRegisterTypesModal();
        clickEvents.closeOrgRegisterModal();
        clickEvents.showRestoRegisterModal();
    });

    //when org type sign up has been selected for registration
    $('.org-selected').on('click', function(e){
        e.preventDefault();
        e.stopPropagation()
        clickEvents.resetOrgForm();
        clickEvents.closeRegisterTypesModal();
        clickEvents.closeRestoRegisterModal();
        clickEvents.showOrgRegisterModal();
    });

    //to close the missing values message modal
    $('.missing-values button').on('click', function(e){
            e.stopPropagation();
            e.preventDefault();
            clickEvents.closeMissingValuesModal();
    });

    //when cancel on the registration modal is clicked
    $('.reg-form-buttons .cancel').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        clickEvents.resetOrgForm();
        clickEvents.resetRestoForm();
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
    $('.incorrect-credentials button').on('click', function(e){
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
    $('footer .backtop').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        clickEvents.logoclick();
    });

    //social media icons
    $('.fa-facebook-official').on('click', function(e){
        window.open(`https://facebook.com/sharer/sharer.php?u=${escape(`https://shielded-coast-22560.herokuapp.com`)}&quote=Stop wasting food and donate to those in need.`);
    });

    $('.fa-twitter').on('click', function(e){
        window.open(`https://twitter.com/intent/tweet?text=Stop wasting food and donate to those in need. https://shielded-coast-22560.herokuapp.com`);
    });
});