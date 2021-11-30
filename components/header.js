$(function loadNav(withBack = true) {
    if (withBack == true){
        $("#nav-placeholder").load("/components/headerWithBack.html");
    }
    else {
        $("#nav-placeholder").load("/components/headerNoBack.html");
    }
});
