$(document).ready(function() {
    //upcoming donations should be the default tab
    $(".js-donation-list").css("display", "block");
    $(".upcoming-donations").css("border-bottom", "3px ridge #5779ac");
    $(".js-account-settings").css("display", "none");

    //when account settings tab is clicked
    $(".account-settings").click(function(){
        $(".upcoming-donations").css("border-bottom", "none");
        $(".account-settings").css("border-bottom", "3px ridge #5779ac");
        $(".js-donation-list").css("display", "none");
        $(".js-account-settings").css("display", "block");
    });

    //when upcoming donations tab is clicked
    $(".upcoming-donations").click(function(){
        $(".account-settings").css("border-bottom", "none");
        $(".upcoming-donations").css("border-bottom", "3px ridge #5779ac");
        $(".js-donation-list").css("display", "block");
        $(".js-account-settings").css("display", "none");
    });

    //make the editable content editable when edit is clicked
    $(".account-settings-buttons > .edit-details").click(function(e){
        e.preventDefault();
        $(".js-account-settings input").removeAttr("readonly");
        $(".js-account-settings input").css({"border-bottom": "1px solid black", "font-style": "italic"});
    });

    //when the save changes is clicked
    $(".account-settings-buttons > .save-changes").click(function(e){
        e.preventDefault();
        $(".js-account-settings input").attr("readonly", "true");
        $(".js-account-settings input").css({"border-bottom": "none", "font-style": "normal"});
    });

    //show hamburger-menu when sidebar icon is clicked
    $(".sidebar-icon").click(function(){
    	$(".hamburger-menu").fadeIn().css("display", "block");
    });

    //hide hamburger-menu when X is clicked
    $(".hamburger-close").click(function(){
    	$(".hamburger-menu").css("display", "none");
    });
});