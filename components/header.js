function loadNav(withBack = true) {
    if (withBack){
        console.log("back")
        $("#nav-placeholder").load("/components/headerWithBack.html");
    }
    else {
        $("#nav-placeholder").load("/components/headerNoBack.html");
    }
};
loadNav();
