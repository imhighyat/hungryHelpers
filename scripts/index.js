$(document).ready(function() {
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
});