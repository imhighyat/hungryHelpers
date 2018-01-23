$(document).ready(function() {
    //log in section
    let credentials = {};
    let newRestoData = {};
    let newOrgData = {};

    function testCredentials(obj){
        $.ajax({
            method: 'POST',
            url: `http://localhost:8080/sessions`,
            data: JSON.stringify(obj),
            contentType: 'application/json; charset=utf-8'
        })
        .done(function(data){
            launchDashboard(data);
        });
    }

    function launchDashboard(obj){
        if(typeof(obj) === 'string'){
            showLoginMessage();
            $('.incorrect-credentials-card p').text('Incorrect credentials. Please try again.');
            $('.incorrect-credentials button').css('display', 'inline-block');
        }
        else{
            if('orgToken' in obj){
                setTimeout(`window.location.href = "private/organizationdashboard.html?id=${obj.orgToken}"`, 3000);
                showLoginMessage();
                $('.incorrect-credentials-card p').text('Found ya! One moment while I load your dashboard.');
                $('.incorrect-credentials button').css('display', 'none');
                $('.incorrect-credentials-card span').css('display', 'block');
            }
            else if('restoToken' in obj){
                setTimeout(`window.location.href = "private/restaurantdashboard.html?id=${obj.restoToken}"`, 3000);
                showLoginMessage();
                $('.incorrect-credentials-card p').text('Found ya! One moment while I load your dashboard.');
                $('.incorrect-credentials button').css('display', 'none');
                $('.incorrect-credentials-card span').css('display', 'block');
            }
        }
    }

    function showLoginMessage(){
        $('.incorrect-credentials').css('display', 'block');
        $('input[name="username"]').val("");
        $('input[name="password"]').val("");
    }

    //register section
    function checkIfValueMissing(obj){
        for(var prop in obj){
            if(obj[prop] === ""){
                return missingValues();
            }
        }
        newRestoRegister(obj);
    }

    function missingValues(){
        $('.missing-values').css('display', 'block');
        $('.missing-values p').text('Please fill out all the fields.');
        $('.missing-values button').css('display', 'inline-block');
    }

    function newRestoRegister(obj){
        $.ajax({
            method: 'POST',
            url: `http://localhost:8080/restaurants`,
            data: JSON.stringify({
                name: obj.restoName,
                phoneNumber: obj.phone,
                manager: {
                    firstName: obj.firstName,
                    lastName: obj.lastName
                },
                address: {
                    street: obj.street,
                    city: obj.city,
                    state: obj.state,
                    zipcode: obj.zip
                },
                email: obj.email,
                username: obj.username,
                password: obj.password
            }),
            contentType: 'application/json; charset=utf-8'
        })
        .done(function(data){
            console.log(data);
            $('.frequency-wrapper').css('display', 'block');
            $('.register-wrapper').css('display', 'none');
            $('.add-frequency button').on('click', function(event){
                event.preventDefault();
                event.stopPropagation();
                storeFrequencyValues(data);
            });
        });
    }

    function storeFrequencyValues(data){
        let days = [];
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
        sendFrequencyToDb(frequencySched, data);
    }

    function sendFrequencyToDb(sched, obj){
        //make sure everything has value
        if($('input[name="start-date"]').val() && $('input[name="end-date"]').val() && $('input[name="appt-time"]').val() && ($('input[name="monday"]').is(':checked') || $('input[name="tuesday"]').is(':checked') || $('input[name="wednesday"]').is(':checked') || $('input[name="thursday"]').is(':checked') || $('input[name="friday"]').is(':checked') || $('input[name="saturday"]').is(':checked') || $('input[name="sunday"]').is(':checked'))){
            $.ajax({
                method: 'POST',
                url: `http://localhost:8080/restaurants/${obj._id}/schedules`,
                data: JSON.stringify({
                    schedType: sched.schedType,
                    startingDate: sched.startingDate,
                    endingDate: sched.endingDate,
                    dayOfWeek: sched.dayOfWeek,
                    time: sched.time,
                restaurant: obj._id,
                restPerson: obj.manager.firstName + obj.manager.lastName,
                bookings: []
                }),
                contentType: 'application/json; charset=utf-8'
            })
            .done(function(){
                setTimeout(`window.location.href = "private/restaurantdashboard.html?id=${obj._id}"`, 5000);
            });
        }
    }





    //------click events-----------//
    const clickEvents = {
        logoClick: function(){
            $('html, body').animate({scrollTop: 0}, 1000);
            this.closeHamburgerMenu();
        },
        closeHamburgerMenu: function(){
            $('.hamburger-menu').css('display', 'none');
        },
        showHamburgerMenu: function(){
            $('.hamburger-menu').css('display', 'block');
        },
        closeLoginModal: function(){
            setTimeout(function(){
                $('#login').css('display', 'none');
            }, 1500);
            $('#login').removeClass('fadeInDown').addClass('fadeOutDown');
            $('.register-types').css('display', 'block');
            $('.resto-register').css('display', 'none');
            $('.org-register').css('display', 'none');
        },
        cancelLogin: function(){
            setTimeout(function(){
                $('#login').css('display', 'none');
            }, 1500);
            $('#login').removeClass('fadeInDown').addClass('fadeOutDown');
            $('.register-types').css('display', 'block');
            $('.resto-register').css('display', 'none');
            $('.org-register').css('display', 'none');
        },
        showLoginModal: function(){
            $('#login').removeClass('fadeOutDown').css('display', 'block').addClass('fadeInDown');
            $('.hamburger-menu').css('display', 'none');
            $('#register').css('display', 'none');
        },
        showRegisterModal: function(){
            $('#register').removeClass('fadeOutDown').css('display', 'block').addClass('fadeInDown');
            $('.hamburger-menu').css('display', 'none');
        },
        closeRegisterTypesModal: function(){
            setTimeout(function(){
                $('#register').css('display', 'none');
            }, 1500);
            $('#register').removeClass('fadeInDown').addClass('fadeOutDown');
        },
        restoTypeSelected: function(){
            $('.register-types').css('display', 'none');
            $('.resto-register').css('display', 'block');
        },
        orgTypeSelected: function(){
            $('.register-types').css('display', 'none');
            $('.org-register').css('display', 'block');
        },
        cancelRegistration: function(){
            $('.resto-register').css('display', 'none');
            $('.org-register').css('display', 'none');
            $('.register-types').css('display', 'block');
        },
        goToHowTo: function(){
            $('html, body').animate({scrollTop: $('#howto').offset().top}, 1000);
        },
        goToContact: function(){
            $('html, body').animate({scrollTop: $('#contact').offset().top}, 1000);
        },
        closeCredentialsModal: function(){
            $('.incorrect-credentials').css('display', 'none');
        },
        closeMissingValuesModal: function(){
            $('.missing-values').css('display', 'none');
        },
        loginClicked: function(){
            this.getLoginValues();
        },
        getLoginValues: function(){
            credentials.username = $('input[name="username"]').val();
            credentials.password = $('input[name="password"]').val();
            if(credentials.username !== "" && credentials.password !== ""){
                testCredentials(credentials);
            }
        },
        restoRegisterClicked: function(){
            this.getRestoSignupValues();
        },
        orgRegisterClicked: function(){
            this.getOrgSignupValues();
        },
        getRestoSignupValues: function(){
            newRestoData.restoName = $('.resto-register input[name="resto-name"]').val();
            newRestoData.firstName = $('.resto-register input[name="first-name"]').val();
            newRestoData.lastName = $('.resto-register input[name="last-name"]').val();
            newRestoData.phone = $('.resto-register input[name="phone"]').val();
            newRestoData.email = $('.resto-register input[name="email"]').val();
            newRestoData.street = $('.resto-register input[name="street"]').val();
            newRestoData.city = $('.resto-register input[name="city"]').val();
            newRestoData.state = $('.resto-register input[name="state"]').val();
            newRestoData.zip = $('.resto-register input[name="zip"]').val();
            newRestoData.username = $('.resto-register input[name="username"]').val();
            newRestoData.password = $('.resto-register input[name="password"]').val();
            checkIfValueMissing(newRestoData);
        },
        getOrgSignupValues: function(){
            newOrgData.orgName = $('.org-register input[name="org-name"]').val();
            newOrgData.cause = $('.org-register textarea').val();
            newOrgData.firstName = $('.org-register input[name="first-name"]').val();
            newOrgData.lastName = $('.org-register input[name="last-name"]').val();
            newOrgData.phone = $('.org-register input[name="phone"]').val();
            newOrgData.email = $('.org-register input[name="email"]').val();
            newOrgData.street = $('.org-register input[name="street"]').val();
            newOrgData.city = $('.org-register input[name="city"]').val();
            newOrgData.state = $('.org-register input[name="state"]').val();
            newOrgData.zip = $('.org-register input[name="zip"]').val();
            newOrgData.username = $('.org-register input[name="username"]').val();
            newOrgData.password = $('.org-register input[name="password"]').val();
            checkIfValueMissing(newOrgData);
        }
    };

    $('.login-form button').on('click', function(event){
        event.stopPropagation();
        event.preventDefault();
        clickEvents.loginClicked();
    });

    $('.resto-register .reg-form-buttons .sign-up').on('click', function(event){
        event.stopPropagation();
        event.preventDefault();
        clickEvents.restoRegisterClicked();
    });

    $('.org-register .reg-form-buttons .sign-up').on('click', function(event){
        event.stopPropagation();
        event.preventDefault();
        clickEvents.orgRegisterClicked();
    });

    $('.missing-values button').on('click', function(event){
        event.stopPropagation();
        event.preventDefault();
        clickEvents.closeMissingValuesModal();

    });

    $('.nav-logo').on('click', function(event){
        event.stopPropagation();
        clickEvents.logoClick();
    });

    $('.sidebar-icon').on('click', function(){
    	clickEvents.showHamburgerMenu();
    });

    $('.hamburger-close').on('click', function(){
    	clickEvents.closeHamburgerMenu();
    });

    $('.login-close').on('click', function(){
    	clickEvents.closeLoginModal();
    });

    $('.login-cancel-forgot > button').on('click', function(){
    	clickEvents.cancelLogin();
    });

    $('.login-link').on('click', function(){
    	clickEvents.showLoginModal();
    });

    $('.register-link').on('click', function(){
    	clickEvents.showRegisterModal();
    });

    $('.register-types > button').on('click', function(){
    	clickEvents.closeRegisterTypesModal();
    });

    $('.resto-selected').on('click', function(){
    	clickEvents.restoTypeSelected();
    });

    $('.org-selected').on('click', function(){
    	clickEvents.orgTypeSelected();
    });

    $('.reg-form-buttons .cancel').on('click', function(event){
        event.preventDefault();
    	clickEvents.cancelRegistration();
    });

    $('.howto-link').on('click', function(){
    	clickEvents.closeHamburgerMenu();
    });

    $('.contact-link').on('click', function(){
    	clickEvents.closeHamburgerMenu();
    });

    $('.learn-more-button').on('click', function(){
        clickEvents.goToHowTo();
    });

    $('.howto-link').on('click', function(){
        clickEvents.goToHowTo();
    });

    $('.contact-link').on('click', function(){
        clickEvents.goToContact();
    });

    $('.incorrect-credentials-card button').on('click', function(){
        clickEvents.closeCredentialsModal();
    });

    $('.thumb-instructions').mouseenter(function(){
        $(this).addClass('animated pulse');
        $(this).mouseleave(function(){
            $(this).removeClass('pulse');
        });
    });

    $('.learn-more-button').mouseenter(function(){
        $(this).addClass('animated pulse infinite');
        $(this).mouseleave(function(){
            $(this).removeClass('pulse');
        });
    });
});