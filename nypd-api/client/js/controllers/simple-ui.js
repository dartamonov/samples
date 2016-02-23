$(document).ready( function() {
    $(".sortby > th:nth-child(-n+4)").click(function(){
        //console.log($(this).text());
        self = $(this);
        field = self.text();
        if (self.hasClass("asc")) {
        	self.addClass('desc').removeClass('asc');
        	field = "-" + field;
        } else {
        	self.addClass('asc').removeClass('desc');
        }
        self.siblings().removeClass('asc').removeClass('desc');

        $("#sortField").val(field).trigger("change");
    });
});