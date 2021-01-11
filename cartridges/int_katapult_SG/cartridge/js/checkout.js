module.exports = function () {
    $(document).ready(function () {
        $('button[name ="dwfrm_billing_save"]').click(function (e) {
            if ($("input:checked").val() === "KATAPULT") {
                e.preventDefault();
                $("#katapultTrue").trigger("click");
            }
        });
    });
};
