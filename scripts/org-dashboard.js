$(document).ready(function() {
    //get the current account settings values
    const currentSettings = {};
    storeSettingsValues();
    //function to get the current values of the inputs
    function storeSettingsValues(){
        currentSettings.firstName = $("input[name=first-name]").val();
        currentSettings.lastName = $("input[name=last-name]").val();
        currentSettings.phone = $("input[name=phone]").val();
        currentSettings.email = $("input[name=email]").val();
        currentSettings.street = $("input[name=street]").val();
        currentSettings.city = $("input[name=city]").val();
        currentSettings.state = $("input[name=state]").val();
        currentSettings.zip = $("input[name=zip]").val();
        currentSettings.password = $("input[name=password]").val();
    }

    function setToOriginalValues(){
        $("input[name=first-name]").val(currentSettings.firstName);
        $("input[name=last-name]").val(currentSettings.lastName);
        $("input[name=phone]").val(currentSettings.phone);
        $("input[name=email]").val(currentSettings.email);
        $("input[name=street]").val(currentSettings.street);
        $("input[name=city]").val(currentSettings.city);
        $("input[name=state]").val(currentSettings.state);
        $("input[name=zip]").val(currentSettings.zip);
        $("input[name=password]").val(currentSettings.password);
    }

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
    });

    //make the editable content editable when edit is clicked
    $(".account-settings-buttons > .edit-details").click(function(e){
        e.preventDefault();
        $(".cancel-changes").removeAttr("hidden");
        $(".edit-details").attr("hidden", "true");
        $(".js-account-settings input").removeAttr("readonly").css({"border-bottom": "1px solid black", "font-style": "italic"});
    });

    //when the cancel has been clicked, should show the initial settings
    $(".account-settings-buttons > .cancel-changes").click(function(e){
        e.preventDefault();
        $(".cancel-changes").attr("hidden", "true");
        $(".edit-details").removeAttr("hidden");
        setToOriginalValues();
        $(".js-account-settings input").attr("readonly", "true").css({"border-bottom": "none", "font-style": "normal"});
    });

        
    //when the save changes is clicked
    $(".account-settings-buttons > .save-changes").click(function(e){
        e.preventDefault();
        $(".cancel-changes").attr("hidden", "true");
        $(".edit-details").removeAttr("hidden");
        $(".js-account-settings input").attr("readonly", "true").css({"border-bottom": "none", "font-style": "normal"});
        $(".success-modal").css("display", "block");
        storeSettingsValues();
    });
  
    //okay button after changes have been made
    $(".success-modal button").click(function(e){
        e.preventDefault();
        $(".success-modal").css("display", "none");
    });

    //when browse schedules is clicked
    $(".browse-sched-link").click(function(){
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
});