$(document).ready(function() {
    //log in section
    let credentials = {};

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
        loginClicked: function(){
            this.getLoginValues();
        },
        getLoginValues: function(){
            credentials.username = $('input[name="username"]').val();
            credentials.password = $('input[name="password"]').val();
            if(credentials.username !== "" && credentials.password !== ""){
                testCredentials(credentials);
            }
        }
    };

    $('.login-form button').on('click', function(event){
        event.stopPropagation();
        event.preventDefault();
        clickEvents.loginClicked();
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

    $('.reg-form-buttons .cancel').on('click', function(){
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