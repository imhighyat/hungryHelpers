$(document).ready(function() {
    let restoId = "";
    let orgId = "";
    const userInfo = {};
    function getLoginValues(){
        userInfo.username = $('input[name="username"]').val();
        userInfo.password = $('input[name="password"').val();
        checkRestoDbForUsername();
    }

    function checkRestoDbForUsername(){
        $.ajax({
            method: "GET",
            url: `http://localhost:8080/restaurants` //will receive an array of objects
        })
        .done(function(data) {
            for(let i = 0; i < data.length; i++){
                if(data[i].username === userInfo.username){
                    restoId = data[i]._id;
                }
            }
            if(restoId){
                checkIfPwMatches(data, restoId);
            }
            else {
                checkOrgDbForUsername();
            }
        });
    }

    function checkOrgDbForUsername(){
        $.ajax({
            method: "GET",
            url: `http://localhost:8080/organizations` //will receive an array of objects
        })
        .done(function(data) {
            for(let i = 0; i < data.length; i++){
                if(data[i].username === userInfo.username){
                    orgId = data[i]._id;
                }
            }
            if(orgId){
                checkIfPwMatches(data, orgId);
            }
            else{
                $('.incorrect-credentials').css('display', 'block');
                $('.incorrect-credentials button').css('display', 'inline-block');
                $('.incorrect-credentials-card p').text('We cant find a match with your username.');
                $('input[name="username"]').val("");
                $('input[name="password"]').val("");
            }
        });
    }

    function checkIfPwMatches(data, id){
        for(let i = 0; i < data.length; i++){
            if(data[i]._id === id){
                if(data[i].username === userInfo.username && data[i].password === userInfo.password){
                    $('.incorrect-credentials').css('display', 'block');
                    $('.incorrect-credentials-card p').text('Found ya! One moment while I load your dashboard.');
                    $('.incorrect-credentials button').css('display', 'none');
                    $('input[name="username"]').val("");
                    $('input[name="password"]').val("");
                    if(orgId){
                        loadOrgProfile();
                    }
                    else{
                        loadRestoProfile();
                    }
                }
                else{
                    $('.incorrect-credentials').css('display', 'block');
                    $('.incorrect-credentials button').css('display', 'inline-block');
                    $('.incorrect-credentials-card p').text('Incorrect credentials.');
                    $('input[name="username"]').val("");
                    $('input[name="password"]').val("");
                }
            }
        }
    }

    function loadOrgProfile(){
        setTimeout(`window.location.href = "private/organizationdashboard.html?id=${orgId}"`, 3000);
    }

    function loadRestoProfile(){
        setTimeout(`window.location.href = "private/restaurantdashboard.html?id=${restoId}"`, 3000);
    }


    $('.login-form button').on('click', function(event){
        event.stopPropagation();
        event.preventDefault();
        getLoginValues();
    });









    /* DYNAMIC STYLES ------------------------------------*/
    //show hamburger-menu when sidebar icon is clicked
    $(".sidebar-icon").click(function(){
    	$(".hamburger-menu").fadeIn().css("display", "block");
    });

    //hide hamburger-menu when X is clicked
    $(".hamburger-close").click(function(){
    	$(".hamburger-menu").css("display", "none");
    });

    //hide login modal, register modals
    $(".login-close").click(function(){
    	$("#login").css("display", "none");
        $(".register-types").css("display", "block");
    	$(".resto-register").css("display", "none");
    	$(".org-register").css("display", "none");
    });

    //hide login modal, register modals
    $(".login-cancel-forgot > button").click(function(){
    	$("#login").css("display", "none");
    	$(".register-types").css("display", "block");
    	$(".resto-register").css("display", "none");
    	$(".org-register").css("display", "none");
    });

    //show login modal and close other open modals and hamburger menu
    $(".login-link").click(function(){
    	$("#login").css("display", "block");
    	$(".hamburger-menu").css("display", "none");
    	$("#register").css("display", "none");
    });

    //will open up register modal and close hamburger menu
    $(".register-link").click(function(){
    	$("#register").css("display", "block");
    	$(".hamburger-menu").css("display", "none");
    });

    //register types window will close when the type has
    //been selected by user
    $(".register-types > button").click(function(){
    	$("#register").css("display", "none");
    });

    //user types window will close and display the resto register form
    //when resto type is selected 
    $(".resto-selected").click(function(){
    	$(".register-types").css("display", "none");
    	$(".resto-register").css("display", "block");
    });

    //user types window will close and display the org register form
    //when org type is selected
    $(".org-selected").click(function(){
    	$(".register-types").css("display", "none");
    	$(".org-register").css("display", "block");
    });

    //go back to user type selection when cancel is clicked
    //on the reg form
    $(".reg-form-buttons .cancel").click(function(){
    	$(".resto-register").css("display", "none");
    	$(".org-register").css("display", "none");
    	$(".register-types").css("display", "block");
    });

    //close the hamburger-menu when the link is clicked
    $(".howto-link").click(function(){
    	$(".hamburger-menu").css("display", "none");
    });

    //close the hamburger-menu when the link is clicked
    $(".contact-link").click(function(){
    	$(".hamburger-menu").css("display", "none");
    });

    //scroll to #howto section when learn more is clicked
    $(".learn-more-button").click(function(){
    	window.location.href = '#howto';
    });

    $('.incorrect-credentials-card button').on('click', function(){
        $('.incorrect-credentials').css('display', 'none');
    });
});