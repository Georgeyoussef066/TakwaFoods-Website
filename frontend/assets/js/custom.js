"use strict";

const formWrapper = document.querySelector(".formbold-form-wrapper");
const formActionButton = document.querySelector(".formbold-action-btn");

function chatboxToogleHandler() {
    formWrapper.classList.toggle("active");
    formActionButton.classList.toggle("active");
}



//AOS Animation
$(window).on("scroll", function() {
    AOS.init();
});



$(function() {


    // mobile nav
    const openBtn = document.querySelector("#nav-opn-btn");
    const closeBtn = document.querySelector("#nav-cls-btn");
    const offcanvasContainer = document.querySelector("#offcanvas-nav");

    function openNav() {
        document.body.style.overflowY = "hidden";
        offcanvasContainer.classList.add("open");
    }

    function closeNav() {
        document.body.style.overflowY = "";
        offcanvasContainer.classList.remove("open");
    }





    // back to top
    $(" .back-to-top ").on("click", function() {
        $("html,body").animate({
            scrollTop: 0,
        });
    });

    $(window).on("scroll", function() {
        var scrolling = $(this).scrollTop();

        if (scrolling > 150) {
            $(".menu-bg").addClass("nav-bg");
        } else {
            $(".menu-bg").removeClass("nav-bg");
        }

        var scrolling = $(this).scrollTop();
        if (scrolling > 200) {
            $(".back-to-top ").fadeIn(500);
        } else {
            $(".back-to-top ").fadeOut(500);
        }

    });



    $(window).on('load', function() {
        if ($(".shafull-container").length > 0) {
            var $grid = $('.shafull-container');
            $grid.shuffle({
                itemSelector: '.shaf-item',
                sizer: '.shaf-sizer'
            });
            /* reshuffle when user clicks a filter item */
            $('.shaf-filter li').on('click', function() {
                // set active class
                $('.shaf-filter li').removeClass('active');
                $(this).addClass('active');
                // get group name from clicked item
                var groupName = $(this).attr('data-group');
                // reshuffle grid
                $grid.shuffle('shuffle', groupName);
            });
        }
    });


    // next-prev-btn

    $('.next-prev-btn li a').on('click', function() {
        // set active class
        $('.next-prev-btn li a').removeClass('active');
        $(this).addClass('active');
    });



    // dashbord-active btn

    $('.dashboard-btn li ').on('click', function() {
        // set active class
        $('.dashboard-btn li ').removeClass('active');
        $(this).addClass('active');
    });


    // feature-slick




    // feature-slick













});


new VenoBox({
    selector: ".my-video-links"
});